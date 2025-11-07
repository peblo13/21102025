# CryptoBLIK Configuration
# Uzupełnij swoje prawdziwe klucze API

import os

# =============================================================================
# KLUCZE API BYBIT - GOTOWE DO UŻYCIA
# =============================================================================

# Klucze API Bybit - prawdziwe klucze produkcyjne
BYBIT_API_KEY = "cSid7NTVRHJ7wuT7S8"
BYBIT_API_SECRET = "Bbkgm5MYlIylyBd7zCs3tpskKlDPSDppfUZl"

# UWAGA: Prawdziwe klucze produkcyjne!
# Te klucze umożliwiają rzeczywiste transakcje na Bybit
# Upewnij się, że mają odpowiednie uprawnienia:
# - Spot Trading (kupno/sprzedaż)
# - Read (odczyt salda i pozycji)

# Alternatywnie możesz ustawić zmienne środowiskowe:
# $env:BYBIT_API_KEY='twoj_klucz'
# $env:BYBIT_API_SECRET='twoj_secret'

# Jeśli zmienne środowiskowe są ustawione, użyj ich
if os.environ.get('BYBIT_API_KEY'):
    BYBIT_API_KEY = os.environ.get('BYBIT_API_KEY')
if os.environ.get('BYBIT_API_SECRET'):
    BYBIT_API_SECRET = os.environ.get('BYBIT_API_SECRET')

# =============================================================================

# POZOSTAŁA KONFIGURACJA
# =============================================================================

BYBIT_BASE_URL = 'https://api.bybit.com'
BYBIT_TESTNET = False

# Obsługiwane kryptowaluty (najlepiej sprawdzone na Bybit)
SUPPORTED_CRYPTOS = {
    'BTC': 'BTCUSDT',
    'ETH': 'ETHUSDT',
    'USDC': 'USDCUSDT',
    'USDT': 'USDTUSDT',
    'DOGE': 'DOGEUSDT',
    'SHIB': 'SHIBUSDT',
    'TRX': 'TRXUSDT'
}

# Limity bezpieczeństwa
LIMITS = {
    'min_pln': 10.0,
    'max_pln': 50000.0,
    'trading_fee': 0.1  # 0.1% opłata
}

# =============================================================================
# PAYU KONFIGURACJA (PRODUKCJA LUB SANDBOX)
# =============================================================================
# Ustaw poniższe zmienne środowiskowe w panelu Render.com lub Railway:
# PAYU_CLIENT_ID, PAYU_CLIENT_SECRET, PAYU_POS_ID, PAYU_SECOND_KEY, PAYU_POS_AUTH_KEY, PAYU_ENV

PAYU_CLIENT_ID = os.environ.get('PAYU_CLIENT_ID', 'wstaw_tutaj_swoj_client_id')
PAYU_CLIENT_SECRET = os.environ.get('PAYU_CLIENT_SECRET', 'wstaw_tutaj_swoj_client_secret')
PAYU_POS_ID = os.environ.get('PAYU_POS_ID', 'wstaw_tutaj_swoj_pos_id')
PAYU_SECOND_KEY = os.environ.get('PAYU_SECOND_KEY', 'wstaw_tutaj_swoj_second_key')
PAYU_POS_AUTH_KEY = os.environ.get('PAYU_POS_AUTH_KEY', 'wstaw_tutaj_swoj_pos_auth_key')
PAYU_ENV = os.environ.get('PAYU_ENV', 'sandbox')  # 'sandbox' lub 'production'

# Przykład użycia w kodzie:
# import config
# client_id = config.PAYU_CLIENT_ID
# pos_auth_key = config.PAYU_POS_AUTH_KEY
# ...

def get_api_credentials():
    """Zwraca klucze API"""
    return BYBIT_API_KEY, BYBIT_API_SECRET

def validate_config():
    """Sprawdza czy konfiguracja jest poprawna"""
    if BYBIT_API_KEY == "TUTAJ_WSTAW_SWÓJ_PRAWDZIWY_KLUCZ_API":
        print("⚠️  UWAGA: Używasz kluczy testowych!")
        print("   Dla prawdziwych transakcji ustaw klucze produkcyjne")
        return True  # Pozwalamy na testowe klucze
    
    if BYBIT_API_SECRET == "TUTAJ_WSTAW_SWÓJ_PRAWDZIWY_SECRET":
        print("⚠️  UWAGA: Używasz kluczy testowych!")
        print("   Dla prawdziwych transakcji ustaw klucze produkcyjne") 
        return True  # Pozwalamy na testowe klucze
    
    print("✅ Konfiguracja API jest gotowa")
    if "demo" in BYBIT_API_KEY.lower() or "test" in BYBIT_API_KEY.lower():
        print("📝 Używasz kluczy testowych - system będzie działać w trybie demo")
    else:
        print("🔥 Używasz kluczy produkcyjnych - rzeczywiste transakcje!")
    return True

if __name__ == "__main__":
    print("CryptoBLIK - Sprawdzanie konfiguracji")
    print("=" * 50)
    validate_config()
    print(f"API Key: {BYBIT_API_KEY[:8]}..." if len(BYBIT_API_KEY) > 8 else "BRAK")
    print(f"Obsługiwane crypto: {list(SUPPORTED_CRYPTOS.keys())}")