<?php
require_once __DIR__ . '/require_admin.php';
admin_require_csrf();
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$id = isset($input['id']) ? (int)$input['id'] : 0;
$role = trim($input['role'] ?? '');
$verified = $input['email_verified'] ?? null;

if ($id <= 0) { http_response_code(400); echo json_encode(['error' => 'Invalid id']); exit; }
if ($role !== '' && !in_array($role, ['user','admin'], true)) { http_response_code(400); echo json_encode(['error' => 'Invalid role']); exit; }
if ($verified !== null) { $verified = $verified ? 1 : 0; }

// Prevent self-demotion lock-out without at least one other admin
if ($role === 'user' && $id === $_ADMIN['me']['id']) {
    $admins = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role='admin'")->fetchColumn();
    if ($admins <= 1) { http_response_code(400); echo json_encode(['error' => 'Cannot demote the only admin']); exit; }
}

$sets = [];
$params = [':id' => $id];
if ($role !== '') { $sets[] = 'role = :role'; $params[':role'] = $role; }
if ($verified !== null) { $sets[] = 'email_verified = :ver'; $params[':ver'] = $verified; }

if (!$sets) { echo json_encode(['ok' => true]); exit; }

$sql = 'UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = :id';
$stmt = $pdo->prepare($sql);
$stmt->execute($params);

echo json_encode(['ok' => true]);
