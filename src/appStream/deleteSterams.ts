import { Context } from 'src/context'

export function deleteStreams(context: Context) {
  return async () => {
    return context.fetch('https://api.pnut.io/v0/streams', {
      method: 'delete',
    })
  }
}
