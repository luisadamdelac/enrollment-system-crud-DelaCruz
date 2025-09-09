<?php
header('Content-Type: application/json');
require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$stud_id = intval($data['stud_id'] ?? 0);
$name = trim($data['name'] ?? '');
$program_id = intval($data['program_id'] ?? 0);
$allowance = floatval($data['allowance'] ?? 0);

if ($stud_id <= 0 || $name === '' || $program_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Student ID, Name and Program are required']);
    exit;
}

$check = $pdo->prepare("SELECT COUNT(*) FROM student_tbl WHERE stud_id = ?");
$check->execute([$stud_id]);
if ($check->fetchColumn() > 0) {
    echo json_encode(['success' => false, 'message' => 'Student ID already exists']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO student_tbl (stud_id, name, program_id, allowance) VALUES (?, ?, ?, ?)");
    $stmt->execute([$stud_id, $name, $program_id, $allowance]);
    echo json_encode(['success' => true, 'message' => 'Student added successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to add student']);
}
?>
