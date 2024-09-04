from model.model import chat_model
from smart_routing import get_route
from model.prompts import CHAT_PROMPT


# Initialize the conversation with a system message
conversation = []

def update_conversation(role, content):
    conversation.append({"role": role, "content": content})

success_msg = "Your complaint has been registered successfully."

system_prompt = CHAT_PROMPT

def send(query):
    update_conversation("user",query)
    response = chat_model(conversation,system_prompt)
    update_conversation("assistant", response)
    if response == success_msg:
        summary = send("Summary")
        # TODO: log summary to database
        print(summary)
        
        route,ucid= get_route(summary)
        # TODO: log route to database
        print(route,ucid)
    
    return response
    
    
    

