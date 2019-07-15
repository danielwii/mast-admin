import { AppContext } from '@asuna-admin/core';
import { createLogger } from '@asuna-admin/logger';
import { appActions } from '@asuna-admin/store';

import { connect, Socket } from 'socket.io-client';

// --------------------------------------------------------------
// Main
// --------------------------------------------------------------

const logger = createLogger('adapters:ws');

export class WsAdapter {
  private port?: number;
  private namespace: string;

  private static io: typeof Socket;

  constructor(opts: { port?: number; namespace?: string } = {}) {
    this.port = opts.port;
    this.namespace = opts.namespace || 'admin';

    if (!AppContext.isServer && !WsAdapter.io) {
      WsAdapter.io = connect(
        '/admin',
        { secure: true, reconnectionDelay: 10e3, reconnectionDelayMax: 60e3 },
      );

      WsAdapter.io.on('connect', () => {
        logger.log('[connect]', { id: WsAdapter.io.id, AppContext });
        AppContext.dispatch(appActions.heartbeat());
      });
      WsAdapter.io.on('reconnect', () => {
        logger.log('[reconnect]', { id: WsAdapter.io.id, AppContext });
        AppContext.dispatch(appActions.heartbeat());
      });
      WsAdapter.io.on('disconnect', () => {
        const { heartbeat } = AppContext.store.select(state => state.app);
        logger.error('[disconnect]', { id: WsAdapter.io.id, heartbeat });
        if (heartbeat) {
          AppContext.dispatch(appActions.heartbeatStop());
        }
      });
      WsAdapter.io.on('error', error => {
        const { heartbeat } = AppContext.store.select(state => state.app);
        logger.error('[error]', { id: WsAdapter.io.id, heartbeat, error });
        if (heartbeat) {
          AppContext.dispatch(appActions.heartbeatStop());
        }
      });
    }
  }
}
