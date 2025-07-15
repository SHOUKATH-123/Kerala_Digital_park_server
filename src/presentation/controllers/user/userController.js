import { userSchema, setNewPasswordSchema } from '../../../security/validation.js'



class UserController {

    #userUseCase
    #jwtToken

    constructor(userUseCase, jwtToken) {
        this.#userUseCase = userUseCase
        this.#jwtToken = jwtToken
    }
    async saveUserData(req, res, next) {
        try {

            const { error } = userSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const response = await this.#userUseCase.saveNewUser(req.body);
            if (response.status == 200) {
                return res.status(200).json({ message: response.message, userData: response.data });
            }
            return res.status(response.status).json({ message: response.message });

        } catch (error) {
            next()
        }
    }
    async login(req, res, next) {
        try {
            const response = await this.#userUseCase.login(req.body);

            if (response.status == 200) {
              
                this.#jwtToken.generateToken(response.data, res);
                return res.status(200).json({ message: response.message, userData: response.data })
            }

            return res.status(response.status).json({ message: response.message, loginData: response.data ? response.data : '' });

        } catch (error) {
            next()
        }
    }
    async otpVerification(req, res, next){
        try {

            const response = await this.#userUseCase.otpVerification(req.body);

            if (response.status == 200) {
                this.#jwtToken.generateToken(response.data.userId, res);
                 
                return res.status(200).json({ message: response.message, userData: response.data })
            }

            return res.status(response.status).json({ message: response.message })
        } catch (error) {
            next()
        }
    }
    async sendVerifyOtp(req, res, next) {
        try {
            const response = await this.#userUseCase.sendVerifyOtp(req.body);

            if (response.status == 200) {

                return res.status(200).json({ message: response.message, userData: response.data })
            }

            return res.status(response.status).json({ message: response.message })

        } catch (error) {
            next()
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const email = req.params.email;
            const response = await this.#userUseCase.forgotPassword(email);

            if (response.status == 200) {
                return res.status(200).json({ message: response.message, userData: response.data })
            }

            return res.status(response.status).json({ message: response.message })


        } catch (error) {
            next()
        }
    }

    async verifyResetOtp(req, res, next) {
        try {
            // console.log(req.body);
            if (!req.body.email) {
                return res.status(400).json({ message: 'Email is required.' });
            }
            if (typeof req.body.otp !== 'string' || req.body.otp.length !== 6) {
                return res.status(400).json({ message: 'OTP must be exactly 6 characters long.' });
            }
            const response = await this.#userUseCase.verifyResetOtp(req.body);

            if (response.status == 200) {


                return res.status(200).json({ message: response.message, userData: response.data })
            }

            return res.status(response.status).json({ message: response.message });

        } catch (error) {
            next(error)
        }
    }
    async setNewPassword(req, res, next) {
        try {
            // console.log(req.body);
            const { error } = setNewPasswordSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const response = await this.#userUseCase.saveNewResPassword(req.body);

            if (response.status == 200) {
                return res.status(200).json({ message: response.message, userData: response.data })
            }

            return res.status(response.status).json({ message: response.message });
        } catch (error) {
            next(error)
        }
    }
    async logout(_,res,next){
        try {
            this.#jwtToken.logout(res);
            return res.status(200).json({ message: 'Logout successful.' })
        } catch (error) {
            next()
        }
    }

}

export default UserController;