import { type EventSubscription } from 'expo-modules-core';
import ReactNativePushkitModule from './ReactNativePushkitModule';
import {
  type PayloadPayload,
  type TokenPayload,
  type InvalidateTokenPayload,
  type ErrorPayload, // <-- Import this
} from './ReactNativePushkit.types';

/**
 * Adds a listener that will be called when a new PushKit token is registered.
 * @param listener A function that receives an event with the token.
 * @returns A subscription object that you can use to remove the listener.
 */
export function addTokenListener(listener: (event: TokenPayload) => void): EventSubscription {
  return ReactNativePushkitModule.addListener('onToken', listener);
}

/**
 * Adds a listener that will be called when a new PushKit payload is received.
 * @param listener A function that receives an event with the payload.
 * @returns A subscription object that you can use to remove the listener.
 */
export function addPayloadListener(listener: (event: PayloadPayload) => void): EventSubscription {
  return ReactNativePushkitModule.addListener('onPayload', listener);
}

/**
 * Adds a listener that will be called when the PushKit token is invalidated by the system.
 * @param listener A function that receives an event with the type of the invalidated push.
 * @returns A subscription object that you can use to remove the listener.
 */
export function addInvalidateTokenListener(
  listener: (event: InvalidateTokenPayload) => void
): EventSubscription {
  return ReactNativePushkitModule.addListener('onInvalidateToken', listener);
}

// --- ADD THIS NEW FUNCTION ---
/**
 * Adds a listener that will be called if PushKit fails to register.
 * @param listener A function that receives an event with an error message.
 * @returns A subscription object that you can use to remove the listener.
 */
export function addErrorListener(listener: (event: ErrorPayload) => void): EventSubscription {
  return ReactNativePushkitModule.addListener('onError', listener);
}

// Re-export all the types.
export * from './ReactNativePushkit.types';