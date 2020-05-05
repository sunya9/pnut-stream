import { CreateAppStreamBody, CreateAppStreamResponse } from './types'
import { Context } from 'src/context'
import { deleteStreams } from 'src/appStream/deleteSterams'
import debug from 'debug'
const logger = debug('pnut-stream:client:createAppStream')
const createStreamUrl = 'https://api.pnut.io/v0/streams'

export function createAppStream(context: Context) {
  return async (): Promise<string> => {
    await deleteStreams(context)()
    const body = getBodyString()
    const res = await context.fetch<CreateAppStreamResponse>(createStreamUrl, {
      body,
      method: 'post',
    })
    logger(res)
    return res.data.key
  }
}

function getBodyString() {
  const body: CreateAppStreamBody = {
    type: 'long_poll',
    object_types: ['post', 'bookmark', 'follow', 'message', 'poll'],
  }
  return JSON.stringify(body)
}
