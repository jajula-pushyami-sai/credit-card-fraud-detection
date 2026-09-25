from flask_mail import Mail, Message
from flask import render_template_string

mail = Mail()


def send_email(to, subject, html_template_string, **kwargs):
    """
    Sends an email using a raw HTML template string.
    In a real app, you would use render_template with actual HTML files.
    """
    msg = Message(subject, recipients=[to])
    msg.html = render_template_string(html_template_string, **kwargs)
    mail.send(msg)


# Basic templates
WELCOME_TEMPLATE = """
<h1>Welcome to FraudShield AI, {{ name }}!</h1>
<p>Your account has been successfully created.</p>
"""

PASSWORD_RESET_TEMPLATE = """
<h1>Password Reset</h1>
<p>Click <a href="{{ reset_link }}">here</a> to reset your password.</p>
<p>If you did not request this, please ignore this email.</p>
"""
