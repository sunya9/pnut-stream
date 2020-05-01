class AppError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export const appErrors = {
  cannotLoadAppAccessToken: new AppError(
    'You have to set app_access_token via environment variable'
  ),
} as const
