<?php
header('Content-Type: application/json');
require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['subject_id'] ?? 0);
$name = trim($data['subject_name'] ?? '');
$sem_id = intval($data['sem_id'] ?? 0);

if ($id <= 0 || $name === '' || $sem_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE subject_tbl SET subject_name = ?, sem_id = ? WHERE subject_id = ?");
    $stmt->execute([$name, $sem_id, $id]);
    echo json_encode(['success' => true, 'message' => 'Subject updated successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to update subject']);
}
?>
