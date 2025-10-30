import ExpoModulesCore
import PushKit

// Define Notification names for communication between this subscriber and the module
internal let pushKitTokenNotification = Notification.Name("expo.modules.pushkit.token")
internal let pushKitPayloadNotification = Notification.Name("expo.modules.pushkit.payload")
internal let pushKitInvalidateTokenNotification = Notification.Name("expo.modules.pushkit.invalidate_token")
internal let pushKitErrorNotification = Notification.Name("expo.modules.pushkit.error") // <-- Add this

public class PushKitAppDelegateSubscriber: ExpoAppDelegateSubscriber, PKPushRegistryDelegate {
  private var pushRegistry: PKPushRegistry?

  public func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    // It's recommended to create the push registry on a background queue.
    let queue = DispatchQueue(label: "dev.expo.pushkit")
    pushRegistry = PKPushRegistry(queue: queue)
    pushRegistry?.delegate = self
    
    // Register for VoIP pushes. This could be made configurable in the future.
    pushRegistry?.desiredPushTypes = [.voIP]
    return true
  }

  // MARK: - PKPushRegistryDelegate

  // This delegate method is called with a new PushKit token.
  public func pushRegistry(_ registry: PKPushRegistry, didUpdate pushCredentials: PKPushCredentials, for type: PKPushType) {
    // Convert the token data to a hex string.
    let token = pushCredentials.token.map { String(format: "%02.2hhx", $0) }.joined()
    
    // Post a notification that the Expo module can listen for.
    NotificationCenter.default.post(
      name: pushKitTokenNotification,
      object: nil,
      userInfo: ["token": token, "type": type.rawValue]
    )
  }

  // This delegate method is called when a new payload is received.
  public func pushRegistry(_ registry: PKPushRegistry, didReceiveIncomingPushWith payload: PKPushPayload, for type: PKPushType, completion: @escaping () -> Void) {
    // Post a notification with the payload.
    NotificationCenter.default.post(
      name: pushKitPayloadNotification,
      object: nil,
      userInfo: ["payload": payload.dictionaryPayload, "type": type.rawValue]
    )
    
    // CRITICAL: You must call the completion handler to acknowledge receipt of the push.
    // If you don't, the system may terminate your app.
    completion()
  }

  // This delegate method is called when the token is no longer valid.
  public func pushRegistry(_ registry: PKPushRegistry, didInvalidatePushTokenFor type: PKPushType) {
     NotificationCenter.default.post(
      name: pushKitInvalidateTokenNotification,
      object: nil,
      userInfo: ["type": type.rawValue]
    )
  }
    
  // --- ADD THIS NEW METHOD ---
  // This delegate method is called when registration fails.
  public func pushRegistry(_ registry: PKPushRegistry, didFailToRegisterFor type: PKPushType, withError error: Error) {
    NotificationCenter.default.post(
        name: pushKitErrorNotification,
        object: nil,
        userInfo: ["error": error.localizedDescription, "type": type.rawValue]
    )
  }
}