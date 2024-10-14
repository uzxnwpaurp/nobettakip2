// Firebase yapılandırma bilgilerinizi buraya ekleyin
const firebaseConfig = {
    apiKey: "AIzaSyC035yNDCY-LKV_NHXxdDaJBcPM_HY_zW4",
    authDomain: "nobettakip-447bf.firebaseapp.com",
    projectId: "nobettakip-447bf",
    storageBucket: "nobettakip-447bf.appspot.com",
    messagingSenderId: "685407754980",
    appId: "1:685407754980:web:5e63808d0c36186afbaaf1",
    measurementId: "G-N36D0ST83P"
};

// Firebase'i başlat
firebase.initializeApp(firebaseConfig);

// Firestore referansını al
const db = firebase.firestore();
const pricesRef = db.collection('prices');

// DOM öğelerini al
const priceForm = document.getElementById('priceForm');
const priceList = document.getElementById('priceList');
const averagePriceElement = document.getElementById('averagePrice');
const resetButton = document.getElementById('resetButton');
const resetPassword = document.getElementById('resetPassword');
const messageElement = document.getElementById('message');

// Sayfa yüklendiğinde fiyatları göster
renderPrices();

function renderPrices() {
    priceList.innerHTML = '';
    pricesRef.get().then(snapshot => {
        snapshot.forEach(doc => {
            const priceEntry = doc.data();
            const listItem = document.createElement('li');
            listItem.textContent = `${priceEntry.stock} - ${priceEntry.date}: ${priceEntry.price.toFixed(2)} TL`;
            priceList.appendChild(listItem);
        });
        updateAveragePrice();
    }).catch(error => {
        console.error("Fiyatları yüklerken hata: ", error);
    });
}

priceForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const stock = document.getElementById('stock').value;
    const date = document.getElementById('date').value;
    const price = parseFloat(document.getElementById('price').value);

    // Gönderilen veriyi kontrol et
    console.log("Gönderilen veri:", { stock, date, price });

    if (!stock || !date || isNaN(price) || price <= 0) {
        alert('Lütfen tüm alanları doğru bir şekilde doldurun.');
        return;
    }

    const priceEntry = { stock, date, price };

    pricesRef.add(priceEntry).then(() => {
        console.log("Başarıyla eklendi.");
        renderPrices();
        messageElement.textContent = "Başarıyla eklendi.";
        setTimeout(() => messageElement.textContent = '', 3000);
    }).catch(error => {
        console.error("Hata eklerken: ", error);
        alert("Bir hata oluştu, lütfen tekrar deneyin.");
    });
});

// Ortalama fiyat güncelleme ve diğer işlevler...







