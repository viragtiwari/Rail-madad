import os
from dotenv import load_dotenv
import google.generativeai as genai

from model.prompts import CHAT_PROMPT, ROUTE_PROMPT

# Load the .env file
load_dotenv()

# Configure the API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# Create the model
generation_config = {
    "temperature": 0.6,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

chat_model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    system_instruction=CHAT_PROMPT,
)

routing_model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    system_instruction=ROUTE_PROMPT,
)
