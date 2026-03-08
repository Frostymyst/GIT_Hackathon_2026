from pydantic import BaseModel


class emailMsg(BaseModel):
    uid: bytes
    sender: str
    subject: str
    date: str
    message_id: str
    references: str | None
    body: str

    def __str__(self):
        return f"From: {self.sender} | Subject: {self.subject} | Date: {self.date}\nBody: {self.body}"
