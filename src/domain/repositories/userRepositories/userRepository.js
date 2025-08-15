
import User from '../../../infrastructure/database/models/userModel.js'
import Otp from '../../../infrastructure/database/models/otpModel.js'
import { v4 as UniqueId } from 'uuid';
import bcrypt from 'bcryptjs';

class UserRepositories {
 
    // ✅ Check if email exists with error handling
    async checkEmailExists(email) {
        try {
            if (!email) {
                throw { status: 400, message: 'Email is required for checking existence' };
            }

            const user = await User.findOne({ email: email });
            return user ? true : false;
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Failed to check email existence'
            };
        }
    }

    async saveNewUser(userData) {
        try {
            if (!userData) {
                throw { status: 400, message: 'User data is required' };
            }

            const newUser = new User(userData);
            const savedUser = await newUser.save();

            return savedUser;
        } catch (error) {


            if (error.code === 11000) {
                throw {
                    status: 409,
                    message: 'User with this email already exists'
                };
            }

            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors).map(err => err.message);
                throw {
                    status: 400,
                    message: 'Validation failed',
                    details: validationErrors
                };
            }

            throw {
                status: error.status || 500,
                message: error.message || 'Failed to save user data'
            };
        }
    }

    async takeUserData(Email) {
        try {
            if (!Email) {
                throw { status: 400, message: 'Email is required to fetch user data' };
            }


            const user = await User.findOne(
                { email: Email },
                { email: 1, password: 1, _id: 1, isVerified: 1,isBlocked: 1 }
            );

            if (!user) {
                throw {
                    status: 404,
                    message: 'User with this email does not exist. Please check your credentials.'
                };
            }

            return user;
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Failed to fetch user data'
            };
        }
    }

    async comparePassword(dbPassword, loginPassword) {
        try {
            if (!dbPassword || !loginPassword) {
                throw {
                    status: 400,
                    message: 'Both database password and login password are required'
                };
            }

            const isMatch = await User.prototype.comparePassword.call(
                { password: dbPassword },
                loginPassword
            );

            if (!isMatch) {
                throw {
                    status: 401,
                    message: 'Incorrect password. Please try again.'
                };
            }

            return true;

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Failed to compare passwords'
            };
        }
    }
    async createOtp(email, otp) {
        try {

            const otpDoc = new Otp({
                email,
                otp,
                createdAt: Date.now()
            });
            await otpDoc.save();


            return true;
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Failed to create Otp'
            };
        }
    }
    async takeOtpData(email) {
        try {
            const otpData = await Otp.findOne({ email: email })
            if (otpData) {
                return otpData;

            }
            throw {
                status: 404,
                message: 'OTP not found for this email. Please request a new OTP.'
            };

        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Failed to retrieve OTP data'
            };
        }
    }
    async optCompare(userOtp, DbOtp) {
        try {
            if (!DbOtp || !userOtp) {
                throw {
                    status: 400,
                    message: 'Both database OTP and user OTP are required for verification'
                };
            }

            const isMatch = await Otp.schema.methods.compareOtp.call({ otp: DbOtp }, userOtp);

            if (!isMatch) {
                throw {
                    status: 401,
                    message: 'Incorrect OTP. Please try again.'
                };
            }
            // Remove the OTP after successful match
            await Otp.findOneAndDelete({otp:DbOtp});

            return true;
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Failed to compare OTP'
            };
        }
    }
    async takeUserDataAndVerification(email) {
        try {
            if (!email) {
                throw { status: 400, message: 'Email is required to verify user' };
            }

            const user = await User.findOneAndUpdate(
                { email: email },
                { $set: { isVerified: true } },
                { new: true }
            );
            if (!user) {
                throw {
                    status: 404,
                    message: 'User not found for verification'
                };
            }
            await Otp.deleteOne({ email });
            return user;
        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Failed to verify user'
            };
        }
    }
    async takeUserDataForReset(email) {
        try {

            const resetPassId = UniqueId();
            const user = await User.findOneAndUpdate(
                { email: email },
                { $set: { resetPassId: resetPassId } },
                { new: true }
            );
            if (!user) {
                throw {
                    status: 404,
                    message: 'No user found with the provided email.'
                };
            }

            this.AutoRemoveResetId(resetPassId)
            return user;


        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Failed to verify user'
            };
        }
    }
    AutoRemoveResetId(resetPassId) {
        setTimeout(async () => {
            try {
                await User.findOneAndUpdate(
                    { resetPassId: resetPassId },
                    { $unset: { resetPassId: "" } },
                    { new: true }
                );
            } catch (error) {
                // console.error('Failed to auto-remove resetPassId:', error.message);
            }
        }, 1000 * 60 * 2);
    }
    async updatePassword(UID, password) {
        try {

            if (!UID || !password) {
                throw {
                    status: 400,
                    message: 'User ID and password are required.'
                };
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await User.findOneAndUpdate(
                { resetPassId: UID },
                {
                    $set: { password: hashedPassword },
                    $unset: { resetPassId: "" }
                },
                { new: true }
            );

            if (!user) {
                throw {
                    status: 404,
                    message: 'Invalid or expired reset token.'
                };
            }

            return user;



        } catch (error) {
            throw {
                status: error.status || 500,
                message: error.message || 'Failed to verify user'
            };
        }
    }
}

export default UserRepositories;