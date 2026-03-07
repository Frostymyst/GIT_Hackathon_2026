import json
from dataclasses import dataclass
from openai import OpenAI
from config import settings


@dataclass
class EmailResponseData:
    name: str
    summary: str
    category: str | None
    actions: dict[str, str] | None = None

    @classmethod
    def parse_raw(cls, raw_str: str, all_actions: dict[str, str]) -> EmailResponseData:
        try:
            data = json.loads(raw_str)

            raw_actions = data.get("actions", {})
            actions: dict[str, str] = {}

            for action in raw_actions if isinstance(raw_actions, dict) else []:
                if action in all_actions:
                    actions[str(action)] = (
                        f"{all_actions[action]}\n{raw_actions[action]}"
                    )

            return cls(
                name=data.get("name", ""),
                summary=data.get("summary", ""),
                category=data.get("category", None),
                actions=actions,
            )
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON format: {e}")


@dataclass
class ExistingEmailResponseData(EmailResponseData):
    context: str | None = None

    @classmethod
    def parse_raw(
        cls, raw_str: str, all_actions: dict[str, str], context: str | None = None
    ) -> ExistingEmailResponseData:
        try:
            data = json.loads(raw_str)
            return cls(
                name=data.get("name", ""),
                summary=data.get("summary", ""),
                category=data.get("category", None),
                actions=data.get("actions", []),
                context=context,
            )
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
        self,
        email_content: str,
        valid_categories: list[str],
        valid_actions: dict[str, str] | None = None,
    ) -> EmailResponseData:
        """Extracts a summary and relevant category from an email that is not associated with an existing ticket.

        Args:
            email_content (str): The full content of the incoming email.
            valid_categories (list[str]): A list of valid categories that can be applied to the email.
            valid_actions (list[str] | None): An optional list of valid actions that can be recommended based on the email content.

        Returns:
            EmailResponseData: Parsed summary and matched category from the email.

        Raises:
            ValueError: If the LLM response cannot be parsed as valid JSON.
        """

        system_prompt = f"""You are a system that processes incoming emails. Your task is to read the email content, provide a concise name and summary of the email, and assign a single relevant category based on the content. The summary should capture the main points of the email including any important details, numbers, dates, or mentions of specifics relevant to the email's context.
        
        You MUST ONLY select a category from the following list of valid categories: {valid_categories}. Choose the single most appropriate category. If none of the valid categories apply, return null for category.
        
        The name MUST be no more than 7 words and should concisely capture the subject of the email.

        The summary MUST be no greater than 300 words though should only be as long as necessary to capture all relevant information from the email. Any information that is essential such as order numbers, dates, or product names, shall be bolded by being wrapped in double asterisks (e.g. **order #12345**).

        DO NOT ask for anything that would prompt the customer to reply with an attachment as our system does not currently have the capability to process attachments.
        
        {f'If you believe there is an action that should be taken based on the content of the email, you can optionally include an "actions" field in your response which is a dictionary of actions including the name of the action and a description of the specifics relating to that action. You DO NOT need to include a description of what the action is as that the description that is included here in the valid actions will be added to your description. The valid actions are: {valid_actions}. If there are no actions that should be taken, you can omit the "actions" field or return it as an empty list.' if valid_actions else 'Return an "actions" field as an empty list since no valid actions were provided.'}
        
        Your response should be in the following JSON format:
        {{
            "name": str,
            "summary": str,
            "category": str | null,
            "actions": dict[str, str] | None
        }}
        """

        prompt = f"{system_prompt}\n\nEmail Content:\n{email_content}"

        response = self.prompt(prompt)

        # Parse the response as JSON
        try:
            response_data = EmailResponseData.parse_raw(
                response, valid_actions if valid_actions else {}
            )
        except Exception as e:
            raise ValueError(f"Failed to parse LLM response: {e}")

        return response_data

    def generate_email_reply(
        self,
        description: str,
        category: str | None,
        actions_to_take: dict[str, str] | None = None,
    ) -> str:
        """Generates a draft reply to an email based on the email content and its conversation history.

        Args:
            email_content (str): The full content of the incoming email.
            conversation_history (list[dict]): Prior messages in the conversation thread.
            actions_to_take (list[str] | None): An optional list of actions that have been identified as necessary based on the email content. This can provide additional context to the LLM for generating an appropriate reply.

        Returns:
            str: A draft reply to the email.
        """

        system_prompt = f"""You are a helpful customer service assistant. Your job is to draft a reply to an incoming email based on the content of the email, the history of the conversation, and any actions that have been identified as necessary. The reply should be professional, concise, friendly, and should address the customer's concerns, questions, and actions that need to be taken. 
        
        Your response should ONLY include the draft reply and should not include any explanations, notes, 
        
        This conversation has the following category associated with it: {category}
        
        The email should be authored as being from the 'Customer Service Team' and should be signed off as such.
        
        The ONLY valid communication method with the customer is through email replies. You should NOT suggest any other communication methods such as phone calls, video calls, or in-person meetings in your response.
        
        DO NOT say that the company will do any certain action such as authorizing a refund, issueing issueing a return, or any other dates, times, of specific details in the response without explicit information in the email content, conversation history, or this system prompt that confirms those details. At the same time, DO NOT say that the company cannot do any actions. Your job is to collect information, reassure the customre, then handoff to a support representative. If the email content or conversation history does not explicitly confirm those details, you should instead say that you will look into the issue and get back to them with more information.

        DO NOT ask for anything that would prompt the customer to reply with an attachment as our system does not currently have the capability to process attachments.
        
        DO NOT indicate that you are an AI language model in the response and DO NOT refer to yourself as an AI language model. You are a helpful customer service assistant that is drafting a reply on behalf of the Customer Service Team. If you do not know how to respond to the email, you should respond saying that you will escalate the issue to another representative who will be better able to assist them and that they will be in touch with them shortly. DO NOT say that the issue is being escalated to a human representative as that implies that you are not human."""

        prompt = f"{system_prompt}\n\nConversation History:\n{description}\n\nActions to Take:\n{actions_to_take if actions_to_take else 'None'}\n\nDraft a reply to the latest email based on the conversation history and actions to take."

        response = self.prompt(prompt)

        return response

    def handle_email_reply(
        self,
        description: str,
        valid_actions: dict[str, str] | None = None,
    ) -> ExistingEmailResponseData:
        """Extracts a summary and relevant tags from an email reply within an existing conversation.

        Args:
            email_content (str): The full content of the incoming email reply.
            conversation_history (list[dict]): Prior messages in the conversation thread.

        Returns:
            ExistingEmailResponseData: Parsed summary, matched tags, and conversation context.

        Raises:
            ValueError: If the LLM response cannot be parsed as valid JSON.
        """

        system_prompt = f"""You are a system that processes incoming email replies. Your task is to read the email content and its conversation history, provide a concise summary of the latest reply, and assign a single relevant category based on the content.

        The summary MUST be no greater than 300 words. Any essential information such as order numbers, dates, or product names shall be bolded by being wrapped in double asterisks (e.g. **order #12345**).
        
        {f'If you believe there is an action that should be taken based on the content of the email, you can optionally include an "actions" field in your response which is a list of action names. The valid actions are: {valid_actions}. If there are no actions that should be taken, you can omit the "actions" field or return it as an empty list.' if valid_actions else 'Return an "actions" field as an empty list since no valid actions were provided.'}

        Your response should be in the following JSON format:
        {{
            "summary": str,
            "category": str | null,
            "actions": list[str]
        }}
        """

        prompt = f"{system_prompt}\n\nConversation History:\n{description}"

        response = self.prompt(prompt)

        try:
            response_data = ExistingEmailResponseData.parse_raw(
                response, valid_actions if valid_actions else {}, context=description
            )
        except Exception as e:
            raise ValueError(f"Failed to parse LLM response: {e}")

        return response_data
