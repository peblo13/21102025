<?php
require_once __DIR__ . '/auth_config.php';
$db = get_db();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error'=>'Method not allowed'], 405);
rate_limit($db, 'register', 30, 3600);
$in = require_json_input();
$email = strtolower(trim($in['email'] ?? ''));
$password = (string)($in['password'] ?? '');
$full = trim($in['full_name'] ?? '');
$plan = trim($in['plan'] ?? 'Bezpłatny');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_out(['error'=>'Invalid email'], 400);
if (strlen($password) < 8) json_out(['error'=>'Password too short'], 400);
$hash = password_hash($password, PASSWORD_DEFAULT);
$verifyToken = bin2hex(random_bytes(16));
// Build verify URL for convenience (local/dev): origin from ORIGIN/REFERER -> /src/verify.html?token=...
$origin = 'http://localhost';
if (!empty($_SERVER['HTTP_ORIGIN'])) { $origin = $_SERVER['HTTP_ORIGIN']; }
elseif (!empty($_SERVER['HTTP_REFERER'])) { $origin = preg_replace('#/src/.*$#','', $_SERVER['HTTP_REFERER']); }
$verifyUrl = rtrim($origin,'/') . '/src/verify.html?token=' . urlencode($verifyToken);
try {
    $stmt = $db->prepare('INSERT INTO users(email,password_hash,full_name,plan,role,email_verified,verify_token,created_at) VALUES (?,?,?,?,"user",0,?,?)');
    $stmt->execute([$email,$hash,$full,$plan,$verifyToken,time()]);
  $uid = (int)$db->lastInsertId();
      $_SESSION['uid'] = $uid;
      json_out(['ok'=>true,'user'=>['id'=>$uid,'email'=>$email,'full_name'=>$full,'plan'=>$plan,'role'=>'user','email_verified'=>0],'verify_url'=>$verifyUrl]);
} catch (PDOException $e) {
  if (str_contains($e->getMessage(),'UNIQUE')) json_out(['error'=>'Email already registered'], 409);
  json_out(['error'=>'DB error'], 500);
}