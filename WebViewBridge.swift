import UIKit
import WebKit
import Photos
import PhotosUI

class WebViewBridge: NSObject, WKScriptMessageHandler {
    
    weak var viewController: UIViewController?
    
    // MARK: - WKScriptMessageHandler
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let messageBody = message.body as? [String: Any],
              let action = messageBody["action"] as? String else {
            print("⚠️ Messaggio non valido ricevuto da JavaScript")
            return
        }
        
        print("📱 Ricevuto comando da JavaScript: \(action)")
        
        switch action {
        case "showAlert":
            handleShowAlert(messageBody)
        case "openCamera":
            handleOpenCamera()
        case "openGallery":
            handleOpenGallery()
        case "saveData":
            handleSaveData(messageBody)
        case "loadData":
            handleLoadData(messageBody)
        case "vibrate":
            handleVibrate()
        case "shareContent":
            handleShareContent(messageBody)
        default:
            print("⚠️ Azione non riconosciuta: \(action)")
        }
    }
    
    // MARK: - Handler Methods
    
    private func handleShowAlert(_ messageBody: [String: Any]) {
        guard let title = messageBody["title"] as? String,
              let message = messageBody["message"] as? String else {
            return
        }
        
        DispatchQueue.main.async {
            let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            
            if let topController = self.getTopViewController() {
                topController.present(alert, animated: true)
            }
        }
    }
    
    private func handleVibrate() {
        DispatchQueue.main.async {
            // Vibrazione leggera per feedback tattile
            let impactGenerator = UIImpactFeedbackGenerator(style: .light)
            impactGenerator.impactOccurred()
        }
    }
    
    private func handleOpenCamera() {
        DispatchQueue.main.async {
            self.presentImagePicker(sourceType: .camera)
        }
    }
    
    private func handleOpenGallery() {
        DispatchQueue.main.async {
            self.presentImagePicker(sourceType: .photoLibrary)
        }
    }
    
    private func handleSaveData(_ messageBody: [String: Any]) {
        guard let key = messageBody["key"] as? String,
              let data = messageBody["data"] else {
            return
        }
        
        // Salva nei UserDefaults
        UserDefaults.standard.set(data, forKey: key)
        UserDefaults.standard.synchronize()
        
        print("💾 Dati salvati con chiave: \(key)")
        
        // Conferma al JavaScript
        executeJavaScript("if(window.onDataSaved) { window.onDataSaved('\(key)'); }")
    }
    
    private func handleLoadData(_ messageBody: [String: Any]) {
        guard let key = messageBody["key"] as? String else {
            return
        }
        
        let data = UserDefaults.standard.object(forKey: key)
        
        print("📖 Caricati dati con chiave: \(key)")
        
        // Invia i dati al JavaScript
        if let jsonData = try? JSONSerialization.data(withJSONObject: data ?? NSNull()),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            let escapedString = jsonString.replacingOccurrences(of: "'", with: "\\'")
            executeJavaScript("if(window.onDataLoaded) { window.onDataLoaded('\(key)', '\(escapedString)'); }")
        }
    }
    
    private func handleShareContent(_ messageBody: [String: Any]) {
        guard let content = messageBody["content"] as? String else {
            return
        }
        
        DispatchQueue.main.async {
            let activityController = UIActivityViewController(
                activityItems: [content],
                applicationActivities: nil
            )
            
            if let topController = self.getTopViewController() {
                // Per iPad - necessario specificare il popover
                if let popover = activityController.popoverPresentationController {
                    popover.sourceView = topController.view
                    popover.sourceRect = CGRect(x: topController.view.bounds.midX, y: topController.view.bounds.midY, width: 0, height: 0)
                    popover.permittedArrowDirections = []
                }
                
                topController.present(activityController, animated: true)
            }
        }
    }
    
    // MARK: - Image Picker
    
    private func presentImagePicker(sourceType: UIImagePickerController.SourceType) {
        guard UIImagePickerController.isSourceTypeAvailable(sourceType) else {
            showAlert(title: "Non Disponibile", message: "Questa funzionalità non è disponibile su questo dispositivo.")
            return
        }
        
        let imagePicker = UIImagePickerController()
        imagePicker.sourceType = sourceType
        imagePicker.delegate = self
        imagePicker.allowsEditing = true
        
        if let topController = getTopViewController() {
            topController.present(imagePicker, animated: true)
        }
    }
    
    // MARK: - Utility Methods
    
    private func getTopViewController() -> UIViewController? {
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let window = windowScene.windows.first {
            return window.rootViewController?.topMostViewController()
        }
        return nil
    }
    
    private func executeJavaScript(_ script: String) {
        if let webView = getTopViewController()?.view.subviews.first(where: { $0 is WKWebView }) as? WKWebView {
            webView.evaluateJavaScript(script) { (result, error) in
                if let error = error {
                    print("⚠️ Errore nell'esecuzione JavaScript: \(error)")
                }
            }
        }
    }
    
    private func showAlert(title: String, message: String) {
        DispatchQueue.main.async {
            let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            
            if let topController = self.getTopViewController() {
                topController.present(alert, animated: true)
            }
        }
    }
}

// MARK: - UIImagePickerControllerDelegate

extension WebViewBridge: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        picker.dismiss(animated: true)
        
        guard let image = info[.editedImage] as? UIImage ?? info[.originalImage] as? UIImage else {
            return
        }
        
        // Converti l'immagine in base64 per inviarla al JavaScript
        if let imageData = image.jpegData(compressionQuality: 0.8) {
            let base64String = imageData.base64EncodedString()
            
            // Invia l'immagine al JavaScript
            let script = """
                if(window.onImageSelected) {
                    window.onImageSelected('data:image/jpeg;base64,\(base64String)');
                }
            """
            executeJavaScript(script)
            
            print("📸 Immagine inviata al JavaScript")
        }
    }
    
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        picker.dismiss(animated: true)
        
        // Notifica al JavaScript che l'operazione è stata annullata
        executeJavaScript("if(window.onImageCanceled) { window.onImageCanceled(); }")
    }
}

// MARK: - UIViewController Extension

extension UIViewController {
    func topMostViewController() -> UIViewController {
        if let presented = self.presentedViewController {
            return presented.topMostViewController()
        }
        
        if let navigation = self as? UINavigationController {
            return navigation.visibleViewController?.topMostViewController() ?? self
        }
        
        if let tab = self as? UITabBarController {
            return tab.selectedViewController?.topMostViewController() ?? self
        }
        
        return self
    }
}