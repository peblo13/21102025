<?php
// server/create-checkout-session.php
// Tworzy Stripe Checkout Session po wybraniu planu lub premium dla ogłoszenia

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

// Klucz tajny Stripe z ENV (SetEnv/Apache lub systemowe). Możliwy fallback z $_SERVER.
// Funkcja: pobierz klucz tajny z ENV lub pliku .env / stripe-secret.txt
$secret = getenv('STRIPE_SECRET_KEY');
if (!$secret && isset($_SERVER['STRIPE_SECRET_KEY'])) {
  $secret = $_SERVER['STRIPE_SECRET_KEY'];
}
if (!$secret) {
  $envFile = __DIR__ . DIRECTORY_SEPARATOR . '.env';
  if (file_exists($envFile)) {
    $ini = @parse_ini_file($envFile, false, INI_SCANNER_TYPED);
    if ($ini && isset($ini['STRIPE_SECRET_KEY']) && is_string($ini['STRIPE_SECRET_KEY'])) {
      $secret = trim($ini['STRIPE_SECRET_KEY']);
    }
  }
}
if (!$secret) {
  $txtFile = __DIR__ . DIRECTORY_SEPARATOR . 'stripe-secret.txt';
  if (file_exists($txtFile)) {
    $content = @file_get_contents($txtFile);
    if ($content !== false) { $secret = trim($content); }
  }
}
if (!$secret) {
  http_response_code(500);
  echo json_encode(['error' => 'Missing STRIPE_SECRET_KEY (set env var, add .env with STRIPE_SECRET_KEY=..., or stripe-secret.txt)']);
  exit;
}

$inputJson = file_get_contents('php://input');
$input = json_decode($inputJson, true);
if (!is_array($input)) { $input = []; }
$type = isset($input['type']) ? $input['type'] : 'plan';
$plan = isset($input['plan']) ? $input['plan'] : '';
$adId = isset($input['adId']) ? $input['adId'] : '';
$currency = isset($input['currency']) ? strtolower($input['currency']) : 'pln';
// Dopuszczalne waluty
if (!in_array($currency, ['pln','eur','usd'], true)) { $currency = 'pln'; }

// Macierz cen (w najmniejszych jednostkach: grosze/centy)
$priceMatrix = [
  'pln' => [ 'Premium' => 2999, 'Business' => 9999, 'Enterprise' => 19999, 'premium-ad' => 1499 ],
  'eur' => [ 'Premium' => 699,  'Business' => 2499, 'Enterprise' => 4999,  'premium-ad' => 399 ],
  'usd' => [ 'Premium' => 799,  'Business' => 2499, 'Enterprise' => 4999,  'premium-ad' => 399 ],
];

// Zbuduj line_items + tryb płatności
$lineItems = [];
if ($type === 'premium-ad' && $adId) {
  $lineItems[] = [
    'price_data' => [
      'currency' => $currency,
      'product_data' => [ 'name' => 'Premium ogłoszenie', 'metadata' => ['adId' => (string)$adId] ],
      'unit_amount' => $priceMatrix[$currency]['premium-ad'],
    ],
    'quantity' => 1,
  ];
  $mode = 'payment';
} else {
  $label = $plan ?: 'Premium';
  $amount = isset($priceMatrix[$currency][$label]) ? $priceMatrix[$currency][$label] : $priceMatrix[$currency]['Premium'];
  $lineItems[] = [
    'price_data' => [
      'currency' => $currency,
      'product_data' => [ 'name' => 'Plan ' . $label ],
      'unit_amount' => $amount,
      'recurring' => [ 'interval' => 'month' ],
    ],
    'quantity' => 1,
  ];
  $mode = 'subscription';
}

// Wyznacz adresy sukcesu/anulowania na bazie origin/referrer
$origin = 'http://localhost';
if (!empty($_SERVER['HTTP_ORIGIN'])) {
  $origin = $_SERVER['HTTP_ORIGIN'];
} elseif (!empty($_SERVER['HTTP_REFERER'])) {
  $origin = preg_replace('#/src/.*$#','', $_SERVER['HTTP_REFERER']);
}
$success = rtrim($origin, '/') . '/src/thank-you.html';
$cancel  = rtrim($origin, '/') . '/src/checkout.html';

// Zbuduj payload w formacie x-www-form-urlencoded (z użyciem zagnieżdżonych kluczy)
$payload = [
  'mode' => $mode,
  'success_url' => $success,
  'cancel_url' => $cancel,
  // Stripe wymaga tablicy payment_method_types[], ustawiamy tylko kartę
  'payment_method_types' => ['card'],
  'line_items' => $lineItems,
];

// Funkcja pomocnicza: http_build_query obsłuży tablice z kluczami w notacji bracket
$postFields = http_build_query($payload);

// Przygotowanie cURL do wywołania Stripe API bez SDK
$ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Authorization: Bearer ' . $secret,
  'Content-Type: application/x-www-form-urlencoded',
]);

// Opcjonalny lokalny CA bundle (jeśli istnieje w tym katalogu), aby uniknąć problemów z certyfikatami
$localCa = __DIR__ . DIRECTORY_SEPARATOR . 'cacert.pem';
if (file_exists($localCa)) {
  curl_setopt($ch, CURLOPT_CAINFO, $localCa);
}

$resp = curl_exec($ch);
$curlErr = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($resp === false) {
  http_response_code(500);
  echo json_encode(['error' => 'Stripe cURL error: ' . $curlErr]);
  exit;
}

$data = json_decode($resp, true);
if (!is_array($data)) {
  http_response_code($httpCode ?: 500);
  echo json_encode(['error' => 'Stripe response parse error', 'status' => $httpCode, 'raw' => $resp]);
  exit;
}

if ($httpCode >= 400) {
  $msg = isset($data['error']['message']) ? $data['error']['message'] : 'Stripe API error';
  http_response_code($httpCode);
  echo json_encode(['error' => $msg, 'status' => $httpCode, 'details' => $data]);
  exit;
}

echo json_encode(['url' => isset($data['url']) ? $data['url'] : null, 'id' => isset($data['id']) ? $data['id'] : null]);
