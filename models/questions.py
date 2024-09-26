from extensions import db, ma
from .options import OptionsSchema  

class Questions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    form_id = db.Column(db.Integer, db.ForeignKey('forms.id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    question_type = db.Column(db.Enum('short_answer', 'long_answer', 'multiple_choice', 'single_choice', name='question_type'), nullable=False)
    options = db.relationship('Options', backref='question', lazy=True)

    def __init__(self, form_id, question_text, question_type):
        self.form_id = form_id
        self.question_text = question_text
        self.question_type = question_type

class QuestionsSchema(ma.SQLAlchemyAutoSchema):
    options = ma.Nested('OptionsSchema', many=True)
    class Meta:
        model = Questions
        fields = ('id', 'form_id', 'question_text', 'question_type', 'options')

question_schema = QuestionsSchema()
questions_schema = QuestionsSchema(many=True)