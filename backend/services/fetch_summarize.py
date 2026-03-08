import json
import os
from datetime import datetime, timezone

from services.email_service import fetch_emails, send_email
from services.llm import LLM
from services.createTask import create_task

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
STATE_FILE = os.path.join(DATA_DIR, "last_email.json")

FETCH_BATCH = 5
MAX_FETCH = 10


def load_state() -> dict:
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE) as f:
            return json.load(f)
    return {"last_uid": None, "last_time": None}


def save_state(uid: str, time: str):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump({"last_uid": uid, "last_time": time}, f, indent=2)


def process_batch(batch: list, ai: LLM, dry_run: bool = False):
    for e in batch:
        if e.sender != "Jack Koskie <jack@koskie.ca>":
            continue
        content = f"From: {e.sender}\nSubject: {e.subject}\nDate: {e.date}\n\n{e.body}"
        try:
            result = ai.handle_new_email(
                content,
                valid_categories=["general"],
                valid_actions={"insufficient-information": "Request more"},
            )
            if dry_run:
                task_id = 1
                body = ai.generate_email_reply(content, result.category, result.actions)
                print(e.sender, f"Re: {e.subject}", task_id, body)
                send_email(e.sender, f"Re: {e.subject}", task_id, body, e.message_id)
            else:
                actions = result.actions

                if actions:
                    task_id = create_task(
                        name=result.name,
                        email=e.sender,
                        summary=result.summary,
                        description=content,
                        due_date=None,
                        category=result.category,
                        status="delayed",
                    )

                    body = ai.generate_email_reply(content, result.category, actions)

                    send_email(
                        e.sender, f"Re: {e.subject}", task_id, body, e.message_id
                    )
                else:

                    create_task(
                        name=result.name,
                        email=e.sender,
                        summary=result.summary,
                        description=content,
                        due_date=None,
                        category=result.category,
                    )
                print(f"Task created: {result.name}")

        except Exception as ex:
            print(f"Failed to process email uid={e.uid}: {ex}")


def run(dry_run: bool = False):
    state = load_state()
    last_uid = int(state["last_uid"]) if state["last_uid"] is not None else None

    ai = LLM()
    all_new_emails = []
    offset = 0

    while True:
        batch = fetch_emails(FETCH_BATCH, offset)
        if not batch:
            break

        # batch is ordered newest-first; check newest in this window
        if last_uid is not None and int(batch[0].uid) <= last_uid:
            print("No new emails.")
            break

        new_in_batch = [e for e in batch if last_uid is None or int(e.uid) > last_uid]
        process_batch(new_in_batch, ai, dry_run=dry_run)
        all_new_emails.extend(new_in_batch)

        if len(new_in_batch) < len(batch):
            break

        offset += FETCH_BATCH
        if offset >= MAX_FETCH:
            break

    if not all_new_emails:
        return

    newest = max(all_new_emails, key=lambda e: int(e.uid))
    save_state(
        uid=newest.uid.decode(),
        time=datetime.now(timezone.utc).isoformat(),
    )
    print(f"Processed {len(all_new_emails)} email(s). Last UID: {newest.uid.decode()}")


if __name__ == "__main__":
    run()
