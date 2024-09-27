document.addEventListener("DOMContentLoaded", function () {
  const questionsContainer = document.getElementById("questions-container");
  let questionCount = 0;

  function createOptionField(additionalInputs, questionIndex, optionText = "") {
    const optionDiv = document.createElement("div");
    const optionInput = document.createElement("input");
    optionInput.type = "text";
    optionInput.placeholder = "Opção";
    optionInput.name = `questions[${questionIndex}][options][]`;
    optionInput.required = true;
    optionInput.value = optionText;

    const removeOptionBtn = document.createElement("button");
    removeOptionBtn.type = "button";
    removeOptionBtn.classList.add("remove-option");

    const trashIcon = document.createElement("img");
    trashIcon.src = "/static/assets/img/delete.png";
    trashIcon.alt = "Remover Opção";
    trashIcon.style.width = "20px";

    removeOptionBtn.appendChild(trashIcon);
    optionDiv.appendChild(optionInput);
    optionDiv.appendChild(removeOptionBtn);
    additionalInputs.appendChild(optionDiv);

    removeOptionBtn.addEventListener("click", function () {
      optionDiv.remove();
    });
  }

  function addQuestionTypeEventListener(questionElement, questionIndex) {
    const questionTypeSelect = questionElement.querySelector(".question_type");
    const additionalInputs =
      questionElement.querySelector(".additional-inputs");

    questionTypeSelect.addEventListener("change", function () {
      additionalInputs.innerHTML = "";

      if (this.value === "multiple_choice" || this.value === "single_choice") {
        const addOptionBtn = document.createElement("button");
        addOptionBtn.type = "button";
        addOptionBtn.classList.add("add-option");

        const addIcon = document.createElement("img");
        addIcon.src = "/static/assets/img/add.png";
        addIcon.alt = "Adicionar Opção";
        addIcon.style.width = "20px";

        addOptionBtn.appendChild(addIcon);
        additionalInputs.appendChild(addOptionBtn);

        addOptionBtn.addEventListener("click", function () {
          createOptionField(additionalInputs, questionIndex);
        });
      } else if (this.value === "short_answer") {
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.placeholder = "Até 200 caracteres...";
        inputField.maxLength = 200;
        inputField.name = `questions[${questionIndex}][short_answer]`;
        additionalInputs.appendChild(inputField);
      } else if (this.value === "long_answer") {
        const textArea = document.createElement("textarea");
        textArea.placeholder = "Resposta longa...";
        textArea.name = `questions[${questionIndex}][long_answer]`;
        additionalInputs.appendChild(textArea);
      }
    });
  }

  function addQuestion() {
    questionCount++;
    const newQuestionDiv = document.createElement("div");
    newQuestionDiv.className = "question";
    newQuestionDiv.setAttribute("data-id", questionCount);
    newQuestionDiv.innerHTML = `
      <div>
        <label>Enunciado da Questão:</label>
        <input type="text" name="questions[${questionCount}][question_text]" required><br>
      </div>
      <div>
        <label>Tipo:</label>
        <select name="questions[${questionCount}][question_type]" class="question_type">
          <option value="" disabled selected>Selecione</option>
          <option value="short_answer">Resposta Curta</option>
          <option value="long_answer">Resposta Longa</option>
          <option value="single_choice">Escolha Única</option>
          <option value="multiple_choice">Múltipla Escolha</option>
        </select>
      </div>
      <div class="additional-inputs"></div>
      <div class="content-question-button">
        <button type="button" class="remove-question">Remover questão
        </button>
      </div>
    `;
    questionsContainer.appendChild(newQuestionDiv);
    addQuestionTypeEventListener(newQuestionDiv, questionCount);

    newQuestionDiv
      .querySelector(".remove-question")
      .addEventListener("click", function () {
        newQuestionDiv.remove();
      });
  }

  document
    .getElementById("add-question")
    .addEventListener("click", addQuestion);
});
