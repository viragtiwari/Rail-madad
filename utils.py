import re
from datetime import datetime

def extract_pnr(response):
    # Regular expression for PNR
    pnr_pattern = r"Pnr\s*:\s*(\d+)"
    pnr_match = re.search(pnr_pattern, response)
    return pnr_match.group(1) if pnr_match else None

def extract_problem(response):
    # Regular expression for Problem
    problem_pattern = r"Problem\s*:\s*(.+)"
    problem_match = re.search(problem_pattern, response)
    return problem_match.group(1).strip() if problem_match else None

def extract_sentiment(response):
    # Regular expression for Sentiment
    sentiment_pattern = r"Sentiment\s*:\s*(.+)"
    sentiment_match = re.search(sentiment_pattern, response)
    return sentiment_match.group(1).strip() if sentiment_match else None


def parse_summary(summary):
    pnr = extract_pnr(summary)
    problem = extract_problem(summary)
    sentiment = extract_sentiment(summary)
    
    return pnr, problem, sentiment
    

# UCID = Unique Complaint ID
def generate_ucid(pnr_number):
    # Get current date and time
    now = datetime.now()
    
    # Format the date and time components
    date_str = now.strftime("%d%m%H%M")
    
    # Construct the special string
    special_string = f"RMai{date_str}{pnr_number}"
    
    return special_string

