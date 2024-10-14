// Firebase SDK'sını modül olarak içe aktar
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, writeBatch } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

// Firebase yapılandırma kodu
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const priceForm = document.getElementById('priceForm');
const priceList = document.getElementById('priceList');
const averagePriceElement = document.getElementById('averagePrice');
const resetButton = document.getElementById('resetButton');
const resetPassword = document.getElementById('resetPassword');
const messageElement = document.getElementById('message');

const correctPassword = '79066540'; // Şifre kontrolü için kullanılacak

// Sayfa yüklendiğinde fiyatları göster
renderPrices();

async function renderPrices() {
    priceList.innerHTML = '';
    const snapshot = await getDocs(collection(db, 'prices'));
    snapshot.forEach(doc => {
        const priceEntry = doc.data();
        const listItem = document.createElement('li');
        listItem.textContent = `${priceEntry.stock} - ${priceEntry.date}: ${priceEntry.price.toFixed(2)} TL`;
        priceList.appendChild(listItem);
    });
    updateAveragePrice();
}

priceForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const stock = document.getElementById('stock').value;
    const date = document.getElementById('date').value;
    const price = parseFloat(document.getElementById('price').value);

    console.log("Gönderilen veri:", { stock, date, price }); // Debug için

    if (!stock || !date || isNaN(price) || price <= 0) {
        alert('Lütfen tüm alanları doğru bir şekilde doldurun.');
        return;
    }

    try {
        await addDoc(collection(db, 'prices'), { stock, date, price });
        console.log("Başarıyla eklendi.");
        renderPrices();
        messageElement.textContent = "Başarıyla eklendi.";
        setTimeout(() => messageElement.textContent = '', 3000);
    } catch (error) {
        console.error("Hata eklerken: ", error);
        alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
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

// Geçmişi sıfırlama
resetButton.addEventListener('click', async function() {
    const enteredPassword = resetPassword.value;

    if (enteredPassword === correctPassword) {
        const snapshot = await getDocs(collection(db, 'prices'));
        const batch = writeBatch(db); // Batch işlemi oluştur
        snapshot.forEach(doc => {
            batch.delete(doc.ref); // Her dökümanı sil
        });
        await batch.commit(); // Tüm silme işlemlerini uygula
        renderPrices();
        alert('Geçmiş sıfırlandı.');
        resetPassword.value = '';
    } else {
        alert('Yanlış şifre. Lütfen tekrar deneyin.');
    }
});

// Ortalama fiyat güncelleme
async function updateAveragePrice() {
    const snapshot = await getDocs(collection(db, 'prices'));
    const prices = snapshot.docs.map(doc => doc.data().price);
    const total = prices.reduce((sum, price) => sum + price, 0);
    const average = prices.length ? total / prices.length : 0;
    averagePriceElement.textContent = average.toFixed(2);
}










