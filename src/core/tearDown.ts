import { Context } from 'context'
import { deleteStreams } from 'appStream/deleteSterams'
import WebSocket from 'ws'

export function tearDown(context: Context, ws: WebSocket) {
  return async () => {
    ws.close()
    await deleteStreams(context)()
  }
}
