export const sendEmailNotification = async ({
  to,
  subject,
  html,
  text
}: {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}) => {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html, text }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    throw error;
  }
};
