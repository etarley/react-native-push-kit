import { NativeModule, requireNativeModule } from 'expo';

import { ReactNativePushkitModuleEvents } from './ReactNativePushkit.types';

declare class ReactNativePushkitModule extends NativeModule<ReactNativePushkitModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativePushkitModule>('ReactNativePushkit');
