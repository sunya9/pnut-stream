import { init } from 'src/core/init'
import { createClientInstance } from 'src/client'
import debug from 'debug'
const logger = debug('pnut-stream:core:main')

export async function main() {
  const { context, key } = await init()
  for (;;) {
    const { connection } = createClientInstance(context)(key)
    try {
      await connection
      logger('closed, reconnecting...')
    } catch (e) {
      logger('terminated:', e)
      break
    }
  }
}
