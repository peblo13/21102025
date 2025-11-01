require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { RestClientV5 } = require('bybit-api');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cryptoblik', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Bybit API client
const bybitClient = new RestClientV5({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,
  testnet: true // Testnet for development
});

// PayU config
const PAYU_BASE_URL = 'https://secure.payu.com'; // Production
const PAYU_POS_ID = process.env.PAYU_POS_ID;
const PAYU_CLIENT_SECRET = process.env.PAYU_CLIENT_SECRET;
const PAYU_CLIENT_ID = process.env.PAYU_CLIENT_ID;

// Models
const transactionSchema = new mongoose.Schema({
  type: String, // 'buy' or 'sell'
  crypto: String,
  amount: Number, // PLN
  fee: Number, // Prowizja w PLN
  date: { type: Date, default: Date.now }
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// Message model for contact form
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});
const Message = mongoose.model('Message', messageSchema);

// Config
let feePercentage = 3; // Default 3%

// Routes
app.get('/api/prices', async (req, res) => {
  try {
    console.log('Fetching prices from Bybit...');
    const response = await bybitClient.getTickers({ category: 'spot' });
    console.log('Prices fetched:', response.result.list.length, 'items');
    res.json(response.result.list);
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.json({ success: true, message: 'Wiadomość wysłana pomyślnie!' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ success: false, message: 'Błąd podczas wysyłania wiadomości' });
  }
});

// Buy transaction with BLIK and Bybit
app.post('/api/buy', async (req, res) => {
  const { crypto, amount, network, wallet, blik } = req.body;
  try {
    // Get current price
    const ticker = await bybitClient.getTickers({ category: 'spot', symbol: crypto });
    const currentPrice = parseFloat(ticker.result.list[0].lastPrice);
    const qty = (amount / currentPrice).toFixed(6); // Approximate qty

    // Step 1: Create BLIK payment via PayU (placeholder - add real PayU integration)
    console.log('Creating BLIK payment for', amount, 'PLN');

    // Assume payment success for demo
    // Step 2: Buy crypto on Bybit
    const buyOrder = await bybitClient.submitOrder({
      category: 'spot',
      symbol: crypto,
      side: 'Buy',
      orderType: 'Market',
      qty: qty
    });

    console.log('Bybit buy order:', buyOrder);

    // Step 3: Send crypto to wallet (requires wallet private key - not implemented)
    console.log('Send', qty, crypto, 'to', wallet);

    res.json({ success: true, message: 'Zakup zakończony pomyślnie!' });
  } catch (error) {
    console.error('Buy error:', error);
    res.status(500).json({ error: 'Błąd transakcji' });
  }
});

// Sell transaction
app.post('/api/sell', async (req, res) => {
  const { crypto, amount, network, wallet, phone } = req.body;
  try {
    // Assume crypto received from wallet
    console.log('Received', amount, crypto, 'from', wallet);

    // Sell on Bybit
    const sellOrder = await bybitClient.submitOrder({
      category: 'spot',
      symbol: crypto,
      side: 'Sell',
      orderType: 'Market',
      qty: amount
    });

    console.log('Bybit sell order:', sellOrder);

    // Send fiat to phone (placeholder)
    console.log('Send PLN to phone:', phone);

    res.json({ success: true, message: 'Sprzedaż zakończona pomyślnie!' });
  } catch (error) {
    console.error('Sell error:', error);
    res.status(500).json({ error: 'Błąd transakcji sprzedaży' });
  }
});

// PayU notification webhook
app.post('/api/notify', (req, res) => {
  console.log('PayU notification:', req.body);
  // Handle payment confirmation
  res.sendStatus(200);
});

// Admin routes
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === 'pawel123!') {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const totalTransactions = transactions.length;
    const buyTransactions = transactions.filter(t => t.type === 'buy').length;
    const sellTransactions = transactions.filter(t => t.type === 'sell').length;
    const totalTurnover = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalFee = transactions.reduce((sum, t) => sum + t.fee, 0);
    const tax = totalFee * 0.19; // 19% CIT
    const avgTransaction = totalTransactions > 0 ? totalTurnover / totalTransactions : 0;
    const maxTransaction = transactions.length > 0 ? Math.max(...transactions.map(t => t.amount)) : 0;
    const minTransaction = transactions.length > 0 ? Math.min(...transactions.map(t => t.amount)) : 0;

    res.json({
      totalTransactions,
      buyTransactions,
      sellTransactions,
      totalTurnover,
      totalFee,
      tax,
      avgTransaction,
      maxTransaction,
      minTransaction,
      feePercentage
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.post('/api/admin/settings', (req, res) => {
  const { fee } = req.body;
  if (typeof fee === 'number' && fee >= 0 && fee <= 100) {
    feePercentage = fee;
    res.json({ success: true, feePercentage });
  } else {
    res.status(400).json({ error: 'Invalid fee percentage' });
  }
});

app.get('/api/admin/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/admin/messages/:id/read', async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// Serve admin page
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Panel Administratora - CryptoBLIK</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
                color: #fff;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
            }
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.3);
                z-index: -1;
            }
            .container {
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #FFD700;
                border-radius: 20px;
                padding: 40px;
                max-width: 800px;
                width: 100%;
                box-shadow: 0 0 40px rgba(255, 215, 0, 0.3);
                animation: fadeInUp 1s ease-out;
            }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            h1 {
                text-align: center;
                color: #FFD700;
                margin-bottom: 30px;
                font-size: 2.5rem;
                text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
            }
            #login {
                text-align: center;
            }
            #login input {
                padding: 12px;
                border: 2px solid #FFD700;
                border-radius: 8px;
                background: #111;
                color: #fff;
                font-size: 1rem;
                margin-bottom: 20px;
                width: 100%;
                max-width: 300px;
            }
            #login input:focus {
                outline: none;
                border-color: #00ff00;
                box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
            }
            .btn {
                padding: 12px 30px;
                border: none;
                border-radius: 10px;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                margin: 10px;
            }
            .btn-primary {
                background: linear-gradient(45deg, #FFD700, #FFA500);
                color: #111;
            }
            .btn-primary:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
            }
            .btn-success {
                background: linear-gradient(45deg, #00ff00, #39ff14);
                color: #111;
            }
            .btn-success:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0, 255, 0, 0.4);
            }
            #panel {
                display: none;
            }
            .section {
                margin: 30px 0;
                padding: 20px;
                background: rgba(0, 0, 0, 0.6);
                border: 1px solid #00ff00;
                border-radius: 10px;
            }
            .section h2 {
                color: #FFD700;
                margin-bottom: 20px;
                font-size: 1.8rem;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                color: #fff;
                margin-bottom: 8px;
                font-weight: 600;
            }
            .form-group input {
                width: 100%;
                padding: 10px;
                border: 2px solid #FFD700;
                border-radius: 8px;
                background: #111;
                color: #fff;
            }
            .form-group input:focus {
                outline: none;
                border-color: #00ff00;
                box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            .stat-card {
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid #FFD700;
                border-radius: 10px;
                padding: 20px;
                text-align: center;
            }
            .stat-value {
                font-size: 2rem;
                font-weight: bold;
                color: #00ff00;
                margin-bottom: 5px;
            }
            .stat-label {
                color: #ccc;
                font-size: 0.9rem;
            }
            .chart-container {
                margin: 20px 0;
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid #FFD700;
                border-radius: 10px;
                padding: 20px;
            }
            .messages-list {
                max-height: 400px;
                overflow-y: auto;
            }
            .message-item {
                background: rgba(0, 0, 0, 0.6);
                border: 1px solid #00ff00;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
            }
            .message-item.unread {
                border-color: #FFD700;
                background: rgba(255, 215, 0, 0.1);
            }
            .message-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
            }
            .message-name {
                font-weight: bold;
                color: #FFD700;
            }
            .message-date {
                color: #ccc;
                font-size: 0.9rem;
            }
            .message-email {
                color: #00ff00;
                margin-bottom: 10px;
            }
            .message-text {
                color: #fff;
                line-height: 1.5;
            }
            .mark-read-btn {
                background: #00ff00;
                color: #000;
                border: none;
                padding: 5px 10px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.8rem;
            }
            @media (max-width: 768px) {
                .container {
                    padding: 20px;
                    margin: 20px;
                }
                .stats-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Panel Administratora</h1>
            <div id="login">
                <input id="password" type="password" placeholder="Wprowadź hasło administratora">
                <button class="btn btn-primary" onclick="login()">Zaloguj się</button>
            </div>
            <div id="panel">
                <div class="section">
                    <h2>Ustawienia</h2>
                    <div class="form-group">
                        <label for="fee">Prowizja (%):</label>
                        <input id="fee" type="number" value="${feePercentage}" step="0.1">
                    </div>
                    <button class="btn btn-success" onclick="updateFee()">Zapisz ustawienia</button>
                </div>
                <div class="section">
                    <h2>Statystyki</h2>
                    <div class="stats-grid" id="stats"></div>
                    <div class="chart-container">
                        <canvas id="statsChart"></canvas>
                    </div>
                    <div class="chart-container">
                        <canvas id="turnoverChart"></canvas>
                    </div>
                </div>
                <div class="section">
                    <h2>Wiadomości kontaktowe</h2>
                    <div id="messages" class="messages-list"></div>
                </div>
            </div>
        </div>
        <script>
            function login() {
                fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: document.getElementById('password').value })
                }).then(r => r.json()).then(data => {
                    if (data.success) {
                        document.getElementById('login').style.display = 'none';
                        document.getElementById('panel').style.display = 'block';
                        loadStats();
                    } else alert('Błędne hasło');
                });
            }
            function updateFee() {
                fetch('/api/admin/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fee: +document.getElementById('fee').value })
                }).then(r => r.json()).then(data => {
                    if (data.success) alert('Ustawienia zapisane pomyślnie!');
                    else alert('Błąd podczas zapisywania');
                });
            }
            function loadStats() {
                fetch('/api/admin/stats').then(r => r.json()).then(data => {
                    document.getElementById('stats').innerHTML = \`
                        <div class="stat-card">
                            <div class="stat-value">\${data.totalTransactions}</div>
                            <div class="stat-label">Razem transakcji</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">\${data.totalTurnover.toFixed(2)} PLN</div>
                            <div class="stat-label">Obrót całkowity</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">\${data.totalFee.toFixed(2)} PLN</div>
                            <div class="stat-label">Zysk (prowizja)</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">\${data.tax.toFixed(2)} PLN</div>
                            <div class="stat-label">Podatek (19% CIT)</div>
                        </div>
                    \`;
                    createChart(data);
                    createTurnoverChart(data);
                });
                loadMessages();
            }
            function createChart(data) {
                const ctx = document.getElementById('statsChart').getContext('2d');
                if (window.statsChart) {
                    window.statsChart.destroy();
                }
                window.statsChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Kupno', 'Sprzedaż'],
                        datasets: [{
                            data: [data.buyTransactions, data.sellTransactions],
                            backgroundColor: ['rgba(0, 255, 0, 0.8)', 'rgba(255, 0, 0, 0.8)'],
                            borderColor: ['#00ff00', '#ff0000'],
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                labels: {
                                    color: '#fff'
                                }
                            }
                        }
                    }
                });
            }
            function createTurnoverChart(data) {
                const ctx = document.getElementById('turnoverChart').getContext('2d');
                if (window.turnoverChart) {
                    window.turnoverChart.destroy();
                }
                window.turnoverChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Obrót', 'Zysk', 'Podatek'],
                        datasets: [{
                            label: 'PLN',
                            data: [data.totalTurnover, data.totalFee, data.tax],
                            backgroundColor: ['rgba(255, 215, 0, 0.8)', 'rgba(0, 255, 0, 0.8)', 'rgba(255, 0, 0, 0.8)'],
                            borderColor: ['#FFD700', '#00ff00', '#ff0000'],
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                labels: {
                                    color: '#fff'
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    color: '#fff'
                                },
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                }
                            },
                            x: {
                                ticks: {
                                    color: '#fff'
                                },
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                }
                            }
                        }
                    }
                });
            }
            function loadMessages() {
                fetch('/api/admin/messages').then(r => r.json()).then(messages => {
                    const messagesDiv = document.getElementById('messages');
                    messagesDiv.innerHTML = messages.map(msg => \`
                        <div class="message-item \${msg.read ? '' : 'unread'}">
                            <div class="message-header">
                                <div class="message-name">\${msg.name}</div>
                                <div class="message-date">\${new Date(msg.date).toLocaleString()}</div>
                            </div>
                            <div class="message-email">\${msg.email}</div>
                            <div class="message-text">\${msg.message}</div>
                            \${!msg.read ? '<button class="mark-read-btn" onclick="markAsRead(\'' + msg._id + '\')">Oznacz jako przeczytane</button>' : ''}
                        </div>
                    \`).join('');
                });
            }
            function markAsRead(id) {
                fetch(\`/api/admin/messages/\${id}/read\`, { method: 'POST' }).then(() => loadMessages());
            }
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});