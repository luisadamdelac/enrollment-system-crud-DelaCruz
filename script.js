document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const tabs = {
        students: document.getElementById('tab-students'),
        programs: document.getElementById('tab-programs'),
        years: document.getElementById('tab-years'),
        subjects: document.getElementById('tab-subjects'),
        enrollments: document.getElementById('tab-enrollments'),
    };

    const formModal = document.getElementById('form-modal');
    const formModalBody = document.getElementById('form-modal-body');
    const formModalClose = document.getElementById('form-modal-close');

    function showFormModal(htmlContent) {
        formModalBody.innerHTML = htmlContent;
        formModal.style.display = 'block';
    }

    function closeFormModal() {
        formModal.style.display = 'none';
        formModalBody.innerHTML = '';
    }

    formModalClose.onclick = closeFormModal;
    window.onclick = function(event) {
        if (event.target == formModal) {
            closeFormModal();
        }
    };

    Object.keys(tabs).forEach(key => {
        tabs[key].onclick = () => setActiveTab(key);
    });

    async function setActiveTab(tabName) {
        Object.values(tabs).forEach(btn => btn.classList.remove('active'));
        tabs[tabName].classList.add('active');
        switch(tabName) {
            case 'students': await loadStudents(); break;
            case 'programs': await loadPrograms(); break;
            case 'years': await loadYearsAndSemesters(); break;
            case 'subjects': await loadSubjects(); break;
            case 'enrollments': await loadEnrollments(); break;
        }
    }

    // --- Students Section ---
async function loadStudents() {
        content.innerHTML = `<h2>Students</h2>
        <button id="btn-add-student">Add Student</button>
        <table>
            <thead><tr><th>ID</th><th>Name</th><th>Program</th><th>Allowance</th><th>Actions</th></tr></thead>
            <tbody id="students-tbody"></tbody>
        </table>
        <div id="student-form-container"></div>`;

        document.getElementById('btn-add-student').onclick = () => renderStudentForm();

        await populateStudentsTable();
    }

    async function populateStudentsTable() {
        const tbody = document.getElementById('students-tbody');
        try {
            const res = await fetch('http://localhost/SMS/api/Students/getStudents.php');
            const data = await res.json();
            if (data.success) {
                tbody.innerHTML = '';
                data.data.forEach(s => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${s.stud_id}</td>
                        <td>${s.name}</td>
                        <td>${s.program_name || ''}</td>
                        <td>${s.allowance || 0}</td>
                        <td>
                            <button class="action-btn edit-btn" data-id="${s.stud_id}">Edit</button>
                            <button class="action-btn delete-btn" data-id="${s.stud_id}">Delete</button>
                        </td>`;
                    tbody.appendChild(tr);
                });
                tbody.onclick = async function(e) {
                    const editBtn = e.target.closest('.edit-btn');
                    const deleteBtn = e.target.closest('.delete-btn');
                    if (editBtn) await editStudent(parseInt(editBtn.dataset.id));
                    else if (deleteBtn) await deleteStudent(parseInt(deleteBtn.dataset.id));
                };
            } else {
                tbody.innerHTML = `<tr><td colspan="5">${data.message}</td></tr>`;
            }
        } catch {
            tbody.innerHTML = `<tr><td colspan="5">Error loading students.</td></tr>`;
        }
    }

    async function renderStudentForm(editData) {
        let programsRes, programsData;
        try {
            programsRes = await fetch('http://localhost/SMS/api/Programs/getPrograms.php');
            programsData = await programsRes.json();
        } catch {
            showError('error-modal', 'Failed to load programs.');
            return;
        }
        if (!programsData.success) {
            showError('error-modal', 'Failed to load programs.');
            return;
        }
        let html = `
        <form id="student-form">
            <h3>${editData ? 'Edit Student' : 'Add Student'}</h3>
            <div id="student-error" class="error-message" style="display: none;"></div>
            <div id="student-success" class="success-message" style="display: none;"></div>
            <label>Student ID</label>
            <input type="number" id="student-id" value="${editData ? editData.stud_id : ''}" ${editData ? 'readonly' : 'required'} />
            <label>Name</label>
            <input type="text" id="student-name" value="${editData ? editData.name : ''}" required />
            <label>Program</label>
            <select id="student-program" required>
                <option value="">Select Program</option>
                ${programsData.data.map(p => `<option value="${p.program_id}" ${editData && editData.program_id == p.program_id ? 'selected' : ''}>${p.program_name}</option>`).join('')}
            </select>
            <label>Allowance</label>
            <input type="number" id="student-allowance" value="${editData ? editData.allowance || 0 : ''}" />
            <button type="submit">${editData ? 'Update' : 'Add'}</button>
            <button type="button" id="cancel-btn">Cancel</button>
        </form>`;
        showFormModal(html);
        document.getElementById('cancel-btn').onclick = () => { closeFormModal(); };
        document.getElementById('student-form').onsubmit = async e => {
            e.preventDefault();
            const stud_id = document.getElementById('student-id').value;
            const name = document.getElementById('student-name').value.trim();
            const program_id = document.getElementById('student-program').value;
            const allowance = document.getElementById('student-allowance').value;

            if (!stud_id || !name || !program_id) {
                showError('student-error', 'Student ID, Name and Program are required');
                return;
            }

            const nameParts = name.split(' ');
            const first_name = nameParts[0] || '';
            const middle_name = nameParts.slice(1, -1).join(' ') || '';
            const last_name = nameParts[nameParts.length - 1] || '';

            try {
                let url = 'http://localhost/SMS/api/Students/addStudent.php';
                let body = {stud_id, first_name, middle_name, last_name, program_id, allowance};
                if (editData) {
                    url = 'http://localhost/SMS/api/Students/updateStudent.php';
                    body.old_stud_id = editData.stud_id;
                }
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                });
                const data = await res.json();
                if (data.success) {
                    showSuccess('student-success', data.message);
                    setTimeout(() => {
                        closeFormModal();
                        loadStudents();
                    }, 1500);
                } else {
                    showError('student-error', data.message);
                }
            } catch {
                showError('student-error', 'Error submitting form');
            }
        };

    }

    async function editStudent(id) {
        try {
            const res = await fetch('http://localhost/SMS/api/Students/getStudents.php');
            const data = await res.json();
            if (!data.success) {
                showError('student-error', 'Unable to fetch student for editing');
                return;
            }
            const student = data.data.find(s => s.stud_id === id);
            if (!student) {
                showError('student-error', 'Student not found');
                return;
            }
            renderStudentForm(student);
        } catch {
            showError('student-error', 'Error loading student for edit');
        }
    }

    async function deleteStudent(id) {
        if (!confirm('Are you sure you want to delete this student?')) return;
        try {
            const res = await fetch('http://localhost/SMS/api/Students/deleteStudent.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({stud_id: id}),
            });
            const data = await res.json();
            if (data.success) {
                await populateStudentsTable();
                const container = document.getElementById('student-form-container');
                container.innerHTML = `<div class="success-message">${data.message}</div>`;
                setTimeout(() => { container.innerHTML = ''; }, 1500);
            } else {
                const container = document.getElementById('student-form-container');
                container.innerHTML = `<div class="error-message">${data.message || 'Cannot delete student with active enrollment'}</div>`;
                setTimeout(() => { container.innerHTML = ''; }, 1500);
            }
        } catch {
            const container = document.getElementById('student-form-container');
            container.innerHTML = `<div class="error-message">Error deleting student</div>`;
            setTimeout(() => { container.innerHTML = ''; }, 1500);
        }
    }

    // --- Programs Section ---
    async function loadPrograms() {
        content.innerHTML = `<h2>Programs</h2>
        <button id="btn-add-program">Add Program</button>
        <table>
            <thead><tr><th>ID</th><th>Name</th><th>Institute</th><th>Actions</th></tr></thead>
            <tbody id="programs-tbody"></tbody>
        </table>
        <div id="program-form-container"></div>`;

    document.getElementById('btn-add-program').onclick = () => renderProgramForm();

    await populateProgramsTable();
}

    async function populateProgramsTable() {
        const tbody = document.getElementById('programs-tbody');
        try {
            const res = await fetch('http://localhost/SMS/api/Programs/getPrograms.php');
            const data = await res.json();
            if (data.success) {
                tbody.innerHTML = '';
                data.data.forEach(p => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${p.program_id}</td>
                        <td>${p.program_name}</td>
                        <td>${p.ins_name || ''}</td>
                        <td>
                            <button class="action-btn edit-btn" data-id="${p.program_id}">Edit</button>
                            <button class="action-btn delete-btn" data-id="${p.program_id}">Delete</button>
                        </td>`;
                    tbody.appendChild(tr);
                });
                tbody.onclick = async function(e) {
                    const editBtn = e.target.closest('.edit-btn');
                    const deleteBtn = e.target.closest('.delete-btn');
                    if (editBtn) await editProgram(parseInt(editBtn.dataset.id));
                    else if (deleteBtn) await deleteProgram(parseInt(deleteBtn.dataset.id));
                };
            } else {
                tbody.innerHTML = `<tr><td colspan="4">${data.message}</td></tr>`;
            }
        } catch {
            tbody.innerHTML = `<tr><td colspan="4">Error loading programs.</td></tr>`;
        }
    }

    async function renderProgramForm(editData) {
        const container = document.getElementById('program-form-container');
        let institutesRes, institutesData;
        try {
            institutesRes = await fetch('http://localhost/SMS/api/getInstitutes.php');
            institutesData = await institutesRes.json();
        } catch {
            container.innerHTML = `<p class="error-message">Failed to load institutes.</p>`;
            return;
        }
        if (!institutesData.success) {
            container.innerHTML = `<p class="error-message">Failed to load institutes.</p>`;
            return;
        }
        let html = `
        <form id="program-form">
            <h3>${editData ? 'Edit Program' : 'Add Program'}</h3>
            <div id="program-error" class="error-message" style="display: none;"></div>
            <div id="program-success" class="success-message" style="display: none;"></div>
            <label>Program ID</label>
            <input type="number" id="program-id" value="${editData ? editData.program_id : ''}" ${editData ? 'readonly' : 'required'} />
            <label>Program Name</label>
            <input type="text" id="program-name" value="${editData ? editData.program_name : ''}" required />
            <label>Institute</label>
            <select id="program-institute" required>
                <option value="">Select Institute</option>
                ${institutesData.data.map(i => `<option value="${i.ins_id}" ${editData && editData.ins_id == i.ins_id ? 'selected' : ''}>${i.ins_name}</option>`).join('')}
            </select>
            <button type="submit">${editData ? 'Update' : 'Add'}</button>
            <button type="button" id="cancel-program-btn">Cancel</button>
        </form>`;
        container.innerHTML = html;
        document.getElementById('cancel-program-btn').onclick = () => { container.innerHTML = ''; };
        document.getElementById('program-form').onsubmit = async e => {
            e.preventDefault();
            const program_id = document.getElementById('program-id').value;
            const program_name = document.getElementById('program-name').value.trim();
            const ins_id = document.getElementById('program-institute').value;

            if (!program_id || !program_name || !ins_id) {
                showError('program-error', 'Program ID, name and institute are required');
                return;
            }

            try {
                let url = 'http://localhost/SMS/api/Programs/addProgram.php';
                let body = {program_id, program_name, ins_id};
                if (editData) {
                    url = 'http://localhost/SMS/api/Programs/updateProgram.php';
                    body.old_program_id = editData.program_id;
                }
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                });
                const data = await res.json();
                if (data.success) {
                    showSuccess('program-success', data.message);
                    setTimeout(() => {
                        container.innerHTML = '';
                        loadPrograms();
                    }, 1500);
                } else {
                    showError('program-error', data.message);
                }
            } catch {
                showError('program-error', 'Error submitting form');
            }
        };
    }

    async function editProgram(id) {
        try {
            const res = await fetch('http://localhost/SMS/api/Programs/getPrograms.php');
            const data = await res.json();
            if (!data.success) {
                showError('program-error', 'Unable to fetch program for editing');
                return;
            }
            const program = data.data.find(p => p.program_id === id);
            if (!program) {
                showError('program-error', 'Program not found');
                return;
            }
            renderProgramForm(program);
        } catch {
            showError('program-error', 'Error loading program for edit');
        }
    }

    async function deleteProgram(id) {
        if (!confirm('Are you sure you want to delete this program?')) return;
        try {
            const res = await fetch('http://localhost/SMS/api/Programs/deleteProgram.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({program_id: id}),
            });
            const data = await res.json();
            if (data.success) {
                const tbody = document.getElementById('programs-tbody');
                const deleteBtn = tbody.querySelector(`button[data-id="${id}"]`);
                if (deleteBtn) {
                    const row = deleteBtn.closest('tr');
                    if (row) row.remove();
                }
                const container = document.getElementById('program-form-container');
                container.innerHTML = `<div class="success-message">${data.message}</div>`;
                setTimeout(() => { container.innerHTML = ''; }, 1500);
            } else {
                const container = document.getElementById('program-form-container');
                container.innerHTML = `<div class="error-message">${data.message}</div>`;
                setTimeout(() => { container.innerHTML = ''; }, 1500);
            }
        } catch {
            const container = document.getElementById('program-form-container');
            container.innerHTML = `<div class="error-message">Error deleting program</div>`;
            setTimeout(() => { container.innerHTML = ''; }, 1500);
        }
    }

    // --- Years & Semesters Section ---
    async function loadYearsAndSemesters() {
        content.innerHTML = `<h2>Years & Semesters</h2>
        <button id="btn-add-year">Add Year</button>
        <table>
            <thead><tr><th>ID</th><th>Year From</th><th>Year To</th><th>Actions</th></tr></thead>
            <tbody id="years-tbody"></tbody>
        </table>
        <div id="year-form-container"></div>
        <hr>
        <button id="btn-add-semester">Add Semester</button>
        <table>
            <thead><tr><th>ID</th><th>Name</th><th>Year</th><th>Actions</th></tr></thead>
            <tbody id="semesters-tbody"></tbody>
        </table>
        <div id="semester-form-container"></div>`;

        document.getElementById('btn-add-year').onclick = () => renderYearForm();
        document.getElementById('btn-add-semester').onclick = () => renderSemesterForm();

        // Years
        const yearsTbody = document.getElementById('years-tbody');
        try {
            const res = await fetch('http://localhost/SMS/api/Years&Semesters/getYears.php');
            const data = await res.json();
            if (data.success) {
                yearsTbody.innerHTML = '';
                data.data.forEach(y => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${y.year_id}</td>
                        <td>${y.year_from}</td>
                        <td>${y.year_to}</td>
                        <td>
                            <button class="action-btn edit-year-btn" data-id="${y.year_id}">Edit</button>
                            <button class="action-btn delete-year-btn" data-id="${y.year_id}">Delete</button>
                        </td>`;
                    yearsTbody.appendChild(tr);
                });
                yearsTbody.onclick = async function(e) {
                    const editBtn = e.target.closest('.edit-year-btn');
                    const deleteBtn = e.target.closest('.delete-year-btn');
                    if (editBtn) await editYear(parseInt(editBtn.dataset.id));
                    else if (deleteBtn) await deleteYear(parseInt(deleteBtn.dataset.id));
                };
            } else {
                yearsTbody.innerHTML = `<tr><td colspan="4">${data.message}</td></tr>`;
            }
        } catch {
            yearsTbody.innerHTML = `<tr><td colspan="4">Error loading years.</td></tr>`;
        }

        // Semesters
        const semestersTbody = document.getElementById('semesters-tbody');
        try {
            const res = await fetch('http://localhost/SMS/api/Years&Semesters/getSemesters.php');
            const data = await res.json();
            if (data.success) {
                semestersTbody.innerHTML = '';
                for (const s of data.data) {
                    const year = await getYearById(s.year_id);
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${s.sem_id}</td>
                        <td>${s.sem_name}</td>
                        <td>${year ? year.year_from + '-' + year.year_to : ''}</td>
                        <td>
                            <button class="action-btn edit-semester-btn" data-id="${s.sem_id}">Edit</button>
                            <button class="action-btn delete-semester-btn" data-id="${s.sem_id}">Delete</button>
                        </td>`;
                    semestersTbody.appendChild(tr);
                }
                semestersTbody.onclick = async function(e) {
                    const editBtn = e.target.closest('.edit-semester-btn');
                    const deleteBtn = e.target.closest('.delete-semester-btn');
                    if (editBtn) await editSemester(parseInt(editBtn.dataset.id));
                    else if (deleteBtn) await deleteSemester(parseInt(deleteBtn.dataset.id));
                };
            } else {
                semestersTbody.innerHTML = `<tr><td colspan="4">${data.message}</td></tr>`;
            }
        } catch {
            semestersTbody.innerHTML = `<tr><td colspan="4">Error loading semesters.</td></tr>`;
        }
    }

    async function getYearById(id) {
        try {
            const res = await fetch('http://localhost/SMS/api/Years&Semesters/getYears.php');
            const data = await res.json();
            if (data.success) {
                return data.data.find(y => y.year_id == id);
            }
        } catch {}
        return null;
    }

    async function renderYearForm(editData) {
        const container = document.getElementById('year-form-container');
        let html = `
        <form id="year-form">
            <h3>${editData ? 'Edit Year' : 'Add Year'}</h3>
            <div id="year-error" class="error-message" style="display: none;"></div>
            <div id="year-success" class="success-message" style="display: none;"></div>
            <label>Year ID</label>
            <input type="number" id="year-id" value="${editData ? editData.year_id : ''}" ${editData ? 'readonly' : 'required'} />
            <label>Year From</label>
            <input type="number" id="year-from" value="${editData ? editData.year_from : ''}" required />
            <label>Year To</label>
            <input type="number" id="year-to" value="${editData ? editData.year_to : ''}" required />
            <button type="submit">${editData ? 'Update' : 'Add'}</button>
            <button type="button" id="cancel-year-btn">Cancel</button>
        </form>`;
        container.innerHTML = html;
        document.getElementById('cancel-year-btn').onclick = () => { container.innerHTML = ''; };
        document.getElementById('year-form').onsubmit = async e => {
            e.preventDefault();
            const year_id = document.getElementById('year-id').value;
            const year_from = parseInt(document.getElementById('year-from').value);
            const year_to = parseInt(document.getElementById('year-to').value);

            if (!year_id || !year_from || !year_to) {
                showError('year-error', 'Year ID and range are required');
                return;
            }

            if (year_to <= year_from) {
                showError('year-error', 'Year To must be greater than Year From');
                return;
            }

            try {
                let url = 'http://localhost/SMS/api/Years&Semesters/addYear.php';
                let body = {year_id, year_from, year_to};
                if (editData) {
                    url = 'http://localhost/SMS/api/Years&Semesters/updateYear.php';
                    body.old_year_id = editData.year_id;
                }
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                });
                const data = await res.json();
                if (data.success) {
                    showSuccess('year-success', data.message);
                    setTimeout(() => {
                        container.innerHTML = '';
                        loadYearsAndSemesters();
                    }, 1500);
                } else {
                    showError('year-error', data.message);
                }
            } catch {
                showError('year-error', 'Error submitting form');
            }
        };
    }

    async function editYear(id) {
        try {
            const res = await fetch('http://localhost/SMS/api/Years&Semesters/getYears.php');
            const data = await res.json();
            if (!data.success) {
                showError('year-error', 'Unable to fetch year for editing');
                return;
            }
            const year = data.data.find(y => y.year_id === id);
            if (!year) {
                showError('year-error', 'Year not found');
                return;
            }
            renderYearForm(year);
        } catch {
            showError('year-error', 'Error loading year for edit');
        }
    }

    async function deleteYear(id) {
        if (!confirm('Are you sure you want to delete this year?')) return;
        try {
            const res = await fetch('http://localhost/SMS/api/Years&Semesters/deleteYear.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({year_id: id}),
            });
            const data = await res.json();
            if (data.success) {
                loadYearsAndSemesters();
            } else {
                showError('year-error', data.message);
            }
        } catch {
            showError('year-error', 'Error deleting year');
        }
    }

    async function renderSemesterForm(editData) {
        const container = document.getElementById('semester-form-container');
        let yearsRes, yearsData;
        try {
            yearsRes = await fetch('http://localhost/SMS/api/Years&Semesters/getYears.php');
            yearsData = await yearsRes.json();
        } catch {
            container.innerHTML = `<p class="error-message">Failed to load years.</p>`;
            return;
        }
        if (!yearsData.success) {
            container.innerHTML = `<p class="error-message">Failed to load years.</p>`;
            return;
        }
        let html = `
        <form id="semester-form">
            <h3>${editData ? 'Edit Semester' : 'Add Semester'}</h3>
            <div id="semester-error" class="error-message" style="display: none;"></div>
            <div id="semester-success" class="success-message" style="display: none;"></div>
            <label>Semester ID</label>
            <input type="number" id="semester-id" value="${editData ? editData.sem_id : ''}" ${editData ? 'readonly' : 'required'} />
            <label>Semester Name</label>
            <input type="text" id="semester-name" value="${editData ? editData.sem_name : ''}" required />
            <label>Year</label>
            <select id="semester-year" required>
                <option value="">Select Year</option>
                ${yearsData.data.map(y => `<option value="${y.year_id}" ${editData && editData.year_id == y.year_id ? 'selected' : ''}>${y.year_from}-${y.year_to}</option>`).join('')}
            </select>
            <button type="submit">${editData ? 'Update' : 'Add'}</button>
            <button type="button" id="cancel-semester-btn">Cancel</button>
        </form>`;
        container.innerHTML = html;
        document.getElementById('cancel-semester-btn').onclick = () => { container.innerHTML = ''; };
        document.getElementById('semester-form').onsubmit = async e => {
            e.preventDefault();
            const sem_id = document.getElementById('semester-id').value;
            const sem_name = document.getElementById('semester-name').value.trim();
            const year_id = parseInt(document.getElementById('semester-year').value);

            if (!sem_id || !sem_name || !year_id) {
                showError('semester-error', 'Semester ID, name and year are required');
                return;
            }

            try {
                let url = 'http://localhost/SMS/api/Years&Semesters/addSemester.php';
                let body = {sem_id, sem_name, year_id};
                if (editData) {
                    url = 'http://localhost/SMS/api/Years&Semesters/updateSemester.php';
                    body.old_sem_id = editData.sem_id;
                }
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                });
                const data = await res.json();
                if (data.success) {
                    showSuccess('semester-success', data.message);
                    setTimeout(() => {
                        container.innerHTML = '';
                        loadYearsAndSemesters();
                    }, 1500);
                } else {
                    showError('semester-error', data.message);
                }
            } catch {
                showError('semester-error', 'Error submitting form');
            }
        };
    }

    async function editSemester(id) {
        try {
            const res = await fetch('http://localhost/SMS/api/Years&Semesters/getSemesters.php');
            const data = await res.json();
            if (!data.success) {
                showError('semester-error', 'Unable to fetch semester for editing');
                return;
            }
            const semester = data.data.find(s => s.sem_id === id);
            if (!semester) {
                showError('semester-error', 'Semester not found');
                return;
            }
            renderSemesterForm(semester);
        } catch {
            showError('semester-error', 'Error loading semester for edit');
        }
    }

    async function deleteSemester(id) {
        if (!confirm('Are you sure you want to delete this semester?')) return;
        try {
            const res = await fetch('http://localhost/SMS/api/Years&Semesters/deleteSemester.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({sem_id: id}),
            });
            const data = await res.json();
            if (data.success) {
                const tbody = document.getElementById('semesters-tbody');
                const deleteBtn = tbody.querySelector(`button[data-id="${id}"]`);
                if (deleteBtn) {
                    const row = deleteBtn.closest('tr');
                    if (row) row.remove();
                }
                const container = document.getElementById('semester-form-container');
                container.innerHTML = `<div class="success-message">${data.message}</div>`;
                setTimeout(() => { container.innerHTML = ''; }, 1500);
            } else {
                const container = document.getElementById('semester-form-container');
                container.innerHTML = `<div class="error-message">${data.message}</div>`;
                setTimeout(() => { container.innerHTML = ''; }, 1500);
            }
        } catch {
            const container = document.getElementById('semester-form-container');
            container.innerHTML = `<div class="error-message">Error deleting semester</div>`;
            setTimeout(() => { container.innerHTML = ''; }, 1500);
        }
    }

    // --- Subjects Section ---
    async function loadSubjects() {
        content.innerHTML = `<h2>Subjects</h2>
        <button id="btn-add-subject">Add Subject</button>
        <table>
            <thead><tr><th>ID</th><th>Name</th><th>Semester</th><th>Actions</th></tr></thead>
            <tbody id="subjects-tbody"></tbody>
        </table>
        <div id="subject-form-container"></div>`;

        document.getElementById('btn-add-subject').onclick = () => renderSubjectForm();

        const tbody = document.getElementById('subjects-tbody');
        try {
            const res = await fetch('http://localhost/SMS/api/Subjects/getSubjects.php');
            const data = await res.json();
            if (data.success) {
                tbody.innerHTML = '';
                for (const s of data.data) {
                    const semester = await getSemesterById(s.sem_id);
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${s.subject_id}</td>
                        <td>${s.subject_name}</td>
                        <td>${semester ? semester.sem_name : ''}</td>
                        <td>
                            <button class="action-btn edit-subject-btn" data-id="${s.subject_id}">Edit</button>
                            <button class="action-btn delete-subject-btn" data-id="${s.subject_id}">Delete</button>
                        </td>`;
                    tbody.appendChild(tr);
                }
                tbody.onclick = async function(e) {
                    const editBtn = e.target.closest('.edit-subject-btn');
                    const deleteBtn = e.target.closest('.delete-subject-btn');
                    if (editBtn) await editSubject(parseInt(editBtn.dataset.id));
                    else if (deleteBtn) await deleteSubject(parseInt(deleteBtn.dataset.id));
                };
            } else {
                tbody.innerHTML = `<tr><td colspan="4">${data.message}</td></tr>`;
            }
        } catch {
            tbody.innerHTML = `<tr><td colspan="4">Error loading subjects.</td></tr>`;
        }
    }

    async function getSemesterById(id) {
        try {
            const res = await fetch('http://localhost/SMS/api/Years&Semesters/getSemesters.php');
            const data = await res.json();
            if (data.success) {
                return data.data.find(s => s.sem_id == id);
            }
        } catch {}
        return null;
    }

    async function renderSubjectForm(editData) {
        const container = document.getElementById('subject-form-container');
        let semestersRes, semestersData;
        try {
            semestersRes = await fetch('http://localhost/SMS/api/Years&Semesters/getSemesters.php');
            semestersData = await semestersRes.json();
        } catch {
            container.innerHTML = `<p class="error-message">Failed to load semesters.</p>`;
            return;
        }
        if (!semestersData.success) {
            container.innerHTML = `<p class="error-message">Failed to load semesters.</p>`;
            return;
        }
        let html = `
        <form id="subject-form">
            <h3>${editData ? 'Edit Subject' : 'Add Subject'}</h3>
            <div id="subject-error" class="error-message" style="display: none;"></div>
            <div id="subject-success" class="success-message" style="display: none;"></div>
            <label>Subject ID</label>
            <input type="number" id="subject-id" value="${editData ? editData.subject_id : ''}" ${editData ? 'readonly' : 'required'} />
            <label>Subject Name</label>
            <input type="text" id="subject-name" value="${editData ? editData.subject_name : ''}" required />
            <label>Semester</label>
            <select id="subject-semester" required>
                <option value="">Select Semester</option>
                ${semestersData.data.map(s => `<option value="${s.sem_id}" ${editData && editData.sem_id == s.sem_id ? 'selected' : ''}>${s.sem_name}</option>`).join('')}
            </select>
            <button type="submit">${editData ? 'Update' : 'Add'}</button>
            <button type="button" id="cancel-subject-btn">Cancel</button>
        </form>`;
        container.innerHTML = html;
        document.getElementById('cancel-subject-btn').onclick = () => { container.innerHTML = ''; };
        document.getElementById('subject-form').onsubmit = async e => {
            e.preventDefault();
            const subject_id = document.getElementById('subject-id').value;
            const subject_name = document.getElementById('subject-name').value.trim();
            const sem_id = document.getElementById('subject-semester').value;

            if (!subject_id || !subject_name || !sem_id) {
                showError('subject-error', 'Subject ID, name and semester are required');
                return;
            }

            try {
                let url = 'http://localhost/SMS/api/Subjects/addSubject.php';
                let body = {subject_id, subject_name, sem_id};
                if (editData) {
                    url = 'http://localhost/SMS/api/Subjects/updateSubject.php';
                    body.subject_id = subject_id;
                }
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                });
                const data = await res.json();
                if (data.success) {
                    showSuccess('subject-success', data.message);
                    setTimeout(() => {
                        container.innerHTML = '';
                        loadSubjects();
                    }, 1500);
                } else {
                    showError('subject-error', data.message);
                }
            } catch {
                showError('subject-error', 'Error submitting form');
            }
        };
    }

    async function editSubject(id) {
        try {
            const res = await fetch('http://localhost/SMS/api/Subjects/getSubjects.php');
            const data = await res.json();
            if (!data.success) {
                showError('subject-error', 'Unable to fetch subject for editing');
                return;
            }
            const subject = data.data.find(s => s.subject_id === id);
            if (!subject) {
                showError('subject-error', 'Subject not found');
                return;
            }
            renderSubjectForm(subject);
        } catch {
            showError('subject-error', 'Error loading subject for edit');
        }
    }

    async function deleteSubject(id) {
        if (!confirm('Are you sure you want to delete this subject?')) return;
        try {
            const res = await fetch('http://localhost/SMS/api/Subjects/deleteSubject.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({subject_id: id}),
            });
            const data = await res.json();
            if (data.success) {
                const tbody = document.getElementById('subjects-tbody');
                const deleteBtn = tbody.querySelector(`button[data-id="${id}"]`);
                if (deleteBtn) {
                    const row = deleteBtn.closest('tr');
                    if (row) row.remove();
                }
                const container = document.getElementById('subject-form-container');
                container.innerHTML = `<div class="success-message">${data.message}</div>`;
                setTimeout(() => { container.innerHTML = ''; }, 1500);
            } else {
                const container = document.getElementById('subject-form-container');
                container.innerHTML = `<div class="error-message">${data.message}</div>`;
                setTimeout(() => { container.innerHTML = ''; }, 1500);
            }
        } catch {
            const container = document.getElementById('subject-form-container');
            container.innerHTML = `<div class="error-message">Error deleting subject</div>`;
            setTimeout(() => { container.innerHTML = ''; }, 1500);
        }
    }

    // --- Enrollments Section ---
    async function loadEnrollments() {
        content.innerHTML = `<h2>Enrollments</h2>
        <div id="enrollment-error" class="error-message" style="display: none;"></div>
        <div id="enrollment-success" class="success-message" style="display: none;"></div>
        <button id="btn-add-enrollment">Add Enrollment</button>
        <table>
            <thead><tr><th>ID</th><th>Student</th><th>Subject</th><th>Actions</th></tr></thead>
            <tbody id="enrollments-tbody"></tbody>
        </table>
        <div id="enrollment-form-container"></div>`;

        document.getElementById('btn-add-enrollment').onclick = () => renderEnrollmentForm();

        const tbody = document.getElementById('enrollments-tbody');
        try {
            const res = await fetch('http://localhost/SMS/api/Enrollments/getEnrollments.php');
            const data = await res.json();
            if (data.success) {
                tbody.innerHTML = '';
                data.data.forEach(e => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${e.load_id}</td>
                        <td>${e.student_name} (${e.stud_id})</td>
                        <td>${e.subject_name} (${e.subject_id})</td>
                        <td>
                            <button class="action-btn edit-enrollment-btn" data-id="${e.load_id}">Edit</button>
                            <button class="action-btn delete-enrollment-btn" data-id="${e.load_id}">Delete</button>
                        </td>`;
                    tbody.appendChild(tr);
                });
                tbody.onclick = async function(e) {
                    const editBtn = e.target.closest('.edit-enrollment-btn');
                    const deleteBtn = e.target.closest('.delete-enrollment-btn');
                    if (editBtn) await editEnrollment(parseInt(editBtn.dataset.id));
                    else if (deleteBtn) await deleteEnrollment(parseInt(deleteBtn.dataset.id));
                };
            } else {
                tbody.innerHTML = `<tr><td colspan="4">${data.message}</td></tr>`;
            }
        } catch {
            tbody.innerHTML = `<tr><td colspan="4">Error loading enrollments.</td></tr>`;
        }
    }

    async function renderEnrollmentForm(editData) {
        const container = document.getElementById('enrollment-form-container');
        let studentsRes, studentsData, subjectsRes, subjectsData;
        try {
            studentsRes = await fetch('http://localhost/SMS/api/Students/getStudents.php');
            studentsData = await studentsRes.json();
            subjectsRes = await fetch('http://localhost/SMS/api/Subjects/getSubjects.php');
            subjectsData = await subjectsRes.json();
        } catch {
            container.innerHTML = `<p class="error-message">Failed to load students or subjects.</p>`;
            return;
        }

        if (!studentsData.success || !subjectsData.success) {
            container.innerHTML = `<p class="error-message">Failed to load students or subjects.</p>`;
            return;
        }

        let html = `
        <form id="enrollment-form">
            <h3>${editData ? 'Edit Enrollment' : 'Add Enrollment'}</h3>
            <div id="enrollment-error" class="error-message" style="display: none;"></div>
            <div id="enrollment-success" class="success-message" style="display: none;"></div>
            <label>Enrollment ID ${editData ? '' : '(optional)'}</label>
            <input type="number" id="enrollment-id" value="${editData ? editData.load_id : ''}" ${editData ? 'readonly' : ''} />
            <label>Student</label>
            <select id="enrollment-student" required>
                <option value="">Select Student</option>
                ${studentsData.data.map(s => `<option value="${s.stud_id}" ${editData && parseInt(editData.stud_id) === parseInt(s.stud_id) ? 'selected' : ''}>${s.name} (${s.stud_id})</option>`).join('')}
            </select>
            <label>Subject</label>
            <select id="enrollment-subject" required>
                <option value="">Select Subject</option>
                ${subjectsData.data.map(s => `<option value="${s.subject_id}" ${editData && parseInt(editData.subject_id) === parseInt(s.subject_id) ? 'selected' : ''}>${s.subject_name} (${s.subject_id})</option>`).join('')}
            </select>
            <button type="submit">${editData ? 'Update' : 'Add'}</button>
            <button type="button" id="cancel-enrollment-btn">Cancel</button>
        </form>
        `;
        container.innerHTML = html;

        document.getElementById('cancel-enrollment-btn').onclick = () => { container.innerHTML = ''; };
        document.getElementById('enrollment-form').onsubmit = async e => {
            e.preventDefault();

            const stud_id = document.getElementById('enrollment-student').value;
            const subject_id = document.getElementById('enrollment-subject').value;

            if (!stud_id || stud_id === '') {
                showError('enrollment-error', 'Please select a student.');
                return;
            }

            if (!subject_id || subject_id === '') {
                showError('enrollment-error', 'Please select a subject.');
                return;
            }

            const studIdInt = parseInt(stud_id);
            const subjectIdInt = parseInt(subject_id);

            if (isNaN(studIdInt) || studIdInt <= 0) {
                showError('enrollment-error', 'Invalid student selected.');
                return;
            }

            if (isNaN(subjectIdInt) || subjectIdInt <= 0) {
                showError('enrollment-error', 'Invalid subject selected.');
                return;
            }

            try {
                let url = 'http://localhost/SMS/api/Enrollments/enrollStudent.php';
                let body = {stud_id: studIdInt, subject_id: subjectIdInt};
                if (editData) {
                    if (!editData.load_id) {
                        showError('enrollment-error', 'Enrollment ID is missing for update.');
                        return;
                    }
                    url = 'http://localhost/SMS/api/Enrollments/updateEnrollment.php';
                    body.load_id = parseInt(editData.load_id);
                }
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                });
                const data = await res.json();
                if (data.success) {
                    showSuccess('enrollment-success', data.message);
                    setTimeout(() => {
                        container.innerHTML = '';
                        loadEnrollments();
                    }, 1500);
                } else {
                    showError('enrollment-error', data.message);
                }
            } catch {
                showError('enrollment-error', 'Error submitting form');
            }
        };
    }

    async function editEnrollment(id) {
        try {
            const res = await fetch('http://localhost/SMS/api/Enrollments/getEnrollments.php');
            const data = await res.json();
            if (!data.success) {
                showError('enrollment-error', 'Unable to fetch enrollment for editing');
                return;
            }
            const enrollment = data.data.find(e => e.load_id === id);
            if (!enrollment) {
                showError('enrollment-error', 'Enrollment not found');
                return;
            }

            renderEnrollmentForm(enrollment);
        } catch (error) {
            showError('enrollment-error', 'Error loading enrollment for edit');
        }
    }

    async function deleteEnrollment(id) {
        if (!confirm('Are you sure you want to delete this enrollment?')) return;
        try {
            const res = await fetch('http://localhost/SMS/api/Enrollments/removeEnrollment.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({load_id: id}),
            });
            const data = await res.json();
            if (data.success) {
                showSuccess('enrollment-success', data.message);
                loadEnrollments();
            } else {
                showError('enrollment-error', data.message);
            }
        } catch (error) {
            showError('enrollment-error', 'Error deleting enrollment');
        }
    }

    // --- Utility Functions ---
    function showError(elementId, message) {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.style.display = 'block';
        const successElement = elementId.replace('error', 'success');
        document.getElementById(successElement).style.display = 'none';
    }

    function showSuccess(elementId, message) {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.style.display = 'block';
        const errorElement = elementId.replace('success', 'error');
        document.getElementById(errorElement).style.display = 'none';
    }

    setActiveTab('students');
});
