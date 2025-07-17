import UIKit

@available(iOS 13.0, *)
class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        
        // Configura la finestra principale
        window = UIWindow(windowScene: windowScene)
        
        // Crea e configura il ViewController principale
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        let viewController = storyboard.instantiateInitialViewController() as! ViewController
        
        // Imposta il root view controller
        window?.rootViewController = viewController
        window?.makeKeyAndVisible()
        
        print("✅ Scene configurata correttamente")
    }

    func sceneDidDisconnect(_ scene: UIScene) {
        // Scene disconnessa
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        // Scene attiva
        print("📱 Scene attiva")
    }

    func sceneWillResignActive(_ scene: UIScene) {
        // Scene sta per diventare inattiva
    }

    func sceneWillEnterForeground(_ scene: UIScene) {
        // Scene sta per entrare in foreground
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
        // Scene entrata in background
        UserDefaults.standard.synchronize()
        print("📱 Scene in background - dati salvati")
    }
}