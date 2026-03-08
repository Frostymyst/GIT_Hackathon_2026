import os
from dotenv import load_dotenv
from services.fetch_summarize import run as fetch_emails_run

# Force the script to load variables from the .env file in the /app directory
load_dotenv()
fetch_emails_run(False)
