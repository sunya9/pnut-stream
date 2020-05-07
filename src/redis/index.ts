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
      client.sadd(id, token, wrapPromiseWithLogger(resolve, reject))
    )
}

function removeUserToken(client: redis.RedisClient) {
  return (id: string, token: string) =>
    new Promise((resolve, reject) =>
      client.srem(id, token, wrapPromiseWithLogger(resolve, reject))
    )
}

function getUserTokens(client: redis.RedisClient) {
  return (id: string) =>
    new Promise<string[]>((resolve, reject) => {
      return client.smembers(id, wrapPromiseWithLogger(resolve, reject))
    })
}

function wrapPromiseWithLogger<T = any>(
  resolve: (value?: T) => void,
  reject: (err: Error) => void
) {
  return (err: Error | null, data: T) => {
    if (err) {
      logger(err)
      reject(err)
      return
    }
    resolve(data)
  }
}
