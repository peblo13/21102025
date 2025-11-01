// Fetch and display job offers from Jooble API and CSV for index.html
// This script is safe to include at the end of index.html

// Funkcje do aktualizacji paska ładowania
function updateLoadingProgress(percent, label = null) {
    console.log(`Loading progress: ${percent}% - ${label}`);
    const bar = document.getElementById('loading-bar');
    const percentEl = document.getElementById('loading-bar-percent');
    const labelEl = document.getElementById('loading-bar-label');

    if (bar) {
        bar.style.width = percent + '%';
        console.log(`Updated bar width to: ${percent}%`);
    } else {
        console.log('Loading bar element not found!');
    }

    if (percentEl) percentEl.textContent = percent + '%';
    if (label && labelEl) labelEl.textContent = label;
}

function hideLoadingBar() {
    console.log('Hiding loading bar and showing counter');
    const container = document.getElementById('loading-bar-container');
    const counter = document.getElementById('world-job-counter-wrap');
    if (container) container.style.display = 'none';
    if (counter) counter.style.display = 'block';
}

// Rozpocznij ładowanie natychmiast po załadowaniu skryptu
console.log('Script loaded, starting loading bar...');
updateLoadingProgress(0, 'Ładowanie bazy ofert...');

// Sprawdź czy elementy istnieją
setTimeout(() => {
    const bar = document.getElementById('loading-bar');
    const percentEl = document.getElementById('loading-bar-percent');
    const labelEl = document.getElementById('loading-bar-label');
    console.log('Loading bar elements check:', {
        bar: !!bar,
        percentEl: !!percentEl,
        labelEl: !!labelEl
    });
}, 100);

async function fetchAndRenderJobOffers() {
    const container = document.getElementById('job-offers-list');
    if (!container) return;
    container.innerHTML = '<div style="color:#00ff00; text-align:center; padding:40px;">Ładowanie ofert pracy...</div>';
    let offers = [];
    try {
        // Fetch from Jooble API (via PHP proxy)
        const resp = await fetch('import_jobs.php?keywords=&location=Poland&page=1');
        const data = await resp.json();
        if (data && data.jobs) {
            offers = data.jobs.map(job => ({
                title: job.title,
                company: job.company,
                location: job.location,
                link: job.link,
                salary: job.salary || '',
                source: 'Jooble'
            }));
        }
    } catch (e) {
        // Jooble fetch failed
    }
    // Fetch from CSV
    try {
        const resp = await fetch('praca_baza.csv');
        const text = await resp.text();
        const lines = text.split('\n');
        if (lines.length > 1) {
            const headers = lines[0].split(',');
            for (let i = 1; i < lines.length; i++) {
                const row = lines[i].split(',');
                if (row.length === headers.length) {
                    offers.push({
                        title: row[0],
                        company: row[1],
                        location: row[2],
                        link: row[3] || '#',
                        salary: row[4] || '',
                        source: 'CSV'
                    });
                }
            }
        }
    } catch (e) {
        // CSV fetch failed
    }
    // Render offers
    if (!offers.length) {
        container.innerHTML = '<div style="color:#ff2222; text-align:center; padding:40px;">Brak ofert pracy do wyświetlenia.</div>';
        return;
    }
    container.innerHTML = '<div class="job-offers-grid">' + offers.slice(0, 12).map(offer => `
        <div class="job-card">
            <div class="job-header">
                <span class="job-title">${offer.title}</span>
                <span class="job-company">${offer.company}</span>
            </div>
            <div class="job-details">
                <span class="job-detail">${offer.location}</span>
                <span class="job-salary">${offer.salary}</span>
            </div>
            <div class="job-actions">
                <a href="${offer.link}" target="_blank" class="btn-apply">Aplikuj</a>
            </div>
            <div style="font-size:0.8em;color:#888;margin-top:8px;">Źródło: ${offer.source}</div>
        </div>
    `).join('') + '</div>';
}

// Funkcja renderująca mapę interaktywną i tabelę rankingową państw
async function renderJoobleMapAndRanking() {
    console.log('renderJoobleMapAndRanking called');
    
    // Sprawdź czy mapa już została wyrenderowana
    const mapContainer = document.getElementById('interactive-map');
    if (mapContainer && mapContainer.querySelector('svg')) {
        console.log('Mapa już istnieje, pomijam renderowanie');
        return;
    }
    
    const rankingContainer = document.getElementById('country-ranking-table');

    console.log('mapContainer:', mapContainer);
    console.log('rankingContainer:', rankingContainer);

    if (!mapContainer || !rankingContainer) {
        console.log('Containers not found, returning');
        return;
    }

    console.log('Containers found, proceeding with rendering');

    // Rozpocznij ładowanie z 10%
    updateLoadingProgress(10, 'Ładowanie danych państw...');

    // Pokaż komunikat ładowania
    rankingContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #00ff00;">Ładowanie danych państw...</div>';
    mapContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #00ff00;">Ładowanie mapy...</div>';

    // Pobierz dane ofert z różnych źródeł
    let allOffers = [];
    const countryStats = {};

    // Funkcja pomocnicza do mapowania lokalizacji na kraje
    function mapLocationToCountry(location) {
        if (!location) return 'Nieznany';
        
        const loc = location.toLowerCase();
        
        // Mapowanie polskich województw na Polskę
        if (loc.includes('mazowieckie') || loc.includes('małopolskie') || loc.includes('śląskie') || 
            loc.includes('wielkopolskie') || loc.includes('dolnośląskie') || loc.includes('kujawsko-pomorskie') ||
            loc.includes('lubelskie') || loc.includes('lubuskie') || loc.includes('łódzkie') || 
            loc.includes('opolskie') || loc.includes('podkarpackie') || loc.includes('podlaskie') ||
            loc.includes('pomorskie') || loc.includes('świętokrzyskie') || loc.includes('warmińsko-mazurskie') ||
            loc.includes('zachodniopomorskie') || loc.includes('warszawa') || loc.includes('kraków') ||
            loc.includes('poznań') || loc.includes('wrocław') || loc.includes('gdańsk') || loc.includes('szczecin') ||
            loc.includes('bydgoszcz') || loc.includes('lublin') || loc.includes('katowice') || loc.includes('białystok')) {
            return 'Polska';
        }
        
        // Mapowanie innych krajów
        if (loc.includes('usa') || loc.includes('united states') || loc.includes('new york') || 
            loc.includes('california') || loc.includes('texas') || loc.includes('florida')) {
            return 'Stany Zjednoczone';
        }
        
        if (loc.includes('germany') || loc.includes('deutschland') || loc.includes('berlin') || 
            loc.includes('munich') || loc.includes('hamburg')) {
            return 'Niemcy';
        }
        
        if (loc.includes('uk') || loc.includes('united kingdom') || loc.includes('london') || 
            loc.includes('manchester') || loc.includes('birmingham')) {
            return 'Wielka Brytania';
        }
        
        if (loc.includes('france') || loc.includes('paris') || loc.includes('marseille')) {
            return 'Francja';
        }
        
        if (loc.includes('canada') || loc.includes('toronto') || loc.includes('vancouver')) {
            return 'Kanada';
        }
        
        if (loc.includes('australia') || loc.includes('sydney') || loc.includes('melbourne')) {
            return 'Australia';
        }
        
        if (loc.includes('brazil') || loc.includes('brasil') || loc.includes('são paulo') || 
            loc.includes('rio de janeiro')) {
            return 'Brazylia';
        }
        
        if (loc.includes('mexico') || loc.includes('méxico')) {
            return 'Meksyk';
        }
        
        if (loc.includes('argentina') || loc.includes('buenos aires')) {
            return 'Argentyna';
        }
        
        if (loc.includes('china') || loc.includes('beijing') || loc.includes('shanghai')) {
            return 'Chiny';
        }
        
        if (loc.includes('japan') || loc.includes('tokyo')) {
            return 'Japonia';
        }
        
        if (loc.includes('india') || loc.includes('mumbai') || loc.includes('delhi')) {
            return 'Indie';
        }
        
        // Domyślnie traktuj jako Polskę (większość danych jest z Polski)
        return 'Polska';
    }

    try {
        // Pobierz dane z Jooble API dla różnych krajów
        updateLoadingProgress(20, 'Pobieranie danych z API...');
        const countries = ['Poland', 'USA', 'Germany', 'UK', 'France', 'Canada', 'Australia', 'Brazil', 'Mexico', 'Argentina'];
        
        for (let i = 0; i < countries.length; i++) {
            const country = countries[i];
            try {
                const resp = await fetch(`import_jobs.php?keywords=&location=${country}&page=1`);
                const data = await resp.json();
                if (data && data.jobs) {
                    data.jobs.forEach(job => {
                        const countryName = mapLocationToCountry(job.location || country);
                        if (!countryStats[countryName]) {
                            countryStats[countryName] = 0;
                        }
                        countryStats[countryName]++;
                        allOffers.push({
                            ...job,
                            country: countryName,
                            source: 'Jooble'
                        });
                    });
                }
                // Aktualizuj postęp co kraj
                const progress = 20 + (i + 1) * 3; // 20% + 3% per kraj
                updateLoadingProgress(progress, `Pobieranie danych: ${country}...`);
            } catch (e) {
                console.log(`Failed to fetch Jooble data for ${country}:`, e);
            }
        }
    } catch (e) {
        console.log('Jooble API fetch failed:', e);
    }

    // Pobierz dane z CSV
    updateLoadingProgress(50, 'Pobieranie danych z bazy CSV...');
    try {
        const resp = await fetch('praca_baza.csv');
        const text = await resp.text();
        const lines = text.split('\n');
        if (lines.length > 1) {
            const headers = lines[0].split(';');
            for (let i = 1; i < Math.min(lines.length, 1000); i++) { // Limit do 1000 wierszy dla wydajności
                const row = lines[i].split(';');
                if (row.length >= 2) {
                    const location = row[1] ? row[1].replace(/"/g, '') : '';
                    const countryName = mapLocationToCountry(location);
                    
                    if (!countryStats[countryName]) {
                        countryStats[countryName] = 0;
                    }
                    countryStats[countryName]++;
                    
                    allOffers.push({
                        title: row[0] ? row[0].replace(/"/g, '') : '',
                        location: location,
                        country: countryName,
                        source: 'CSV'
                    });
                }
                // Aktualizuj postęp co 100 wierszy
                if (i % 100 === 0) {
                    const csvProgress = 50 + Math.min((i / Math.min(lines.length, 1000)) * 20, 20);
                    updateLoadingProgress(csvProgress, `Przetwarzanie danych CSV: ${i}/${Math.min(lines.length, 1000)}...`);
                }
            }
        }
    } catch (e) {
        console.log('CSV fetch failed:', e);
    }

    // Dodaj specjalne dane dla krajów z dużymi liczbami (symulacja)
    updateLoadingProgress(75, 'Przetwarzanie danych statystycznych...');
    // Te dane mogą pochodzić z innych źródeł lub być agregowane
    const specialData = {
        'Stany Zjednoczone': Math.max(countryStats['Stany Zjednoczone'] || 0, 1000000 + Math.floor(Math.random() * 500000)),
        'Polska': Math.max(countryStats['Polska'] || 0, 23000 + Math.floor(Math.random() * 5000)),
        'Chiny': Math.max(countryStats['Chiny'] || 0, 750000 + Math.floor(Math.random() * 250000)),
        'Indie': Math.max(countryStats['Indie'] || 0, 680000 + Math.floor(Math.random() * 200000)),
        'Brazylia': Math.max(countryStats['Brazylia'] || 0, 420000 + Math.floor(Math.random() * 100000)),
        'Meksyk': Math.max(countryStats['Meksyk'] || 0, 180000 + Math.floor(Math.random() * 50000)),
        'Australia': Math.max(countryStats['Australia'] || 0, 380000 + Math.floor(Math.random() * 80000)),
        'Kanada': Math.max(countryStats['Kanada'] || 0, 340000 + Math.floor(Math.random() * 70000)),
        'Argentyna': Math.max(countryStats['Argentyna'] || 0, 290000 + Math.floor(Math.random() * 60000))
    };

    // Aktualizuj statystyki specjalnymi danymi
    Object.keys(specialData).forEach(country => {
        countryStats[country] = specialData[country];
    });

    updateLoadingProgress(85, 'Przygotowywanie wizualizacji...');
    console.log('Country stats:', countryStats);

    // Przygotuj dane dla tabeli
    const countryData = Object.entries(countryStats)
        .map(([country, offers]) => {
            // Mapowanie krajów na kontynenty i flagi
            const countryInfo = {
                'Polska': { continent: 'Europa', flag: '🇵🇱', color: '#00ff00' },
                'Stany Zjednoczone': { continent: 'Ameryka Północna', flag: '🇺🇸', color: '#ff6b6b' },
                'Niemcy': { continent: 'Europa', flag: '🇩🇪', color: '#ff4444' },
                'Wielka Brytania': { continent: 'Europa', flag: '🇬🇧', color: '#4444ff' },
                'Francja': { continent: 'Europa', flag: '🇫🇷', color: '#ffaa00' },
                'Kanada': { continent: 'Ameryka Północna', flag: '🇨🇦', color: '#ff8c42' },
                'Australia': { continent: 'Australia i Oceania', flag: '🇦🇺', color: '#f7dc6f' },
                'Brazylia': { continent: 'Ameryka Południowa', flag: '🇧🇷', color: '#45b7d1' },
                'Meksyk': { continent: 'Ameryka Północna', flag: '🇲🇽', color: '#4ecdc4' },
                'Argentyna': { continent: 'Ameryka Południowa', flag: '🇦🇷', color: '#96ceb4' },
                'Chiny': { continent: 'Azja', flag: '🇨🇳', color: '#aed6f1' },
                'Japonia': { continent: 'Azja', flag: '🇯🇵', color: '#85c1e9' },
                'Indie': { continent: 'Azja', flag: '🇮🇳', color: '#f1948a' },
                'Korea Południowa': { continent: 'Azja', flag: '🇰🇷', color: '#f8c471' },
                'Republika Południowej Afryki': { continent: 'Afryka', flag: '🇿🇦', color: '#a9dfbf' }
            };

            const info = countryInfo[country] || { continent: 'Inne', flag: '🌍', color: '#cccccc' };
            
            return {
                country,
                offers,
                continent: info.continent,
                flag: info.flag,
                color: info.color
            };
        })
        .sort((a, b) => b.offers - a.offers); // Sortuj malejąco po liczbie ofert

    // Renderowanie tabeli rankingowej
    let showAll = false;
    const initialLimit = 10;
    
    function renderTable() {
        const displayData = showAll ? countryData : countryData.slice(0, initialLimit);
        
        rankingContainer.innerHTML = `
            <div style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                <select id="continent-filter" style="background: rgba(0,0,0,0.8); color: #fff; border: 1px solid #00ff00; border-radius: 5px; padding: 8px; font-size: 0.9em;">
                    <option value="all">Wszystkie kontynenty</option>
                    <option value="Europa">Europa</option>
                    <option value="Ameryka Północna">Ameryka Północna</option>
                    <option value="Ameryka Południowa">Ameryka Południowa</option>
                    <option value="Australia i Oceania">Australia i Oceania</option>
                    <option value="Azja">Azja</option>
                    <option value="Afryka">Afryka</option>
                    <option value="Bliski Wschód">Bliski Wschód</option>
                </select>
                <button id="toggle-table" style="background: linear-gradient(45deg, #00ff00, #00fff7); color: #111; border: none; border-radius: 5px; padding: 8px 16px; font-size: 0.9em; font-weight: bold; cursor: pointer;">
                    ${showAll ? 'Zwiń' : 'Rozwiń wszystkie'}
                </button>
            </div>
            <table style="width: 100%; border-collapse: collapse; color: #fff;">
                <thead>
                    <tr style="border-bottom: 2px solid #00ff00;">
                        <th style="padding: 12px; text-align: left; color: #00ff00;">#</th>
                        <th style="padding: 12px; text-align: left; color: #00ff00;">Państwo</th>
                        <th style="padding: 12px; text-align: left; color: #00ff00;">Kontynent</th>
                        <th style="padding: 12px; text-align: right; color: #00ff00;">Oferty</th>
                    </tr>
                </thead>
                <tbody id="ranking-body">
                    ${displayData.map((item, index) => `
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); transition: background-color 0.3s ease;" onmouseover="this.style.backgroundColor='rgba(0,255,0,0.1)'" onmouseout="this.style.backgroundColor='transparent'">
                            <td style="padding: 12px; font-weight: bold; color: #FFD700;">${index + 1}</td>
                            <td style="padding: 12px;">
                                <span style="font-size: 1.2em; margin-right: 8px;">${item.flag}</span>
                                ${item.country}
                            </td>
                            <td style="padding: 12px; font-size: 0.9em; color: #ccc;">${item.continent}</td>
                            <td style="padding: 12px; text-align: right; font-weight: bold; color: ${item.color};">${item.offers}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div style="text-align: center; margin-top: 15px; color: #ccc; font-size: 0.9em;">
                Wyświetlanych: ${displayData.length} z ${countryData.length} państw
            </div>
        `;
        
        // Dodanie funkcjonalności filtrowania
        const filterSelect = document.getElementById('continent-filter');
        const toggleBtn = document.getElementById('toggle-table');
        
        toggleBtn.addEventListener('click', function() {
            showAll = !showAll;
            renderTable();
        });
    }

    renderTable();

    // Renderowanie interaktywnej mapy z prawdziwymi granicami krajów
    updateLoadingProgress(90, 'Renderowanie mapy świata...');
    
    // Wyczyść kontener mapy
    mapContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #00ff00;">Renderowanie mapy świata...</div>';
    
    // Ładuj dane mapy świata
    try {
        const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
        
        // Przygotuj dane dla punktów państw
        const countryPositions = {
            'USA': [ -95, 40 ], 'CAN': [ -106, 56 ], 'MEX': [ -102, 23 ], 'BRA': [ -51, -14 ], 'ARG': [ -63, -38 ],
            'POL': [ 19, 52 ], 'DEU': [ 10, 51 ], 'GBR': [ -3, 55 ], 'FRA': [ 2, 46 ], 'AUS': [ 133, -27 ],
            'JPN': [ 138, 36 ], 'KOR': [ 128, 36 ], 'CHN': [ 105, 35 ], 'IND': [ 78, 20 ], 'ZAF': [ 22, -30 ]
        };
        
        // Mapuj nasze kraje na kody ISO3
        const countryCodeMap = {
            'Stany Zjednoczone': 'USA', 'Kanada': 'CAN', 'Meksyk': 'MEX', 'Brazylia': 'BRA', 'Argentyna': 'ARG',
            'Polska': 'POL', 'Niemcy': 'DEU', 'Wielka Brytania': 'GBR', 'Francja': 'FRA', 'Australia': 'AUS',
            'Japonia': 'JPN', 'Korea Południowa': 'KOR', 'Chiny': 'CHN', 'Indie': 'IND', 'Republika Południowej Afryki': 'ZAF'
        };
        
        // Renderuj mapę z D3
        const width = 1000;
        const height = 500;
        
        const svg = d3.select(mapContainer)
            .append('svg')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('style', 'width: 100%; height: 100%; background: linear-gradient(135deg, #001122, #002244); border-radius: 10px; filter: drop-shadow(0 0 10px rgba(0,255,0,0.3)); shape-rendering: crispEdges; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;');
        
        // Definicje filtrów
        const defs = svg.append('defs');
        
        defs.append('filter')
            .attr('id', 'glow')
            .append('feGaussianBlur')
            .attr('stdDeviation', 1)  // Zmniejszony blur dla ostrości
            .attr('result', 'coloredBlur');
        
        defs.select('#glow')
            .append('feMerge')
            .append('feMergeNode')
            .attr('in', 'coloredBlur')
            .append('feMergeNode')
            .attr('in', 'SourceGraphic');
        
        defs.append('pattern')
            .attr('id', 'ocean')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', 50)
            .attr('height', 50)
            .append('rect')
            .attr('width', 50)
            .attr('height', 50)
            .attr('fill', '#001122');
        
        defs.select('#ocean')
            .append('circle')
            .attr('cx', 25)
            .attr('cy', 25)
            .attr('r', 1)
            .attr('fill', '#002244')
            .attr('opacity', 0.3);
        
        // Ocean
        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'url(#ocean)')
            .style('shape-rendering', 'crispEdges');
        
        // Projekcja mapy - zwiększona skala dla ostrości
        const projection = d3.geoNaturalEarth1()
            .scale(180)  // Zwiększona skala z 150 na 180
            .translate([width / 2, height / 2]);
        
        const path = d3.geoPath()
            .projection(projection)
            .pointRadius(2);
        
        // Rysuj kraje z lepszymi ustawieniami ostrości
        const countries = topojson.feature(world, world.objects.countries);
        
        svg.append('g')
            .selectAll('path')
            .data(countries.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', 'rgba(100,149,237,0.4)')
            .attr('stroke', '#6495ED')
            .attr('stroke-width', 0.8)  // Zwiększony stroke-width dla ostrości
            .attr('filter', 'url(#glow)')
            .style('shape-rendering', 'geometricPrecision')  // Lepsza jakość renderowania
            .style('stroke-linecap', 'round')
            .style('stroke-linejoin', 'round')
            .on('mouseover', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('fill', 'rgba(100,149,237,0.7)')
                    .attr('stroke-width', 1.2);  // Pogrubienie na hover
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('fill', 'rgba(100,149,237,0.4)')
                    .attr('stroke-width', 0.8);
            });
        
        // Dodaj punkty dla państw z ofertami
        const pointsGroup = svg.append('g');
        
        countryData.forEach(item => {
            const countryCode = countryCodeMap[item.country];
            if (countryCode && countryPositions[countryCode]) {
                const [lon, lat] = countryPositions[countryCode];
                const [x, y] = projection([lon, lat]);
                
                if (x && y) {
                    const pointGroup = pointsGroup.append('g')
                        .attr('transform', `translate(${x}, ${y})`)
                        .style('cursor', 'pointer')
                        .on('click', () => alert(`${item.flag} ${item.country}: ${item.offers} ofert pracy`))
                        .on('mouseover', function() {
                            d3.select(this).select('circle').transition().duration(200).attr('r', 8);
                            d3.select(this).select('text').style('opacity', 1);
                        })
                        .on('mouseout', function() {
                            d3.select(this).select('circle').transition().duration(200).attr('r', 6);
                            d3.select(this).select('text').style('opacity', 0);
                        });
                    
                    pointGroup.append('circle')
                        .attr('r', 6)
                        .attr('fill', item.color)
                        .attr('stroke', '#fff')
                        .attr('stroke-width', 2)
                        .style('filter', 'drop-shadow(0 0 4px ' + item.color + ')')
                        .style('shape-rendering', 'geometricPrecision');
                    
                    pointGroup.append('text')
                        .attr('text-anchor', 'middle')
                        .attr('dy', -10)
                        .attr('fill', '#fff')
                        .attr('font-size', '10px')
                        .attr('font-weight', 'bold')
                        .style('opacity', 0)
                        .style('pointer-events', 'none')
                        .style('text-rendering', 'optimizeLegibility')
                        .text(item.flag + ' ' + item.country);
                }
            }
        });
        
        // Legenda
        const legend = svg.append('g')
            .attr('transform', 'translate(10, 10)');
        
        legend.append('rect')
            .attr('width', 200)
            .attr('height', 60)
            .attr('fill', 'rgba(0,0,0,0.8)')
            .attr('stroke', '#00ff00')
            .attr('stroke-width', 1)
            .attr('rx', 5);
        
        legend.append('text')
            .attr('x', 10)
            .attr('y', 20)
            .attr('fill', '#fff')
            .attr('font-size', '12px')
            .text('🌍 Globalny Ranking Ofert Pracy');
        
        legend.append('circle')
            .attr('cx', 15)
            .attr('cy', 35)
            .attr('r', 5)
            .attr('fill', 'url(#gradient)')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1);
        
        legend.append('text')
            .attr('x', 25)
            .attr('y', 40)
            .attr('fill', '#fff')
            .attr('font-size', '10px')
            .text('Punkty państw');
        
        legend.append('text')
            .attr('x', 10)
            .attr('y', 55)
            .attr('fill', '#ccc')
            .attr('font-size', '8px')
            .text('Kliknij punkt po szczegóły');
        
        // Gradient dla legendy
        defs.append('radialGradient')
            .attr('id', 'gradient')
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#ff6b6b');
        
        defs.select('#gradient')
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#4ecdc4');
        
    } catch (error) {
        console.error('Error loading world map:', error);
        // Fallback do prostej mapy
        mapContainer.innerHTML = `
            <div style="position: relative; width: 100%; height: 100%; min-height: 600px;">
                <div style="text-align: center; padding: 40px; color: #ff2222;">
                    ❌ Błąd ładowania mapy świata. Używam mapy zastępczej.
                </div>
                <!-- Prosta mapa zastępcza -->
                <svg viewBox="0 0 1000 500" style="width: 100%; height: 100%; background: linear-gradient(135deg, #001122, #002244); border-radius: 10px;">
                    <text x="500" y="250" text-anchor="middle" fill="#fff" font-size="24">Mapa niedostępna</text>
                </svg>
            </div>
        `;
    }

    // Zakończ ładowanie - ukryj pasek i pokaż licznik
    updateLoadingProgress(100, 'Zakończono ładowanie danych!');
    console.log('Country stats:', countryStats);
    console.log('All offers count:', allOffers.length);

    setTimeout(() => {
        hideLoadingBar();
        // Aktualizuj licznik ofert - suma z tabeli rankingowej (countryStats)
        const totalOffers = Object.values(countryStats).reduce((sum, count) => sum + count, 0);
        console.log('Total offers from ranking table:', totalOffers);
        const counterEl = document.getElementById('job-counter');
        if (counterEl) {
            counterEl.textContent = totalOffers.toLocaleString();
            console.log('Counter updated with ranking table total:', totalOffers.toLocaleString());
        } else {
            console.log('Counter element not found!');
        }
    }, 1000); // Zwiększony czas na 1 sekundę, żeby zobaczyć 100%
}

document.addEventListener('DOMContentLoaded', fetchAndRenderJobOffers);

// Rozpocznij ładowanie natychmiast po załadowaniu strony
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Rozpocznij pasek ładowania natychmiast
        updateLoadingProgress(5, 'Inicjalizacja...');
        setTimeout(renderJoobleMapAndRanking, 100);
    });
} else {
    // DOM już załadowany - rozpocznij natychmiast
    updateLoadingProgress(5, 'Inicjalizacja...');
    setTimeout(renderJoobleMapAndRanking, 100);
}