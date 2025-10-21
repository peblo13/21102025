<?php
// Plik: jooble-proxy.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['apiKey'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Brak danych wejściowych']);
    exit;
}

$url = 'https://jooble.org/api/';

$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($input),
        'timeout' => 10
    ]
];
$context  = stream_context_create($options);
$result = @file_get_contents($url, false, $context);
if ($result === FALSE) {
    http_response_code(502);
    echo json_encode(['error' => 'Błąd proxy lub API Jooble']);
    exit;
}
echo $result;
