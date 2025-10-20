// Uzupełnij swoim kluczem publikowalnym Stripe (np. 'pk_live_...' lub 'pk_test_...')
// Bezpiecznie: to tylko klucz publiczny; klucz tajny ustaw na serwerze w PHP.
window.__STRIPE_PUBLISHABLE_KEY__ = '';

// Adres endpointu serwerowego do tworzenia PaymentIntent
// Dostosuj, jeśli masz inną ścieżkę lub język backendu.
window.__PAYMENT_INTENT_URL__ = '/server/create-payment-intent.php';
