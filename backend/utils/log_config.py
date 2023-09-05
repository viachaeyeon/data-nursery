import logging
from logging.handlers import TimedRotatingFileHandler

# Create a logger
logger = logging.getLogger("data_nursery_logger")

# Set the logging level (you can adjust this as needed)
logger.setLevel(logging.INFO)

# Create a file handler for the log file (change the path to your desired location)
log_file = "logs/access.log"
file_handler = TimedRotatingFileHandler(
    log_file, when="midnight", interval=1, backupCount=7
)
# file_handler = logging.FileHandler(log_file)

# Create a formatter to define log message format
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")

# Add the formatter to the file handler
file_handler.setFormatter(formatter)

# Add the file handler to the logger
logger.addHandler(file_handler)
