# Setup Progetto iOS - Gestione Spese App

## Requisiti
- Mac con Xcode installato
- Account Apple Developer (gratuito per test 7 giorni, $99/anno per uso prolungato)
- iPhone per testing

## Passo 1: Creare il Progetto Xcode

1. Apri Xcode
2. "Create a new Xcode project"
3. Seleziona "iOS" → "App"
4. Configura:
   - **Product Name**: `GestioneSpese`
   - **Bundle Identifier**: `com.tuonome.gestionespese`
   - **Language**: Swift
   - **Interface**: Storyboard
   - **Use Core Data**: No

## Passo 2: Struttura File

Dopo aver creato il progetto, aggiungi questi file:

### File Swift da creare:
- `ViewController.swift` (principale)
- `WebViewBridge.swift` (comunicazione JS-Swift)
- `AppDelegate.swift` (già esistente, da modificare)

### Cartella WebApp:
- Crea cartella "WebApp" nel progetto
- Aggiungi tutti i file della tua web app:
  - `index.html`
  - `style.css`
  - `script.js`
  - `manifest.json`
  - `service-worker.js`
  - Le icone PNG

## Passo 3: Configurazione Info.plist

Aggiungi queste chiavi nel file `Info.plist`:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
<key>NSCameraUsageDescription</key>
<string>L'app ha bisogno della fotocamera per scannerizzare ricevute</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>L'app ha bisogno di accedere alle foto per allegare ricevute</string>
```

## Passo 4: File da sostituire/creare

I file Swift verranno creati nei prossimi step con tutto il codice necessario.

## Passo 5: Build e Test

1. Collega iPhone al Mac
2. Seleziona il tuo iPhone come target
3. Premi "Run" (▶️) in Xcode
4. Autorizza l'app sul telefono: Impostazioni → Generali → Gestione dispositivi

## Caratteristiche che avrà l'app:

✅ **App nativa iOS completa**
✅ **Tutta la funzionalità della web app**
✅ **Possibilità di aggiungere funzioni native future**
✅ **Icona sulla home screen**
✅ **Funziona offline (se configurato)**
✅ **Accesso a fotocamera/galleria (configurabile)**

## Prossimi passi:
Ora ti creo tutti i file Swift necessari!