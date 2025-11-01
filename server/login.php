<?php
// Prosty backend logowania (demo, bez bazy danych)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');

// Demo: użytkownik testowy
$users = [
    'test@example.com' => [
        'password' => 'haslo123',
        'full_name' => 'Jan Kowalski',
        'plan' => 'Bezpłatny',
        'email_verified' => true,
        'role' => 'user'
    ]
];

// Pobierz dane z POST
$data = json_decode(file_get_contents('php://input'), true);
$email = isset($data['email']) ? $data['email'] : '';
$password = isset($data['password']) ? $data['password'] : '';

if (isset($users[$email]) && $users[$email]['password'] === $password) {
    // Zalogowano
    session_start();
    $_SESSION['user'] = $users[$email];
    $_SESSION['user']['email'] = $email;
    echo json_encode([
        'authenticated' => true,
        'user' => $_SESSION['user']
    ]);
} else {
    // Błędne dane
    echo json_encode([
        'authenticated' => false,
        'error' => 'Invalid credentials'
    ]);
}
?>