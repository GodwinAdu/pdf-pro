export const password_reset_2 = ({resetLink,fullName}:{resetLink:string,fullName:string}) =>`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f7;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
            background-color: #4CAF50;
            color: white;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .content {
            padding: 20px;
        }
        .reset-link {
            font-size: 18px;
            text-align: center;
            padding: 15px;
            background-color: #f0f0f0;
            border-radius: 8px;
            margin: 20px 0;
            word-wrap: break-word;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-size: 16px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #999;
            font-size: 12px;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Dear ${fullName},</p>
            <p>You requested a password reset for your account. Please click the link below to reset your password. This link will expire in 1 hour. If you did not request this password reset, please ignore this email.</p>

            <div class="reset-link">
                <a href="${resetLink}" class="button">Reset Password</a>
            </div>

            <p>If the button above does not work, copy and paste the following URL into your browser:</p>
            <p><a href="${resetLink}">${resetLink}</a></p>

            <p>Best regards,<br>EduxcelMaster Team</p>
        </div>
        <div class="footer">
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>

</body>
</html>
`