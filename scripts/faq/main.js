document.addEventListener("DOMContentLoaded", () => {
  const questions = document.querySelectorAll(".faq-question");

  questions.forEach((question) => {
    question.addEventListener("click", () => {
      console.log("click");
      const answer = question.nextElementSibling;

      if (answer.style.maxHeight) {
        answer.style.maxHeight = null;
      } else {
        answer.style.maxHeight = answer.scrollHeight + "px";
      }

      const icon = question.querySelector(".cross-icon");

      if (icon.classList.contains("rotated")) {
        icon.style.transform = "rotate(0deg)";
        icon.classList.remove("rotated");
      } else {
        icon.style.transform = "rotate(45deg)";
        icon.classList.add("rotated");
      }
    });
  });
});
