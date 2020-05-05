import { createContext } from 'context'
import { createAppStream } from 'appStream/createAppStream'

export async function init() {
  const context = createContext()
  const key = await createAppStream(context)()
  return {
    context,
    key,
  }
}
