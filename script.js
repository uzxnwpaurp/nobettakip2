// Firebase SDK'larını içe aktar
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const pricesRef = collection(db, 'prices');

const priceForm = document.getElementById('priceForm');
const priceList = document.getElementById('priceList');
const averagePriceElement = document.getElementById('averagePrice');
const resetButton = document.getElementById('resetButton');
const resetPassword = document.getElementById('resetPassword');
const messageElement = document.getElementById('message');

const correctPassword = '79066540';

// Sayfa yüklendiğinde fiyatları göster
renderPrices();

function renderPrices() {
    priceList.innerHTML = '';
    getDocs(pricesRef).then(snapshot => {
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
    const date = document.getElementById('date').value; // Tarih artık dd/mm/yyyy formatında
    const price = parseFloat(document.getElementById('price').value);

    // Tarih formatı kontrolü
    const dateParts = date.split('/');
    if (dateParts.length !== 3 || 
        isNaN(dateParts[0]) || isNaN(dateParts[1]) || isNaN(dateParts[2]) ||
        dateParts[0] < 1 || dateParts[0] > 31 ||
        dateParts[1] < 1 || dateParts[1] > 12) {
        alert('Lütfen geçerli bir tarih girin (gg/aa/yyyy).');
        return;
    }

    if (isNaN(price) || price <= 0) {
        alert('Lütfen geçerli bir fiyat girin.');
        return;
    }

    const priceEntry = { stock, date, price };

    addDoc(pricesRef, priceEntry).then(() => {
        renderPrices();
        messageElement.textContent = "Başarıyla eklendi.";
        setTimeout(() => messageElement.textContent = '', 3000);
    }).catch(error => {
        console.error("Hata eklerken: ", error);
        alert("Bir hata oluştu, lütfen tekrar deneyin.");
    });
});

// Tarih alanına otomatik / ekleme
const dateInput = document.getElementById('date');
dateInput.addEventListener('input', function(event) {
    let value = dateInput.value.replace(/[^0-9]/g, ''); // Sadece rakamları al
    if (value.length >= 2) {
        value = value.slice(0, 2) + 





