// Platform-specific module exports
// This file allows TypeScript to resolve the module correctly
// Metro bundler will automatically resolve to .ios.ts or .android.ts at build time

import { type EventSubscription } from 'expo-modules-core';
import { ReactNativePushkitModuleEvents } from './ReactNativePushkit.types';

// For TypeScript: Export the type so index.ts can import from here
// At runtime, Metro bundler will resolve to the platform-specific file
type ReactNativePushkitModuleType = {
  addListener<EventName extends keyof ReactNativePushkitModuleEvents>(
    eventName: EventName,
    listener: ReactNativePushkitModuleEvents[EventName]
  ): EventSubscription;
};

// Import the platform-specific module
// Metro bundler will automatically resolve this to .ios.ts or .android.ts
// We use a dynamic import approach that TypeScript can understand
import ReactNativePushkitModuleIOS from './ReactNativePushkitModule.ios';
import ReactNativePushkitModuleAndroid from './ReactNativePushkitModule.android';

import { Platform } from 'react-native';

const ReactNativePushkitModule: ReactNativePushkitModuleType = Platform.OS === 'ios' 
  ? ReactNativePushkitModuleIOS 
  : ReactNativePushkitModuleAndroid;

export default ReactNativePushkitModule;

