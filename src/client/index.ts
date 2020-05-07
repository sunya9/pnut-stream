import WebSocket from 'ws'
import { Context } from 'src/context'
import debug from 'debug'
import {
  BroadcastMessage,
  toBroadcastMessage,
} from 'src/client/broadcastMessage'
import * as admin from 'firebase-admin'

const logger = debug('pnut-stream:client')

function getStreamUrl(appAccessToken: string, appStreamKey: string) {
  return `wss://stream.pnut.io/v0/app?access_token=${appAccessToken}&key=${appStreamKey}&include_raw=1`
}

export function createClientInstance(context: Context) {
  return (appStreamKey: string) => {
    const ws = new WebSocket(
      getStreamUrl(context.env.appAccessToken, appStreamKey)
    )
    const connection = setEventHandler(context, ws)
    return {
      ws,
      connection,
    }
  }
}
function setEventHandler(context: Context, ws: WebSocket): Promise<never> {
  ws.on('open', () => {
    logger('client socket is open')
  })
  ws.on('message', (data) => {
    handleMessage(context, data)
    logger(data)
  })

  ws.on('error', (err) => {
    logger(err)
  })
  ws.on('unexpected-response', () => {
    logger('unexpected-response')
  })

  const connection = new Promise<never>((resolve) => {
    ws.on('close', (code, reason) => {
      logger(`connection closed. code: ${code}, reason: ${reason}`)
      resolve()
    })
  })
  return connection
}

async function handleMessage(context: Context, data: WebSocket.Data) {
  const broadcastMessage = toBroadcastMessage(data)
  if (!broadcastMessage) return
  if (!broadcastMessage.targetIds.length || !broadcastMessage.message) return
  await broadcast(context)(broadcastMessage)
}

interface IDWithTokens {
  id: string
  tokens: string[]
}

interface InvalidToken {
  id: string
  token: string
}

function broadcast(context: Context) {
  return async (broadcastMessage: BroadcastMessage) => {
    const { targetIds, message } = broadcastMessage
    debug('pnut-stream:client:broadcast')(
      `target ids: ${targetIds.join(',')}; message: ${JSON.stringify(message)}`
    )

    const idWithTokensListPromises: Promise<IDWithTokens>[] = targetIds.map(
      async (id) => {
        const tokens = await context.redis.get(id)
        return {
          id,
          tokens,
        }
      }
    )
    const idWithTokensList = await Promise.all(idWithTokensListPromises)
    debug('pnut-stream:client:broadcast')(idWithTokensList)
    const { tokens, userMapping } = idWithTokensList.reduce<{
      tokens: string[]
      userMapping: string[]
    }>(
      (res, idWithTokens) => {
        const tokens = idWithTokens.tokens.filter((token) => !!token)
        return {
          userMapping: res.userMapping.concat(
            new Array(tokens.length).fill(idWithTokens.id)
          ),
          tokens: res.tokens.concat(tokens),
        }
      },
      { tokens: [], userMapping: [] }
    )
    const messages = tokens.map<admin.messaging.Message>((token) => ({
      data: {
        message: JSON.stringify(message),
      },
      token,
    }))
    if (!messages.length) return
    const res = await context.messaging.sendAll(messages)
    const invalidTokens = res.responses.reduce<InvalidToken[]>(
      (invalidTokens, res, index) => {
        if (
          res.success ||
          res.error?.code !== 'messaging/invalid-registration-token'
        )
          return invalidTokens
        return invalidTokens.concat({
          id: userMapping[index],
          token: tokens[index],
        })
      },
      []
    )
    cleanup(context)(invalidTokens)
  }
}

function cleanup(context: Context) {
  return async (invalidTokens: InvalidToken[]) => {
    const removePromises = invalidTokens.map((invalidToken) =>
      context.redis.remove(invalidToken.id, invalidToken.token)
    )
    return Promise.all(removePromises)
  }
}
