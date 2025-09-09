<?php
header('Content-Type: application/json');
require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$sem_id = intval($data['sem_id'] ?? 0);
$sem_name = trim($data['sem_name'] ?? '');
$year_id = intval($data['year_id'] ?? 0);

if ($sem_id <= 0 || $sem_name === '' || $year_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Semester ID, name and Year required']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO semester_tbl (sem_id, sem_name, year_id) VALUES (?, ?, ?)");
    $stmt->execute([$sem_id, $sem_name, $year_id]);
    echo json_encode(['success' => true, 'message' => 'Semester added successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to add semester']);
}
?>
