from extensions import db

answer_options = db.Table('answer_options',
    db.Column('answer_id', db.Integer, db.ForeignKey('answers.id'), primary_key=True),
    db.Column('option_id', db.Integer, db.ForeignKey('options.id'), primary_key=True)
)

class Answers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    short_answer = db.Column(db.String(200), nullable=True)  
    long_answer = db.Column(db.Text, nullable=True)           
    response_id = db.Column(db.Integer, db.ForeignKey('options.id'), nullable=True)  
    selected_options = db.relationship('Options', secondary=answer_options, lazy='subquery',
                                       backref=db.backref('answers', lazy=True))  

    def __init__(self, question_id):
        self.question_id = question_id
