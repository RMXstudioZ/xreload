const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3060;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Nodemailer transporter setup for Outlook.com (Hotmail)
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com', // Outlook.com SMTP server
    port: 587, // Port for STARTTLS encryption
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'noreply.xreload@gmail.com', // Your Outlook.com email address
        pass: 'Robinmollah' // Your Outlook.com email password (use environment variables in production)
    },
    tls: {
        rejectUnauthorized: false // Ignore certificate validation errors
    }
});

// POST route to send verification email
app.post('http://127.0.0.1:5500/email-sender/password-reset.html', (req, res) => {
    const email = req.body.email;
    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    const mailOptions = {
        from: 'noreply.xreload@gmail.com',
        to: email,
        subject: 'Password Reset Verification Code',
        text: `Your verification code is: ${verificationCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error); // Log the actual error
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Verification code sent successfully');
        }
    });
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
