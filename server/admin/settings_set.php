<?php
require_once __DIR__ . '/require_admin.php';
admin_require_csrf();
header('Content-Type: application/json');

// Optional: restrict to localhost for key writes
$remote = $_SERVER['REMOTE_ADDR'] ?? '';
if (!in_array($remote, ['127.0.0.1', '::1'], true)) {
    http_response_code(403);
    echo json_encode(['error' => 'Settings writes allowed only from localhost']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$key = trim($input['stripe_secret'] ?? '');
if ($key === '' || !preg_match('/^sk_(test|live)_[A-Za-z0-9]+$/', $key)) {
    http_response_code(400);
    echo json_encode(['error' => 'Provide a valid Stripe secret (sk_test_… or sk_live_…)']);
    exit;
}

$path = __DIR__ . '/../stripe-secret.txt';
$ok = @file_put_contents($path, $key, LOCK_EX) !== false;
if (!$ok) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write stripe-secret.txt']);
    exit;
}

echo json_encode(['ok' => true]);
