<?php
header('Content-Type: application/json');
require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['program_id'] ?? 0);
$name = trim($data['program_name'] ?? '');
$ins_id = intval($data['ins_id'] ?? 0);

if ($id <= 0 || $name === '' || $ins_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Program ID, name, and institute are required']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE program_tbl SET program_name = ?, ins_id = ? WHERE program_id = ?");
    $stmt->execute([$name, $ins_id, $id]);
    echo json_encode(['success' => true, 'message' => 'Program updated successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to update program']);
}
?>
