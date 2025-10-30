import { NativeModule, requireNativeModule } from 'expo';
import { PushType, ReactNativePushkitModuleEvents } from './ReactNativePushkit.types';

// This is the raw native module interface. It's used internally by the library.
declare class ReactNativePushkitModule extends NativeModule<ReactNativePushkitModuleEvents> {
    register(types: PushType[]): Promise<void>;
}

export default requireNativeModule<ReactNativePushkitModule>('ReactNativePushkit');