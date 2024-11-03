from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature, BadData

from src import app

def generate_token(email):
    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
    return serializer.dumps(email, salt=app.config["SECURITY_PASSWORD_SALT"])

def confirm_token(token, expiration=3600): # 1 hour of expiration
    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
    try:
        # Try to load the token
        email = serializer.loads(
            token, salt=app.config["SECURITY_PASSWORD_SALT"], max_age=expiration
        )
        return email  # Token is valid and email is returned
    except SignatureExpired:
        # Token has expired
        return "Token has expired. Please request a new one."
    except BadSignature:
        # Token signature is invalid
        return "Invalid token. The token signature is incorrect."
    except BadData:
        # Data in token cannot be deserialized
        return "Invalid token. The data could not be processed."
    except Exception as e:
        # Catch-all for other exceptions
        return f"An error occurred: {str(e)}"