from model.model import model

success_msg = "Your complaint has been registered successfully."

chat_session = model.start_chat(history=[])

def send(query):
    response = chat_session.send_message(query)
    
    response = response.text.strip()
    
    if response == success_msg:
        summary = send("Summary")
        response += f"\n{summary}"
    
    return response
    
    
    

