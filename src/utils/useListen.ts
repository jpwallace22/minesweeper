import { EventCallback, EventName, listen } from '@tauri-apps/api/event';
import { useEffect } from 'react';
import { useConfig } from './useConfig';

/**
 * Hook that listens for events using the Tauri API and cleans itself up
 *
 * @param {EventName} event - The name of the event to listen for.
 * @param {EventCallback<T>} handler - The callback function to be executed when the event is triggered. It receives the event data as an argument.
 * @returns {void}
 */
export const useListen = <T>(
  event: EventName,
  handler: EventCallback<T>,
  deps: unknown[] = []
): void => {
  const { isWeb } = useConfig();

  useEffect(() => {
    if (isWeb) return;
    const unListen = listen(event, handler);

    return () => {
      unListen.then(f => f());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, handler, isWeb, ...deps]);
};
