import { Resend } from "resend"

const resend = new Resend(process.env.NEXT_RESEND_API_KEY);

export const sendVerificationEmail = async ( email: string, token: string) => {
    const confirmLink = 'http://localhost:3000/auth/new-verification?token='+token; 

    // create new-verification page, email link to user , detect if token is okay, then change user emailverified status date in DB

    // send email with resend

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: '<p>Click <a href='+confirmLink+'>here</a> to confirm email.</p>'
    })

}