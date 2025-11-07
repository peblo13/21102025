# 🎯 GOOGLE ADSENSE - Przewodnik krok po kroku

## ✅ **Krok 1: Rejestracja w Google AdSense**

### 1.1 Idź na stronę: https://www.google.com/adsense/
### 1.2 Kliknij **"Rozpocznij"**
### 1.3 Wypełnij dane:
- **Strona internetowa**: `serwiswojtka.pl`
- **Kraj**: Polska
- **Waluta**: PLN (złoty polski)
- **Typ płatności**: Tak, chcę otrzymywać płatności

### 1.4 Zweryfikuj telefon i adres email

---

## 🔧 **Krok 2: Dodaj stronę do AdSense**

### 2.1 W panelu AdSense wybierz **"Witryny"**
### 2.2 Kliknij **"Dodaj witrynę"**
### 2.3 Wpisz: `serwiswojtka.pl`
### 2.4 Wybierz kraj: **Polska**

---

## 📋 **Krok 3: Otrzymaj kod AdSense**

Po dodaniu strony otrzymasz **Publisher ID** w formacie:
```
ca-pub-1234567890123456
```

### **ZAMIEŃ w pliku index.html:**
Znajdź i zamień `ca-pub-1234567890123456` na swój prawdziwy kod!

---

## 🎨 **Krok 4: Utwórz jednostki reklamowe**

### 4.1 W panelu AdSense idź do **"Reklamy"** → **"Wg jednostki reklamowej"**

### 4.2 Utwórz 3 jednostki:

#### **A) Banner górny** 📺
- **Nazwa**: "Top Banner Serwis"
- **Typ**: Banner wyświetlania
- **Rozmiar**: 728 x 90 (Leaderboard)
- **Responsywny**: TAK

#### **B) Reklama w treści** 📱
- **Nazwa**: "Content Mobile"
- **Typ**: Banner wyświetlania  
- **Rozmiar**: 320 x 100 (Large Mobile Banner)
- **Responsywny**: TAK

#### **C) Sidebar desktop** 🖥️
- **Nazwa**: "Sidebar Desktop"
- **Typ**: Banner wyświetlania
- **Rozmiar**: 160 x 600 (Wide Skyscraper)
- **Responsywny**: NIE

### 4.3 Skopiuj **ID jednostek** (np. 1234567890, 1234567891, 1234567892)

---

## 🔄 **Krok 5: Aktualizuj kody w HTML**

### **W pliku index.html zamień:**

```html
<!-- PRZED: -->
data-ad-client="ca-pub-1234567890123456"
data-ad-slot="1111111111"

<!-- PO: -->
data-ad-client="ca-pub-TWOJ-PRAWDZIWY-KOD"
data-ad-slot="PRAWDZIWY-SLOT-ID"
```

### **Konkretnie trzeba zamienić:**
1. **Top Banner**: `1111111111` → `SLOT-ID-TOP-BANNER`
2. **Content**: `2222222222` → `SLOT-ID-CONTENT`  
3. **Sidebar**: `3333333333` → `SLOT-ID-SIDEBAR`

---

## ⏱️ **Krok 6: Weryfikacja strony**

### 6.1 AdSense sprawdzi Twoją stronę pod kątem:
- ✅ Jakość treści
- ✅ Nawigacja strony
- ✅ Polityki AdSense
- ✅ Doświadczenie użytkownika

### 6.2 **Czas oczekiwania**: 1-14 dni

### 6.3 **Status**: Sprawdzaj w panelu AdSense

---

## 💰 **Krok 7: Płatności**

### 7.1 **Próg płatności**: 100 zł
### 7.2 **Metody płatności**:
- Przelew bankowy (najpopularniejszy)
- Western Union Quick Cash
- Czek pocztowy

### 7.3 **Weryfikacja adresu**:
Gdy osiągniesz 10 zł - AdSense wyśle PIN do weryfikacji

---

## 📊 **Krok 8: Monitoring wyników**

### **Panel AdSense pokazuje:**
- 💰 **Przychody** (dzienne/miesięczne)
- 👁️ **Wyświetlenia** reklam
- 🖱️ **Kliknięcia** (CTR)
- 📈 **RPM** (przychód na 1000 wyświetleń)

### **Google Analytics** (już dodane):
- Ruch na stronie
- Źródła odwiedzin
- Czas spędzony na stronie

---

## ⚠️ **WAŻNE - Zasady AdSense:**

### ❌ **ZABRONIONE:**
- Klikanie własnych reklam
- Proszenie o kliknięcia
- Fałszywy ruch
- Nieodpowiednie treści

### ✅ **ZALECANE:**
- Naturalna integracja reklam
- Wysokiej jakości treść
- Szybka strona (< 3 sekundy)
- Mobile-friendly design

---

## 💡 **Optymalizacja zarobków:**

### **1. Pozycjonowanie reklam:**
- Top banner: **najwyższy CTR**
- In-content: **najlepszy dla mobile**
- Sidebar: **dodatkowy przychód na desktop**

### **2. Rozmiary reklam o najwyższej skuteczności:**
- 728x90 (Leaderboard)
- 300x250 (Medium Rectangle) 
- 320x50 (Mobile Banner)
- 160x600 (Wide Skyscraper)

### **3. Testowanie:**
- A/B test pozycji
- Różne kolory tła
- Eksperymentuj z rozmiarami

---

## 🚀 **Oczekiwane zarobki:**

### **Przy 1000 odwiedzin/miesiąc:**
- **CTR**: 1-3%
- **CPC**: 0.10-1.00 zł
- **Przychód**: 30-100 zł/miesiąc

### **Przy 5000 odwiedzin/miesiąc:**
- **CTR**: 1-3%  
- **CPC**: 0.10-1.00 zł
- **Przychód**: 150-500 zł/miesiąc

### **Przy 10000 odwiedzin/miesiąc:**
- **Przychód**: 300-1000 zł/miesiąc

---

## 📞 **Wsparcie AdSense:**

### **Forum pomocy**: https://support.google.com/adsense/
### **Chat/Email**: Dostępny w panelu AdSense
### **Społeczność**: https://www.en.advertisercommunity.com/

---

## ✅ **Checklist - Co zrobić:**

- [ ] 1. Zarejestrować się w AdSense
- [ ] 2. Dodać domenę serwiswojtka.pl  
- [ ] 3. Otrzymać Publisher ID
- [ ] 4. Zamienić kod w HTML
- [ ] 5. Utworzyć 3 jednostki reklamowe
- [ ] 6. Zamienić slot ID w HTML
- [ ] 7. Opublikować stronę na GitHub Pages
- [ ] 8. Poczekać na weryfikację (1-14 dni)
- [ ] 9. Sprawdzać przychody w panelu
- [ ] 10. Zoptymalizować na podstawie wyników

---

**🎉 Gotowe! Twoja strona jest przygotowana na zarabianie z Google AdSense!**

**Powodzenia! 💰🚀**