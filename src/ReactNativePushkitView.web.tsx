import * as React from 'react';

import { ReactNativePushkitViewProps } from './ReactNativePushkit.types';

export default function ReactNativePushkitView(props: ReactNativePushkitViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
