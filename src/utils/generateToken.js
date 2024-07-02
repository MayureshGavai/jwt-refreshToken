import JWT from 'jsonwebtoken';
import RedisClient from '../config/redis.js';

export const signAccessToken = async (username) => {
    try {
        const payload = {
            user: username,
        };
        const secret = process.env.ACCESS_SECRET_KEY; // Ensure this key matches across your application
        
        const options = {
            expiresIn: '15m',
        };

        return new Promise((resolve, reject) => {
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.error('Error signing access token:', err);
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    } catch (error) {
        console.error('Error generating JWT:', error);
        throw error;
    }
}

export const signRefreshToken = async (username) => {
    try {
        const payload = {
            user: username,
        };
        const secret = process.env.REFRESH_SECRET_KEY;
        const options = {
            // expiresIn: '30d',
        };

        const expirationTimeInSeconds = 15 * 24 * 60 * 60

        return new Promise((resolve, reject) => {
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    RedisClient.SET(username, token, 'EX', expirationTimeInSeconds, (err, reply) => {
                        if (err) {
                            reject(err);
                        } else {
                            console.log('Hello WOrld')
                            console.log('Refresh token stored in Redis:', reply);
                        }
                    });
                    resolve(token); // Resolve with the token
                }
            });
        });
    } catch (error) {
        console.error('Error generating JWT:', error);
        throw error;
    }
}
