import debug from 'debug'
import { main } from 'core/main'
const logger = debug('pnut-stream:main')

try {
  main()
} catch (e) {
  logger('catch error', e)
}
