<?php
header('Content-Type: application/json');
require '../db.php';

try {
    $stmt = $pdo->query("SELECT year_id, year_from, year_to FROM year_tbl");
    $years = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $years]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch years']);
}
?>
