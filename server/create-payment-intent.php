<?php
// server/create-payment-intent.php
// Minimalny endpoint do tworzenia PaymentIntent ze Stripe z włączonymi metodami: karta (globalnie) + blik (PL)
// WYMAGANE: PHP 7.4+, rozszerzenie curl, composer zainstalowany stripe/stripe-php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/vendor/autoload.php';

$input = json_decode(file_get_contents('php://input'), true);
$amount = isset($input['amount']) ? intval($input['amount']) : 0;
$currency = isset($input['currency']) ? strtolower($input['currency']) : 'pln';

// Walidacja prosta
if ($amount < 1) { http_response_code(400); echo json_encode(['error' => 'Invalid amount']); exit; }
if (!in_array($currency, ['pln','eur','usd'])) { http_response_code(400); echo json_encode(['error' => 'Invalid currency']); exit; }

// PRZED URUCHOMIENIEM: ustaw klucz tajny Stripe w zmiennej środowiskowej STRIPE_SECRET_KEY
$secret = getenv('STRIPE_SECRET_KEY');
if (!$secret) {
  http_response_code(500);
  echo json_encode(['error' => 'Missing STRIPE_SECRET_KEY environment variable']);
  exit;
}

\Stripe\Stripe::setApiKey($secret);

try {
  // Kwota w najmniejszych jednostkach waluty: PLN grosze, EUR/ USD centy
  $unit = max(1, $amount) * 100;

  // Włączamy karty i BLIK
  $pm_types = ['card'];
  if ($currency === 'pln') { $pm_types[] = 'blik'; }

  $intent = \Stripe\PaymentIntent::create([
    'amount' => $unit,
    'currency' => $currency,
    'payment_method_types' => $pm_types,
    'automatic_payment_methods' => [ 'enabled' => true ],
    'metadata' => [ 'project' => 'eCVjob.pl' ],
  ]);

  echo json_encode([ 'clientSecret' => $intent->client_secret ]);
} catch (\Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
