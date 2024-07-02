import JWT from 'jsonwebtoken'


export const verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(401).send('Not Authorized');
    }

    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];

    JWT.verify(token, process.env.SECRET_KEY, (err, payload) => {
        if (err) {
            const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
            return res.status(401).send(message);
        } else {
            req.payload = payload;
            next();
        }
    });
};


export const verifyRefreshToken = (refreshToken) => {

    if (!refreshToken) {
        return res.status(400).send('Refresh Token is required');
    }

    return new Promise((resolve, reject) => {
        JWT.verify(refreshToken, process.env.SECRET_KEY, (err, payload) => {
            if (err) {
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
                reject(new Error(message));
            } else {
                resolve(payload.user); // Assuming the payload contains the username as `user`
            }
        });
    });
}