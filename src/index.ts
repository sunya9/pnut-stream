import { createClientInstance } from 'client'
import { createAppStream } from 'appStream/createAppStream'
import { createContext, Context } from 'context'
import { deleteStreams } from 'appStream/deleteSterams'
import WebSocket from 'ws'
import debug from 'debug'
const logger = debug('pnut-stream:main')

async function init() {
  const context = createContext()
  const key = await createAppStream(context)()
  return {
    context,
    key,
  }
}

async function main() {
  const { context, key } = await init()
  for (;;) {
    const { ws, connection } = createClientInstance(context)(key)
    try {
      const removeListeners = setProcessEventListeners(context, ws)
      await connection
      removeListeners()
      logger('closed, reconnecting...')
    } catch (e) {
      logger('terminated:', e)
      break
    }
  }
}

function setProcessEventListeners(context: Context, ws: WebSocket) {
  const shutdown = async () => {
    logger('graceful shutdown...')
    await tearDown(context, ws)()
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
  return () => {
    process.off('SIGINT', shutdown)
    process.off('SIGTERM', shutdown)
  }
}

function tearDown(context: Context, ws: WebSocket) {
  return async () => {
    ws.close()
    await deleteStreams(context)()
  }
}

try {
  main()
} catch (e) {
  logger('catch error', e)
}
