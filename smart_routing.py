from model.model import routing_model
import utils

chat_session = routing_model.start_chat(history=[])


def get_route(summary):
    
    pnr, problem, sentiment = utils.parse_summary(summary)
    
    response = chat_session.send_message(
        f"Pnr: {pnr} :: Problem: {problem} :: Sentiment of the user: {sentiment}"
    )

    ucid = utils.generate_ucid(pnr_number=pnr)
    return response.text, ucid
