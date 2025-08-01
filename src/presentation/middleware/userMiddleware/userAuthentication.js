
import jwt from 'jsonwebtoken';
import config from '../../../config/env.js'
import UserToken from '../../../domain/services/jwtToken.js'

const userToken = new UserToken()

class UserAuthentication {

    async verifyUser(req, res, next){
        try {
            const token = req.cookies?.token;

            if (!token) {
                return res.status(498).json({
                    message: 'No authentication token found. Please log in.'
                });
            }
            // console.log(token);
            const decoded = jwt.verify(token, config.JWT_SECRET);
            req.user = decoded.userId;

            const now = Math.floor(Date.now() / 1000);
            const remainingSeconds = decoded.exp - now;
            const remainingDays = remainingSeconds / (24 * 60 * 60);

           
            //regenerate new token is remaining days are 10 days
            if (remainingDays <= 10) {
                userToken.generateToken(decoded.userId, res);
            }
            next(); 

        } catch (error) {
            res.clearCookie('token', {
                httpOnly: true,
                secure: false,
                sameSite: 'lax'
            });
            return res.status(498).json({
                message: 'Invalid or expired authentication token. Please log in again.'
            });
        }
    }

}

export default UserAuthentication