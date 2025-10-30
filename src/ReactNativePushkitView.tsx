import { requireNativeView } from 'expo';
import * as React from 'react';

import { ReactNativePushkitViewProps } from './ReactNativePushkit.types';

const NativeView: React.ComponentType<ReactNativePushkitViewProps> =
  requireNativeView('ReactNativePushkit');

export default function ReactNativePushkitView(props: ReactNativePushkitViewProps) {
  return <NativeView {...props} />;
}
