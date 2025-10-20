<?php
// Common auth config: DB connection, JSON helpers, CORS, session
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

ini_set('session.use_strict_mode', '1');
ini_set('session.cookie_httponly', '1');
// For local http, secure flag cannot be set; in prod set session.cookie_secure=1 and use HTTPS
session_name('ECVSESS');
session_start();

function json_out($data, int $status=200) {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

function get_db(): PDO {
  static $pdo = null;
  if ($pdo) return $pdo;
  $dir = __DIR__ . DIRECTORY_SEPARATOR . 'data';
  if (!is_dir($dir)) { @mkdir($dir, 0775, true); }
  $path = $dir . DIRECTORY_SEPARATOR . 'auth.sqlite';
  $pdo = new PDO('sqlite:' . $path, null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
  init_schema($pdo);
  return $pdo;
}

function init_schema(PDO $db) {
  $db->exec('CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    plan TEXT DEFAULT "Bezpłatny",
    role TEXT DEFAULT "user",
    email_verified INTEGER DEFAULT 0,
    verify_token TEXT,
    reset_token TEXT,
    reset_expires INTEGER,
    created_at INTEGER NOT NULL
  )');
  // backfill role column if table existed without it
  try {
    $cols = $db->query('PRAGMA table_info(users)')->fetchAll();
    $hasRole = false;
    foreach ($cols as $c) { if (($c['name'] ?? '') === 'role') { $hasRole = true; break; } }
    if (!$hasRole) { $db->exec("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'"); }
  } catch (Throwable $e) {}
  $db->exec('CREATE TABLE IF NOT EXISTS rate_limits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT NOT NULL,
    action TEXT NOT NULL,
    count INTEGER NOT NULL,
    window_start INTEGER NOT NULL
  )');
}

function rate_limit(PDO $db, string $action, int $limit, int $windowSec=600) {
  $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
  $now = time();
  $row = $db->prepare('SELECT * FROM rate_limits WHERE ip=? AND action=?')->execute([$ip,$action]) ? $db->query('SELECT * FROM rate_limits WHERE ip='.$db->quote($ip).' AND action='.$db->quote($action))->fetch() : null;
  if (!$row) {
    $db->prepare('INSERT INTO rate_limits(ip,action,count,window_start) VALUES (?,?,?,?)')->execute([$ip,$action,1,$now]);
    return; 
  }
  $count = (int)$row['count'];
  $start = (int)$row['window_start'];
  if ($now - $start > $windowSec) {
    $db->prepare('UPDATE rate_limits SET count=?, window_start=? WHERE id=?')->execute([1,$now,$row['id']]);
    return;
  }
  if ($count >= $limit) {
    json_out(['error'=>'Too many requests, try later'], 429);
  }
  $db->prepare('UPDATE rate_limits SET count=count+1 WHERE id=?')->execute([$row['id']]);
}

function require_json_input() {
  $raw = file_get_contents('php://input');
  $data = json_decode($raw, true);
  if (!is_array($data)) json_out(['error'=>'Invalid JSON'], 400);
  return $data;
}

function current_user(PDO $db) {
  if (empty($_SESSION['uid'])) return null;
  $stmt = $db->prepare('SELECT id,email,full_name,plan,role,email_verified,created_at FROM users WHERE id=?');
  $stmt->execute([$_SESSION['uid']]);
  return $stmt->fetch() ?: null;
}
