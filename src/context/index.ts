import { appErrors } from 'errors/appErrors'
import { getFetch } from 'context/fetch'
import { RequestInfo, RequestInit } from 'node-fetch'

export interface Context {
  fetch: <T = any>(input: RequestInfo, init?: RequestInit) => Promise<T>
  env: {
    appAccessToken: string
  }
}

export function createContext(): Context {
  const appAccessToken = getAppAccessToken()
  return {
    fetch: getFetch(appAccessToken),
    env: {
      appAccessToken,
    },
  }
}

function getAppAccessToken(): string {
  const appAccesToken = process.env.app_access_token
  if (!appAccesToken) throw appErrors.cannotLoadAppAccessToken
  return appAccesToken
}
