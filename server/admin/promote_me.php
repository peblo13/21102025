<?php
require_once __DIR__ . '/../auth_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  json_out(['error' => 'Method not allowed'], 405);
}

// Tylko z localhost (bez CSRF, bo jednorazowe i lokalne)
$remote = $_SERVER['REMOTE_ADDR'] ?? '';
if (!in_array($remote, ['127.0.0.1', '::1'], true)) {
  json_out(['error' => 'Only localhost allowed'], 403);
}

$db = get_db();
rate_limit($db, 'promote_me', 5, 600);
$u = current_user($db);
if (!$u) {
  json_out(['error' => 'Unauthorized'], 401);
}

$admins = (int)$db->query("SELECT COUNT(*) FROM users WHERE role='admin'")->fetchColumn();
if ($admins > 0) {
  json_out(['error' => 'Admin already exists'], 409);
}

$stmt = $db->prepare("UPDATE users SET role='admin' WHERE id=?");
$stmt->execute([$u['id']]);

json_out(['ok' => true, 'user' => ['id' => $u['id'], 'email' => $u['email'], 'role' => 'admin']]);
