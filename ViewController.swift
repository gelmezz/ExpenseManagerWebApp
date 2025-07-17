import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate, WKUIDelegate {
    
    @IBOutlet weak var webView: WKWebView!
    private var webViewBridge: WebViewBridge!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupWebView()
        loadWebApp()
    }
    
    private func setupWebView() {
        // Configurazione WKWebView
        let webConfiguration = WKWebViewConfiguration()
        
        // Abilita JavaScript
        webConfiguration.preferences.javaScriptEnabled = true
        
        // Aggiungi il bridge per comunicazione JS-Swift
        webViewBridge = WebViewBridge()
        webConfiguration.userContentController.add(webViewBridge, name: "iosHandler")
        
        // Crea WKWebView se non è collegata via Storyboard
        if webView == nil {
            webView = WKWebView(frame: view.bounds, configuration: webConfiguration)
            webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            view.addSubview(webView)
        } else {
            // Se esiste già, applica la configurazione
            for script in webConfiguration.userContentController.userScripts {
                webView.configuration.userContentController.addUserScript(script)
            }
            webView.configuration.userContentController.add(webViewBridge, name: "iosHandler")
        }
        
        // Imposta i delegate
        webView.navigationDelegate = self
        webView.uiDelegate = self
        
        // Abilita swipe gesture per navigazione
        webView.allowsBackForwardNavigationGestures = true
        
        // Nasconde la barra di scorrimento
        webView.scrollView.showsVerticalScrollIndicator = false
        webView.scrollView.showsHorizontalScrollIndicator = false
        
        // Impedisce il bounce quando si raggiunge il limite dello scroll
        webView.scrollView.bounces = false
        
        // Configurazioni per un'esperienza più app-like
        if #available(iOS 16.4, *) {
            webView.isInspectable = true // Per debug in sviluppo
        }
    }
    
    private func loadWebApp() {
        guard let htmlPath = Bundle.main.path(forResource: "index", ofType: "html", inDirectory: "WebApp"),
              let htmlURL = URL(string: "file://\(htmlPath)") else {
            print("❌ Errore: impossibile trovare index.html nella cartella WebApp")
            showErrorAlert()
            return
        }
        
        // Carica la web app locale
        let request = URLRequest(url: htmlURL)
        webView.load(request)
        
        print("✅ Caricamento web app da: \(htmlPath)")
    }
    
    private func showErrorAlert() {
        let alert = UIAlertController(
            title: "Errore di Caricamento",
            message: "Impossibile caricare l'app. Assicurati che tutti i file della web app siano stati aggiunti al progetto nella cartella 'WebApp'.",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
    
    // MARK: - WKNavigationDelegate
    
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        print("🔄 Iniziato caricamento web app...")
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("✅ Web app caricata con successo!")
        
        // Inietta JavaScript per migliorare l'esperienza mobile
        let jsCode = """
            // Previeni il comportamento di selezione del testo
            document.body.style.webkitUserSelect = 'none';
            document.body.style.webkitTouchCallout = 'none';
            
            // Previeni il zoom con doppio tap
            document.addEventListener('gesturestart', function (e) {
                e.preventDefault();
            });
            
            // Aggiungi funzioni per comunicare con iOS
            window.iOSInterface = {
                // Funzione per mostrare alert nativo
                showAlert: function(title, message) {
                    window.webkit.messageHandlers.iosHandler.postMessage({
                        action: 'showAlert',
                        title: title,
                        message: message
                    });
                },
                
                // Funzione per accedere alla fotocamera
                openCamera: function() {
                    window.webkit.messageHandlers.iosHandler.postMessage({
                        action: 'openCamera'
                    });
                },
                
                // Funzione per aprire la galleria
                openGallery: function() {
                    window.webkit.messageHandlers.iosHandler.postMessage({
                        action: 'openGallery'
                    });
                },
                
                // Funzione per salvare dati localmente
                saveData: function(key, data) {
                    window.webkit.messageHandlers.iosHandler.postMessage({
                        action: 'saveData',
                        key: key,
                        data: data
                    });
                },
                
                // Funzione per leggere dati locali
                loadData: function(key) {
                    window.webkit.messageHandlers.iosHandler.postMessage({
                        action: 'loadData',
                        key: key
                    });
                }
            };
            
            console.log('✅ iOS Interface configurata correttamente');
        """
        
        webView.evaluateJavaScript(jsCode) { (result, error) in
            if let error = error {
                print("⚠️ Errore nell'iniezione JavaScript: \(error)")
            } else {
                print("✅ JavaScript iOS bridge configurato")
            }
        }
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("❌ Errore nel caricamento: \(error.localizedDescription)")
        showErrorAlert()
    }
    
    // MARK: - Status Bar
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .default
    }
}

// MARK: - Extensions per funzionalità aggiuntive

extension ViewController {
    
    // Nasconde la status bar se necessario
    override var prefersStatusBarHidden: Bool {
        return false // Cambia in true se vuoi nascondere la status bar
    }
    
    // Supporta solo orientamento portrait (cambia se necessario)
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return .portrait
    }
}