// Firebase SDK'nın başlatılması
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

// Firestore'a referans al
const db = firebase.firestore();

const priceForm = document.getElementById('priceForm');
const priceList = document.getElementById('priceList');
const averagePriceElement = document.getElementById('averagePrice');
const resetButton = document.getElementById('resetButton');
const resetPassword = document.getElementById('resetPassword');

// Şifre tanımla
const correctPassword = '79066540'; // Burada istediğin şifreyi belirleyebilirsin

// Sayfa yüklendiğinde fiyatları göster
loadPrices();

function loadPrices() {
    db.collection("prices").get().then((querySnapshot) => {
        priceList.innerHTML = ''; // Mevcut listeyi temizle
        let prices = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            prices.push(data);
            const listItem = document.createElement('li');
            listItem.textContent = `${data.stock} - ${data.date}: ${data.price.toFixed(2)} TL`;
            priceList.appendChild(listItem);
        });
        updateAveragePrice(prices);
    });
}

function updateAveragePrice(prices) {
    const total = prices.reduce((sum, entry) => sum + entry.price, 0);
    const average = prices.length ? total / prices.length : 0;
    averagePriceElement.textContent = average.toFixed(2);
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

    const priceEntry = { stock, date, price, timestamp: firebase.firestore.FieldValue.serverTimestamp() };

    // Firestore'a veri ekle
    db.collection("prices").add(priceEntry)
    .then(() => {
        alert('Fiyat başarıyla eklendi!');
        loadPrices(); // Verileri yeniden yükle
    })
    .catch((error) => {
        console.error("Veri eklenirken hata oluştu: ", error);
    });
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

// Geçmişi sıfırlama işlevi
resetButton.addEventListener('click', function() {
    const enteredPassword = resetPassword.value;

    if (enteredPassword === correctPassword) {
        db.collection("prices").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                db.collection("prices").doc(doc.id).delete();
            });
        }).then(() => {
            alert('Geçmiş sıfırlandı.');
            loadPrices(); // Fiyat listesini güncelle
        }).catch((error) => {
            console.error("Geçmiş sıfırlanırken hata oluştu: ", error);
        });
    } else {
        alert('Yanlış şifre. Lütfen tekrar deneyin.');
    }
});








