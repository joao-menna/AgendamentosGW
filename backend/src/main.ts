import getServer from "./functions/getServer";

getServer().then(async (server) => {
  server.listen({
    host: '0.0.0.0',
    port: process.env.PORT
  })
}).catch((err) => {
  console.error(err)
})
