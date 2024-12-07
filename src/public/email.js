export const generateTemplate = (token) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
      color: #ffffff;
      background-color: #007bff;
      text-decoration: none;
      border-radius: 5px;
    }
    .button:hover {
      background-color: #0056b3;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Confirm Your Email Address</h1>
    <p>Hello,</p>
    <p>Thank you for signing up! Please confirm your email address by clicking the button below:</p>
    <a href="http://localhost:5000/api/v1/auth/confirm?token=${token}" class="button">Confirm Email</a>
    <p>If you did not create this account, you can safely ignore this email.</p>
    <div class="footer">
      <p>© 2024 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
  return html;
};
