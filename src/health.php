<?php
header('Content-Type: text/plain; charset=utf-8');

echo "== eCVjob health check ==\n\n";
echo "PHP: " . PHP_VERSION . "\n";
echo "cURL: " . (function_exists('curl_version') ? 'ENABLED' : 'MISSING') . "\n";
echo "OpenSSL: " . (defined('OPENSSL_VERSION_TEXT') ? OPENSSL_VERSION_TEXT : 'unknown') . "\n\n";

$test = isset($_GET['test']) ? $_GET['test'] : '';

if ($test === 'curl') {
    $url = isset($_GET['url']) ? $_GET['url'] : 'https://example.com/';
    echo "-- Testing cURL GET: $url --\n";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($ch, CURLOPT_USERAGENT, 'eCVjob-health/1.0');
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);
    echo "HTTP code: $code\n";
    echo "Error: $err\n";
    echo "Body first 200 chars:\n" . substr($body ?: '', 0, 200) . "\n";
    exit;
}

if ($test === 'jooble') {
    $apiKey = '308b2058-1f34-451c-b28a-c25956935603';
    $payload = json_encode(['keywords' => 'programista', 'location' => 'Polska', 'page' => 1], JSON_UNESCAPED_UNICODE);
    $url = "https://jooble.org/api/{$apiKey}";
    echo "-- Testing Jooble POST --\nURL: $url\nPayload: $payload\n";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json','Accept: application/json','User-Agent: eCVjob-health/1.0']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    // Opcjonalne wyłączenie TLS
    if (isset($_GET['insecure']) && $_GET['insecure'] == '1') {
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        echo "TLS verify: DISABLED\n";
    } else {
        echo "TLS verify: ENABLED\n";
    }
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);
    echo "HTTP code: $code\n";
    echo "Error: $err\n";
    echo "Resp first 400 chars:\n" . substr($resp ?: '', 0, 400) . "\n";
    exit;
}

echo "Usage:\n";
echo "  /health.php?test=curl&url=https://example.com/\n";
echo "  /health.php?test=jooble            # TLS verify ON\n";
echo "  /health.php?test=jooble&insecure=1 # TLS verify OFF (local only)\n";
?>
