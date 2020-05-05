class AppError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export const appErrors = {
  cannotLoadEnv: (key: string) =>
    new AppError(`You have to set ${key} via environment variable`),
} as const
