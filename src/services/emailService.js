const nodemailer = require('nodemailer');
const { promisify } = require('util');
const sleep = promisify(setTimeout);
const winston = require('winston');
const emailConfig = require('../config/email.config');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport(emailConfig.smtp);
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        })
      );
    }
  }

  async sendEmail(options) {
    const mailOptions = {
      from: emailConfig.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    };

    for (let attempt = 1; attempt <= emailConfig.retryAttempts; attempt++) {
      try {
        await this.validateEmailOptions(mailOptions);
        const info = await this.transporter.sendMail(mailOptions);

        this.logger.info('Email sent successfully', {
          messageId: info.messageId,
          to: options.to,
          subject: options.subject,
        });

        return info;
      } catch (error) {
        this.logger.error('Error sending email', {
          attempt,
          error: error.message,
          to: options.to,
          subject: options.subject,
        });

        if (attempt === emailConfig.retryAttempts) {
          throw new Error(`Failed to send email after ${emailConfig.retryAttempts} attempts: ${error.message}`);
        }

        await sleep(emailConfig.retryDelay);
      }
    }
  }

  async validateEmailOptions(options) {
    if (!options.to) {
      throw new Error('Recipient email is required');
    }

    if (!options.subject) {
      throw new Error('Email subject is required');
    }

    if (!options.text && !options.html) {
      throw new Error('Email must have either text or HTML content');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(options.to)) {
      throw new Error('Invalid recipient email format');
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.info('SMTP connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('SMTP connection verification failed', {
        error: error.message,
      });
      throw error;
    }
  }
}
