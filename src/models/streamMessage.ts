import { ObjectTypes } from 'appStream/types'
import { User } from 'models/user'
import { Post } from 'models/post'
import { Message } from 'models/message'

interface BaseMeta {
  timestamp: number
  id: string
  type: ObjectTypes
  suppress_notifications: string[]
}
export interface BaseStreamMessage {
  meta: BaseMeta
}

export namespace StreamMessage {
  export interface PostMessage extends BaseStreamMessage {
    meta: BaseMeta & {
      revision?: boolean
      is_deleted?: boolean
      type: 'post'
    }
    data: Post
  }
  export interface BookmarkMessage extends BaseStreamMessage {
    meta: BaseMeta & {
      type: 'bookmark'
    }
    data: {
      user: User
      post: Post
    }
  }
  export interface FollowMessage extends BaseStreamMessage {
    meta: BaseMeta & {
      type: 'follow'
    }
    data: {
      user: User
      followed_user: User
    }
  }
  export interface MessageMessage extends BaseStreamMessage {
    meta: BaseMeta & {
      channel_type: 'io.pnut.core.pm' | 'io.pnut.core.chat'
      type: 'message'
      subscribed_user_ids: string[]
    }
    data: Message
  }
}

export function messageIsPost(
  data: BaseStreamMessage
): data is StreamMessage.PostMessage {
  return data.meta.type === 'post'
}

export function messageIsMessage(
  data: BaseStreamMessage
): data is StreamMessage.MessageMessage {
  return data.meta.type === 'message'
}

export function messageIsFollow(
  data: BaseStreamMessage
): data is StreamMessage.FollowMessage {
  return data.meta.type === 'follow'
}

export function messageIsBookmark(
  data: BaseStreamMessage
): data is StreamMessage.BookmarkMessage {
  return data.meta.type === 'bookmark'
}
