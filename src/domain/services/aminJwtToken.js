import jwt from 'jsonwebtoken';
import config from '../../config/env.js';

class AdminJwtToken {
    /**
     * Generate a JWT token, set it in httpOnly cookie 
     * @param {string} userId - User's ID
     * @param {Response} res - Express response object
     * @returns {void}
     */
    generateToken(userId, res) {
        
        if (!userId) {
            throw new Error('User ID is required to generate token.');
        }

        const payload = { userId };

        const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES });
        
        res.cookie('AdminToken', token, {
            httpOnly: true,
            secure: false,       
            sameSite: 'lax',     
            maxAge: 30 * 24 * 60 * 60 * 1000 
        });
    }
    logout(res) {
        res.clearCookie('AdminToken',{
            httpOnly: true,
            secure: false,    
            sameSite: 'lax'
        });

        return {
            status: 200,
            message: 'Logout successful. Token cleared from cookies.'
        };
    }
}

export default AdminJwtToken;
