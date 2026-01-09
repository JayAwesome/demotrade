lucide.createIcons();

let isLoggedIn = false;
let currentSymbol = 'BINANCE:BTCUSDT';

// --- NAVIGATION ---
function navigate(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link, .tab-link').forEach(l => l.classList.remove('active'));

    const targetPage = (pageId === 'spot' || pageId === 'perp') ? 'page-trade' : 'page-' + pageId;
    document.getElementById(targetPage).classList.add('active');
    
    // UI Updates
    if(pageId === 'spot') {
        document.getElementById('nav-spot').classList.add('active');
        document.getElementById('tab-spot').classList.add('active');
        document.getElementById('pair-display').innerText = "BTC/USDT (SPOT)";
        initTV('BINANCE:BTCUSDT');
    } else if(pageId === 'perp') {
        document.getElementById('nav-perp').classList.add('active');
        document.getElementById('pair-display').innerText = "BTC/USDT (PERP)";
        initTV('BINANCE:BTCUSDT.P');
    } else {
        document.getElementById('tab-wallet').classList.add('active');
    }
}

// --- TRADINGVIEW ---
function initTV(symbol) {
    if (currentSymbol === symbol && document.querySelector('iframe')) return;
    currentSymbol = symbol;
    
    new TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": "15",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "hide_side_toolbar": true,
        "container_id": "tv_widget_container"
    });
}

// --- LOGIN LOGIC ---
function toggleLogin(show) {
    const modal = document.getElementById('login-modal');
    const card = document.getElementById('modal-card');
    if(show) {
        modal.classList.remove('hidden');
        setTimeout(() => card.classList.add('modal-show'), 10);
    } else {
        card.classList.remove('modal-show');
        setTimeout(() => modal.classList.add('hidden'), 200);
    }
}

function handleLogin() {
    isLoggedIn = true;
    toggleLogin(false);
    document.getElementById('user-btn').innerText = "Jay_User_01";
}

function attemptTrade() {
    if(!isLoggedIn) toggleLogin(true);
    else alert("Order Placed Successfully!");
}

// --- LIVE ORDER BOOK ---
const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@aggTrade');
ws.onmessage = (e) => {
    const d = JSON.parse(e.data);
    const p = parseFloat(d.p).toFixed(2);
    const color = d.m ? 'text-red-500' : 'text-green-500';
    
    document.getElementById('ticker-top').innerText = p;
    document.getElementById('ticker-top').className = `font-bold mono text-sm ${color}`;
    document.getElementById('ticker-mid').innerText = p;
    document.getElementById('ticker-mid').style.color = d.m ? '#f6465d' : '#0ecb81';
};

function updateBook() {
    const row = (c) => `<div class="order-row z-10">
        <span class="${c}">${(98000 + Math.random()*200).toFixed(1)}</span>
        <span class="text-gray-400 z-10">${Math.random().toFixed(3)}</span>
        <div class="depth-fill ${c.replace('text', 'bg')}" style="width: ${Math.random()*100}%"></div>
    </div>`;
    document.getElementById('asks').innerHTML = Array(15).fill(0).map(()=>row('text-red-500')).join('');
    document.getElementById('bids').innerHTML = Array(15).fill(0).map(()=>row('text-green-500')).join('');
}

setInterval(updateBook, 1200);
navigate('spot'); // Initial Load
// --- DEPOSIT MODAL LOGIC ---
function openDepositModal() {
    if (!isLoggedIn) {
        toggleLogin(true); // Must log in before depositing
        return;
    }
    const modal = document.getElementById('deposit-modal');
    modal.classList.remove('hidden');
    // Re-trigger lucide icons for the 'x' and 'copy' inside the modal
    lucide.createIcons();
}

function closeDepositModal() {
    document.getElementById('deposit-modal').classList.add('hidden');
}

// Update navigate function to handle mobile wallet properly
function navigate(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link, .tab-link').forEach(l => l.classList.remove('active'));

    const targetId = (pageId === 'spot' || pageId === 'perp') ? 'page-trade' : 'page-' + pageId;
    const targetPage = document.getElementById(targetId);
    
    if (targetPage) {
        targetPage.classList.add('active');
        // Logic to refresh chart if switching back to trade
        if (pageId === 'spot' || pageId === 'perp') {
            initTV(pageId === 'spot' ? 'BINANCE:BTCUSDT' : 'BINANCE:BTCUSDT.P');
        }
    }
    
    // Set Active State on Buttons
    const btn = document.getElementById('nav-' + pageId) || document.getElementById('tab-' + pageId);
    if (btn) btn.classList.add('active');
}