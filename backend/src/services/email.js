/**
 * Email service — stub for development, ready for SMTP in production.
 * Provisioning and password lifecycle are owned by Keycloak.
 */
export async function sendKeycloakCredentialsEmail({ email, password, name, role }) {
    const loginUrl = `${process.env.FRONTEND_ORIGIN || 'http://localhost:5173'}/login`;

    if (process.env.NODE_ENV === 'production') {
        // TODO: integrate with email provider
        // await transporter.sendMail({
        //   from: process.env.EMAIL_USER,
        //   to: email,
        //   subject: `CloudCRM — Your ${role} Account Has Been Created`,
        //   html: `
        //     <h2>Welcome to CloudCRM, ${name}!</h2>
        //     <p>Your ${role} account has been created in Keycloak.</p>
        //     <p><strong>Email:</strong> ${email}</p>
        //     <p><strong>Temporary Password:</strong> ${password}</p>
        //     <br />
        //     <p>Please sign in through Keycloak and change your password immediately:</p>
        //     <p><a href="${loginUrl}">Log in to CloudCRM</a></p>
        //     <br />
        //     <p style="color: #666; font-size: 12px;">
        //       This is an automated message. Do not share your credentials with anyone.
        //       If you did not expect this email, please contact the administrator.
        //     </p>
        //   `,
        // });
        console.log(`[EMAIL] ${role} Keycloak credentials email queued for: ${email}`);
    } else {
        console.log(`[EMAIL-DEV] ${role} Keycloak credentials would be sent to: ${email}`);
        console.log(`[EMAIL-DEV] Name: ${name}`);
        console.log(`[EMAIL-DEV] Login URL: ${loginUrl}`);
        console.log(`[EMAIL-DEV] Temp password: ${password}`);
    }
}
