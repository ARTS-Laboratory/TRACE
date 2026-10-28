import logging
from pytictoc import TicToc

logging.basicConfig(level=logging.INFO,
                     format='%(asctime)s - %(levelname)s - %(message)s',
                     datefmt='%Y-%m-%d %I:%M:%S %p')
logger = logging.getLogger(__name__)

t = TicToc()
