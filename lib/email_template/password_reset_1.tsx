export const password_reset_1 = ({ fullName, resetLink }: { fullName: string, resetLink: string }) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Password Reset Request</title>
    <style>
        /* Container */
        .container {
            width: 100%;
            padding: 20px;
            background-color: #f4f4f7;
            font-family: Arial, sans-serif;
            color: #333;
        }
        /* Header */
        .header {
            text-align: center;
            padding: 10px 0;
            background-color: #4CAF50;
            color: white;
        }
        /* Content */
        .content {
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        /* Reset Button */
        .reset-button {
            display: block;
            width: 100%;
            max-width: 200px;
            margin: 20px auto;
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 4px;
        }
        /* Footer */
        .footer {
            text-align: center;
            padding: 10px 0;
            color: #999;
            font-size: 12px;
        }
        /* Responsive */
        @media (max-width: 600px) {
            .content {
                padding: 10px;
            }
            .reset-button {
                width: 100%;
            }
        }
    </style>
</head>
<body>

    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <p>Dear ${fullName},</p>
            <p>We received a request to reset your password. Please click the button below to proceed. This link is valid for 1 hour.</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/${resetLink}" class="reset-button" target="_blank" rel="noopener noreferrer">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email or contact support.</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>&copy; 2024 EduxcelMaster. All rights reserved.</p>
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>

</body>
</html>
`;

