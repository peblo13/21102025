document.addEventListener('DOMContentLoaded', function() {
    const jobListings = document.getElementById('job-listings');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const pagination = document.getElementById('pagination');
    const jobCount = document.getElementById('job-count');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarMenu = document.querySelector('.navbar ul');

    let jobs = [];
    let currentFilteredJobs = []; // Aktualne przefiltrowane oferty
    const jobsPerPage = 20; // Liczba ofert pracy na stronę
    let currentPage = 1;

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('showing');
        });
    }
        // Usunięto obsługę nieistniejących elementów DOM (searchForm, searchInput, jobCount, pagination)
    function displayJobs(jobsToDisplay, page = 1) {
        if (!Array.isArray(jobsToDisplay)) {
            console.error('jobsToDisplay is not an array');
            return;
        }

        // Zapisz aktualne przefiltrowane oferty
        currentFilteredJobs = jobsToDisplay;
        currentPage = page;

        jobListings.innerHTML = '';
        const start = (page - 1) * jobsPerPage;
        const end = start + jobsPerPage;
        const paginatedJobs = jobsToDisplay.slice(start, end);

        paginatedJobs.forEach(job => {
            const jobSquare = document.createElement('div');
            jobSquare.classList.add('job-square');

            const jobTitle = document.createElement('h3');
            jobTitle.textContent = job.title;
            jobTitle.style.color = '#ffffff'; // Biały tekst dla stanowiska
            jobSquare.appendChild(jobTitle);

            const jobLocation = document.createElement('p');
            jobLocation.innerHTML = `<span class="location-marker">📍</span>${job.location}`;
            jobSquare.appendChild(jobLocation);

            const jobDescription = document.createElement('div');
            jobDescription.classList.add('job-description');
            jobDescription.textContent = `Firma: ${job.company}\nUmowa: ${job.contract}\nDostępne od: ${job.available_from}`;
            jobSquare.appendChild(jobDescription);

            const applyButton = document.createElement('button');
            applyButton.classList.add('apply-button');
            applyButton.textContent = 'Aplikuj';
            applyButton.addEventListener('click', () => {
                openApplicationForm(job.title);
            });
            jobSquare.appendChild(applyButton);

            jobListings.appendChild(jobSquare);
        });

        displayPagination(jobsToDisplay.length, page);
        updateJobCount(jobsToDisplay.length);
    }

    function displayPagination(totalJobs, page) {
        pagination.innerHTML = '';
        const totalPages = Math.ceil(totalJobs / jobsPerPage);

        const prevButton = document.createElement('button');
        prevButton.textContent = '<-';
        prevButton.classList.add('page-button');
        prevButton.disabled = page === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayJobs(currentFilteredJobs, currentPage);
            }
        });
        pagination.appendChild(prevButton);

        const pageInfo = document.createElement('span');
        pageInfo.classList.add('page-info');
        pageInfo.textContent = ` ${page} -> ${totalPages} `;
        pagination.appendChild(pageInfo);

        const nextButton = document.createElement('button');
        nextButton.textContent = '->';
        nextButton.classList.add('page-button');
        nextButton.disabled = page === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayJobs(currentFilteredJobs, currentPage);
            }
        });
        pagination.appendChild(nextButton);
    }

    function updateJobCount(count) {
        jobCount.textContent = `Liczba ofert pracy: ${count}`;
    }

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // Jeśli pole wyszukiwania jest puste, pokaż wszystkie oferty
        if (searchTerm === '') {
            currentPage = 1;
            displayJobs(jobs, 1);
            return;
        }
        
        const filteredJobs = jobs.filter(job => 
            job.location.toLowerCase().includes(searchTerm) || 
            job.title.toLowerCase().includes(searchTerm)
        );
        currentPage = 1; // Reset do pierwszej strony przy nowym wyszukiwaniu
        displayJobs(filteredJobs, 1);
    });

    // Dodaj obsługę czyszczenia wyszukiwania przy zmianie tekstu
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            currentPage = 1;
            displayJobs(jobs, 1);
        }
    });

    // Fetch jobs from ue.json
    fetch('ue.json')
        .then(response => response.json())
        .then(data => {
            if (data.jobs && Array.isArray(data.jobs)) {
                jobs = data.jobs;
