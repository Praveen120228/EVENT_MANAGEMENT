interface InvitationEmailOptions {
  eventTitle: string;
  eventDate: string;
  eventTime?: string;
  eventLocation?: string;
  eventDescription?: string;
  guestName: string;
  organizerName?: string;
  eventLink?: string;
  responseLink?: string;
}

interface ReminderEmailOptions {
  eventTitle: string;
  eventDate: string;
  eventTime?: string;
  eventLocation?: string;
  guestName: string;
  eventLink?: string;
  responseLink?: string;
}

/**
 * Generate the subject and body for a guest invitation email
 */
export function generateGuestInvitationEmail(options: InvitationEmailOptions) {
  const {
    eventTitle,
    eventDate,
    eventTime,
    eventLocation,
    guestName,
    organizerName,
    eventLink,
  } = options;

  const subject = `You're invited to ${eventTitle}`;

  const timeInfo = eventTime ? `at ${eventTime}` : '';
  const locationInfo = eventLocation ? `Location: ${eventLocation}` : '';

  const body = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header { 
      background-color: #10b981; 
      color: white; 
      padding: 20px;
      border-radius: 5px 5px 0 0;
      text-align: center;
    }
    .content { 
      padding: 20px;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 5px 5px;
    }
    .button {
      background-color: #10b981;
      color: white;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 4px;
      display: inline-block;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      margin-top: 20px;
      font-size: 0.8em;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>You're Invited!</h1>
  </div>
  <div class="content">
    <p>Hello ${guestName},</p>
    
    <p>${organizerName} has invited you to <strong>${eventTitle}</strong>.</p>
    
    <p>
      <strong>Date:</strong> ${eventDate}<br>
      ${eventTime ? `<strong>Time:</strong> ${eventTime}<br>` : ''}
      ${eventLocation ? `<strong>Location:</strong> ${eventLocation}` : ''}
    </p>

    <p>Please respond to let us know if you can make it!</p>
    
    <a href="${eventLink}" class="button">View Event Details</a>
    
    <p>We look forward to seeing you there!</p>
    
    <p>Best regards,<br>The Specyf Team</p>
  </div>
  <div class="footer">
    <p>This invitation was sent via Specyf, an event management platform.</p>
    <p>If you believe you received this in error, please ignore this email.</p>
  </div>
</body>
</html>
  `;

  return { subject, body };
}

/**
 * Generate the subject and body for a reminder email
 */
export function generateGuestReminderEmail(options: ReminderEmailOptions) {
  const {
    eventTitle,
    eventDate,
    eventTime,
    eventLocation,
    guestName,
    eventLink,
  } = options;

  const subject = `Reminder: ${eventTitle} on ${eventDate}`;

  const timeInfo = eventTime ? `at ${eventTime}` : '';
  const locationInfo = eventLocation ? `Location: ${eventLocation}` : '';

  const body = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header { 
      background-color: #10b981; 
      color: white; 
      padding: 20px;
      border-radius: 5px 5px 0 0;
      text-align: center;
    }
    .content { 
      padding: 20px;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 5px 5px;
    }
    .button {
      background-color: #10b981;
      color: white;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 4px;
      display: inline-block;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      margin-top: 20px;
      font-size: 0.8em;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Event Reminder</h1>
  </div>
  <div class="content">
    <p>Hello ${guestName},</p>
    
    <p>This is a friendly reminder about the upcoming event: <strong>${eventTitle}</strong>.</p>
    
    <p>
      <strong>Date:</strong> ${eventDate}<br>
      ${eventTime ? `<strong>Time:</strong> ${eventTime}<br>` : ''}
      ${eventLocation ? `<strong>Location:</strong> ${eventLocation}` : ''}
    </p>

    <p>We're looking forward to seeing you there!</p>
    
    <a href="${eventLink}" class="button">View Event Details</a>
    
    <p>Best regards,<br>The Specyf Team</p>
  </div>
  <div class="footer">
    <p>This reminder was sent via Specyf, an event management platform.</p>
    <p>If you've already responded or believe you received this in error, please disregard this email.</p>
  </div>
</body>
</html>
  `;

  return { subject, body };
} 