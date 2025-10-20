<?php
require_once __DIR__ . '/auth_config.php';
$db = get_db();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error'=>'Method not allowed'], 405);
$in = require_json_input();
$token = trim($in['token'] ?? '');
$password = (string)($in['password'] ?? '');
if (strlen($token) < 8 || strlen($password) < 8) json_out(['error'=>'Invalid input'], 400);
$stmt = $db->prepare('SELECT id, reset_expires FROM users WHERE reset_token=?');
$stmt->execute([$token]);
$u = $stmt->fetch();
if (!$u || (int)$u['reset_expires'] < time()) json_out(['error'=>'Invalid or expired token'], 400);
$hash = password_hash($password, PASSWORD_DEFAULT);
$db->prepare('UPDATE users SET password_hash=?, reset_token=NULL, reset_expires=NULL WHERE id=?')->execute([$hash,$u['id']]);
json_out(['ok'=>true]);