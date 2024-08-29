from complaint_number import generate_special_string
from complaint_parser import extract_pnr, extract_problem, extract_sentiment
from smart_routing import complaint_route
from model.model import model

chat_session = model.start_chat(history=[])


def complaint_registration(query):
    response = chat_session.send_message(query)
    return response.text


response = ""
while True:
    query = input("Message: ")
    response = complaint_registration(query)
    print(response)
    if response.strip() == "Your complaint has been registered successfully.":
        response = complaint_registration("Summary")
        pnr = extract_pnr(response)
        problem = extract_problem(response)
        sentiment = extract_sentiment(response)
        # workflow
        complaint_number = generate_special_string(pnr)
        print(complaint_number)  # testing
        route = complaint_route(pnr, problem, sentiment)
        print(route)
        while True:
            query1 = input("Message:  ")
            response1 = complaint_registration(f"""
Complaint has been registered with Complaint number: {complaint_number}
Now your task is to assure user their problem would be resolved as soon as possible
Answer the query in the most empathetic manner

Query:
{query1}""")
            print(response1)

    


# Urgency codes comes here::::
# ======== code ========
