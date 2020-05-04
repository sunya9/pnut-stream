import { Source } from 'models/source'
import { HasContent } from 'models/content'
import { HasUser } from 'models/hasUser'

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
