import { appErrors } from 'errors/appErrors'

interface Context {
  env: {
    appAccessToken: string
  }
}

export function createContext(): Context {
  const appAccessToken = getAppAccessToken()
  return {
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
