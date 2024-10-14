const priceForm = document.getElementById('priceForm');
const priceList = document.getElementById('priceList');
const averagePriceElement = document.getElementById('averagePrice');
const resetButton = document.getElementById('resetButton');
const resetPassword = document.getElementById('resetPassword');

// Şifre tanımla
const correctPassword = '79066540'; // Burada istediğin şifreyi belirleyebilirsin

// LocalStorage'dan fiyatları yükle veya boş dizi oluştur
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

    if (isNaN(price) || price <= 0) {
        alert('Lütfen geçerli bir fiyat girin.');
        return;
    }

    const priceEntry = { stock, date, price };
    prices.push(priceEntry);
    localStorage.setItem('prices', JSON.stringify(prices)); // Fiyatları kaydet

    renderPrices(); // Fiyatları güncelle
});

// Tarih alanına otomatik / ekleme
const dateInput = document.getElementById('date');
dateInput.addEventListener('input', function(event) {
    let value = dateInput.value.replace(/[^0-9]/g, ''); // Sadece rakamları al
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2); // gg/aa formatı
    }
    if (value.length >= 5) {
        value = value.slice(0, 5) + '/' + value.slice(5); // gg/aa/yyyy formatı
    }
    dateInput.value = value; // Güncellenmiş değeri inputa yaz
});

resetButton.addEventListener('click', function() {
    const enteredPassword = resetPassword.value;

    if (enteredPassword === correctPassword) {
        localStorage.removeItem('prices'); // LocalStorage'dan fiyatları kaldır
        prices = []; // Fiyatları sıfırla
        renderPrices(); // Fiyat listesini güncelle
        alert('Geçmiş sıfırlandı.');
    } else {
        alert('Yanlış şifre. Lütfen tekrar deneyin.');
    }
});

function updateAveragePrice() {
    const total = prices.reduce((sum, entry) => sum + entry.price, 0);
    const average = prices.length ? total / prices.length : 0;
    averagePriceElement.textContent = average.toFixed(2);
}






