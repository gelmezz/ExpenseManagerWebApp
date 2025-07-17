/*
 * ESEMPIO - Come usare le funzionalità native iOS nella tua web app
 * Aggiungi questo codice al tuo script.js esistente
 */

// Funzione per verificare se siamo in ambiente iOS nativo
function isRunningInIOSApp() {
    return typeof window.webkit !== 'undefined' && 
           typeof window.webkit.messageHandlers !== 'undefined' &&
           typeof window.webkit.messageHandlers.iosHandler !== 'undefined';
}

// Funzione per mostrare alert nativo iOS (migliore di alert() del browser)
function showNativeAlert(title, message) {
    if (isRunningInIOSApp()) {
        window.iOSInterface.showAlert(title, message);
    } else {
        // Fallback per browser web
        alert(title + '\n\n' + message);
    }
}

// Funzione per vibrazione tattile (funziona solo su iOS)
function vibrateDevice() {
    if (isRunningInIOSApp()) {
        window.webkit.messageHandlers.iosHandler.postMessage({
            action: 'vibrate'
        });
    } else {
        console.log('Vibrazione non supportata nel browser');
    }
}

// Funzione per aprire la fotocamera nativa
function openNativeCamera() {
    if (isRunningInIOSApp()) {
        window.iOSInterface.openCamera();
    } else {
        // Fallback per browser: apri file picker per immagini
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'camera';
        input.click();
    }
}

// Funzione per aprire la galleria
function openNativeGallery() {
    if (isRunningInIOSApp()) {
        window.iOSInterface.openGallery();
    } else {
        // Fallback per browser
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.click();
    }
}

// Funzione per condividere contenuto con il sistema iOS
function shareContent(text) {
    if (isRunningInIOSApp()) {
        window.webkit.messageHandlers.iosHandler.postMessage({
            action: 'shareContent',
            content: text
        });
    } else {
        // Fallback per browser
        if (navigator.share) {
            navigator.share({
                title: 'Gestione Spese',
                text: text
            });
        } else {
            // Copia negli appunti
            navigator.clipboard.writeText(text);
            alert('Contenuto copiato negli appunti!');
        }
    }
}

// Funzione per salvare dati usando il sistema nativo iOS (più sicuro)
function saveDataNative(key, data) {
    if (isRunningInIOSApp()) {
        window.iOSInterface.saveData(key, data);
    } else {
        // Fallback per browser
        localStorage.setItem(key, JSON.stringify(data));
    }
}

// Funzione per caricare dati dal sistema nativo iOS
function loadDataNative(key) {
    if (isRunningInIOSApp()) {
        window.iOSInterface.loadData(key);
    } else {
        // Fallback per browser
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
}

// Callback per quando un'immagine viene selezionata (chiamata da iOS)
window.onImageSelected = function(base64ImageData) {
    console.log('📸 Immagine ricevuta da iOS');
    
    // Qui puoi usare l'immagine nella tua app
    // base64ImageData è nel formato: "data:image/jpeg;base64,..."
    
    // Esempio: mostra l'immagine in un elemento img
    const img = document.createElement('img');
    img.src = base64ImageData;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    
    // Aggiungi l'immagine dove vuoi (esempio)
    // document.getElementById('receipt-container').appendChild(img);
    
    // Oppure salva l'immagine nei dati della spesa
    // currentExpense.receiptImage = base64ImageData;
};

// Callback per quando l'utente annulla la selezione immagine
window.onImageCanceled = function() {
    console.log('📸 Selezione immagine annullata');
    showNativeAlert('Info', 'Selezione immagine annullata');
};

// Callback per quando i dati vengono salvati con successo
window.onDataSaved = function(key) {
    console.log('💾 Dati salvati:', key);
    vibrateDevice(); // Feedback tattile di conferma
};

// Callback per quando i dati vengono caricati
window.onDataLoaded = function(key, data) {
    console.log('📖 Dati caricati:', key, data);
    
    // Processa i dati caricati
    try {
        const parsedData = JSON.parse(data);
        // Usa i dati nella tua app
    } catch (e) {
        console.error('Errore nel parsing dei dati:', e);
    }
};

// ESEMPI DI USO NELLA TUA APP DI GESTIONE SPESE:

// 1. Quando l'utente aggiunge una nuova spesa con ricevuta
function addExpenseWithReceipt() {
    showNativeAlert('Aggiungi Ricevuta', 'Vuoi fotografare la ricevuta?');
    
    // Mostra opzioni per camera o galleria
    const cameraBtn = document.getElementById('camera-button');
    const galleryBtn = document.getElementById('gallery-button');
    
    if (cameraBtn) {
        cameraBtn.onclick = () => {
            openNativeCamera();
            vibrateDevice(); // Feedback tattile
        };
    }
    
    if (galleryBtn) {
        galleryBtn.onclick = () => {
            openNativeGallery();
            vibrateDevice(); // Feedback tattile
        };
    }
}

// 2. Quando l'utente salva una spesa
function saveExpense(expenseData) {
    // Salva usando il sistema nativo iOS per maggiore sicurezza
    saveDataNative('expenses', expenseData);
    
    // Mostra conferma nativa
    showNativeAlert('Successo', 'Spesa salvata correttamente!');
    
    // Feedback tattile
    vibrateDevice();
}

// 3. Quando l'utente vuole condividere un resoconto
function shareExpenseReport(reportText) {
    shareContent(reportText);
}

// 4. Inizializzazione app - carica dati salvati
function initializeApp() {
    if (isRunningInIOSApp()) {
        console.log('✅ App in esecuzione su iOS nativo');
        
        // Carica i dati delle spese salvate
        loadDataNative('expenses');
        
        // Configura l'interfaccia per iOS
        document.body.classList.add('ios-native');
        
        // Nascondi elementi non necessari su app nativa
        const webOnlyElements = document.querySelectorAll('.web-only');
        webOnlyElements.forEach(el => el.style.display = 'none');
        
    } else {
        console.log('📱 App in esecuzione nel browser web');
        document.body.classList.add('web-browser');
    }
}

// Avvia l'inizializzazione quando il DOM è pronto
document.addEventListener('DOMContentLoaded', initializeApp);

/*
 * STILI CSS AGGIUNTIVI PER L'APP iOS
 * Aggiungi questi stili al tuo style.css
 */
const iosStyles = `
    /* Stili specifici per l'app iOS nativa */
    .ios-native {
        /* Rimuovi padding top per status bar */
        padding-top: env(safe-area-inset-top);
        padding-bottom: env(safe-area-inset-bottom);
    }
    
    .ios-native .header {
        /* Adatta header per safe area */
        padding-top: calc(20px + env(safe-area-inset-top));
    }
    
    /* Migliora l'aspetto dei bottoni per touch */
    .ios-native button {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
    }
    
    /* Nascondi elementi specifici del web */
    .ios-native .web-only {
        display: none !important;
    }
    
    /* Mostra elementi specifici dell'app nativa */
    .web-browser .native-only {
        display: none !important;
    }
`;

// Inietta gli stili iOS se necessario
if (isRunningInIOSApp()) {
    const style = document.createElement('style');
    style.textContent = iosStyles;
    document.head.appendChild(style);
}