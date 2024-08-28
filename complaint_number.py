from datetime import datetime

def generate_special_string(pnr_number):
    # Get current date and time
    now = datetime.now()
    
    # Format the date and time components
    date_str = now.strftime("%d%m%H%M")
    
    # Construct the special string
    special_string = f"RMai{date_str}{pnr_number}"
    
    return special_string

