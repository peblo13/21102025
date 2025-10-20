<?php
require_once __DIR__ . '/require_admin.php';
header('Content-Type: application/json');

$total = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
$verified = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE email_verified = 1")->fetchColumn();
$admins = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();

echo json_encode([
    'users_total' => $total,
    'users_verified' => $verified,
    'admins' => $admins,
]);
