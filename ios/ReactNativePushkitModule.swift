import ExpoModulesCore

public class ReactNativePushkitModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ReactNativePushkit")

    // Define the events that can be sent to JavaScript.
    Events("onToken", "onPayload", "onInvalidateToken", "onError") // <-- Add "onError"

    // This is called when the first JavaScript listener is added.
    // We'll start observing our internal notifications here.
    OnStartObserving {
      NotificationCenter.default.addObserver(self, selector: #selector(self.onNewToken), name: pushKitTokenNotification, object: nil)
      NotificationCenter.default.addObserver(self, selector: #selector(self.onNewPayload), name: pushKitPayloadNotification, object: nil)
      NotificationCenter.default.addObserver(self, selector: #selector(self.onInvalidateToken), name: pushKitInvalidateTokenNotification, object: nil)
      NotificationCenter.default.addObserver(self, selector: #selector(self.onRegistrationError), name: pushKitErrorNotification, object: nil) // <-- Add this observer
    }

    // This is called when the last JavaScript listener is removed.
    // We'll stop observing here to prevent memory leaks.
    OnStopObserving {
      NotificationCenter.default.removeObserver(self)
    }
  }

  // MARK: - Notification Handlers

  @objc
  private func onNewToken(notification: Notification) {
    guard let userInfo = notification.userInfo, let token = userInfo["token"] else {
      return
    }
    // Send the 'onToken' event to JavaScript.
    self.sendEvent("onToken", [
      "token": token
    ])
  }
    
  @objc
  private func onNewPayload(notification: Notification) {
    guard let userInfo = notification.userInfo, let payload = userInfo["payload"] else {
      return
    }
    // Send the 'onPayload' event to JavaScript.
    self.sendEvent("onPayload", [
      "payload": payload
    ])
  }

  @objc
  private func onInvalidateToken(notification: Notification) {
    guard let userInfo = notification.userInfo, let type = userInfo["type"] else {
      return
    }
    // Send the 'onInvalidateToken' event to JavaScript.
    self.sendEvent("onInvalidateToken", [
        "type": type
    ])
  }
    
  // --- ADD THIS NEW METHOD ---
  @objc
  private func onRegistrationError(notification: Notification) {
    guard let userInfo = notification.userInfo, let error = userInfo["error"] as? String else {
      return
    }
    // Send the 'onError' event to JavaScript.
    self.sendEvent("onError", [
        "error": error
    ])
  }
}