from pydantic import BaseModel


class emailMsg(BaseModel):
    uid: bytes
    sender: str
    subject: str
    date: str
    body: str

    def __str__(self):
        return f"From: {self.sender} | Subject: {self.subject} | Date: {self.date}\nBody: {self.body}"
