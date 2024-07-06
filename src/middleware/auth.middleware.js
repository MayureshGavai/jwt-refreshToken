import JWT from 'jsonwebtoken'
import RedisClient from '../config/redis.js';
import { configDotenv } from 'dotenv';
import { signAccessToken, signRefreshToken } from '../utils/generateToken.js';

configDotenv()

export const checkAccessTokenisPresent = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        console.log('no token in cookies')
        req.isAuthenticated = false
        return res.redirect('/login');
    }
    else {
        next()
    }
}

export const verifyAccessTokenFromCookies = (req, res, next) => {
    const token = req.cookies.accessToken;

    JWT.verify(token, process.env.ACCESS_SECRET_KEY, async (err, user) => {
        if (err) {
            if (err.name == 'TokenExpiredError') {
                // console.log(err)
                const refreshToken = await RedisClient.get('refreshToken', (err, reply) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(reply)
                    }
                })

                console.log('refreshToken :',refreshToken)

                if (!refreshToken) {
                    // res.clearCookie('accessToken')
                    console.log('no refreshToken is present')
                    return res.redirect('/login')
                }

                const username = await verifyRefreshToken(refreshToken);
                const newAccessToken = await signAccessToken(username);
                const newRefreshToken = await signRefreshToken(username);
                


                res.cookie('accessToken', newAccessToken, {
                    httpOnly: false,
                    secure: false,
                    sameSite: false,
                    path: '/'
                })

                console.log('New Tokens generated:', { newAccessToken, newRefreshToken });
                return next()
            }
            else if(err.name === 'JsonWebTokenError'){
                console.log('no token available in cookies')
                return res.redirect('/login');
                
            }else {
                console.log('err occured : ', err)
                return next()
            }
        } else {
            console.log('hello')
        }
    });
};


export const verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) {
        req.isAuthenticated = false;
        // return res.status(401).send('Not Authorized');
        return next()
    }

    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];

    // console.log("Access Token : ",token)

    JWT.verify(token, process.env.ACCESS_SECRET_KEY, (err, payload) => {
        if (err) {
            const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
            req.isAuthenticated = false
            return res.status(401).send(message);
        } else {
            req.isAuthenticated = true;
            req.payload = payload;
            next();
        }
    });
};


export const verifyRefreshToken = (refreshToken) => {

    // console.log("refreshToken : ",refreshToken)

    if (!refreshToken) {
        return res.status(400).send('Refresh Token is required');
    }

    return new Promise((resolve, reject) => {
        JWT.verify(refreshToken, process.env.REFRESH_SECRET_KEY, async (err, payload) => {
            if (err) {
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
                reject(new Error(message));
            } else {
                console.log(payload.user)
                const savedToken = await RedisClient.get('refreshToken', (err, reply) => {
                    if (err) {
                        console.log('internal server error')
                    } else {
                        console.log(reply)
                    }
                })
                // console.log("savedToken : ",savedToken)
                if (refreshToken !== savedToken) {
                    reject(new Error('Unauthorized Token'))
                } else {
                    resolve(payload.user); // Assuming the payload contains the username as `user`
                }
            }
        });
    });
}

