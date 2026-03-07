import json
from dataclasses import dataclass
from openai import OpenAI
from config import settings


@dataclass
class EmailResponseData:
    summary: str
    tags: list[str]

    @classmethod
    def parse_raw(cls, raw_str: str) -> "EmailResponseData":
        try:
            data = json.loads(raw_str)
            return cls(summary=data.get("summary", ""), tags=data.get("tags", []))
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON format: {e}")


class LLM:
    def __init__(self):
        self.client = OpenAI(api_key=settings.openai_api_key)
        self.model = "gpt-5-mini-2025-08-07"

    def prompt(self, prompt_str: str) -> str:
        response = self.client.responses.create(model=self.model, input=prompt_str)
        return response.output_text

    def handle_new_email(
        self, email_content: str, valid_tags: list[str]
    ) -> EmailResponseData:
        """Extracts a summary and relevant tags from an email that is not associated with an existing ticket.

        Args:
            email_content (str): The full content of the incoming email.
            valid_tags (list[str]): A list of valid tags that can be applied to the email.

        Returns:
            EmailResponseData: Parsed summary and matched tags from the email.

        Raises:
            ValueError: If the LLM response cannot be parsed as valid JSON.
        """

        system_prompt = f"""You are a system that processes incoming emails. Your task is to read the email content, provide a concise summary of the email, and generate relevant tags based on the content. The summary should capture the main points of the email including any important details, numbers, dates, or mentions of specifics relevant to the email's context. The tags should be a list of keywords that represent the type of email and what the content of the email is about. 
        
        You MUST ONLY select tags from the following list of valid tags: {valid_tags}. If none of the valid tags apply, return an empty list for tags.
        
        The summary MUST be no greater than 300 words though should only be as long as necessary to capture all relevant information from the email. Any information that is essential such as order numbers, dates, or product names, shall be bolded by being wrapped in double asterisks (e.g. **order #12345**).
        
        Your response should be in the following JSON format:
        {{
            "summary": str,
            "tags": list[str]
        }}
        """

        prompt = f"{system_prompt}\n\nEmail Content:\n{email_content}"

        response = self.prompt(prompt)

        # Parse the response as JSON
        try:
            response_data = EmailResponseData.parse_raw(response)
        except Exception as e:
            raise ValueError(f"Failed to parse LLM response: {e}")

        return response_data
