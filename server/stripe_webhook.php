<?php
// Stripe webhook handler for payment confirmation and plan activation
require 'vendor/autoload.php';

// Set your Stripe secret key
\Stripe\Stripe::setApiKey('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');

// You should set your webhook secret from Stripe Dashboard
$endpoint_secret = 'whsec_YOUR_WEBHOOK_SECRET';

$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';
$event = null;

try {
    $event = \Stripe\Webhook::constructEvent(
        $payload, $sig_header, $endpoint_secret
    );
} catch(\UnexpectedValueException $e) {
    http_response_code(400); // Invalid payload
    exit();
} catch(\Stripe\Exception\SignatureVerificationException $e) {
    http_response_code(400); // Invalid signature
    exit();
}

// Handle the event
if ($event->type == 'checkout.session.completed') {
    $session = $event->data->object;
    // $session->id, $session->amount_total, $session->customer_email, etc.
    // TODO: Activate plan for user in your database
    // Example: file_put_contents('stripe_payments.log', json_encode($session) . "\n", FILE_APPEND);
}

http_response_code(200);
?>
