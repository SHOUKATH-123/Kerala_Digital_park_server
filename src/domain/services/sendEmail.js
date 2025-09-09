import nodemailer from 'nodemailer';
import config from '../../config/env.js'

const APP_NAME = 'Blue Link';

class SendEmail {

    createNewOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async sendEmailPaymentSuccess(email, orderData) {
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user: config.EMAIL_USER, pass: config.EMAIL_PASS },
            });

            const { subject, html } = this.getOrderConfirmationContent(orderData);

            await transporter.sendMail({
                from: `Blue Link Printing <${config.EMAIL_USER}>`,
                to: email,
                subject,
                html,
            });

            console.log("✅ Order confirmation email sent successfully");
        } catch (error) {
            console.error("Email sending failed:", error);
            throw new Error("Order confirmation email delivery failed");
        }
    }

    getOrderConfirmationContent(orderData) {
        const {
            _id,
            orderItems,
            totalPrice,
            status,
            createdAt,
            paidAt,
            paymentResult,
            discountAmount,
            appliedCoupon,
        } = orderData;

        const orderDate = new Date(createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        const paidDate = new Date(paidAt).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        const subject = `Order Confirmation - #${_id.toString().slice(-8)} | Blue Link Printing`;

        // Utility function for rows
        const row = (label, value, color = "#1e293b") => `
    <div class="order-row">
      <span class="order-label">${label}</span>
      <span class="order-value" style="color:${color}">${value}</span>
    </div>`;

        // Utility function for specs
        const spec = (label, value) =>
            value
                ? `<div class="spec-item">
            <div class="spec-label">${label}</div>
            <div class="spec-value">${value}</div>
         </div>`
                : "";

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Order Confirmation</title>
<style>
  body { font-family: Segoe UI, Tahoma, sans-serif; background:#f4f7fa; margin:0; padding:0; color:#333 }
  .email-container { max-width:600px; margin:auto; background:#fff; box-shadow:0 10px 30px rgba(0,0,0,0.1) }
  .header { background:linear-gradient(135deg,#2563eb,#1d4ed8); color:#fff; padding:30px; text-align:center }
  .logo { font-size:28px; font-weight:bold }
  .content { padding:30px }
  .success-badge { background:linear-gradient(135deg,#10b981,#059669); color:#fff; padding:10px 20px; border-radius:50px; display:inline-block; margin-bottom:20px }
  .order-info { background:#f8fafc; border-left:5px solid #2563eb; padding:20px; border-radius:10px; margin-bottom:20px }
  .order-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #e2e8f0 }
  .order-row:last-child { border:none }
  .order-label { font-weight:600; font-size:13px; text-transform:uppercase; color:#475569 }
  .order-value { font-weight:700 }
  .items-section { margin-bottom:20px }
  .item-card { border:1px solid #e2e8f0; border-radius:8px; padding:15px; margin-bottom:10px }
  .item-header { display:flex; align-items:center; margin-bottom:10px }
  .item-image { width:70px; height:70px; border-radius:6px; margin-right:12px; object-fit:cover }
  .item-name { font-weight:700; font-size:16px }
  .spec-item { background:#f1f5f9; padding:6px 10px; border-radius:5px; font-size:12px; margin:5px 0 }
  .price-summary { background:#1e293b; color:#fff; border-radius:10px; padding:20px; margin-bottom:20px }
  .price-row { display:flex; justify-content:space-between; margin-bottom:8px }
  .total-row { border-top:1px solid rgba(255,255,255,0.2); padding-top:10px; margin-top:10px; font-size:18px; font-weight:700 }
  .footer { background:#1e293b; color:#94a3b8; text-align:center; padding:20px; font-size:14px }
  .footer a { color:#94a3b8; margin:0 10px; text-decoration:none }
  .footer a:hover { color:#fff }
</style>
</head>
<body>
<div class="email-container">
  <div class="header">
    <div class="logo">Blue Link</div>
    <div>Premium Printing Solutions</div>
  </div>
  <div class="content">
    <div class="success-badge">✅ Order Confirmed</div>
    <h1 style="margin-bottom:20px">Thank you for your order!</h1>

    <div class="order-info">
      ${row("Order Number", `#${_id.toString().slice(-8)}`)}
      ${row("Order Date", orderDate)}
      ${row("Payment Status", "✅ Paid", "#10b981")}
      ${row("Payment Date", paidDate)}
      ${row("Order Status", status, "#2563eb")}
      ${paymentResult?.id ? row("Transaction ID", paymentResult.id) : ""}
    </div>

    <div class="items-section">
      <h2>Order Items</h2>
      ${orderItems
                .map(
                    (item) => `
        <div class="item-card">
          <div class="item-header">
            <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.style.display='none'">
            <div>
              <div class="item-name">${item.name}</div>
              <div style="color:#64748b;font-size:14px">Qty: ${item.quantity} | $${item.price}</div>
            </div>
          </div>
          ${[spec("Size", item.size?.name), spec("Paper", item.paper?.name), spec("Finish", item.finish?.name), spec("Corner", item.corner?.name)]
                            .filter(Boolean)
                            .join("")}
        </div>`
                )
                .join("")}
    </div>

    <div class="price-summary">
      ${appliedCoupon ? `<div class="price-row"><span>Coupon</span><span>${appliedCoupon}</span></div>` : ""}
      ${discountAmount > 0 ? `<div class="price-row"><span>Discount</span><span>-$${discountAmount.toFixed(2)}</span></div>` : ""}
      <div class="price-row total-row"><span>Total</span><span>$${totalPrice.toFixed(2)}</span></div>
    </div>

    <p style="font-size:13px;color:#64748b">We'll review your order and start production within 24 hours.  
    Estimated production: 3–5 business days. You'll receive updates by email.</p>
  </div>

  <div class="footer">
    <div style="font-weight:bold;color:#fff">Blue Link Printing</div>
    <div>Your trusted partner for premium printing solutions</div>
    <div style="margin:10px 0">
      <a href="#">Track Order</a><a href="#">Support</a><a href="#">Website</a><a href="#">Contact</a>
    </div>
    © 2024 Blue Link Printing. Order #${_id.toString().slice(-8)}
  </div>
</div>
</body>
</html>`;

        return { subject, html };
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
