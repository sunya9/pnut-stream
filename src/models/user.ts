import { Entities } from 'src/models/entity'
import { Content, HasContent } from 'src/models/content'

export interface User extends HasContent {
  badge: {
    id: string
    name: string
  }
  content?: User.UserContent
  counts: {
    bookmarks: number
    clients: number
    followers: number
    following: number
    posts: number
    users: number
  }
  created_at: Date
  id: string
  locale: string
  name: string
  timezone: string
  type: User.Type
  username: string
  verified?: {
    domain: string
    link: string
  }
  raw: any[]
}

export namespace User {
  export interface Image {
    is_default: boolean
    height: number
    width: number
    link: string
  }
  export interface UserContent extends Content {
    avatar_image: Image
    cover_image: Image
    markdown_text: string
    entities: Entities
  }
  export type Type = 'human' | 'bot' | 'feed'
}
