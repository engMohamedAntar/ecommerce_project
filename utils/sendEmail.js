const asyncHandler= require('express-async-handler');
const nodemailer = require("nodemailer");

const sendEmail= asyncHandler(async(options)=>{
    const transporter = nodemailer.createTransport({
        service: "gmail", // Use your email service provider
        auth: {
          user: process.env.EMAIL_USER, // Your email address
          pass: process.env.EMAIL_PASS, // Your email password or app-specific password
        },
      });
    
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.email,
        subject: options.subject,
        text: options.text,
      };
    
     
      await transporter.sendMail(mailOptions);
});

module.exports= sendEmail;