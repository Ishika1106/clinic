import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# --- Email account details ---
sender_email = "blessingchildcare.diagnostics@gmail.com"
app_password = "tjqqggmhdqmvnzwa"   # The 16-character app password
receiver_email = "nitin.dumeer@gmail.com"

# --- Create the email content ---
msg = MIMEMultipart("alternative")
msg["Subject"] = "Child Checkup Reminder"
msg["From"] = sender_email
msg["To"] = receiver_email

# Plain text version
text = """\
Hello,
This is a friendly reminder for your child's routine checkup tomorrow at 10:00 AM.

Best regards,
Blessings ChildCare And Dignostics
"""

# HTML version
html = """\
<html>
  <body>
    <p>Hello,<br><br>
       This is a friendly reminder for your child's <b>routine checkup</b> tomorrow at <b>10:00 AM</b>.<br><br>
       <i>Best regards,<br>Blessings-ChildCare And Dignostics</i>
    </p>
  </body>
</html>
"""

# Attach both plain and HTML (so email apps can choose)
part1 = MIMEText(text, "plain")
part2 = MIMEText(html, "html")
msg.attach(part1)
msg.attach(part2)

# --- Send the email ---
with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
    server.login(sender_email, app_password)
    print("Sending email to:", receiver_email)
    server.sendmail(sender_email, receiver_email, msg.as_string())

print("Email sent successfully!")