<?php
header('Content-Type: application/json');
require '../db.php';

try {
    $stmt = $pdo->query("SELECT sem_id, sem_name, year_id FROM semester_tbl");
    $semesters = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $semesters]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch semesters']);
}
?>
