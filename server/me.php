<?php
// Prosty backend do pobierania danych zalogowanego użytkownika (demo)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
session_start();
if (isset($_SESSION['user'])) {
    echo json_encode([
        'authenticated' => true,
        'user' => $_SESSION['user']
    ]);
} else {
    echo json_encode([
        'authenticated' => false
    ]);
}
?>