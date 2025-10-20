<?php
require_once __DIR__ . '/auth_config.php';
$db = get_db();
$token = isset($_GET['token']) ? trim((string)$_GET['token']) : '';
if ($token === '') json_out(['error'=>'Missing token'], 400);
$stmt = $db->prepare('SELECT id FROM users WHERE verify_token=?');
$stmt->execute([$token]);
$u = $stmt->fetch();
if (!$u) json_out(['error'=>'Invalid token'], 400);
$db->prepare('UPDATE users SET email_verified=1, verify_token=NULL WHERE id=?')->execute([$u['id']]);
$_SESSION['uid'] = (int)$u['id'];
json_out(['ok'=>true]);