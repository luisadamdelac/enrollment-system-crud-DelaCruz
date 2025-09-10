<?php
header('Content-Type: application/json');
require '../db.php';

try {
    $stmt = $pdo->query("SELECT sl.load_id, sl.stud_id, sl.subject_id, s.name AS student_name, sub.subject_name FROM student_load sl JOIN student_tbl s ON sl.stud_id = s.stud_id JOIN subject_tbl sub ON sl.subject_id = sub.subject_id");
    $enrollments = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $enrollments]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch enrollments: ' . $e->getMessage()]);
}
?>
