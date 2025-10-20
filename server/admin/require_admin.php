<?php
// Admin access guard and lightweight schema migration for 'role' column
// Includes the shared auth bootstrap to get $pdo, sessions, and JSON helpers

require_once __DIR__ . '/../auth_config.php';

// Ensure the users table has a 'role' column; add if missing (idempotent)
try {
    $cols = $pdo->query("PRAGMA table_info(users)")->fetchAll(PDO::FETCH_ASSOC);
    $hasRole = false;
    foreach ($cols as $c) {
        if (isset($c['name']) && $c['name'] === 'role') { $hasRole = true; break; }
    }
    if (!$hasRole) {
        $pdo->exec("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'");
    }
} catch (Throwable $e) {
    // If pragma fails, continue; downstream queries will fail with clear errors
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    @session_start();
}

// Resolve current user from session
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, email, role, email_verified, created_at FROM users WHERE id = :id");
$stmt->execute([':id' => $_SESSION['user_id']]);
$me = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$me || ($me['role'] ?? 'user') !== 'admin') {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Forbidden: admin only']);
    exit;
}

// CSRF utilities for state-changing requests
function admin_require_csrf() {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') { return; }
    $hdr = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!isset($_SESSION['admin_csrf']) || !hash_equals($_SESSION['admin_csrf'], $hdr)) {
        http_response_code(419);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'CSRF validation failed']);
        exit;
    }
}

// Expose $me for includees
$_ADMIN = ['me' => $me];
