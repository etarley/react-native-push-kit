import { registerWebModule, NativeModule } from 'expo';

import { ReactNativePushkitModuleEvents } from './ReactNativePushkit.types';

class ReactNativePushkitModule extends NativeModule<ReactNativePushkitModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ReactNativePushkitModule, 'ReactNativePushkitModule');
