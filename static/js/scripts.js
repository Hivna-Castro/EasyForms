document.addEventListener("DOMContentLoaded", function () {
  const questionTemplate = document.getElementById("question-template");

  function createOptionField(additionalInputs, questionIndex) {
    const optionDiv = document.createElement("div");
    const optionInput = document.createElement("input");
    optionInput.type = "text";
    optionInput.placeholder = "Opção";
    optionInput.name = `option_text[${questionIndex}][]`;
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

  function addQuestionTypeEventListener(questionElement, questionIndex) {
    const questionTypeSelect = questionElement.querySelector(".question_type");
    const additionalInputs =
      questionElement.querySelector(".additional-inputs");

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
          createOptionField(additionalInputs, questionIndex);
        });
        additionalInputs.appendChild(addOptionBtn);
      } else if (this.value === "short_answer") {
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.placeholder = "Até 200 caracteres...";
        inputField.maxLength = 200;
        inputField.name = `short_answer[${questionIndex}]`;
        additionalInputs.appendChild(inputField);
      } else if (this.value === "long_answer") {
        const textArea = document.createElement("textarea");
        textArea.placeholder = "Resposta longa...";
        textArea.name = `long_answer[${questionIndex}]`;
        additionalInputs.appendChild(textArea);
      }
    });
  }

  let questionIndex = 0;
  addQuestionTypeEventListener(questionTemplate, questionIndex);

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

      questionIndex++;
      addQuestionTypeEventListener(newQuestion, questionIndex);

      newQuestion
        .querySelector(".remove-question")
        .addEventListener("click", function () {
          newQuestion.remove();
        });

      document.getElementById("questions-container").appendChild(newQuestion);
    });
});
