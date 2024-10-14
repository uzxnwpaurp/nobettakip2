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
const pricesRef = db.collection('prices'); // Koleksiyon adı

const priceForm = document.getElementById('priceForm');
const priceList = document.getElementById('priceList');
const averagePriceElement = document.getElementById('averagePrice');
const resetButton = document.getElementById('resetButton');
const resetPassword = document.getElementById('resetPassword');
const messageElement = document.getElementById('message'); // Başarı mesajı elementi

// Şifre tanımla
const correctPassword = '79066540'; // Burada istediğin şifreyi belirleyebilirsin

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
    });
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

    // Tarih kontrolü (gg/aa/yyyy formatı)
    const isValidDate = (dateString) => {
        const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([0-9]{4})$/;
        return dateString.match(regex);
    };
    
    if (!isValidDate(date)) {
        alert('Lütfen geçerli bir tarih girin (gg/aa/yyyy).');
        return;
    }

    const priceEntry = { stock, date, price };

    // Firestore'a fiyat kaydet
    pricesRef.add(priceEntry).then(() => {
        renderPrices(); // Fiyatları güncelle
        messageElement.textContent = "Başarıyla eklendi."; // Başarı mesajı göster
        setTimeout(() => messageElement.textContent = '', 3000); // Mesajı 3 saniye sonra temizle
    }).catch(error => {
        console.error("Hata eklerken: ", error);
    });
});

// Geçmişi sıfırlama
resetButton.addEventListener('click', function() {
    const enteredPassword = resetPassword.value;

    if (enteredPassword === correctPassword) {
        pricesRef.get().then(snapshot => {
            const batch = db.batch();
            snapshot.forEach(doc => {
                batch.delete(doc.ref); // Tüm belgeleri sil
            });
            return batch.commit();
        }).then(() => {
            renderPrices(); // Fiyat listesini güncelle
            alert('Geçmiş sıfırlandı.');
            resetPassword.value = ''; // Şifre alanını temizle
        }).catch(error => {
            console.error("Geçmiş sıfırlanırken hata: ", error);
        });
    } else {
        alert('Yanlış şifre. Lütfen tekrar deneyin.');
    }
});

function updateAveragePrice() {
    pricesRef.get().then(snapshot => {
        const prices = snapshot.docs.map(doc => doc.data().price);
        const total = prices.reduce((sum, price) => sum + price, 0);
        const average = prices.length ? total / prices.length : 0;
        averagePriceElement.textContent = average.toFixed(2);
    });
}


