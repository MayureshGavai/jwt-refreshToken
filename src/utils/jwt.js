import jwt from 'jsonwebtoken'

export const signAccessToken = async (email) => {
    try {
        const payload = {
            userMail: email,
        };
        const secret = process.env.SECRET_KEY;
        const options = {
            expiresIn: '60d',
        };

        const token = jwt.sign(payload, secret, options);
        return token;
    } catch (error) {
        console.error('Error generating JWT:', error);
        throw error;
    }
}