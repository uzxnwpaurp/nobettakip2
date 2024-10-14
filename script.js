const priceForm = document.getElementById('priceForm');
const priceList = document.getElementById('priceList');
const averagePriceElement = document.getElementById('averagePrice');

let prices = JSON.parse(localStorage.getItem('prices')) || [];

// Sayfa yüklendiğinde fiyatları göster
renderPrices();

function renderPrices() {
    priceList.innerHTML = '';
    prices.forEach((priceEntry) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${priceEntry.stock} - ${priceEntry.date}: ${priceEntry.price.toFixed(2)} TL`;
        priceList.appendChild(listItem);
    });
    updateAveragePrice();
}

priceForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const stock = document.getElementById('stock').value;
    const date = document.getElementById('date').value;
    const price = parseFloat(document.getElementById('price').value);

    const priceEntry = { stock, date, price };
    prices.push(priceEntry);
    localStorage.setItem('prices', JSON.stringify(prices)); // Fiyatları kaydetme

    renderPrices(); // Fiyatları güncelle
});

function updateAveragePrice() {
    const total = prices.reduce((sum, entry) => sum + entry.price, 0);
    const average = prices.length ? total / prices.length : 0;
    averagePriceElement.textContent = average.toFixed(2);
}

