export type AppSteramType = 'long_poll'

export interface CreateAppStreamBody {
  type: AppSteramType
  object_types: ObjectTypes[]
}

export type ObjectTypes =
  | 'post'
  | 'bookmark'
  | 'follow'
  | 'mute'
  | 'block'
  | 'message'
  | 'channel'
  | 'channel_subscription'
  | 'token'
  | 'file'
  | 'poll'
  | 'user'

export interface CreateAppStreamResponse {
  meta: {
    code: number
  }
  data: {
    key: string
    object_types: ObjectTypes[]
    endpoint: string
    type: 'long_poll'
  }
}
