import { config } from 'dotenv'
import getServer from './functions/getServer'

config()

async function main (): Promise<void> {
  const server = await getServer()

  await server.listen({
    host: '0.0.0.0',
    port: parseInt(process.env.PORT ?? '8080')
  })
}

main()
  .then(() => {
    console.log(`Server running in port ${process.env.PORT}`)
  })
  .catch((err) => {
    console.error(err)
  })
