import { EventSubscription } from 'expo-modules-core';
import { PushType, ReactNativePushkitModuleEvents } from './ReactNativePushkit.types';

// PushKit is an iOS-only feature. This is a no-op stub for Android
// to prevent the app from crashing. It provides the same interface
// as the iOS module, but the methods do nothing except log a warning.

const mockModule = {
  register(types: PushType[]): Promise<void> {
    console.warn('PushKit is not supported on Android. The `register` method is a no-op.');
    return Promise.resolve();
  },

  addListener<EventName extends keyof ReactNativePushkitModuleEvents>(
    eventName: EventName,
    listener: ReactNativePushkitModuleEvents[EventName]
  ): EventSubscription {
    console.warn(`PushKit is not supported on Android. Listeners for '${eventName}' will not be called.`);
    return {
      remove: () => {},
    };
  },
};

export default mockModule;
