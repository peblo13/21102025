// Safe stub for CSV job loading to prevent runtime errors.// Safe stub for CSV job loading to prevent runtime errors.// Safe stub for CSV job loading to prevent runtime errors.

// Replace with actual implementation when ready.

(function(global){// Replace with actual implementation when ready.// Replace with actual implementation when ready.

  function loadJobOffersFromCSV(csvPath, callback){

    try {(function(global){(function(global){

      if (typeof Papa === 'undefined') {

        console.warn('PapaParse not available, returning empty offers.');      function loadJobOffersFromCSV(csvPath, callback){  function loadJobOffersFromCSV(csvPath, callback){

        if (typeof callback === 'function') callback([]);

        return;    try {    try {

      }

      Papa.parse(csvPath, {      if (typeof Papa === 'undefined') {      if (typeof Papa === 'undefined') {

        download: true,

        header: true,        console.warn('PapaParse not available, returning empty offers.');            console.warn('PapaParse not available, returning empty offers.');

        delimiter: ';',

        skipEmptyLines: true,        if (typeof callback === 'function') callback([]);        if (typeof callback === 'function') callback([]);

        complete: function(results){

          const offers = (results.data || []).filter(Boolean);        return;        return;

          if (typeof callback === 'function') callback(offers);

        },      }      }

        error: function(){

          if (typeof callback === 'function') callback([]);      Papa.parse(csvPath, {      Papa.parse(csvPath, {

        }

      });        download: true,        download: true,

    } catch(e) {

      console.error('loadJobOffersFromCSV error:', e);        header: true,        header: true,

      if (typeof callback === 'function') callback([]);

    }        delimiter: ';',        delimiter: ';',

  }

  global.loadJobOffersFromCSV = loadJobOffersFromCSV;        skipEmptyLines: true,        skipEmptyLines: true,

})(window);

        complete: function(results){        complete: function(results){

// Dynamiczne ładowanie i wyświetlanie ofert pracy z pliku praca_baza.csv  

// Wymaga Papaparse (cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js)            const offers = (results.data || []).filter(Boolean);          const offers = (results.data || []).filter(Boolean);



const OFFERS_PER_PAGE = 3;          if (typeof callback === 'function') callback(offers);          if (typeof callback === 'function') callback(offers);

let allOffers = [];

let filteredOffers = [];        },        },

let currentPage = 1;

let totalPages = 1;        error: function(){        error: function(){



function renderOffersPage(page) {          if (typeof callback === 'function') callback([]);          if (typeof callback === 'function') callback([]);

  console.log('renderOffersPage', {page, filteredOffers});

  const start = (page - 1) * OFFERS_PER_PAGE;        }        }

  const end = start + OFFERS_PER_PAGE;

  const offers = filteredOffers.slice(start, end);      });      });

  const grid = document.createElement('div');

  grid.className = 'job-offer-grid';    } catch(e) {    } catch(e) {

  

  offers.forEach((offer, idx) => {      console.error('loadJobOffersFromCSV error:', e);      console.error('loadJobOffersFromCSV error:', e);

    console.log('Oferta', idx, offer);

    const stanowisko = (offer['Stanowisko'] || '').replace(/"/g, '').trim();       if (typeof callback === 'function') callback([]);      if (typeof callback === 'function') callback([]);

    const miejsce = (offer['Miejsce pracy'] || '').replace(/"/g, '').trim();

    const umowa = (offer['Rodzaj umowy'] || '').replace(/"/g, '').trim();        }    }

    const pracodawca = (offer['Pracodawca'] || '').replace(/"/g, '').trim(); 

      }  }

    const card = document.createElement('div');

    card.className = 'job-offer-card-ue';  global.loadJobOffersFromCSV = loadJobOffersFromCSV;  global.loadJobOffersFromCSV = loadJobOffersFromCSV;

    

    // Stylowanie tylko przez CSS})(window);})(window);

    const title = document.createElement('div');

    title.className = 'job-title-red-bold';// Dynamiczne ładowanie i wyświetlanie ofert pracy z pliku praca_baza.csv

    title.textContent = stanowisko;

    card.appendChild(title);// Dynamiczne ładowanie i wyświetlanie ofert pracy z pliku praca_baza.csv  // Wymaga Papaparse (cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js)

    

    const loc = document.createElement('div');// Wymaga Papaparse (cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js)  

    loc.className = 'job-location-ue';

    loc.innerHTML = `<span style="color:#00ff00;font-size:1.15em;vertical-align:middle;margin-right:6px;">📍</span>${miejsce}`;const OFFERS_PER_PAGE = 3;

    card.appendChild(loc);

    const OFFERS_PER_PAGE = 3;let allOffers = [];

    const btnRow = document.createElement('div');

    btnRow.className = 'apply-btn-row';let allOffers = [];let filteredOffers = [];

    const btn = document.createElement('button');

    btn.className = 'apply-btn-red-ue';let filteredOffers = [];let currentPage = 1;

    btn.textContent = 'Aplikuj';

    btn.onclick = function(e) {let currentPage = 1;let totalPages = 1;

      e.stopPropagation();

      var modal = document.getElementById('job-contact-modal');let totalPages = 1;

      if (modal) modal.style.display = 'flex';

    };function renderOffersPage(page) {

    btnRow.appendChild(btn);

    card.appendChild(btnRow);function renderOffersPage(page) {  console.log('renderOffersPage', {page, filteredOffers});

    

    const details = document.createElement('div');  console.log('renderOffersPage', {page, filteredOffers});  const start = (page - 1) * OFFERS_PER_PAGE;

    details.className = 'job-offer-details-hidden';

    const desc = document.createElement('div');  const start = (page - 1) * OFFERS_PER_PAGE;  const end = start + OFFERS_PER_PAGE;

    desc.className = 'job-desc-ue';

    desc.textContent = (umowa ? umowa + ' | ' : '') + pracodawca;  const end = start + OFFERS_PER_PAGE;  const offers = filteredOffers.slice(start, end);

    details.appendChild(desc);

    card.appendChild(details);  const offers = filteredOffers.slice(start, end);  const grid = document.createElement('div');

    

    grid.appendChild(card);  const grid = document.createElement('div');  grid.className = 'job-offer-grid';

  });

    grid.className = 'job-offer-grid';  offers.forEach((offer, idx) => {

  const listings = document.getElementById('job-offers-list');

  if (listings) {      console.log('Oferta', idx, offer);

    listings.innerHTML = '';

    listings.appendChild(grid);  offers.forEach((offer, idx) => {    const stanowisko = (offer['Stanowisko'] || '').replace(/"/g, '').trim();

  }

      console.log('Oferta', idx, offer);    const miejsce = (offer['Miejsce pracy'] || '').replace(/"/g, '').trim();

  const counter = document.getElementById('job-offers-count');

  if (counter) counter.textContent = filteredOffers.length;    const stanowisko = (offer['Stanowisko'] || '').replace(/"/g, '').trim();     const umowa = (offer['Rodzaj umowy'] || '').replace(/"/g, '').trim();

  

  renderPaginationBar();    const miejsce = (offer['Miejsce pracy'] || '').replace(/"/g, '').trim();    const pracodawca = (offer['Pracodawca'] || '').replace(/"/g, '').trim();

}

    const umowa = (offer['Rodzaj umowy'] || '').replace(/"/g, '').trim();        const card = document.createElement('div');

function renderPaginationBar() {

  let bar = document.getElementById('pagination-bar');    const pracodawca = (offer['Pracodawca'] || '').replace(/"/g, '').trim();     card.className = 'job-offer-card-ue';

  if (!bar) {

    bar = document.createElement('div');        // Stylowanie tylko przez CSS

    bar.id = 'pagination-bar';

    bar.style = 'display:flex;justify-content:center;gap:6px;margin:18px 0;flex-wrap:wrap;';    const card = document.createElement('div');    const title = document.createElement('div');

    const offersList = document.getElementById('job-offers-list');

    if (offersList) offersList.parentNode.insertBefore(bar, offersList.nextSibling);    card.className = 'job-offer-card-ue';    title.className = 'job-title-red-bold';

  }

          title.textContent = stanowisko;

  bar.innerHTML = '';

  totalPages = Math.max(1, Math.ceil(filteredOffers.length / OFFERS_PER_PAGE));    // Stylowanie tylko przez CSS    card.appendChild(title);

  

  const prevBtn = document.createElement('button');    const title = document.createElement('div');    const loc = document.createElement('div');

  prevBtn.textContent = '←';

  prevBtn.disabled = currentPage === 1;    title.className = 'job-title-red-bold';    loc.className = 'job-location-ue';

  prevBtn.onclick = () => {

    if (currentPage > 1) {    title.textContent = stanowisko;    loc.innerHTML = `<span style="color:#00ff00;font-size:1.15em;vertical-align:middle;margin-right:6px;">📍</span>${miejsce}`;

      currentPage--;

      renderOffersPage(currentPage);    card.appendChild(title);    card.appendChild(loc);

    }

  };        const btnRow = document.createElement('div');

  bar.appendChild(prevBtn);

      const loc = document.createElement('div');    btnRow.className = 'apply-btn-row';

  for (let i = 1; i <= totalPages; i++) {

    const pageBtn = document.createElement('button');    loc.className = 'job-location-ue';    const btn = document.createElement('button');

    pageBtn.textContent = i;

    pageBtn.style.fontWeight = i === currentPage ? 'bold' : 'normal';    loc.innerHTML = `<span style="color:#00ff00;font-size:1.15em;vertical-align:middle;margin-right:6px;">📍</span>${miejsce}`;    btn.className = 'apply-btn-red-ue';

    pageBtn.onclick = () => {

      currentPage = i;    card.appendChild(loc);    btn.textContent = 'Aplikuj';

      renderOffersPage(currentPage);

    };        btn.onclick = function(e) {

    bar.appendChild(pageBtn);

  }    const btnRow = document.createElement('div');      e.stopPropagation();

  

  const nextBtn = document.createElement('button');    btnRow.className = 'apply-btn-row';      var modal = document.getElementById('job-contact-modal');

  nextBtn.textContent = '→';

  nextBtn.disabled = currentPage === totalPages;    const btn = document.createElement('button');      if (modal) modal.style.display = 'flex';

  nextBtn.onclick = () => {

    if (currentPage < totalPages) {    btn.className = 'apply-btn-red-ue';    };

      currentPage++;

      renderOffersPage(currentPage);    btn.textContent = 'Aplikuj';    btnRow.appendChild(btn);

    }

  };    btn.onclick = function(e) {    card.appendChild(btnRow);

  bar.appendChild(nextBtn);

}      e.stopPropagation();    const details = document.createElement('div');



// Ładowanie ofert pracy po załadowaniu DOM i biblioteki PapaParse      var modal = document.getElementById('job-contact-modal');    details.className = 'job-offer-details-hidden';

document.addEventListener('DOMContentLoaded', function() {

  if (window.Papa) {      if (modal) modal.style.display = 'flex';    const desc = document.createElement('div');

    Papa.parse('src/praca_baza.csv', {

      download: true,    };    desc.className = 'job-desc-ue';

      header: true,

      delimiter: ';',    btnRow.appendChild(btn);    desc.textContent = (umowa ? umowa + ' | ' : '') + pracodawca;

      skipEmptyLines: true,

      complete: function(results) {    card.appendChild(btnRow);    details.appendChild(desc);

        console.log('Wynik PapaParse:', results);

        allOffers = results.data;        card.appendChild(details);

        filteredOffers = allOffers.slice();

        totalPages = Math.max(1, Math.ceil(filteredOffers.length / OFFERS_PER_PAGE));    const details = document.createElement('div');    grid.appendChild(card);

        currentPage = 1;

        renderOffersPage(currentPage);    details.className = 'job-offer-details-hidden';  });

      },

      error: function(err) {    const desc = document.createElement('div');  const listings = document.getElementById('job-offers-list');

        console.error('Błąd ładowania pliku ofert pracy:', err);

      }    desc.className = 'job-desc-ue';  if (listings) {

    });

  } else {    desc.textContent = (umowa ? umowa + ' | ' : '') + pracodawca;    listings.innerHTML = '';

    console.warn('PapaParse library not loaded');

  }    details.appendChild(desc);    listings.appendChild(grid);

});

    card.appendChild(details);  }

// Function to import job offers from CSV file input

function importCSV() {      const counter = document.getElementById('job-offers-count');

    const input = document.getElementById('csvFileInput');

    if (!input || !input.files.length) {    grid.appendChild(card);  if (counter) counter.textContent = filteredOffers.length;

        alert('Wybierz plik CSV!');

        return;  });  renderPaginationBar();

    }

      }

    const file = input.files[0];

    Papa.parse(file, {  const listings = document.getElementById('job-offers-list');

        header: true,

        skipEmptyLines: true,  if (listings) {function renderPaginationBar() {

        complete: function(results) {

            const offers = results.data.map(row => {    listings.innerHTML = '';  let bar = document.getElementById('pagination-bar');

                const cleaned = {};

                Object.keys(row).forEach(function(key) {    listings.appendChild(grid);  if (!bar) {

                    const cleanKey = key.replace(/^[\s"']+|[\s"']+$/g, '');  

                    let value = row[key];  }    bar = document.createElement('div');

                    if (typeof value === 'string') {

                        value = value.replace(/^[\s"']+|[\s"']+$/g, '');           bar.id = 'pagination-bar';

                    }

                    cleaned[cleanKey] = value;  const counter = document.getElementById('job-offers-count');    bar.style = 'display:flex;justify-content:center;gap:6px;margin:18px 0;flex-wrap:wrap;';

                });

                return cleaned;  if (counter) counter.textContent = filteredOffers.length;    const offersList = document.getElementById('job-offers-list');

            });

            console.log('Zaimportowane oferty:', offers);      if (offersList) offersList.parentNode.insertBefore(bar, offersList.nextSibling);

            // Możesz tutaj wywołać funkcję wyświetlającą oferty na stronie

        },  renderPaginationBar();  }

        error: function(err) {

            console.error('Błąd ładowania pliku CSV:', err);}  bar.innerHTML = '';

        }

    });  totalPages = Math.max(1, Math.ceil(filteredOffers.length / OFFERS_PER_PAGE));

}
function renderPaginationBar() {  const prevBtn = document.createElement('button');

  let bar = document.getElementById('pagination-bar');  prevBtn.textContent = '←';

  if (!bar) {  prevBtn.className = 'pagination-btn';

    bar = document.createElement('div');  prevBtn.disabled = currentPage === 1;

    bar.id = 'pagination-bar';  prevBtn.onclick = function() {

    bar.style = 'display:flex;justify-content:center;gap:6px;margin:18px 0;flex-wrap:wrap;';    if (currentPage > 1) {

    const offersList = document.getElementById('job-offers-list');      currentPage--;

    if (offersList) offersList.parentNode.insertBefore(bar, offersList.nextSibling);      renderOffersPage(currentPage);

  }    }

    };

  bar.innerHTML = '';  bar.appendChild(prevBtn);

  totalPages = Math.max(1, Math.ceil(filteredOffers.length / OFFERS_PER_PAGE));  let maxPagesToShow = 7;

    let startPage = Math.max(1, currentPage - 3);

  const prevBtn = document.createElement('button');  let endPage = Math.min(totalPages, currentPage + 3);

  prevBtn.textContent = '←';  if (totalPages > maxPagesToShow) {

  prevBtn.disabled = currentPage === 1;    if (currentPage <= 4) {

  prevBtn.onclick = () => {      startPage = 1;

    if (currentPage > 1) {      endPage = maxPagesToShow;

      currentPage--;    } else if (currentPage >= totalPages - 3) {

      renderOffersPage(currentPage);      startPage = totalPages - maxPagesToShow + 1;

    }      endPage = totalPages;

  };    } else {

  bar.appendChild(prevBtn);      startPage = currentPage - 3;

        endPage = currentPage + 3;

  for (let i = 1; i <= totalPages; i++) {    }

    const pageBtn = document.createElement('button');  } else {

    pageBtn.textContent = i;    startPage = 1;

    pageBtn.style.fontWeight = i === currentPage ? 'bold' : 'normal';    endPage = totalPages;

    pageBtn.onclick = () => {  }

      currentPage = i;  if (startPage > 1) {

      renderOffersPage(currentPage);    const firstBtn = document.createElement('button');

    };    firstBtn.textContent = '1';

    bar.appendChild(pageBtn);    firstBtn.className = 'pagination-btn';

  }    firstBtn.onclick = function() {

        currentPage = 1;

  const nextBtn = document.createElement('button');      renderOffersPage(currentPage);

  nextBtn.textContent = '→';    };

  nextBtn.disabled = currentPage === totalPages;    bar.appendChild(firstBtn);

  nextBtn.onclick = () => {    if (startPage > 2) {

    if (currentPage < totalPages) {      const dots = document.createElement('span');

      currentPage++;      dots.textContent = '...';

      renderOffersPage(currentPage);      dots.style = 'color:#00ff00;font-weight:bold;padding:0 6px;';

    }      bar.appendChild(dots);

  };    }

  bar.appendChild(nextBtn);  }

}  for (let i = startPage; i <= endPage; i++) {

    const btn = document.createElement('button');

// Ładowanie ofert pracy po załadowaniu DOM i biblioteki PapaParse    btn.textContent = i;

document.addEventListener('DOMContentLoaded', function() {    btn.className = 'pagination-btn' + (i === currentPage ? ' active' : '');

  if (window.Papa) {    btn.disabled = i === currentPage;

    Papa.parse('src/praca_baza.csv', {    btn.onclick = function() {

      download: true,      currentPage = i;

      header: true,      renderOffersPage(currentPage);

      delimiter: ';',    };

      skipEmptyLines: true,    bar.appendChild(btn);

      complete: function(results) {  }

        console.log('Wynik PapaParse:', results);  if (endPage < totalPages) {

        allOffers = results.data;    if (endPage < totalPages - 1) {

        filteredOffers = allOffers.slice();      const dots = document.createElement('span');

        totalPages = Math.max(1, Math.ceil(filteredOffers.length / OFFERS_PER_PAGE));      dots.textContent = '...';

        currentPage = 1;      dots.style = 'color:#00ff00;font-weight:bold;padding:0 6px;';

        renderOffersPage(currentPage);      bar.appendChild(dots);

      },    }

      error: function(err) {    const lastBtn = document.createElement('button');

        console.error('Błąd ładowania pliku ofert pracy:', err);    lastBtn.textContent = totalPages;

      }    lastBtn.className = 'pagination-btn';

    });    lastBtn.onclick = function() {

  } else {      currentPage = totalPages;

    console.warn('PapaParse library not loaded');      renderOffersPage(currentPage);

  }    };

});    bar.appendChild(lastBtn);

  }

// Function to import job offers from CSV file input  const nextBtn = document.createElement('button');

function importCSV() {  nextBtn.textContent = '→';

    const input = document.getElementById('csvFileInput');  nextBtn.className = 'pagination-btn';

    if (!input || !input.files.length) {  nextBtn.disabled = currentPage === totalPages;

        alert('Wybierz plik CSV!');  nextBtn.onclick = function() {

        return;    if (currentPage < totalPages) {

    }      currentPage++;

          renderOffersPage(currentPage);

    const file = input.files[0];    }

    Papa.parse(file, {  };

        header: true,  bar.appendChild(nextBtn);

        skipEmptyLines: true,}

        complete: function(results) {

            const offers = results.data.map(row => {function normalize(str) {

                const cleaned = {};  return (str||'').toLowerCase()

                Object.keys(row).forEach(function(key) {    .replace(/ą/g,'a').replace(/ć/g,'c').replace(/ę/g,'e').replace(/ł/g,'l')

                    const cleanKey = key.replace(/^[\s"']+|[\s"']+$/g, '');      .replace(/ń/g,'n').replace(/ó/g,'o').replace(/ś/g,'s').replace(/ż/g,'z').replace(/ź/g,'z');

                    let value = row[key];}

                    if (typeof value === 'string') {

                        value = value.replace(/^[\s"']+|[\s"']+$/g, '');     function filterOffers() {

                    }  const q = normalize((document.getElementById('job-search-input')?.value || '').trim());

                    cleaned[cleanKey] = value;  filteredOffers = allOffers.filter(offer => {

                });    if (!offer['Stanowisko'] || !offer['Miejsce pracy']) return false;

                return cleaned;    const stanowisko = normalize((offer['Stanowisko']||'').trim());

            });    const pracodawca = normalize((offer['Pracodawca']||'').trim());

            console.log('Zaimportowane oferty:', offers);    const miejsce = normalize((offer['Miejsce pracy']||'').trim());

            // Możesz tutaj wywołać funkcję wyświetlającą oferty na stronie    const opis = normalize((offer['Opis']||'').trim());

        },    return (

        error: function(err) {      stanowisko.includes(q) ||

            console.error('Błąd ładowania pliku CSV:', err);      pracodawca.includes(q) ||

        }      miejsce.includes(q) ||

    });      opis.includes(q)

}    );
  });
}

var _jobSearchBtn = document.getElementById('job-search-btn');
if (_jobSearchBtn) _jobSearchBtn.addEventListener('click', function() {
  filterOffers();
  currentPage = 1;
  renderOffersPage(currentPage);
});
var _jobSearchInput = document.getElementById('job-search-input');
if (_jobSearchInput) _jobSearchInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    filterOffers();
    currentPage = 1;
    renderOffersPage(currentPage);
  }
});
var _advForm = document.getElementById('advanced-job-search-form');
if (_advForm) _advForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const locEl = document.getElementById('adv-job-location');
  const typeEl = document.getElementById('adv-job-type');
  const expEl = document.getElementById('adv-job-experience');
  const salaryEl = document.getElementById('adv-job-salary');
  const loc = (locEl && locEl.value ? locEl.value.toLowerCase() : '');
  const type = (typeEl && typeEl.value ? typeEl.value.toLowerCase() : '');
  const exp = (expEl && expEl.value ? expEl.value.toLowerCase() : '');
  const salary = parseInt((salaryEl && salaryEl.value ? salaryEl.value : '0'), 10) || 0;
  const cats = Array.from(document.querySelectorAll('input[name="category[]"]:checked')).map(cb => cb.value.toLowerCase());
  filteredOffers = allOffers.filter(offer => {
    let ok = true;
    if (loc && !(offer['Miejsce pracy']||'').toLowerCase().includes(loc)) ok = false;
    if (type && !(offer['Rodzaj umowy']||'').toLowerCase().includes(type)) ok = false;
    if (exp && !(offer['Doświadczenie']||'').toLowerCase().includes(exp)) ok = false;
    if (salary && parseInt(offer['Wynagrodzenie']||'0',10) < salary) ok = false;
    if (cats.length > 0 && !cats.some(cat => (offer['Kategoria']||'').toLowerCase().includes(cat))) ok = false;
    return ok;
  });
  currentPage = 1;
  renderOffersPage(currentPage);
});

// Ładowanie ofert pracy po załadowaniu DOM i biblioteki PapaParse
document.addEventListener('DOMContentLoaded', function() {
  if (window.Papa) {
    Papa.parse('src/praca_baza.csv', {
      download: true,
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
      complete: function(results) {
        console.log('Wynik PapaParse:', results);
        allOffers = results.data;
        filteredOffers = allOffers.slice();
        totalPages = Math.max(1, Math.ceil(filteredOffers.length / OFFERS_PER_PAGE));
        currentPage = 1;
        renderOffersPage(currentPage);
      },
      error: function(err) {
        alert('Błąd ładowania pliku ofert pracy: ' + err);
      }
    });
  }
});
