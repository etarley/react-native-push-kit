package expo.modules.reactnativepushmodule

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

class ReactNativePushkitModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ReactnativepushModule')` in JavaScript.
    Name("ReactNativePushkit")

    // Defines constant property on the module.
    // Defines event names that the module can send to JavaScript.
    Events("onToken", "onPayload", "onInvalidateToken", "onError")

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("register") { (types: [String]) in
      PushKitAppDelegateSubscriber.shared.register(for: types)
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    View(ReactNativePushkitView::class) {
      // Defines a setter for the `url` prop.
      Prop("url") { view: ReactNativePushkitView, url: URL ->
        view.webView.loadUrl(url.toString())
      }
      // Defines an event that the view can send to JavaScript.
      Events("onPayload")
    }
  }
}
