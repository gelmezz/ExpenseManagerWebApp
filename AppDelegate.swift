import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // Configurazioni iniziali dell'app
        setupAppearance()
        
        // Abilita il background refresh se necessario
        application.setMinimumBackgroundFetchInterval(UIApplication.backgroundFetchIntervalMinimum)
        
        print("✅ Gestione Spese App inizializzata correttamente")
        
        return true
    }
    
    private func setupAppearance() {
        // Configura l'aspetto generale dell'app
        
        // Status bar style
        if #available(iOS 13.0, *) {
            // La configurazione della status bar è gestita nel ViewController
        } else {
            UIApplication.shared.statusBarStyle = .default
        }
        
        // Colore di tint globale (opzionale)
        window?.tintColor = UIColor(red: 0.3, green: 0.69, blue: 0.31, alpha: 1.0) // #4CAF50
    }

    // MARK: UISceneSession Lifecycle (iOS 13+)

    @available(iOS 13.0, *)
    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    @available(iOS 13.0, *)
    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // Gestione scene scartate
    }
    
    // MARK: Background App Refresh
    
    func applicationDidEnterBackground(_ application: UIApplication) {
        // Salva i dati quando l'app va in background
        UserDefaults.standard.synchronize()
        print("📱 App entrata in background - dati salvati")
    }
    
    func applicationWillEnterForeground(_ application: UIApplication) {
        // L'app sta per tornare attiva
        print("📱 App sta per tornare attiva")
    }
    
    func applicationDidBecomeActive(_ application: UIApplication) {
        // L'app è diventata attiva
        print("📱 App è diventata attiva")
    }
    
    func applicationWillTerminate(_ application: UIApplication) {
        // L'app sta per essere terminata - salva i dati
        UserDefaults.standard.synchronize()
        print("📱 App in chiusura - dati salvati")
    }
    
    // MARK: Memory Warning
    
    func applicationDidReceiveMemoryWarning(_ application: UIApplication) {
        // Gestione warning di memoria
        print("⚠️ Warning memoria ricevuto")
    }
}