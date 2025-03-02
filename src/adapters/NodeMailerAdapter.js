// Email provider implementation (Adapter pattern)
export class NodemailerAdapter {
  constructor() {
      // Lazy initialization
      this._transporter = null;
  }
  
  get transporter() {
      if (!this._transporter) {
          this._transporter = require('nodemailer').createTransport({
              service: config.email.service,
              auth: {
                  user: config.email.username,
                  pass: config.email.password
              },
              tls: {
                  rejectUnauthorized: false // In production, set to true
              }
          });
      }
      return this._transporter;
  }
  
  async sendMail(options) {
      const mailOptions = {
          from: config.email.username,
          ...options
      };
      
      return await this.transporter.sendMail(mailOptions);
  }
}