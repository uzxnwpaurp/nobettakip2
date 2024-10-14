const priceForm = document.getElementById('priceForm');
const priceList = document.getElementById('priceList');
const averagePriceElement = document.getElementById('averagePrice');

let prices = [];

priceForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const date = document.getElementById('date').value;
    const price = parseFloat(document.getElementById('price').value);

    prices.push(price);
    
    const listItem = document.createElement('li');
    listItem.textContent = `${date}: ${price.toFixed(2)} TL`;
    priceList.appendChild(listItem);

    updateAveragePrice();
});

function updateAveragePrice() {
    const total = prices.reduce((sum, price) => sum + price, 0);
    const average = prices.length ? total / prices.length : 0;
    averagePriceElement.textContent = average.toFixed(2);
}
