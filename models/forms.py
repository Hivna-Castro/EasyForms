import datetime
from extensions import db

class Forms(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    questions = db.relationship('Questions', backref='form', lazy=True)

    def __init__(self, title, description=None):
        self.title = title
        self.description = description
   