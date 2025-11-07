#!/usr/bin/env python3
"""
CryptoBLIK Production App
Unified backend dla https://cryptoblik.pl
"""

import os
import requests
import json
import hashlib
import hmac
import time
from flask import Flask, request, jsonify
from flask_cors import CORS

# Import konfiguracji
from config import get_api_credentials, BYBIT_BASE_URL, SUPPORTED_CRYPTOS

def create_app():
    """Stwórz unified Flask app dla produkcji"""
    app = Flask(__name__, static_folder='.')
    
    # CORS dla https://cryptoblik.pl i innych
    CORS(app, methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type", "Authorization"])
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {"status": "OK", "service": "CryptoBLIK Production API"}
    
    @app.route('/')
    def root():
        return app.send_static_file('index.html')
    
    # Bybit API functions
    def generate_signature(params, secret):
        """Generate signature for Bybit API requests"""
        query_string = '&'.join([f"{k}={v}" for k, v in sorted(params.items())])
        return hmac.new(secret.encode('utf-8'), query_string.encode('utf-8'), hashlib.sha256).hexdigest()

    @app.route('/api/market-price/<symbol>')
    def market_price(symbol):
        """Get crypto price from Bybit"""
        try:
            url = f'{BYBIT_BASE_URL}/v5/market/tickers'
            params = {
                'category': 'spot',
                'symbol': symbol
            }
            
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if data.get('retCode') == 0 and data.get('result'):
                ticker = data['result']['list'][0]
                return jsonify({
                    'symbol': symbol,
                    'price': float(ticker.get('lastPrice', 0)),
                    'bid': float(ticker.get('bid1Price', 0)),
                    'ask': float(ticker.get('ask1Price', 0)),
                    'volume24h': float(ticker.get('volume24h', 0))
                })
            else:
                return jsonify({'error': 'Symbol not found'}), 404
                
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/calculate-crypto-amount', methods=['POST', 'OPTIONS'])
    def calculate_crypto_amount():
        """Calculate crypto amount for PLN input"""
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            data = request.get_json()
            pln_amount = float(data.get('pln_amount', 0))
            crypto_symbol = data.get('crypto_symbol', 'BTCUSDT')
            
            # Get USD/PLN rate (using USDC/USDT as approximation)
            usd_pln_response = requests.get(f'{BYBIT_BASE_URL}/v5/market/tickers?category=spot&symbol=USDCUSDT', timeout=10)
            usd_pln_data = usd_pln_response.json()
            usd_pln_rate = 4.0  # default
            if usd_pln_data.get('retCode') == 0 and usd_pln_data.get('result'):
                usd_pln_rate = float(usd_pln_data['result']['list'][0].get('lastPrice', 4.0))
            
            # Get crypto price
            crypto_response = requests.get(f'{BYBIT_BASE_URL}/v5/market/tickers?category=spot&symbol={crypto_symbol}', timeout=10)
            crypto_data = crypto_response.json()
            crypto_price_usd = 1.0  # default
            if crypto_data.get('retCode') == 0 and crypto_data.get('result'):
                crypto_price_usd = float(crypto_data['result']['list'][0].get('lastPrice', 1.0))
            
            usd_amount = pln_amount / usd_pln_rate
            crypto_amount = usd_amount / crypto_price_usd
            
            return jsonify({
                'success': True,
                'pln_amount': pln_amount,
                'usd_amount': usd_amount,
                'crypto_amount': crypto_amount,
                'crypto_symbol': crypto_symbol,
                'usd_pln_rate': usd_pln_rate,
                'crypto_price_usd': crypto_price_usd
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/crypto/buy', methods=['POST'])
    def crypto_buy():
        """Handle crypto purchase with BLIK"""
        try:
            data = request.get_json()
            # Validacja danych
            required_fields = ['amount', 'crypto', 'wallet', 'blik_code', 'email']
            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'Missing field: {field}'}), 400

            # Parametry wejściowe
            amount_pln = float(data['amount'])
            crypto_symbol = data['crypto']
            wallet = data['wallet']
            email = data['email']
            # Prowizja 5%
            fee_percent = 0.05
            fee_pln = round(amount_pln * fee_percent, 2)
            amount_for_crypto = round(amount_pln - fee_pln, 2)

            # Pobierz kurs krypto (USDT/PLN i krypto/USDT)
            # Założenie: PLN->USDT->krypto
            try:
                # 1. Pobierz kurs USDT/PLN (odwrotność PLN/USDT)
                url_usdt = f'{BYBIT_BASE_URL}/v5/market/tickers'
                params_usdt = {'category': 'spot', 'symbol': 'USDTPLN'}
                r_usdt = requests.get(url_usdt, params=params_usdt, timeout=10)
                d_usdt = r_usdt.json()
                if d_usdt.get('retCode') == 0 and d_usdt.get('result'):
                    usdt_pln = float(d_usdt['result']['list'][0]['lastPrice'])
                else:
                    return jsonify({'error': 'Brak kursu USDT/PLN'}), 400
                # 2. Pobierz kurs krypto/USDT
                params_crypto = {'category': 'spot', 'symbol': f'{crypto_symbol}USDT'}
                r_crypto = requests.get(url_usdt, params=params_crypto, timeout=10)
                d_crypto = r_crypto.json()
                if d_crypto.get('retCode') == 0 and d_crypto.get('result'):
                    crypto_usdt = float(d_crypto['result']['list'][0]['lastPrice'])
                else:
                    return jsonify({'error': f'Brak kursu {crypto_symbol}/USDT'}), 400
            except Exception as e:
                return jsonify({'error': f'Błąd pobierania kursów: {str(e)}'}), 500

            # Oblicz ile USDT i krypto kupić
            usdt_amount = round(amount_for_crypto / usdt_pln, 6)
            crypto_amount = round(usdt_amount / crypto_usdt, 8)

            # Zakup krypto na Bybit (market order)
            api_key, api_secret = get_api_credentials()
            bybit_order_url = f'{BYBIT_BASE_URL}/v5/order/create'
            timestamp = int(time.time() * 1000)
            order_params = {
                'category': 'spot',
                'symbol': f'{crypto_symbol}USDT',
                'side': 'Buy',
                'orderType': 'Market',
                'qty': str(crypto_amount),
                'timestamp': str(timestamp),
                'api_key': api_key
            }
            # Podpisz zapytanie
            sign = generate_signature(order_params, api_secret)
            order_params['sign'] = sign
            # Wyślij zapytanie
            try:
                order_resp = requests.post(bybit_order_url, data=order_params, timeout=10)
                order_data = order_resp.json()
                if order_data.get('retCode') != 0:
                    return jsonify({'error': f'Błąd zakupu krypto: {order_data.get("retMsg", "Brak szczegółów")}'})
            except Exception as e:
                return jsonify({'error': f'Błąd zamówienia na Bybit: {str(e)}'}), 500

            # Odpowiedź
            response = {
                "status": "success",
                "message": "Transakcja crypto zrealizowana",
                "transaction_id": f"CB_{int(time.time())}",
                "data": {
                    "amount_pln": amount_pln,
                    "fee_pln": fee_pln,
                    "amount_for_crypto": amount_for_crypto,
                    "crypto": crypto_symbol,
                    "wallet": wallet,
                    "email": email,
                    "usdt_amount": usdt_amount,
                    "crypto_amount": crypto_amount,
                    "order_result": order_data
                }
            }
            return jsonify(response)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/payment/blik', methods=['POST'])
    def blik_payment():
        """Handle BLIK payment processing"""
        try:
            data = request.get_json()
            
            # Validacja danych BLIK
            required_fields = ['blik_code', 'amount', 'email']
            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'Missing field: {field}'}), 400
            
            # Symulacja płatności BLIK
            response = {
                "status": "success",
                "message": "Płatność BLIK zainicjowana",
                "payment_id": f"BLIK_{int(time.time())}",
                "amount": data['amount'],
                "email": data['email']
            }
            
            # TODO: Implementować rzeczywistą integrację z PayU/Przelewy24
            
            return jsonify(response)
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    return app

# Utwórz app instance
app = create_app()

if __name__ == '__main__':
    # Render.com przekazuje port przez zmienną środowiskową PORT
    port = int(os.environ.get('PORT', 10000))
    debug = os.environ.get('FLASK_ENV') == 'development'

    print(f"🚀 CryptoBLIK API startuje na porcie {port} (Render.com ready)")
    print(f"🔧 Debug mode: {debug}")
    print(f"🌐 CORS origins: https://cryptoblik.pl")

    app.run(host='0.0.0.0', port=port, debug=debug)

