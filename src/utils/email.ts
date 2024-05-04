import nodemailer from 'nodemailer';

export const sendEmail = async (options: { email: string; subject: any; message: any; html: any;}) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from:'YouRide Inc',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    }

    await transporter.sendMail(mailOptions)
}

export async function sendVerificationCode(email: string, verificationCode: string | null) {
   try {

    await sendEmail({
      email: email,
      subject: 'Verification Code', 
      message: `Your verification code is ${verificationCode}`,
      html: `<b>Your verification code is ${verificationCode}</b>`, 
    });
 
     // Return true to indicate that the email was successssfully sent
     return true;
   } catch (error) {
     console.error('Email sending error:', error);
     // Return false to indicate that there was an error sending the email
     return false;
   }
 }
export async function sendTemporaryPassword(email: string, tempPassword: string) {
   try {

    await sendEmail({
            email: email,
            subject: 'Your temporary password',
            message: `Your temporary password is ${tempPassword}. 
            Please change it as soon as possible.`,
            html: `<b>Your temporary password is ${tempPassword}</b>. Please change it as soon as possible`, 
        });

     // Return true to indicate that the email was successssfully sent
     return true;
   } catch (error) {
     console.error('Email sending error:', error);
     // Return false to indicate that there was an error sending the email
     return false;
   }
}
         