const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// Serve static files from current directory
app.use(express.static(path.join(__dirname)));

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Also accessible at http://192.168.100.5:${port} from other devices on the network`);
    console.log('Serving files from:', __dirname);
});