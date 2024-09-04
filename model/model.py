import os
from dotenv import load_dotenv
import base64
from model.prompts import CHAT_PROMPT, ROUTE_PROMPT
import anthropic
import imghdr

client = anthropic.Anthropic(
    api_key=os.getenv("API_KEY"),
)

# Load the .env file
load_dotenv()

def chat_model(messages,systems):
    response = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=4096,
        system= systems,
        messages=messages,
        temperature=0
    )
    return response.content[0].text

def routing_model(messages,systems):
    response = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=4096,
        system= systems,
        messages=messages,
        temperature=0
    )
    return response.content[0].text


def send_image_request(image_path):
    # Read the image file and encode it to Base64
    with open(image_path, "rb") as image_file:
        encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
    
    # Detect the image format
    image_format = imghdr.what(image_path)
    
    # Set the media type based on the detected format
    if image_format == 'jpeg':
        media_type = 'image/jpeg'
    elif image_format == 'png':
        media_type = 'image/png'
    elif image_format == 'jpg':
        media_type = "image/jpg"
    else:
        raise ValueError(f"Unsupported image format: {image_format}")
    
    # Prepare the message with the image
    response = client.messages.create(
        model="claude-3-5-sonnet-20240620",  # Use the correct model name
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,  # Set the appropriate media type
                            "data": encoded_image
                        }
                    },
                    {"type": "text", "text": "Describe this image."}
                ]
            }
        ]
    )
    
    return response.content[0].text
