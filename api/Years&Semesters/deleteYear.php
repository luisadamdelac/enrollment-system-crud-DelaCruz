<?php
header('Content-Type: application/json');
require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['year_id'] ?? 0);

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Year ID required']);
    exit;
}

try {
    $check = $pdo->prepare("SELECT COUNT(*) FROM semester_tbl WHERE year_id = ?");
    $check->execute([$id]);
    if ($check->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Cannot delete year with assigned semesters']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM year_tbl WHERE year_id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true, 'message' => 'Year deleted successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to delete year']);
}
?>
