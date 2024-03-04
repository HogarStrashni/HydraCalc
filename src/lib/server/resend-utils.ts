import { RESEND_API_KEY } from '$env/static/private';
import { Resend } from 'resend';

export const sendResetPasswordEmail = (email: string, invitationLink: string) => {
	const resend = new Resend(RESEND_API_KEY);

	return resend.emails.send({
		from: 'djmatic@agfbl.org',
		to: email,
		subject: 'HydraCalc password reset',
		html: `<div>
				<h2>Reset password for your HydraCalc account.</h2>
				<p>This is an automated message from the HydraCalc App. Click link and enter new password.</p>			
				<a href=${invitationLink}>Reset password</a>
				</div>`
	});
};
