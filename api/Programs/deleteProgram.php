<?php
header('Content-Type: application/json');
require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['program_id'] ?? 0);

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Program ID is required']);
    exit;
}

try {
    $check = $pdo->prepare("SELECT COUNT(*) FROM student_tbl WHERE program_id = ?");
    $check->execute([$id]);
    if ($check->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Cannot delete program with enrolled students']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM program_tbl WHERE program_id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true, 'message' => 'Program deleted successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to delete program']);
}
?>
