from flask import Flask, render_template, request, redirect, url_for, flash
from settings import url, secret_key
from extensions import db
from models import Forms, Questions, Options, Answers

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = secret_key

db.init_app(app)  

with app.app_context():
    db.create_all()  

# "home" - lista os formulários existentes
@app.route('/', methods=['GET'])
def list_forms():
    try:
        forms = Forms.query.all()
        return render_template('forms.html', forms=forms)
    except Exception as e:
        return "Ocorreu um erro ao listar os formulários.", 500

@app.route('/forms/add', methods=['GET', 'POST'])
def add_form():
    if request.method == 'POST':

        title = request.form.get('title')
        description = request.form.get('description')

        new_form = Forms(title=title, description=description)
        db.session.add(new_form)

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return "Erro ao criar formulário, tente novamente.", 500

        questions = request.form.getlist('question_text[]')
        question_types = request.form.getlist('question_type[]')

        for index, question_text in enumerate(questions):
            question_type = question_types[index]
            options = request.form.getlist(f'option_text[{index}][]') 

            new_question = Questions(form_id=new_form.id, question_text=question_text, question_type=question_type)
            db.session.add(new_question)

            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                return "Erro ao adicionar pergunta, tente novamente.", 500

            if question_type in ['multiple_choice', 'single_choice']:
                if not options:
                    return f'Pergunta "{question_text}" deve ter pelo menos uma opção.', 400

                for option_text in options:
                    new_option = Options(question_id=new_question.id, option_text=option_text)
                    db.session.add(new_option)

                try:
                    db.session.commit()
                except Exception as e:
                    db.session.rollback()
                    return "Erro ao adicionar opções, tente novamente.", 500

        return redirect(url_for('list_forms')) 

    return render_template('add_form.html')


#editar form especifico
@app.route('/forms/edit/<int:form_id>', methods=['GET', 'POST'])
def edit_form(form_id):
    form = Forms.query.get_or_404(form_id)

    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')

        form.title = title
        form.description = description

        question_ids = request.form.getlist('question_id') 
        question_texts = request.form.getlist('questions[][question_text]')  
        question_types = request.form.getlist('questions[][question_type]')  

        for i, question_text in enumerate(question_texts):
            question_id = question_ids[i] if i < len(question_ids) else None
            question_type = question_types[i]

            if question_id: 
                question = Questions.query.get(question_id)
                if question:
                    question.question_text = question_text
                    question.question_type = question_type

                    if question_type in ['multiple_choice', 'single_choice']:
                        option_texts = request.form.getlist(f'questions[{i}][options][]')  

                        Options.query.filter_by(question_id=question_id).delete()
                        for option_text in option_texts:
                            if option_text:  
                                new_option = Options(option_text=option_text, question_id=question_id)
                                db.session.add(new_option)

            else:  
                new_question = Questions(question_text=question_text, question_type=question_type, form_id=form_id)
                db.session.add(new_question)

                if question_type in ['multiple_choice', 'single_choice']:
                    option_texts = request.form.getlist(f'questions[{i}][options][]')
                    for option_text in option_texts:
                        if option_text:  
                            new_option = Options(option_text=option_text, question_id=new_question.id)
                            db.session.add(new_option)

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return f"Erro ao editar formulário: {str(e)}", 500

        return redirect(url_for('list_forms'))

    questions = [
        {
            'id': q.id,
            'question_text': q.question_text,
            'question_type': q.question_type,
            'options': [{'id': o.id, 'option_text': o.option_text} for o in q.options]
        }
        for q in form.questions
    ]
    return render_template('edit_form.html', form=form, questions=questions)


@app.route('/forms/respond/<int:form_id>', methods=['GET'])
def respond_form(form_id):
    form = Forms.query.get_or_404(form_id)
        
    return render_template('respond_form.html', form=form)

@app.route('/forms/delete/<int:form_id>', methods=['POST'])
def delete_form(form_id):
    if request.form.get('_method') == 'DELETE':
        form = Forms.query.get_or_404(form_id)
        
        if form:
            answers = Answers.query.filter_by(question_id=form.id).all() 
            for answer in answers:
                db.session.delete(answer) 

            for question in form.questions:
                for option in question.options:
                    db.session.delete(option)
                db.session.delete(question)

            db.session.delete(form)
            db.session.commit()

            flash('Formulário deletado com sucesso!')
        else:
            flash('Formulário não encontrado.')
            
    return redirect(url_for('list_forms'))

if __name__ == "__main__":
    app.run(debug=True)