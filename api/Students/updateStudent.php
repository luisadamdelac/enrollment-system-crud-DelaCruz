<?php
header('Content-Type: application/json');
require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['stud_id'] ?? 0);
$first_name = trim($data['first_name'] ?? '');
$middle_name = trim($data['middle_name'] ?? '');
$last_name = trim($data['last_name'] ?? '');
$program_id = intval($data['program_id'] ?? 0);
$allowance = floatval($data['allowance'] ?? 0);

if ($id <= 0 || $first_name === '' || $last_name === '' || $program_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Student ID, First Name, Last Name and Program are required']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE student_tbl SET first_name = ?, middle_name = ?, last_name = ?, program_id = ?, allowance = ? WHERE stud_id = ?");
    $stmt->execute([$first_name, $middle_name, $last_name, $program_id, $allowance, $id]);
    echo json_encode(['success' => true, 'message' => 'Student updated successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to update student']);
}
?>
