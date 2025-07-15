import dotenv from 'dotenv';
dotenv.config()

const configData={
    PORT:process.env.PORT,
    DB_URL:process.env.DB_URL,
    EMAIL_USER:process.env.EMAIL_USER,
    EMAIL_PASS:process.env.EMAIL_PASS,
    JWT_SECRET:process.env.JWT_SECRET,
    JWT_EXPIRES:process.env.JWT_EXPIRES
}

export default configData