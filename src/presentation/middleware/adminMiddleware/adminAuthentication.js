
import jwt from 'jsonwebtoken';
import config from '../../../config/env.js'
import AdminJwtToken from '../../../domain/services/aminJwtToken.js'

const adminJwtToken = new AdminJwtToken()

class AdminAuthentication {

    async verifyAdmin(req, res, next) {
        try {


            const token = req.cookies?.AdminToken;

            if (!token) {
                return res.status(422).json({
                    message: 'No authentication token found. Please log in.'
                });
            }
            // console.log(token);
            const decoded = jwt.verify(token, config.JWT_SECRET);
            req.admin = decoded.userId;

            const now = Math.floor(Date.now() / 1000);
            const remainingSeconds = decoded.exp - now;
            const remainingDays = remainingSeconds / (24 * 60 * 60);


            //regenerate new token is remaining days are 10 days
            if (remainingDays <= 10) {
                adminJwtToken.generateToken(decoded.userId, res);
            }
            next();

        } catch (error) {
            // res.clearCookie('AdminToken', {
            //     httpOnly: true,
            //     secure: false,    // true in production with HTTPS
            //     sameSite: 'lax'
            // });
             res.clearCookie('AdminToken', {
                httpOnly: true,
                secure: true,    // true in production with HTTPS
                sameSite: 'none'
            });
            return res.status(422).json({
                message: 'Invalid or expired authentication token. Please log in again.'
            });
        }


    }
}

export default AdminAuthentication;