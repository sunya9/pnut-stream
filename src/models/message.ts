import { Source } from 'src/models/source'
import { HasContent } from 'src/models/content'
import { HasUser } from 'src/models/hasUser'

export interface Message extends HasUser, HasContent {
  created_at: Date
  id: string
  is_deleted?: boolean
  is_sticky: boolean
  source: Source
  reply_to?: string
  thread_id: string
  raw: []
}
