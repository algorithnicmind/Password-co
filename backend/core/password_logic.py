import secrets
import string
import re

def generate_secure_password(length: int = 16, use_symbols: bool = True, use_numbers: bool = True) -> str:
    """Generates a cryptographically secure random password."""
    chars = string.ascii_letters
    if use_numbers:
        chars += string.digits
    if use_symbols:
        chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    # Ensure the password isn't just one type of character
    while True:
        password = ''.join(secrets.choice(chars) for _ in range(length))
        if (any(c.islower() for c in password)
                and any(c.isupper() for c in password)
                and (not use_numbers or any(c.isdigit() for c in password))
                and (not use_symbols or any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password))):
            return password

def check_password_strength(password: str) -> dict:
    """Analyzes password strength and returns a score and feedback."""
    score = 0
    feedback = []

    if len(password) >= 12:
        score += 2
    elif len(password) >= 8:
        score += 1
    else:
        feedback.append("Password is too short.")

    if re.search(r"[A-Z]", password) and re.search(r"[a-z]", password):
        score += 1
    else:
        feedback.append("Include both uppercase and lowercase letters.")

    if re.search(r"\d", password):
        score += 1
    else:
        feedback.append("Add at least one number.")

    if re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        score += 1
    else:
        feedback.append("Add at least one special character.")

    # Convert score to label
    if score >= 5:
        strength = "Very Strong"
    elif score >= 4:
        strength = "Strong"
    elif score >= 3:
        strength = "Medium"
    else:
        strength = "Weak"

    return {
        "score": score,
        "strength": strength,
        "feedback": feedback
    }
