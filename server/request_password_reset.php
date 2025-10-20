<?php
require_once __DIR__ . '/auth_config.php';
$db = get_db();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error'=>'Method not allowed'], 405);
rate_limit($db, 'reset_req', 10, 3600);
$in = require_json_input();
$email = strtolower(trim($in['email'] ?? ''));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_out(['error'=>'Invalid email'], 400);
$stmt = $db->prepare('SELECT id FROM users WHERE email=?');
$stmt->execute([$email]);
$u = $stmt->fetch();
// Respond the same regardless to avoid user enumeration
if ($u) {
  $token = bin2hex(random_bytes(16));
  $exp = time() + 3600; // 1h
  $db->prepare('UPDATE users SET reset_token=?, reset_expires=? WHERE id=?')->execute([$token,$exp,$u['id']]);
}
json_out(['ok'=>true,'message'=>'If that email exists, a reset link has been prepared.']);