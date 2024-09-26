import datetime
from extensions import db, ma
from .questions import QuestionsSchema  

class Forms(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    questions = db.relationship('Questions', backref='form', lazy=True)

    def __init__(self, title, description=None):
        self.title = title
        self.description = description
   
class FormsSchema(ma.SQLAlchemyAutoSchema):
    questions = ma.Nested('QuestionsSchema', many=True)
    class Meta:
        model = Forms
        fields = ('id', 'title', 'description', 'created_at', 'questions')

form_schema = FormsSchema()
forms_schema = FormsSchema(many=True)