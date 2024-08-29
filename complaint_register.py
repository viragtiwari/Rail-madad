import utils
from smart_routing import get_route
from model.model import chat_model

chat_session = chat_model.start_chat(history=[])


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
        pnr = utils.extract_pnr(response)
        problem = utils.extract_problem(response)
        sentiment = utils.extract_sentiment(response)
        # workflow
        complaint_number = utils.generate_ucid(pnr)
        print(complaint_number)  # testing
        route = get_route(pnr, problem, sentiment)
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
