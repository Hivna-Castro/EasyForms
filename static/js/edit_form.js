document.addEventListener("DOMContentLoaded", function () {
  const questionTemplate = document.getElementById("question-template");

  function createOptionField(additionalInputs, optionText = "") {
    const optionDiv = document.createElement("div");
    const optionInput = document.createElement("input");
    optionInput.type = "text";
    optionInput.placeholder = "Opção";
    optionInput.name = `questions[][options][]`;
    optionInput.value = optionText;
    optionInput.required = true;

    const removeOptionBtn = document.createElement("button");
    removeOptionBtn.type = "button";
    removeOptionBtn.id = "removeOptionBtn";
    const trashIcon = document.createElement("img");
    trashIcon.src = "/static/assets/img/delete.png";
    trashIcon.alt = "Remover Opção";
    trashIcon.style.width = "20px";

    removeOptionBtn.appendChild(trashIcon);

    removeOptionBtn.addEventListener("click", function () {
      optionDiv.remove();
    });

    optionDiv.appendChild(optionInput);
    optionDiv.appendChild(removeOptionBtn);
    additionalInputs.appendChild(optionDiv);
  }

  function addQuestionTypeEventListener(questionTemplate) {
    const questionTypeSelect = questionTemplate.querySelector(".question_type");
    const additionalInputs =
      questionTemplate.querySelector(".additional-inputs");

    if (!questionTypeSelect || !additionalInputs) {
      console.error("Elementos não encontrados no template de pergunta.");
      return;
    }

    questionTypeSelect.addEventListener("change", function () {
      additionalInputs.innerHTML = "";

      if (this.value === "multiple_choice" || this.value === "single_choice") {
        const addOptionBtn = document.createElement("button");
        addOptionBtn.type = "button";
        addOptionBtn.id = "addOptionBtn";

        const addIcon = document.createElement("img");
        addIcon.src = "/static/assets/img/add.png";
        addIcon.alt = "Adicionar Opção";
        addIcon.style.width = "20px";

        addOptionBtn.appendChild(addIcon);

        addOptionBtn.addEventListener("click", function () {
          createOptionField(additionalInputs);
        });
        additionalInputs.appendChild(addOptionBtn);
      } else if (this.value === "short_answer") {
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.placeholder = "Resposta curta...";
        inputField.maxLength = 200;
        inputField.name = `questions[][short_answer]`;
        additionalInputs.appendChild(inputField);
      } else if (this.value === "long_answer") {
        const textArea = document.createElement("textarea");
        textArea.placeholder = "Resposta longa...";
        textArea.name = `questions[][long_answer]`;
        additionalInputs.appendChild(textArea);
      }
    });
  }

  if (questionTemplate) {
    addQuestionTypeEventListener(questionTemplate);
  } else {
    console.error("Template de pergunta não encontrado.");
  }

  function populateQuestion(question) {
    const newQuestion = questionTemplate.cloneNode(true);
    newQuestion.style.display = "block";
    newQuestion.removeAttribute("id");

    const questionTextInput = newQuestion.querySelector(".question_text");
    if (questionTextInput) {
      questionTextInput.value = question.question_text;
    }

    const questionTypeSelect = newQuestion.querySelector(".question_type");
    if (questionTypeSelect) {
      questionTypeSelect.value = question.question_type;
    }

    const additionalInputs = newQuestion.querySelector(".additional-inputs");
    additionalInputs.innerHTML = "";

    if (
      question.question_type === "multiple_choice" ||
      question.question_type === "single_choice"
    ) {
      question.options.forEach((option) => {
        createOptionField(additionalInputs, option.option_text);
      });
    }

    document.getElementById("questions-container").appendChild(newQuestion);
    addQuestionTypeEventListener(newQuestion);
  }

  const questionsToEdit = JSON.parse(
    document.getElementById("existing-questions").value || "[]"
  );
  questionsToEdit.forEach(populateQuestion);

  document
    .getElementById("add-question")
    .addEventListener("click", function () {
      const newQuestion = questionTemplate.cloneNode(true);
      newQuestion.style.display = "block";
      newQuestion.removeAttribute("id");
      newQuestion.querySelector(".question_text").value = "";
      newQuestion.querySelector(".question_type").value = "short_answer";

      const additionalInputs = newQuestion.querySelector(".additional-inputs");
      additionalInputs.innerHTML = "";

      addQuestionTypeEventListener(newQuestion);
      document.getElementById("questions-container").appendChild(newQuestion);
    });

  document.getElementById("form").addEventListener("submit", function (event) {
    console.log("Enviando formulário...");
  });
});
