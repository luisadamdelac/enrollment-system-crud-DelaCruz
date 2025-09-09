<?php
header('Content-Type: application/json');
require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['sem_id'] ?? 0);
$sem_name = trim($data['sem_name'] ?? '');
$year_id = intval($data['year_id'] ?? 0);

if ($id <= 0 || $sem_name === '' || $year_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE semester_tbl SET sem_name = ?, year_id = ? WHERE sem_id = ?");
    $stmt->execute([$sem_name, $year_id, $id]);
    echo json_encode(['success' => true, 'message' => 'Semester updated successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to update semester']);
}
?>
