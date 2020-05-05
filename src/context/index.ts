import { appErrors } from 'src/errors/appErrors'
import { getFetch } from 'src/context/fetch'
import { RequestInfo, RequestInit } from 'node-fetch'
import * as admin from 'firebase-admin'
import * as path from 'path'
import { redisClient } from 'src/redis'

const keyPath = path.resolve(__dirname, '../../service-account-file.json')

function initAdmin() {
  if (admin.apps.length) return // already initialized
  admin.initializeApp({
    credential: admin.credential.cert(keyPath),
    databaseURL: 'https://pnut-stream.firebaseio.com',
  })
}

export interface Context {
  readonly fetch: <T = any>(
    input: RequestInfo,
    init?: RequestInit
  ) => Promise<T>
  readonly messaging: admin.messaging.Messaging
  readonly env: {
    readonly appAccessToken: string
    readonly registrationToken: string
  }
  redis: typeof redisClient
}

export function createContext(): Context {
  const appAccessToken = getEnv('app_access_token')
  const registrationToken = getEnv('registration_token')
  initAdmin()
  return {
    fetch: getFetch(appAccessToken),
    messaging: admin.messaging(),
    env: {
      appAccessToken,
      registrationToken,
    },
    redis: redisClient,
  }
}

function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw appErrors.cannotLoadEnv(key)
  return value
}
