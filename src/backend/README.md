# CryptoBLIK Backend

Backend for CryptoBLIK platform with real Bybit trading and PayU BLIK integration.

## Setup

1. Install dependencies: `npm install`
2. Set up `.env` with:
   - Bybit API keys (provided)
   - PayU credentials (register at PayU and get POS ID, Client ID, Secret)
3. Run: `npm start`

## API Endpoints

- GET /api/prices: Fetch crypto prices from Bybit
- POST /api/buy: Handle buy with BLIK (PayU) and Bybit trade
- POST /api/sell: Handle sell with Bybit trade
- POST /api/notify: PayU webhook

## Notes

- Bybit: Production mode (add funds to account).
- PayU: Add real credentials for BLIK payments.
- Wallet sending: Requires external wallet service (not implemented).