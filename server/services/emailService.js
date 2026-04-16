const nodemailer = require('nodemailer');

// Create transporter using environment variables
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send email to faculty
 * @param {string} to - Faculty email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} text - Plain text content (fallback)
 */
const sendEmail = async (to, subject, html, text) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_FROM || 'USTP TPCO <tpco@ustp.edu.ph>',
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send IP application status update notification
 * @param {string} to - Faculty email
 * @param {object} application - Application data
 * @param {string} oldStatus - Previous status
 * @param {string} newStatus - New status
 */
const sendStatusUpdateEmail = async (to, application, oldStatus, newStatus) => {
  const subject = `IP Application Status Update: ${application.title}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">USTP TPCO</h1>
        <p style="color: #e0e7ff; margin: 5px 0 0 0;">Technology Transfer and Commercialization Office</p>
      </div>
      
      <div style="padding: 30px; background: #ffffff;">
        <h2 style="color: #1e40af; margin-top: 0;">Application Status Updated</h2>
        
        <p>Dear ${application.applicant_full_name},</p>
        
        <p>Your IP application status has been updated:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">${application.title}</h3>
          <p style="margin: 5px 0;"><strong>Type:</strong> ${application.ip_type}</p>
          <p style="margin: 5px 0;">
            <strong>Status:</strong> 
            <span style="color: #6b7280; text-decoration: line-through;">${oldStatus}</span>
            <span style="color: #1e40af; font-weight: bold; margin-left: 10px;">→ ${newStatus}</span>
          </p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <p>You can view your application details by logging into the Faculty IP Portal:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/faculty" 
             style="background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Application
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          If you have any questions, please contact the TPCO office at tpco@ustp.edu.ph
        </p>
      </div>
      
      <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          This is an automated message from USTP TPCO. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

  const text = `
USTP TPCO - IP Application Status Update

Dear ${application.applicant_full_name},

Your IP application status has been updated:

Title: ${application.title}
Type: ${application.ip_type}
Status: ${oldStatus} → ${newStatus}
Date: ${new Date().toLocaleDateString()}

You can view your application details by logging into the Faculty IP Portal.

If you have any questions, please contact the TPCO office at tpco@ustp.edu.ph

---
This is an automated message from USTP TPCO.
  `;

  return await sendEmail(to, subject, html, text);
};

/**
 * Send notification email to faculty
 * @param {string} to - Faculty email
 * @param {object} notification - Notification data
 */
const sendNotificationEmail = async (to, notification) => {
  const subject = notification.title || 'USTP TPCO Notification';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">USTP TPCO</h1>
        <p style="color: #e0e7ff; margin: 5px 0 0 0;">Technology Transfer and Commercialization Office</p>
      </div>
      
      <div style="padding: 30px; background: #ffffff;">
        <h2 style="color: #1e40af; margin-top: 0;">${notification.title}</h2>
        
        <p>Dear Faculty Member,</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #374151;">${notification.message}</p>
        </div>
        
        ${notification.action_url ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${notification.action_url}" 
             style="background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            ${notification.action_text || 'View Details'}
          </a>
        </div>
        ` : ''}
        
        <p style="color: #6b7280; font-size: 14px;">
          If you have any questions, please contact the TPCO office.
        </p>
      </div>
      
      <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          This is an automated message from USTP TPCO. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

  const text = `
USTP TPCO - ${notification.title}

Dear Faculty Member,

${notification.message}

${notification.action_url ? `View details: ${notification.action_url}` : ''}

If you have any questions, please contact the TPCO office.

---
This is an automated message from USTP TPCO.
  `;

  return await sendEmail(to, subject, html, text);
};

/**
 * Send welcome email to new faculty
 * @param {string} to - Faculty email
 * @param {string} name - Faculty name
 */
const sendWelcomeEmail = async (to, name) => {
  const subject = 'Welcome to USTP TPCO Faculty IP Portal';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">USTP TPCO</h1>
        <p style="color: #e0e7ff; margin: 5px 0 0 0;">Technology Transfer and Commercialization Office</p>
      </div>
      
      <div style="padding: 30px; background: #ffffff;">
        <h2 style="color: #1e40af; margin-top: 0;">Welcome to the Faculty IP Portal!</h2>
        
        <p>Dear ${name},</p>
        
        <p>Your account has been successfully created for the USTP TPCO Faculty IP Filing System. You can now:</p>
        
        <ul style="color: #374151; line-height: 1.8;">
          <li>Submit IP applications (Patents, Utility Models, Industrial Designs, Copyrights)</li>
          <li>Track the status of your applications</li>
          <li>Receive notifications about updates</li>
          <li>Manage your IP portfolio</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/faculty" 
             style="background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Access Faculty Portal
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          If you have any questions, please contact the TPCO office at tpco@ustp.edu.ph
        </p>
      </div>
      
      <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          This is an automated message from USTP TPCO.
        </p>
      </div>
    </div>
  `;

  const text = `
Welcome to USTP TPCO Faculty IP Portal!

Dear ${name},

Your account has been successfully created for the USTP TPCO Faculty IP Filing System. You can now:

- Submit IP applications (Patents, Utility Models, Industrial Designs, Copyrights)
- Track the status of your applications
- Receive notifications about updates
- Manage your IP portfolio

Access the Faculty Portal: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/faculty

If you have any questions, please contact the TPCO office at tpco@ustp.edu.ph

---
USTP TPCO
  `;

  return await sendEmail(to, subject, html, text);
};

module.exports = {
  sendEmail,
  sendStatusUpdateEmail,
  sendNotificationEmail,
  sendWelcomeEmail,
};
