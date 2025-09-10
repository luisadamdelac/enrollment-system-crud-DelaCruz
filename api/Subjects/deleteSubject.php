<?php
header('Content-Type: application/json');
require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['subject_id'] ?? 0);

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Subject ID required']);
    exit;
}

try {
    $check = $pdo->prepare("SELECT COUNT(*) FROM student_load WHERE subject_id = ?");
    $check->execute([$id]);
    if ($check->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Cannot delete subject with enrolled students']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM subject_tbl WHERE subject_id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true, 'message' => 'Subject deleted successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to delete subject']);
}
?>
