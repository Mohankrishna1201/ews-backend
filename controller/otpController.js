const admin = require('../index');


const otpGenerator = require('otp-generator')
const nodemailer = require("nodemailer");


// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "code4fun.kattamuri@gmail.com",
        pass: "pjydpmibhonskphh",
    },
});



// Endpoint to send OTP
const sendOtp = async (req, res) => {

    // Retrieve email param
    const toEmail = req.body.email

    // Initiliaze firestore database
    const db = admin.firestore()

    // Generate OTP code
    const code = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false, digits: true });


    // mail options object to send email
let mailOptions = {
    from: 'code4fun.kattamuri@gmail.com',
    to: 'mohanfanofaa@gmail.com,ashimsattar@iitbbs.ac.in',
    subject: 'OTP To Complete Your Signup',
    html: `
        <html>
            <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <div style="padding: 20px; text-align: center; background-color: #0078d4;">
                        <img src="https://cdn.dribbble.com/userupload/17455045/file/original-c406238a97426c49592682a55603cf09.png?resize=864x864" alt="My App Logo" style="max-width: 150px; height: auto;" />
                    </div>
                    <div style="padding: 20px;">
                        <h1 style="color: #333;">Hello,</h1>
                        <p style="font-size: 1.1em; color: #555;">
                            Thank you for signing up with My App! To complete your account setup, please use the OTP code below:
                        </p>
                        <div style="text-align: center; padding: 20px; background-color: #f9f9f9; border-radius: 4px; margin: 20px 0;">
                            <h2 style="color: #ff8c00; font-size: 2em; margin: 0;">${code}</h2>
                        </div>
                        <p style="color: #555;">
                            If you didn't request this, please ignore this email or contact support.
                        </p>
                    </div>
                    <div style="padding: 15px; text-align: center; background-color: #0078d4; color: #fff;">
                        <p style="font-size: 0.9em; margin: 0;">Need help? Contact us at <a href="mailto:ashimsattar@iitbbs.ac.in" style="color: #fff; text-decoration: underline;">ashimsattar@iitbbs.ac.in</a></p>
                        <p style="font-size: 0.8em; color: #ddd;">&copy; ${new Date().getFullYear()} Glof, Inc. All rights reserved.</p>
                    </div>
                </div>
            </body>
        </html>
    `
};


    // Now try sending the otp email
    try {

        // 2 minutes
        var expiryDate = Date.now() + 18000000

        console.log(`DATE: ${expiryDate}`)

        try {
            await transporter.sendMail(mailOptions)
            await db.collection("otps").doc(toEmail).set({
                email: toEmail,
                otp: code,
                expiry: expiryDate
            })
            return res.json({
                status: "success",
                message: "OTP has been sent to the provided email."
            })
        } catch (e) {
            console.log(e)
            return res.json({ status: "failed", message: "Unable to send email at the momment" })
        }


    } catch (error) {
        return res.json({
            status: "failed",
            message: `Unknown error occured:${error}`
        })
    }

}

const verifyOtp = async (req, res) => {

    // Firestore database initialization
    const db = admin.firestore()

    // Retrieve email and OTP from request object
    const email = req.body.email
    const otp = req.body.otp

    // Retrieve the OTP details from the database
    const emailOtp = await db.collection("otps").doc(email).get()

    // Check if this record exists and proceed
    if (emailOtp.exists) {

        // Retrieve the expiry date
        const date = emailOtp.data().expiry

        // Check if OTP has expired
        if (Date.now() > date) {
            return res.json({ status: "failed", message: "Sorry this otp has expired!" })
        } else {
            // Retrieve OTP code from database
            const rOtp = emailOtp.data().otp

            // Compare OTP for match
            if (otp == rOtp) {
                return res.json({ status: "success", message: "OTP successfully confirmed!" })
            }

            return res.json({ status: "failed", message: "Sorry, the otp provided is not valid" })
        }
    }

    return res.json({ status: "failed", message: "OTP can not be verified at the moment!" })

}


module.exports = { sendOtp, verifyOtp }
