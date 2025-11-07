// uslugi-csv-import.js
// Loader for services from uslugi.csv using PapaParse

// Make sure PapaParse is loaded before this script
// <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js"></script>

function loadServicesFromCSV(csvPath, callback) {
    Papa.parse(csvPath, {
        download: true,
        header: true,
        skipEmptyLines: true,
        delimiter: ';',
        complete: function(results) {
            // Clean up field names and values
            const services = results.data.map(row => {
                const cleaned = {};
                Object.keys(row).forEach(key => {
                    const cleanKey = key.replace(/^[\s"']+|[\s"']+$/g, '');
                    let value = row[key];
                    if (typeof value === 'string') {
                        value = value.replace(/^[\s"']+|[\s"']+$/g, '');
                    }
                    cleaned[cleanKey] = value;
                });
                return cleaned;
            });
            callback(services);
        },
        error: function(err) {
            console.error('Błąd ładowania pliku CSV:', err);
            callback([]);
        }
    });
}

// Example usage:
// loadServicesFromCSV('uslugi.csv', function(services) {
//     displayServices(services);
// });
