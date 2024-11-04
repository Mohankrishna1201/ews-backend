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
        to: 'mohanfanofaa@gmail.com',
        subject: 'OTP To Complete Your Signup',
        html: `<html> <h1>Hi,</h1> <br/><p style="color:grey; font-size:1.2em">Please use the below OTP code to complete your account setup on My App</p><br><br><h1 style="color:orange">${code}</h1></html>`
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