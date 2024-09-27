from extensions import db

class Options(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    option_text = db.Column(db.Text, nullable=False)

    def __init__(self, question_id, option_text):
        self.question_id = question_id
        self.option_text = option_text
