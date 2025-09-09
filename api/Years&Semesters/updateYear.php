<?php
header('Content-Type: application/json');
require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['year_id'] ?? 0);
$year_from = intval($data['year_from'] ?? 0);
$year_to = intval($data['year_to'] ?? 0);

if ($id <= 0 || $year_from <= 0 || $year_to <= 0 || $year_to <= $year_from) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE year_tbl SET year_from = ?, year_to = ? WHERE year_id = ?");
    $stmt->execute([$year_from, $year_to, $id]);
    echo json_encode(['success' => true, 'message' => 'Year updated successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to update year']);
}
?>
