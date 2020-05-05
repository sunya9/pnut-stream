import { createContext } from 'src/context'
import { createAppStream } from 'src/appStream/createAppStream'

export async function init() {
  const context = createContext()
  const key = await createAppStream(context)()
  return {
    context,
    key,
  }
}
