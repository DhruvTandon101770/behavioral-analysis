import os

# Flask Config
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")

# XAMPP MySQL Database Config
DB_HOST = "localhost"
DB_USER = "root"  # Default XAMPP MySQL user
DB_PASSWORD = ""  # XAMPP MySQL default has no password
DB_NAME = "behavioral_analysis"
