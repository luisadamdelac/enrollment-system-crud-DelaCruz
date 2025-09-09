<?php
header('Content-Type: application/json');
require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$year_id = intval($data['year_id'] ?? 0);
$year_from = intval($data['year_from'] ?? 0);
$year_to = intval($data['year_to'] ?? 0);

if ($year_id <= 0 || $year_from <= 0 || $year_to <= 0 || $year_to <= $year_from) {
    echo json_encode(['success' => false, 'message' => 'Year ID and valid year range are required']);
    exit;
}

$check = $pdo->prepare("SELECT COUNT(*) FROM year_tbl WHERE year_id = ?");
$check->execute([$year_id]);
if ($check->fetchColumn() > 0) {
    echo json_encode(['success' => false, 'message' => 'Year ID already exists']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO year_tbl (year_id, year_from, year_to) VALUES (?, ?, ?)");
    $stmt->execute([$year_id, $year_from, $year_to]);
    echo json_encode(['success' => true, 'message' => 'Year added successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to add year']);
}
?>
