from model.model import chat_model
from smart_routing import get_route

success_msg = "Your complaint has been registered successfully."

chat_session = chat_model.start_chat(history=[])

def send(query):
    response = chat_session.send_message(query)
    
    response = response.text.strip()
    
    if response == success_msg:
        
        summary = send("Summary")
        # TODO: log summary to database
        print(summary)
        
        route = get_route(summary)
        # TODO: log route to database
        print(route)
    
    return response
    
    
    

