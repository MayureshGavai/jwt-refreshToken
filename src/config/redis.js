import redis from 'redis';

const RedisClient = redis.createClient({
    port: 6379,
    host: "127.0.0.1"
});

RedisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
});

RedisClient.on('connect', () => {
    console.log('Redis connection established.');
});

await RedisClient.connect();

export default RedisClient;
