<?php
header('Content-Type: application/json');
require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['stud_id'] ?? 0);
$name = trim($data['name'] ?? '');
$program_id = intval($data['program_id'] ?? 0);
$allowance = floatval($data['allowance'] ?? 0);

if ($id <= 0 || $name === '' || $program_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Student ID, Name and Program are required']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE student_tbl SET name = ?, program_id = ?, allowance = ? WHERE stud_id = ?");
    $stmt->execute([$name, $program_id, $allowance, $id]);
    echo json_encode(['success' => true, 'message' => 'Student updated successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to update student']);
}
?>
