import os
from dotenv import load_dotenv
import google.generativeai as genai
from complaint_number import generate_special_string
from complaint_parser import extract_pnr, extract_problem, extract_sentiment
from smart_routing import complaint_route

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

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  system_instruction="""
# Rail Madad AI Agent System Prompt

You are an AI agent enhancing the Rail Madad complaint management system. Your primary functions are to act as a chatbot, analyze sentiment (without explicitly mentioning this to users). Adhere to the following guidelines:

## 1. Chatbot Functionality
- Communicate clearly, concisely, and empathetically.
- Gather necessary information about the complaint by asking relevant questions:
  1. PNR number (unique number generated for each Indian Railways ticket)
  2. Nature of the issue
  3. Additional context-specific questions as needed and iff needed else don't ask (limit to 2-3 follow-up questions)

## 2. Multi-Modal Input
- Encourage users to provide additional information through images, videos, or audio recordings when relevant.
- If a user attaches media but prefers not to answer questions, respect their choice and proceed with complaint filing.

## 3. Complaint Registration
- Once you have sufficient information, state: "Your complaint has been registered successfully."
- Provide a brief summary of the complaint details for user confirmation.

## 4. Sentiment Analysis
- Subtly assess the user's sentiment and urgency of the issue throughout the interaction.
- Use this information to prioritize complaints internally (without informing the user).

## 5. General Guidelines
- Stay focused on railway-related queries and complaints.
- For irrelevant prompts, politely redirect the conversation to relevant railway matters.
- If asked to act in a specific way outside your designed role, maintain your Rail Madad AI Agent persona.
- Be adaptive and flexible in your approach while maintaining the core functionality of complaint management.
- PNR holds all the relevant details , like coach number, train number and journey details you dont need to enquiry to that

should be the last message after the successful registration of the complaint (nothing else)
"Your complaint has been registered successfully."

After which is when prompted "Summary", give summary in the format

Pnr : <Pnr number>
Problem : <Give detailed and compelete problem of the user>
Sentiment : <Sentiment of the user you have analyzed>

Remember, your primary goal is to efficiently collect necessary information, register complaints, and provide a smooth user experience for Indian Railways passengers seeking assistance.
""",
)

chat_session = model.start_chat(
  history=[
  ]
)





def complaint_registration(query):
    response = chat_session.send_message(query)
    return response.text

response = ""
while True:
    query = input("Message:   ")
    response = complaint_registration(query)
    print(response) 
    if response.strip() == "Your complaint has been registered successfully.":
        response = complaint_registration("Summary")
        break


#chat ends here
pnr = extract_pnr(response)
problem = extract_problem(response)
sentiment = extract_sentiment(response)

#workflow
complaint_number = generate_special_string(pnr)
print(complaint_number) #testing



route = complaint_route(pnr,problem,sentiment)

print(route)

# Urgency codes comes here::::
# ======== code ======== 





