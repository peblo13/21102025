// Globalne zmienne dla ofert zagranicznych
let abroadJobsFromCSV = [];
let filteredAbroadJobs = [];
let currentCountryFilter = 'all';

// Prosta funkcja do ładowania ofert pracy z pliku CSV
// Zwraca tablicę obiektów ofert pracy
function loadJobOffersFromCSV(csvUrl, callback) {
  fetch(csvUrl)
    .then(response => response.text())
    .then(text => {
      const lines = text.trim().split('\n').filter(line => line.trim().length > 0);
      if (lines.length < 2) return callback([]);
      const headers = lines[0].split(',').map(h => h.trim());
      const offers = lines.slice(1).map(line => {
        const values = line.split(',');
        const offer = {};
        headers.forEach((h, i) => {
          offer[h] = (values[i] !== undefined) ? values[i].trim() : '';
        });
        return offer;
      });
      callback(Array.isArray(offers) ? offers : []);
    })
    .catch(() => callback([]));
}

// Funkcja do ładowania ofert pracy z zagranicy
function loadAbroadJobsFromCSV(csvUrl = 'abroad-jobs.csv') {
  fetch(csvUrl)
    .then(response => response.text())
    .then(text => {
      const lines = text.trim().split('\n').filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        abroadJobsFromCSV = [];
        filteredAbroadJobs = [];
        return;
      }
      const headers = lines[0].split(',').map(h => h.trim());
      const offers = lines.slice(1).map((line, index) => {
        const values = line.split(',');
        const offer = { id: index + 1 };
        headers.forEach((h, i) => {
          offer[h] = (values[i] !== undefined) ? values[i].trim() : '';
        });
        return offer;
      });
      abroadJobsFromCSV = Array.isArray(offers) ? offers : [];
      filteredAbroadJobs = [...abroadJobsFromCSV];
      
      // Jeśli funkcja renderJoobleMapAndRanking jest dostępna, wywołaj ją
      if (typeof renderJoobleMapAndRanking === 'function') {
        renderJoobleMapAndRanking();
      }
    })
    .catch(() => {
      abroadJobsFromCSV = [];
      filteredAbroadJobs = [];
    });
}