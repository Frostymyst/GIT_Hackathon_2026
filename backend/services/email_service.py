import imaplib
from datetime import datetime
import smtplib
import email
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import caldav
from dotenv import load_dotenv

load_dotenv()

# .env Variables
EMAIL = os.getenv("EMAIL", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
CALDAV_PASSWORD = os.getenv("CALDAV_PASSWORD", "")
IMAP_SERVER = os.getenv("IMAP_SERVER", "")
SMTP_SERVER = os.getenv("SMTP_SERVER", "")
CALDAV_URL = os.getenv("CALDAV_URL", "")


# IMAP - Fetch latest emails
def fetch_emails(n=5):
    print("\n=== Fetching Emails (IMAP) ===")
    with imaplib.IMAP4_SSL(IMAP_SERVER) as mail:
        mail.login(EMAIL, SMTP_PASSWORD)
        mail.select("INBOX") # Select Mailbox
        _, data = mail.search(None, "ALL")
        ids = data[0].split()
        latest = ids[-n:]
        for uid in reversed(latest):
            _, msg_data = mail.fetch(uid, "(RFC822)")
            msg = email.message_from_bytes(msg_data[0][1])
            print(f"From: {msg['From']}") # Print - Email Sender
            print(f"Subject: {msg['Subject']}") # Print - Email Subject 
            print(f"Date: {msg['Date']}") # Print - Email Date
            print(f"UID: {uid}") # Print - Email UID
            print("-" * 40)


# SMTP - Send a test email
def send_email():
    print("\n=== Sending Test Email (SMTP) ===")
    msg = MIMEMultipart()
    msg["From"] = EMAIL
    msg["To"] = EMAIL
    msg["Subject"] = "Test Email from Hackathon Script"
    msg.attach(MIMEText("This is a test email sent via smtplib.", "plain"))

    with smtplib.SMTP_SSL(SMTP_SERVER, 465) as server:
        server.login(EMAIL, SMTP_PASSWORD)
        server.sendmail(EMAIL, EMAIL, msg.as_string())
    print("Email sent successfully.")


# CalDAV - Fetch calendar events
def fetch_calendar():
    print("\n=== Fetching Calendar Events (CalDAV) ===")
    # Client Configuration
    client = caldav.DAVClient(
        url=CALDAV_URL,
        username=EMAIL,
        password=CALDAV_PASSWORD,
    )
    principal = client.principal()
    calendars = principal.calendars() # Index Account Calendars
    calendar = calendars[1] # Select Calender[1] = "Test" Calendar
    print(f"\nCalendar: {calendar.name}") # Print - Calendar Name
    events = calendar.events() # Load Calendar Events
    for event in events[:5]: 
        ical = event.icalendar_instance
        for component in ical.walk():
            if component.name == "VEVENT":
                summary = component.get("SUMMARY", "No title") # Event - Title
                dtstart = component.get("DTSTART") # Event - Start Date
                dtend = component.get("DTEND") # Event - End Date
                print(f"  - {summary} @ {dtstart.dt if dtstart else 'No date'} to {dtend.dt if dtend else 'No date'}")

# CalDAV - Make an Event
def create_event(title:str, start:datetime, end:datetime):
    '''
    title - Event Title
    Start Date - Year, Month, Day, Hour, Minute
    End Date - Year, Month, Day, Hour, Minute  
    '''
    print("\n=== Creating Calendar Event (CalDAV) ===")
    client = caldav.DAVClient(url=CALDAV_URL, username=EMAIL, password=CALDAV_PASSWORD)
    cal = client.principal().calendars()[1]
    cal.save_event(
        summary=title, # Event Title
        dtstart= start, # Start Date - Year, Month, Day, Hour, Minute 
        dtend=end, # End Date - Year, Month, Day, Hour, Minute 
    )
    print("Event created.")


if __name__ == "__main__":
    fetch_emails()
    #send_email()
    fetch_calendar()
    #create_event("Event", datetime(2026, 3, 10, 10, 0), datetime(2026, 3, 10, 11, 0))