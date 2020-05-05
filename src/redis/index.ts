import redis, { RedisClient } from 'redis'
import debug from 'debug'

const logger = debug('pnut-stream:redis')

function createRedisClient(): redis.RedisClient {
  const client = redis.createClient()
  return client
}

// singleton
function createRedisWrapper(client: RedisClient) {
  return {
    add: registerUserToken(client),
    get: getUserTokens(client),
    remove: removeUserToken(client),
  }
}

export const redisClient = createRedisWrapper(createRedisClient())

function registerUserToken(client: redis.RedisClient) {
  return (id: string, token: string) =>
    new Promise((resolve, reject) =>
      client.rpush(id, token, wrapPromiseWithLogger(resolve, reject))
    )
}

function removeUserToken(client: redis.RedisClient) {
  return (id: string, token: string) =>
    new Promise((resolve, reject) =>
      client.lrem(id, 0, token, wrapPromiseWithLogger(resolve, reject))
    )
}

function getUserTokens(client: redis.RedisClient) {
  return (id: string) =>
    new Promise((resolve, reject) =>
      client.lrange(id, 0, -1, wrapPromiseWithLogger(resolve, reject))
    )
}

function wrapPromiseWithLogger(
  resolve: (value?: unknown) => void,
  reject: (err: Error) => void
) {
  return (err: Error | null) => {
    if (err) {
      logger(err)
      reject(err)
      return
    }
    resolve()
  }
}
