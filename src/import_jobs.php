<?php
// Proxy do Jooble API, aby uniknąć CORS i nie eksponować klucza w przeglądarce
// Użycie (GET): import_jobs.php?keywords=programista&location=Polska&page=1

header('Content-Type: application/json; charset=utf-8');
// CORS dla lokalnych testów (rozważ zawężenie na produkcji)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// 1) Konfiguracja
$apiUrl = 'https://jooble.org/api/308b2058-1f34-451c-b28a-c25956935603';

// 2) Pobierz parametry zapytania (GET/POST)
$keywords = isset($_GET['keywords']) ? trim($_GET['keywords']) : (isset($_POST['keywords']) ? trim($_POST['keywords']) : '');
$location = isset($_GET['location']) ? trim($_GET['location']) : (isset($_POST['location']) ? trim($_POST['location']) : '');
$page     = isset($_GET['page']) ? intval($_GET['page']) : (isset($_POST['page']) ? intval($_POST['page']) : 1);

// Bezpieczeństwo: proste ograniczenia długości
if (strlen($keywords) > 100) $keywords = substr($keywords, 0, 100);
if (strlen($location) > 100) $location = substr($location, 0, 100);
if ($page < 1) $page = 1;

// 3) Zbuduj payload
// Jeśli użytkownik nie podał nic (ani keywords, ani location) – zastosuj bezpieczne, szerokie domyślne wartości,
// ale jeśli podał choć jedno z nich, NIE nadpisuj drugim domyślną wartością.
$payload = [ 'page' => $page ];
if ($keywords === '' && $location === '') {
    // Domyślne zapytanie startowe – większa szansa na wyniki niż "programista/Polska"
    $payload['keywords'] = 'developer';
    $payload['location'] = 'Poland';
} else {
    $payload['keywords'] = $keywords; // może być pusty – wtedy filtrowanie tylko po lokalizacji
    $payload['location'] = $location; // może być puste – wtedy filtrowanie tylko po słowie kluczowym
}

// 4) Wywołanie Jooble API przez cURL
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'User-Agent: eCVjob-local-proxy/1.0'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_TIMEOUT, 20);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);

// Opcjonalnie, dla lokalnych problemów z certyfikatami: dodaj ?insecure=1 do URL
if (isset($_GET['insecure']) && $_GET['insecure'] == '1') {
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
}

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

// 5) Obsługa błędów
if ($response === false || $httpCode >= 400) {
    http_response_code(502);
    echo json_encode([
        'success' => false,
        'error' => 'Błąd pobierania z Jooble API',
        'httpCode' => $httpCode,
        'curlError' => $curlErr,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 6) Zwróć surowy JSON od Jooble
http_response_code(200);
echo $response;
?>
