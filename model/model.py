import os
import base64
import anthropic
import imghdr

from model.prompts import CHAT_PROMPT, ROUTE_PROMPT, IMAGE_PROMPT
import utils

class Model:
    def __init__(self, key):
        self.client = anthropic.Anthropic(api_key=key)
        self.conversation = []

    def _update_conversation(self, role, content):
        self.conversation.append({"role": role, "content": content})

    def chat(self, message):
        self._update_conversation("user", message)

        response = self.client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=4096,
            system=CHAT_PROMPT,
            messages=self.conversation,
            temperature=0,
        )
        self._update_conversation("assistant", message)

        return response.content[0].text

    def route(self, summary):
        pnr, problem, sentiment = utils.parse_summary(summary)
        message = f"Pnr: {pnr} :: Problem: {problem} :: Sentiment of the user: {sentiment}"
        
        response = self.client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=4096,
            system=ROUTE_PROMPT,
            messages=[{"role": "user", "content": message}],
            temperature=0,
        )
        
        ucid = utils.generate_ucid(pnr_number=pnr)
        print(ucid)
        print(response)

    def analyse_image(self, image_path):
        with open(image_path, "rb") as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode("utf-8")

        image_format = imghdr.what(image_path)

        if image_format == "jpeg":
            media_type = "image/jpeg"
        elif image_format == "png":
            media_type = "image/png"
        elif image_format == "jpg":
            media_type = "image/jpg"
        else:
            raise ValueError(f"Unsupported image format: {image_format}")

        response = self.client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=4096,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type, 
                                "data": encoded_image,
                            },
                        },
                        {
                            "type": "text",
                            "text": IMAGE_PROMPT,
                        },
                    ],
                }
            ],
        )

        return response.content[0].text


class TestModel:    
    def chat(self, message):
        return "This is a dummy response for chatting."
        
    def route(self, summary):
        return "This is a dummy response for routing."
    
    def analyse_image(self, image_path):
        return "This is a dummy response for image analysis."
