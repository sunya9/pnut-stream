import { appErrors } from 'errors/appErrors'
import { getFetch } from 'context/fetch'
import { RequestInfo, RequestInit } from 'node-fetch'

export interface Context {
  fetch: <T = any>(input: RequestInfo, init?: RequestInit) => Promise<T>
  env: {
    appAccessToken: string
    registrationToken: string
  }
}

export function createContext(): Context {
  const appAccessToken = getEnv('app_access_token')
  const registrationToken = getEnv('registration_token')
  return {
    fetch: getFetch(appAccessToken),
    env: {
      appAccessToken,
      registrationToken,
    },
  }
}

function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw appErrors.cannotLoadEnv(key)
  return value
}
