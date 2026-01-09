lucide.createIcons();

// --- 1. THE ROUTER ---
function navigate(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    if (pageId === 'spot' || pageId === 'perp') {
        document.getElementById('page-trade').classList.remove('hidden');
        document.getElementById('btn-' + pageId).classList.add('active');
        initTradingView(pageId === 'spot' ? 'BINANCE:BTCUSDT' : 'BINANCE:BTCUSDT.P');
        document.getElementById('trade-btn').innerText = pageId === 'spot' ? 'Buy BTC' : 'Open Long';
    } else {
        document.getElementById('page-' + pageId).classList.remove('hidden');
        document.getElementById('btn-' + pageId)?.classList.add('active');
    }
}

// --- 2. TRADINGVIEW WIDGET ---
let tvWidget = null;
function initTradingView(symbol) {
    tvWidget = new TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": "15",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#121619",
        "enable_publishing": false,
        "hide_top_toolbar": false,
        "container_id": "tradingview_widget"
    });
}

// --- 3. BINANCE LIVE DATA (WebSockets) ---
const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@aggTrade');
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const price = parseFloat(data.p).toFixed(2);
    const ticker = document.getElementById('ticker-price');
    if(ticker) {
        ticker.innerText = price;
        ticker.className = `p-2 text-center font-bold text-lg border-y border-gray-800 ${data.m ? 'text-red-500' : 'text-green-500'}`;
    }
};

// --- 4. ORDER BOOK GENERATOR ---
function updateOrderBook() {
    const asks = document.getElementById('asks');
    const bids = document.getElementById('bids');
    if(!asks || !bids) return;

    const row = (color) => `
        <div class="order-row">
            <span class="${color}">${(98000 + Math.random()*500).toFixed(1)}</span>
            <span class="text-gray-400">${Math.random().toFixed(3)}</span>
            <div class="depth-fill ${color.replace('text', 'bg')}" style="width: ${Math.random()*100}%"></div>
        </div>`;
    
    asks.innerHTML = Array(20).fill(0).map(() => row('text-red-500')).join('');
    bids.innerHTML = Array(20).fill(0).map(() => row('text-green-500')).join('');
}

setInterval(updateOrderBook, 1000);
navigate('home'); // Start on Home/Login