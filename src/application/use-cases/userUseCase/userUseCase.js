import { checkCountry } from '../../../security/validation.js';


class UserUseCase {

    #userRepository
    #sendEmail
    constructor(userRepository, sendEmail) {
        this.#userRepository = userRepository;
        this.#sendEmail = sendEmail
    }

    // ✅ Save new user with comprehensive error handling
    async saveNewUser(userData) {
        try {

            // ✅ Validate input data
            if (!userData) {
                throw { status: 400, message: 'User data is required' };
            }

            const checkCountryAndCode = checkCountry(userData.country, userData.countryCode);
            if (!checkCountryAndCode.valid) {
                throw { status: 400, message: checkCountryAndCode.error };
            }
            userData.country = userData.country
                ? userData.country.charAt(0).toUpperCase() + userData.country.slice(1).toLowerCase()
                : '';

            const exists = await this.#userRepository.checkEmailExists(userData.email);
            if (exists) {
                throw { status: 409, message: 'User with this email already exists' };
            }

            const savedUser = await this.#userRepository.saveNewUser(userData);

            // this function is email verification 

            await this.sendVerificationOtp(savedUser.email, 'emailVerification')

            return {
                status: 200,
                // message: 'Registration successful.',
                message: 'Registration successful. An OTP has been sent to your email for verification.',
                data: { email: savedUser.email, userId: savedUser._id }
            };

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while registering the user'
            };
        }
    }

    async sendVerificationOtp(email, purpose) {
        try {
            const OTP = this.#sendEmail.createNewOtp();
            console.log(OTP);

            await this.#sendEmail.sendEmail(purpose, email, OTP);

            await this.#userRepository.createOtp(email, OTP);

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while sending the verification OTP.'
            };
        }
    }
    async sendVerifyOtp(verificationData) {
        try {


            const email = verificationData.email?.trim();
            if (!email) {
                throw { status: 400, message: 'Email is required for OTP verification.' };
            }

            const userData = await this.#userRepository.takeUserData(email);


            await this.sendVerificationOtp(userData.email, verificationData.purpose || 'emailVerification')

            return {
                status: 200,
                message: 'Verification OTP sent successfully.',
                data: { email: userData.email, userId: userData._id }
            };

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while sending the verification OTP.'
            };
        }
    }

    // ✅ Login user with comprehensive error handling
    async login(loginData) {
        try {

            if (!loginData) {
                throw { status: 400, message: 'Login data is required' };
            }

            const email = loginData.email?.trim();
            const password = loginData.password;

            if (!email || !password) {
                throw { status: 400, message: 'Email and password are required' };
            }


            const userData = await this.#userRepository.takeUserData(email);
            if (userData.isBlocked) {
                return {
                    status: 403,
                    message: 'Your account has been blocked. Please contact support for assistance.',
                    data: loginData
                };
            }

            await this.#userRepository.comparePassword(userData.password, password);

            // checking user verification in here 
            if (!userData.isVerified) {
                return {
                    status: 400,
                    message: 'User is not verified. Please verify your account before logging in.',
                    data: loginData
                }
            };
            // console.log(1212, userData);



            return {
                status: 200,
                message: 'Login successful',
                data: { userId: userData._id, email: userData.email }
            };
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred during login'
            };
        }
    }

    async otpVerification(otpReqData) {
        try {

            const takeOtpData = await this.#userRepository.takeOtpData(otpReqData.email)

            await this.#userRepository.optCompare(otpReqData.otp, takeOtpData.otp)

            const takeUserData = await this.#userRepository.takeUserDataAndVerification(otpReqData.email);

            await this.#sendEmail.sendEmail('welcome', takeUserData.email);


            return {
                status: 200,
                message: 'OTP verification successful.',
                data: { email: takeOtpData.email, userId: takeUserData._id }
            }

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred during login'
            };
        }
    }
    async forgotPassword(email) {
        try {
            if (!email) {
                return {
                    status: 400,
                    message: 'Email is required to reset password.'
                };
            }


            const userData = await this.#userRepository.takeUserData(email)
            // const userData = await this.#userRepository.takeUserDataForReset(email);

            await this.sendVerificationOtp(email, 'resetPassword')
            return {
                status: 200,
                message: 'OTP sent successfully for password reset. It will expire after 1 minute.',
                data: { email: userData.email, userId: userData._id }
            };


        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while processing the password reset request.'
            };
        }
    }
    async verifyResetOtp(reqData) {
        try {

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(reqData.email)) {
                return {
                    status: 400,
                    message: 'Invalid email format.'
                };
            }
            console.log(reqData);
            const takeOtpData = await this.#userRepository.takeOtpData(reqData.email)

            await this.#userRepository.optCompare(reqData.otp, takeOtpData.otp)

            const userData = await this.#userRepository.takeUserDataForReset(takeOtpData.email);
            return {
                status: 200,
                message: 'OTP verified successfully. You have 2 minutes to complete your password reset.',
                data: { email: userData.email, userId: userData._id, UId: userData.resetPassId }
            };



        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while verifying reset Otp.'
            };
        }
    }
    async saveNewResPassword(reqData) {
        try {

            const userData = await this.#userRepository.updatePassword(reqData.UId, reqData.password)
            return {
                status: 200,
                message: 'Password has been reset successfully.',
                data: { email: userData.email, userId: userData._id }
            };

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'An error occurred while save new reset password.'
            };
        }
    }
}

export default UserUseCase;