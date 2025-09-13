<?php
header('Content-Type: application/json');
require '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    
    $stud_id = intval($_GET['stud_id'] ?? 0);
    if ($stud_id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Student ID is required']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT allowance FROM student_tbl WHERE stud_id = ?");
        $stmt->execute([$stud_id]);
        $result = $stmt->fetch();
        if ($result) {
            echo json_encode(['success' => true, 'allowance' => $result['allowance']]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Student not found']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to get allowance']);
    }
} elseif ($method === 'POST') {
    
    $data = json_decode(file_get_contents('php://input'), true);
    $stud_id = intval($data['stud_id'] ?? 0);
    $allowance = floatval($data['allowance'] ?? 0);

    if ($stud_id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Student ID is required']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE student_tbl SET allowance = ? WHERE stud_id = ?");
        $stmt->execute([$allowance, $stud_id]);
        echo json_encode(['success' => true, 'message' => 'Allowance updated successfully']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to update allowance']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
