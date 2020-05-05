import { Context } from 'src/context'
import { deleteStreams } from 'src/appStream/deleteSterams'
import WebSocket from 'ws'

export function tearDown(context: Context, ws: WebSocket) {
  return async () => {
    ws.close()
    await deleteStreams(context)()
  }
}
