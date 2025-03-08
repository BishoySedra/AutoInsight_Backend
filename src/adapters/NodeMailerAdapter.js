// Email provider implementation (Adapter pattern)
import nodemailer from 'nodemailer';
export class NodemailerAdapter {
  constructor() {
      // Lazy initialization
      this._transporter = null;
  }
  
  get transporter() {
      if (!this._transporter) {
          console.log(process.env.EMAIL_USERNAME)
          console.log(process.env.EMAIL_PASSWORD)
          this._transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  user: process.env.EMAIL_USERNAME,
                  pass: process.env.EMAIL_PASSWORD
              },
              tls: {
                  rejectUnauthorized: false // In production, set to true
              }
          });
        }
      return this._transporter;
  }
  
  async sendMail(options) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            ...options
        };
        
        const result =  await this.transporter.sendMail(mailOptions);
        return result;
    }
      catch (err) {
        console.log('error sending email', err.message);
      }
    }
}