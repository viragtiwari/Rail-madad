from model.model import routing_model
import utils
from model.prompts import ROUTE_PROMPT


conversation = []

def update_conversation(role, content):
    conversation.append({"role": role, "content": content})

systemprompt = ROUTE_PROMPT

def get_route(summary):
    pnr, problem, sentiment = utils.parse_summary(summary)
    update_conversation("user", f"Pnr: {pnr} :: Problem: {problem} :: Sentiment of the user: {sentiment}")
    response = routing_model(conversation,systemprompt)
    ucid = utils.generate_ucid(pnr_number=pnr)
    return response.text, ucid
