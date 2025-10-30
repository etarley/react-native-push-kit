export type TokenPayload = {
  /**
   * The hexadecimal string representation of the PushKit token.
   */
  token: string;
};

export type PayloadPayload = {
  /**
   * The dictionary payload received from the PushKit notification.
   */
  payload: Record<string, any>;
};

export type InvalidateTokenPayload = {
  /**
   * The type of push that was invalidated (e.g., 'voip').
   */
  type: string;
};

// --- ADD THIS NEW TYPE ---
export type ErrorPayload = {
  /**
   * A string describing the registration error.
   */
  error: string;
};

export type PushType = 'voip' | 'fileProvider';

/**
 * Defines the events that the native module can emit.
 */
export type ReactNativePushkitModuleEvents = {
  onToken: (event: TokenPayload) => void;
  onPayload: (event: PayloadPayload) => void;
  onInvalidateToken: (event: InvalidateTokenPayload) => void;
  onError: (event: ErrorPayload) => void; // <-- Add this
};