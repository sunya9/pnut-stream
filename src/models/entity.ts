interface Entity {
  text: string
  len: number
  pos: number
}

export namespace Entity {
  export interface Link extends Entity {
    amended_len?: number
    link: string
    title?: string
  }
  export interface Mention extends Entity {
    id: string
    is_copy?: boolean
    is_leading?: boolean
  }
  export interface Tag extends Entity {}
}

export interface Entities {
  links: Entity.Link[]
  mentions: Entity.Mention[]
  tags: Entity.Tag[]
}
