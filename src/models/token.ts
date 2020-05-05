import { Source } from 'src/models/source'
import { User } from 'src/models/user'

export interface Token {
  app: Source
  scopes: string[]
  user: User
  storage: {
    available: number
    total: number
  }
}
