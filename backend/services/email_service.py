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


# Email Class
class Email:
    def __init__(self, uid: bytes, sender: str, subject: str, date: str, body: str):
        self.uid = uid
        self.sender = sender
        self.subject = subject
        self.date = date
        self.body = body

    def __str__(self):
        return f"UID: {self.uid} | From: {self.sender} | Subject: {self.subject} | Date: {self.date} | Body: {self.body}"


# IMAP - Fetch latest emails
def fetch_emails(n=5):
    email_list = []
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
            body = ""
            if msg.is_multipart():
                for part in msg.walk():
                    if part.get_content_type() == "text/plain":
                        payload = part.get_payload(decode=True)
                        if isinstance(payload, bytes):
                            body = payload.decode(errors="replace")
                        break
            else:
                payload = msg.get_payload(decode=True)
                if isinstance(payload, bytes):
                    body = payload.decode(errors="replace")
            email_list.append(Email(uid, msg['From'], msg['Subject'], msg['Date'], body))
            print("-" * 40)
    return email_list


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



email_list = fetch_emails()
for emailMsg in email_list:
    print(emailMsg)

#send_email()
fetch_calendar()
#create_event("Event", datetime(2026, 3, 10, 10, 0), datetime(2026, 3, 10, 11, 0))