<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

// Prosty bezpiecznik: tylko z localhost (unikamy zdalnego zapisu)
$remote = $_SERVER['REMOTE_ADDR'] ?? '';
if ($remote !== '127.0.0.1' && $remote !== '::1') {
  http_response_code(403);
  echo json_encode(['error' => 'Forbidden: local only']);
  exit;
}

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);
$secret = is_array($input) && isset($input['secret']) ? trim((string)$input['secret']) : '';
if ($secret === '') {
  http_response_code(400);
  echo json_encode(['error' => 'Missing secret']);
  exit;
}

// Minimalna walidacja formatu — pozwalamy zapisać cokolwiek, ale ostrzegamy w UI
if (strncmp($secret, 'sk_', 3) !== 0) {
  // dalej zapisujemy, decyzja należy do operatora
}

$path = __DIR__ . DIRECTORY_SEPARATOR . 'stripe-secret.txt';
$ok = @file_put_contents($path, $secret, LOCK_EX);
if ($ok === false) {
  http_response_code(500);
  echo json_encode(['error' => 'Write failed']);
  exit;
}

// Upewnij się, że plik zapisany bez BOM
$raw = @file_get_contents($path);
if ($raw !== false) {
  // zapis jako ASCII bez BOM
  $raw = preg_replace('/\r?\n$/','', $raw);
  @file_put_contents($path, $raw, LOCK_EX);
}

echo json_encode(['ok' => true]);
