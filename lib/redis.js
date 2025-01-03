
const Redis = require("ioredis");




const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    tls: {
        rejectUnauthorized: false 
    }
});


const connectRedis = () => {
        redis.on("connect", () => {
            console.log("Connected to  Redis");
          
        });

        redis.on("error", (error) => {
            console.error("Redis connection error:", error);
        });

       
};


module.exports = {
    redis,
    connectRedis
}
