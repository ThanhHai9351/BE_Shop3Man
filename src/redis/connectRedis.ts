import { createClient } from "redis"

const redisClient = createClient({
  password: process.env.REDIS_PW,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT as any,
  },
})

;(async () => {
  // redisClient.on("error", (err) => {
  //   console.error("Redis client error!", err)
  // })
  redisClient.on("ready", () => {
    console.log("Redis client started!")
  })

  await redisClient.connect().catch(console.error)

  await redisClient.ping()
})()

export default redisClient
