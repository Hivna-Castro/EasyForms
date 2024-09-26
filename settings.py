import os
from dotenv import dotenv_values
from flask_sqlalchemy import SQLAlchemy

config = dotenv_values(".env")
url = f"{config['DRIVER']}://{config['USER']}:{config['PASSWORD']}@{config['HOST']}:{config['PORT']}/{config['DB']}"
secret_key =os.getenv('SECRET_KEY')
db = SQLAlchemy()
