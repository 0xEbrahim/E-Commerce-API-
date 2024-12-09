export const generateEmailTemplate = (token) => {
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

export const generatePasswordTemplate = (token) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
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
    <h1>Reset Your Password</h1>
    <p>Hello,</p>
    <p>You recently requested to reset your password. Click the button below to reset it:</p>
    <a href="http://localhost:5000/api/v1/auth/resetPassword?token=${token}" class="button">Reset Password</a>
    <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
    <div class="footer">
      <p>© 2024 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
  return html;
};

export const generateTwoStepAuthTemplate = (OTP) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Two-Factor Authentication</title>
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
    .code {
      display: inline-block;
      margin: 20px 0;
      padding: 10px 20px;
      font-size: 24px;
      font-weight: bold;
      color: #333333;
      background-color: #f4f4f4;
      border-radius: 5px;
      border: 1px solid #ddd;
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
    <h1>Two-Factor Authentication Code</h1>
    <p>Hello,</p>
    <p>Use the following code to complete your login:</p>
    <div class="code">${OTP}</div>
    <p>This code is valid for the next 10 minutes. If you did not request this, please secure your account immediately.</p>
    <div class="footer">
      <p>© 2024 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
  return html;
};

export const generatechangePasswordConfirmTemplate = (email) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Change Confirmation</title>
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
      background-color: #28a745;
      text-decoration: none;
      border-radius: 5px;
    }
    .button:hover {
      background-color: #218838;
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
    <h1>Password Changed</h1>
    <p>Hello,</p>
    <p>We noticed that the password for your account was recently changed. If you made this change, no further action is required.</p>
    <p>If you did not change your password, please secure your account immediately by clicking the button below:</p>
    <a href="https://localhost:5000/api/v1/users/secureAccount/${email}" class="button">Secure My Account</a>
    <p>If you have any questions or concerns, please contact our support team.</p>
    <div class="footer">
      <p>© 2024 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
  return html;
};

export const generateAccountDeactivatedTemplate = () => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Deactivated</title>
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
    <h1>Account Deactivated</h1>
    <p>Hello,</p>
    <p>We wanted to let you know that your account has been deactivated. If you requested this action, no further steps are needed.</p>
    <p>You still can retrieve your account within 30 days.</p>
    <p>If you have any questions, please don't hesitate to reach out.</p>
    <div class="footer">
      <p>© 2024 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
  return html;
};


export const generateReactivateAccountTemplate = () => {
  const html =`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Reactivated</title>
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
      background-color: #28a745;
      text-decoration: none;
      border-radius: 5px;
    }
    .button:hover {
      background-color: #218838;
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
    <h1>Welcome Back!</h1>
    <p>Hello,</p>
    <p>We’re happy to let you know that your account has been successfully reactivated. You can now log in and continue using our services as usual.</p>
    <p>If you did not request this reactivation or have any concerns, please contact our support team immediately.</p>
    <div class="footer">
      <p>© 2024 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`
return html
}