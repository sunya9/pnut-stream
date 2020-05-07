import debug from 'debug'
import { main } from 'src/core/main'
import { listenServer } from 'src/server'

const logger = debug('pnut-stream:main')

try {
  listenServer()
  main()
} catch (e) {
  logger('catch error', e)
}
