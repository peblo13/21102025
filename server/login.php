<?php
require_once __DIR__ . '/auth_config.php';
$db = get_db();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error'=>'Method not allowed'], 405);
rate_limit($db, 'login', 60, 600);
$in = require_json_input();
$email = strtolower(trim($in['email'] ?? ''));
$password = (string)($in['password'] ?? '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_out(['error'=>'Invalid email'], 400);
$stmt = $db->prepare('SELECT id,password_hash,email,full_name,plan,role,email_verified,created_at FROM users WHERE email=?');
$stmt->execute([$email]);
$u = $stmt->fetch();
if (!$u || !password_verify($password, $u['password_hash'])) json_out(['error'=>'Invalid credentials'], 401);
$_SESSION['uid'] = (int)$u['id'];
json_out(['ok'=>true,'user'=>[ 'id'=>$u['id'],'email'=>$u['email'],'full_name'=>$u['full_name'],'plan'=>$u['plan'],'role'=>$u['role'],'email_verified'=>$u['email_verified'] ]]);