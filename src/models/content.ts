import { Entities } from 'src/models/entity'

export interface Content {
  text: string
  html: string
  entities: Entities
}

export interface HasContent {
  content?: Content
}
