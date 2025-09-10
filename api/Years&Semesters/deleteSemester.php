<?php
header('Content-Type: application/json');
require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['sem_id'] ?? 0);

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Semester ID required']);
    exit;
}

try {
    $check = $pdo->prepare("SELECT COUNT(*) FROM subject_tbl WHERE sem_id = ?");
    $check->execute([$id]);
    if ($check->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Cannot delete semester with assigned subjects']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM semester_tbl WHERE sem_id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true, 'message' => 'Semester deleted successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to delete semester']);
}
?>
