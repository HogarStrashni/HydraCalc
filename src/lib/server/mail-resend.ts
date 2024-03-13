import { RESEND_API_KEY } from '$env/static/private';
import { Resend } from 'resend';

const resend = new Resend(RESEND_API_KEY);

export const sendResetPasswordEmail = async (email: string, verificationLink: string) => {
	return resend.emails.send({
		from: 'info@sitec.dev',
		to: email,
		subject: 'HydraCalc Password Reset',
		html: `<div>
				<h2>Reset password for your HydraCalc account.</h2>
				<p>This is an automated message from the HydraCalc App. Click link and enter new password.</p>			
				<a href=${verificationLink}>${verificationLink}</a>
				</div>`
	});
};

export const sendVerificationCodeEmail = async (email: string, verificationCode: string) => {
	return resend.emails.send({
		from: 'info@sitec.dev',
		to: email,
		subject: 'HydraCalc Verification Code',
		html: `<div>
				<h2>Verification code for your HydraCalc account.</h2>
				<p>This is an automated message from the HydraCalc App. Enter your verification code.</p>			
				<h1>${verificationCode}</a>
				</div>`
	});
};
