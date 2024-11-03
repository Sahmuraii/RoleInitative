from flask_mail import Message

from src import app, mail


def send_email(to, subject, template):
    msg = Message(
        subject, # subject of the email
        recipients=[to], # email address of recipient
        html=template, # body of the email
        sender=app.config["MAIL_DEFAULT_SENDER"],
    )
    mail.send(msg)