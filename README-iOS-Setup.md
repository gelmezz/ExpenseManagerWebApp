# 🍎 Trasformare la Web App in App iOS Nativa

## Guida completa per creare l'app iOS "Gestione Spese"

### 📋 Prerequisiti
- Mac con macOS Big Sur 11.0 o superiore
- Xcode 12.0 o superiore (scaricabile dall'App Store)
- iPhone per testing
- Account Apple ID (gratuito per sviluppo)

---

## 🚀 STEP 1: Creare il Progetto Xcode

### 1.1 Aprire Xcode
- Lancia Xcode dal LaunchPad o Applicazioni
- Clicca "Create a new Xcode project"

### 1.2 Configurare il Progetto
1. Seleziona **iOS** nella barra superiore
2. Scegli **App** 
3. Clicca **Next**

4. Compila i campi:
   - **Product Name**: `GestioneSpese`
   - **Team**: Seleziona il tuo team (account Apple)
   - **Organization Identifier**: `com.tuonome.gestionespese`
   - **Bundle Identifier**: (si autocompila)
   - **Language**: **Swift**
   - **Interface**: **Storyboard**
   - **Use Core Data**: ❌ (non selezionare)

5. Clicca **Next** e scegli dove salvare il progetto

---

## 📁 STEP 2: Aggiungere i File al Progetto

### 2.1 Creare la Cartella WebApp
1. Nel navigatore di Xcode (pannello sinistro), clicca destro sul nome progetto
2. Seleziona **New Group**
3. Rinomina il gruppo in **WebApp**

### 2.2 Aggiungere i File della Web App
1. Trascina tutti i file della tua web app nella cartella WebApp:
   - `index.html`
   - `style.css`
   - `script.js`
   - `manifest.json`
   - `service-worker.js`
   - `icon-192x192.png`
   - `icon-512x512.png`

2. Quando appare la finestra di dialogo:
   - ✅ **Copy items if needed**
   - ✅ **Create groups**
   - ✅ **Add to target: GestioneSpese**

### 2.3 Sostituire i File Swift
1. Cancella i file esistenti:
   - `ViewController.swift`
   - `AppDelegate.swift`
   
2. Aggiungi i nuovi file Swift creati:
   - `ViewController.swift`
   - `WebViewBridge.swift`
   - `AppDelegate.swift`
   - `SceneDelegate.swift`

3. Sostituisci i file di configurazione:
   - `Info.plist`
   - `Main.storyboard`
   - `LaunchScreen.storyboard`

---

## ⚙️ STEP 3: Configurazione del Progetto

### 3.1 Impostazioni Generali
1. Seleziona il progetto nel navigatore
2. Vai alla tab **General**
3. Verifica:
   - **Deployment Target**: iOS 13.0 o superiore
   - **Device Orientation**: Portrait (gli altri opzionali)

### 3.2 Configurazione Signing
1. Nella sezione **Signing & Capabilities**:
   - ✅ **Automatically manage signing**
   - **Team**: Seleziona il tuo account Apple
   - **Bundle Identifier**: `com.tuonome.gestionespese`

### 3.3 Aggiungere Capabilities (se necessario)
- **Camera**: Per accesso fotocamera
- **Photo Library**: Per accesso galleria
- **Background App Refresh**: Per aggiornamenti in background

---

## 📱 STEP 4: Preparare l'iPhone

### 4.1 Abilitare Modalità Sviluppatore
1. Su iPhone: **Impostazioni** → **Generali** → **Info**
2. Tocca **Numero build** 7 volte
3. Apparirà "Ora sei uno sviluppatore!"

### 4.2 Autorizzare il Mac
1. Collega iPhone al Mac con cavo USB
2. Su iPhone: tocca **Autorizza** quando richiesto
3. Su Mac: apparirà l'iPhone in Xcode

---

## 🔨 STEP 5: Compilazione e Installazione

### 5.1 Selezionare il Target
1. In Xcode, nel menu a tendina accanto al pulsante ▶️
2. Seleziona il tuo iPhone (non "Simulator")

### 5.2 Compilare l'App
1. Premi **Cmd+B** o clicca il pulsante **Build**
2. Attendi la compilazione (prima volta può richiedere qualche minuto)

### 5.3 Installare sull'iPhone
1. Premi **Cmd+R** o clicca **▶️ Run**
2. L'app verrà installata automaticamente sull'iPhone

### 5.4 Autorizzare l'App sull'iPhone
1. Su iPhone: **Impostazioni** → **Generali** → **Gestione dispositivi**
2. Tocca il tuo account Apple
3. Tocca **Autorizza "GestioneSpese"**
4. Conferma con **Autorizza**

---

## ✅ STEP 6: Testare l'App

### 6.1 Avviare l'App
1. Cerca "Gestione Spese" nella home screen dell'iPhone
2. Tocca l'icona per avviare l'app
3. L'app dovrebbe caricare la tua web app perfettamente!

### 6.2 Testare le Funzioni Native
- **Alert nativi**: Prova i popup
- **Fotocamera**: Testa l'accesso alla camera
- **Galleria**: Prova la selezione immagini
- **Vibrazione**: Testa il feedback tattile

---

## 🔄 STEP 7: Aggiornamenti e Reinstallazione

### Ogni 7 giorni (Account gratuito):
1. Ricollegare iPhone al Mac
2. Aprire il progetto in Xcode
3. Premere **▶️ Run** per reinstallare
4. **IMPORTANTE**: I dati dell'app verranno persi ad ogni reinstallazione

### Con Apple Developer Account ($99/anno):
- L'app funziona per 1 anno senza reinstallazione
- I dati vengono mantenuti
- Possibilità di distribuire a più dispositivi

---

## 🎨 STEP 8: Personalizzazione Icona App

### 8.1 Preparare le Icone
Crea icone nelle seguenti dimensioni:
- 1024x1024 (App Store)
- 180x180 (iPhone @3x)
- 120x120 (iPhone @2x)

### 8.2 Aggiungere le Icone
1. In Xcode: **Assets.xcassets** → **AppIcon**
2. Trascina le icone negli slot corrispondenti
3. Compila e reinstalla

---

## 🔧 Risoluzione Problemi Comuni

### ❌ "No signing certificate found"
**Soluzione**: Vai a Signing & Capabilities → seleziona il tuo Team

### ❌ "Unable to install app"
**Soluzione**: 
1. Autorizza il certificato nell'iPhone
2. Verifica che l'iPhone sia autorizzato nel Mac

### ❌ "Web app non si carica"
**Soluzione**:
1. Verifica che tutti i file siano nella cartella WebApp
2. Controlla che index.html sia presente
3. Verifica i path nei file HTML

### ❌ "Device not found"
**Soluzione**:
1. Riavvia Xcode
2. Scollega e ricollega l'iPhone
3. Verifica che iTunes riconosca il dispositivo

---

## 🚀 Funzionalità Aggiuntive Disponibili

Con questo setup hai accesso a:

### ✅ Funzioni Native iOS:
- 📸 **Fotocamera integrata**
- 🖼️ **Accesso galleria**
- 📳 **Vibrazione tattile**
- 🔔 **Notifiche push** (configurazione aggiuntiva)
- 📊 **Condivisione sistema**
- 💾 **Storage sicuro UserDefaults**
- 🎨 **Interfaccia nativa**

### ✅ Funzioni Web App Mantenute:
- 📱 **Responsive design**
- 🎯 **JavaScript completo**
- 🎨 **CSS styling**
- 📈 **Chart.js per grafici**
- 💾 **LocalStorage (+ UserDefaults)**

---

## 📚 File di Esempio

Nel progetto troverai:
- `ios-bridge-example.js` - Esempi di integrazione iOS
- Tutti i file Swift necessari
- Configurazioni complete

---

## 🔐 Note sulla Sicurezza

### Account Gratuito (7 giorni):
- ⚠️ Dati persi ad ogni reinstallazione
- ✅ Ideale per test e sviluppo

### Apple Developer Account ($99/anno):
- ✅ Dati persistenti per 1 anno
- ✅ Distribuzione a team/famiglia
- ✅ Accesso a tutte le API avanzate

---

## 📞 Supporto

Se incontri problemi:
1. Controlla la console Xcode per errori
2. Verifica che tutti i file siano correttamente aggiunti
3. Assicurati che l'iPhone sia autorizzato
4. Riavvia Xcode se necessario

**La tua app "Gestione Spese" è ora pronta per iOS! 🎉**