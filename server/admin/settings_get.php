<?php
require_once __DIR__ . '/require_admin.php';
header('Content-Type: application/json');

// Reuse detection logic similar to health.php but only expose prefixes
$prefix = null; $source = null;
if (getenv('STRIPE_SECRET_KEY')) { $source = 'env'; $prefix = substr(getenv('STRIPE_SECRET_KEY'), 0, 7); }
else {
    $envPath = __DIR__ . '/../.env';
    $txtPath = __DIR__ . '/../stripe-secret.txt';
    if (is_file($envPath)) {
        $env = @parse_ini_file($envPath, false, INI_SCANNER_RAW);
        if ($env && isset($env['STRIPE_SECRET_KEY'])) { $source = '.env'; $prefix = substr(trim($env['STRIPE_SECRET_KEY']), 0, 7); }
    }
    if (!$prefix && is_file($txtPath)) {
        $val = trim(@file_get_contents($txtPath));
        if ($val) { $source = 'file'; $prefix = substr($val, 0, 7); }
    }
}

// CSRF seed for admin UI
if (!isset($_SESSION['admin_csrf'])) { $_SESSION['admin_csrf'] = bin2hex(random_bytes(16)); }

echo json_encode([
    'stripe_secret' => $prefix ? ($prefix . '…') : null,
    'source' => $source,
    'csrf' => $_SESSION['admin_csrf'],
]);
