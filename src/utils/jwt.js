import jwt from 'jsonwebtoken'

export const signAccessToken = async (username) => {
    try {
        const payload = {
            user: username,
        };
        const secret = process.env.SECRET_KEY; // Ensure this key matches across your application
        const options = {
            expiresIn: '30d',
        };
    
        return new Promise((resolve, reject) => {
            jwt.sign(payload, secret, options, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        })
    } catch (error) {
        console.error('Error generating JWT:', error);
        throw error;
    }
}