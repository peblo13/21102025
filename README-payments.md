# Płatności: Karta (świat) + BLIK (PL)

Ten projekt integruje Stripe Payment Element, umożliwiając płatność kartą globalnie oraz BLIK-iem w Polsce.

## Wymagania
- Konto Stripe (test lub live)
- PHP 7.4+ na serwerze lokalnym (Apache), composer
- `server/` dostępne spod `/server/...` (np. `http://localhost/server/create-payment-intent.php`)

## Instalacja backendu (PHP)
1. Ustaw zmienną środowiskową z kluczem tajnym Stripe:
   - Windows PowerShell (tymczasowo w sesji):
     ```powershell
     setx STRIPE_SECRET_KEY "sk_test_..."
     # zamknij i otwórz nowe okno, by wczytać zmienną
     ```
2. Zainstaluj zależności w folderze `server/`:
   ```powershell
   cd server
   composer install
   ```

## Konfiguracja frontendu
1. W pliku `src/js/payments.config.js` wpisz klucz publikowalny:
   ```js
   window.__STRIPE_PUBLISHABLE_KEY__ = 'pk_test_...';
   ```
2. Upewnij się, że endpoint jest poprawny:
   ```js
   window.__PAYMENT_INTENT_URL__ = '/server/create-payment-intent.php';
   ```

## Użycie
- Wejdź na `src/index.html`, sekcja „Płatność”.
- Wybierz kwotę i walutę (PLN włącza BLIK), kliknij „Zapłać”.
- Stripe poprowadzi przez metody płatności w Payment Element.

## Uwaga dot. BLIK
- BLIK działa, gdy `currency=pln` i konto Stripe ma włączony BLIK.
- W trybie testowym Stripe używa specjalnych kodów testowych BLIK.

## Produkcja
- Zmień klucze testowe na produkcyjne.
- Rozważ weryfikację kwot, walut, walidację CSRF i logowanie transakcji.
