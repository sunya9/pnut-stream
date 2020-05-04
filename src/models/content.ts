import { Entities } from 'models/entity'

export interface Content {
  text: string
  html: string
  entities: Entities
}

export interface HasContent {
  content?: Content
}
