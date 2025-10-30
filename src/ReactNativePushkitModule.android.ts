import { NativeModule, requireNativeModule } from 'expo';
import { ReactNativePushkitModuleEvents } from './ReactNativePushkit.types';

// This is the raw native module interface. It's used internally by the library.
// Note: PushKit is iOS-only, so this Android module is a no-op stub to prevent Android apps from breaking.
declare class ReactNativePushkitModule extends NativeModule<ReactNativePushkitModuleEvents> {}

export default requireNativeModule<ReactNativePushkitModule>('ReactNativePushkit');

