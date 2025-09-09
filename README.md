#enrollment-system-crud-LuisAdam

#Description
This is a web-based Student Enrollment System built using PHP for the backend API and JavaScript for the frontend. It provides a user-friendly interface to manage students, programs, years and semesters, subjects, and enrollments. Users can perform CRUD (Create, Read, Update, Delete) operations on these entities through a tabbed interface.

#Features
Manage Students: Add, edit, delete students with details like name, program, and allowance.
Manage Programs: Handle academic programs linked to institutes.
Manage Years and Semesters: Organize academic periods.
Manage Subjects: Associate subjects with semesters.
Manage Enrollments: Enroll students in subjects and track enrollments.

#Setup Instructions

Prerequisites
XAMPP (or any web server with PHP and MySQL support)
Web browser
Installation Steps

#Download and Install XAMPP:
Download XAMPP from https://www.apachefriends.org/.
Install XAMPP on your system.
Start XAMPP Services:
Open XAMPP Control Panel.
Start Apache and MySQL services.
Place the Project:
Copy the project folder to C:\xampp\htdocs\.
Rename the folder to SMS if necessary.

#Set Up the Database:
Open phpMyAdmin by navigating to http://localhost/phpmyadmin/ in your browser.
Create a new database named enrollment_db.
If there are SQL files for table creation (e.g., in api/alter_table.php or similar), import them into the database. Otherwise, the application may create tables on first run.
Configure Database Connection:

#The database connection is configured in api/db.php with the following details:
Host: localhost
Database: enrollment_db
User: root
Password: (empty)
Ensure these match your MySQL setup.
Run the Application:
Open your web browser.
Navigate to http://localhost/SMS/.
The application should load, and you can start managing data through the tabs.

#Notes
Ensure PHP is configured to allow file operations if needed.
If you encounter any database connection errors, verify the MySQL credentials in api/db.php.


#Author
Name: Luis Adam Dela Cruz
Section: 3-A
