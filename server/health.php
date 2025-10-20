<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$secret = null;
$src = null;
if (getenv('STRIPE_SECRET_KEY')) { $secret = getenv('STRIPE_SECRET_KEY'); $src = 'env'; }
if (!$secret && isset($_SERVER['STRIPE_SECRET_KEY'])) { $secret = $_SERVER['STRIPE_SECRET_KEY']; $src = 'server'; }
if (!$secret) {
  $envFile = __DIR__ . DIRECTORY_SEPARATOR . '.env';
  if (file_exists($envFile)) {
    $ini = @parse_ini_file($envFile, false, INI_SCANNER_TYPED);
    if ($ini && isset($ini['STRIPE_SECRET_KEY']) && is_string($ini['STRIPE_SECRET_KEY'])) { $secret = trim($ini['STRIPE_SECRET_KEY']); $src='file:.env'; }
  }
}
if (!$secret) {
  $txtFile = __DIR__ . DIRECTORY_SEPARATOR . 'stripe-secret.txt';
  if (file_exists($txtFile)) { $content = @file_get_contents($txtFile); if ($content !== false) { $secret = trim($content); $src='file:stripe-secret.txt'; } }
}
$ok = ($secret && strncmp($secret, 'sk_', 3) === 0);
echo json_encode([
  'stripeSecretDetected' => $ok,
  'source' => $src,
  'prefix' => $ok ? substr($secret,0,5) : null,
]);
