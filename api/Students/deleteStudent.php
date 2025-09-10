<?php
header('Content-Type: application/json');
require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['stud_id'] ?? 0);

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Student ID is required']);
    exit;
}

try {
    $check = $pdo->prepare("SELECT COUNT(*) FROM student_load WHERE stud_id = ?");
    $check->execute([$id]);
    if ($check->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Cannot delete student with active enrollments']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM student_tbl WHERE stud_id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true, 'message' => 'Student deleted successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to delete student']);
}
?>
