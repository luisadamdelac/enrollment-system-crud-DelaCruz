<?php
header('Content-Type: application/json');
require_once 'db.php';

try {
    $stmt = $pdo->query("SELECT ins_id, ins_name FROM institutes ORDER BY ins_name ASC");
    $institutes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $institutes]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch institutes: ' . $e->getMessage()]);
}
?>
