<?php
header('Content-Type: application/json');
require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$subject_id = intval($data['subject_id'] ?? 0);
$name = trim($data['subject_name'] ?? '');
$sem_id = intval($data['sem_id'] ?? 0);

if ($subject_id <= 0 || $name === '' || $sem_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Subject ID, name and semester are required']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO subject_tbl (subject_id, subject_name, sem_id) VALUES (?, ?, ?)");
    $stmt->execute([$subject_id, $name, $sem_id]);
    echo json_encode(['success' => true, 'message' => 'Subject added successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to add subject']);
}
?>
