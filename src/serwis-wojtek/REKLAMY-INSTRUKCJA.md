# 📺 Instrukcja konfiguracji reklam na stronie serwiswojtka.pl

## 🎯 Miejsca na reklamy w witrynie:

### 1. **Banner górny (728x90)** - Leaderboard
- **Lokalizacja**: Tuż pod headerem
- **Rozmiar**: 728x90 px (desktop), 320x50 px (mobile)
- **Typ**: Google AdSense lub bezpośrednie bannery
- **Widoczność**: Bardzo wysoka

### 2. **Reklama w treści (320x100)** - Large Mobile Banner
- **Lokalizacja**: Między sekcją usług a kontaktem
- **Rozmiar**: 320x100 px
- **Typ**: Artykuły sponsorowane lub AdSense
- **Widoczność**: Średnia-wysoka

### 3. **Sidebar reklamy (160x600)** - Wide Skyscraper
- **Lokalizacja**: Prawy bok strony (tylko desktop)
- **Rozmiar**: 160x600 px
- **Typ**: Affiliate links, lokalne reklamy
- **Widoczność**: Średnia (desktop only)

## 🔧 Konfiguracja Google AdSense:

### Krok 1: Załóż konto AdSense
1. Idź na https://www.google.com/adsense/
2. Załóż konto używając Gmail
3. Dodaj swoją domenę: `serwiswojtka.pl`
4. Zweryfikuj własność strony

### Krok 2: Zamień placeholdery w kodzie
W pliku `index.html` zamień:
```
ca-pub-TWOJ-ADSENSE-ID → ca-pub-1234567890123456
SLOT-ID → 1234567890
SLOT-ID-2 → 1234567891
SLOT-ID-3 → 1234567892
GA_MEASUREMENT_ID → G-XXXXXXXXXX
```

### Krok 3: Utworzone jednostki reklamowe
1. **Top Banner**: 728x90 (responsywny)
2. **In-Content**: 320x100 (mobile)
3. **Sidebar**: 160x600 (desktop tylko)

## 💰 Potencjalne przychody z reklam:

### Przy 1000 odwiedzin/miesiąc:
- **Google AdSense**: 30-100 zł
- **Lokalne bannery**: 100-300 zł
- **Affiliate links**: 50-200 zł
- **RAZEM**: 180-600 zł/miesiąc

### Przy 5000 odwiedzin/miesiąc:
- **Google AdSense**: 150-500 zł
- **Lokalne bannery**: 300-800 zł
- **Affiliate links**: 200-600 zł
- **RAZEM**: 650-1900 zł/miesiąc

## 🎯 Alternatywne sieci reklamowe:

### 1. **Clickshare.pl** (polska sieć)
- Niższe wymagania niż AdSense
- Lokalne reklamy
- Wypłaty w PLN

### 2. **Affiliate programy**:
- **Allegro Partner**: 2-8% prowizji
- **X-kom**: 1-5% prowizji
- **MediaMarkt**: 2-6% prowizji

### 3. **Lokalne partnerstwa**:
- Sklepy z telefonami w okolicy
- Ubezpieczenia (9zł.pl, Link4, Uniqa)
- Hurtownie akcesoriów GSM

## 📊 Śledzenie wyników:

### Google Analytics (już dodane):
- Śledzenie odwiedzin
- Źródła ruchu
- Konwersje z reklam

### Kody śledzące:
```html
<!-- Event tracking dla kliknięć w reklamy -->
<script>
gtag('event', 'ad_click', {
  'ad_unit': 'top_banner',
  'value': 1
});
</script>
```

## 🚀 Optymalizacja zarobków:

### 1. **SEO dla większego ruchu**:
- "serwis telefonów [miasto]"
- "naprawa iphone [miasto]"
- "wymiana ekranu samsung"

### 2. **A/B testing reklam**:
- Różne pozycje bannerów
- Różne rozmiary
- Różne kolory

### 3. **Sezonowość**:
- Więcej reklam w grudniu (prezenty)
- Promocje wakacyjne
- Back-to-school (wrzesień)

## ⚡ Szybki start:

1. **Zarejestruj się w Google AdSense**
2. **Dodaj domenę serwiswojtka.pl**
3. **Zamień kody w pliku HTML**
4. **Poczekaj 24-48h na pierwsze reklamy**
5. **Monitoruj wyniki w AdSense dashboard**

## 📞 Kontakt do lokalnych reklamodawców:

### Potencjalni partnerzy:
- Sklepy Play, Orange, Plus, T-Mobile
- Sklepy komputerowe (Media Expert, RTV Euro AGD)
- Firmy ubezpieczeniowe
- Lokalne serwisy elektroniczne

### Template propozycji:
```
Temat: Propozycja reklamowa - serwiswojtka.pl

Szanowni Państwo,

Prowadzę popularną stronę serwisu telefonów serwiswojtka.pl 
odwiedzaną przez [X] osób miesięcznie - głównie właścicieli 
smartfonów szukających naprawy.

Oferuję:
- Banner 728x90px - 200 zł/miesiąc
- Artykuł sponsorowany - 300 zł
- Stała współpraca - rabat 20%

Zapraszam do kontaktu: 793-924-622
```

---
**Powodzenia w monetyzacji strony! 🚀💰**