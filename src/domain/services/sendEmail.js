import nodemailer from 'nodemailer';
import config from '../../config/env.js'

const APP_NAME = 'Blue Link';

class SendEmail { 

    createNewOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async sendEmail(type, to, otp) {
        try {
            // 1️⃣ Create transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.EMAIL_USER,
                    pass: config.EMAIL_PASS,
                },
            });

            // 2️⃣ Use this.getEmailContent instead of global
            const { subject, text, html } = this.getEmailContent(type, otp);

            // 3️⃣ Define mail options
            const mailOptions = {
                from: `${APP_NAME} <${config.EMAIL_USER}>`,
                to,
                subject, 
                text,
                html,
            };

           
            await transporter.sendMail(mailOptions);
            // console.log('✅ Email sent:', info.response);
        } catch (error) {
            throw new Error('Email delivery failed,user data saved succfully.log in letter');
        }
    }

    getEmailContent(type, otp) {
    const baseStyle = `
        style="
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
        "
    `;
    const headerStyle = `
        style="
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border-radius: 6px 6px 0 0;
            text-align: center;
            font-size: 20px;
        "
    `;
    const bodyStyle = `
        style="
            padding: 20px;
            background-color: white;
            border-radius: 0 0 6px 6px;
            color: #333;
            line-height: 1.5;
            font-size: 16px;
        "
    `;
    
    switch (type) {
        case 'emailVerification':
            return {
                subject: `${APP_NAME} - Email Verification`,
                text: `Your ${APP_NAME} email verification code is: ${otp}.`,
                html: `
                    <div ${baseStyle}>
                        <div ${headerStyle}>
                            ${APP_NAME} - Email Verification
                        </div>
                        <div ${bodyStyle}>
                            <p>Hello,</p>
                            <p>Your verification code is:</p>
                            <p style="font-size: 24px; font-weight: bold; color: #007bff;">${otp}</p>
                            <p>This code will expire in <strong>1 minute</strong>. Please do not share it with anyone.</p>
                            <p>Thank you,<br/>The ${APP_NAME} Team</p>
                        </div>
                    </div>
                `,
            };
        case 'resetPassword':
            return {
                subject: `${APP_NAME} - Password Reset`,
                text: `Your ${APP_NAME} password reset code is: ${otp}.`,
                html: `
                    <div ${baseStyle}>
                        <div ${headerStyle}>
                            ${APP_NAME} - Password Reset
                        </div>
                        <div ${bodyStyle}>
                            <p>Hello,</p>
                            <p>Your password reset code is:</p>
                            <p style="font-size: 24px; font-weight: bold; color: #007bff;">${otp}</p>
                            <p>This code will expire in <strong>1 minute</strong>. Please do not share it with anyone.</p>
                            <p>If you did not request this, please ignore this email.</p>
                            <p>Thank you,<br/>The ${APP_NAME} Team</p>
                        </div>
                    </div>
                `,
            };
        case 'welcome':
            return {
                subject: `Welcome to ${APP_NAME}!`,
                text: `Welcome to ${APP_NAME}! We're thrilled to have you on board.`,
                html: `
                    <div ${baseStyle}>
                        <div ${headerStyle}>
                            Welcome to ${APP_NAME}!
                        </div>
                        <div ${bodyStyle}>
                            <p>Hello,</p>
                            <p>Welcome to <strong>${APP_NAME}</strong>! We're excited to have you join our community.</p>
                            <p>Thank you,<br/>The ${APP_NAME} Team</p>
                        </div>
                    </div>
                `,
            };
        default:
            throw new Error('Invalid email type');
    }
}

}

export default SendEmail;
