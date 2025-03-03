// Email service using Dependency Injection pattern (separate module in practice)
export class EmailService {
    constructor(emailProvider) {
        this.emailProvider = emailProvider;
    }
    
    async sendPasswordResetEmail(email, resetToken) {
        try {
            const resetUrl = `${config.frontendUrl}/reset-password/${resetToken}`;
            
            const emailTemplate = this.getPasswordResetTemplate(resetUrl);
            
            await this.emailProvider.sendMail({
                to: email,
                subject: 'Password Reset Request',
                html: emailTemplate
            });
            
            // logger.info(`Password reset email sent to ${email}`);
            return true;
        } catch (error) {
            // logger.error(`Failed to send reset email: ${error.message}`);
            throw new Error('Failed to send password reset email');
        }
    }
    
    getPasswordResetTemplate(resetUrl) {
        // Template Method pattern
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>You have requested to reset your password. Please click the link below to set a new password:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
                <p>This link will expire in 1 hour for security reasons.</p>
                <p>If you did not request this reset, please ignore this email and ensure your account is secure.</p>
                <p>Thank you,<br>The Support Team</p>
            </div>
        `;
    }
}