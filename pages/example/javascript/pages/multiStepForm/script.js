
const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");
const progressSteps = document.querySelectorAll(".step");
const form = document.getElementById("multiForm");
const successMsg = document.getElementById("successMsg");

let formStep = 0;

// Show next step
nextBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (validateStep(formStep)) {
      formStep++;
      updateFormSteps();
      updateProgressBar();
    }
  });
});

// Show previous step
prevBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    formStep--;
    updateFormSteps();
    updateProgressBar();
  });
});

// Change visible step
function updateFormSteps() {
  steps.forEach(step => step.classList.remove("active"));
  steps[formStep].classList.add("active");
}

// Update progress bar
function updateProgressBar() {
  progressSteps.forEach((step, idx) => {
    step.classList.toggle("active", idx <= formStep);
  });
}

// Validate fields
function validateStep(stepIndex) {
  const inputs = steps[stepIndex].querySelectorAll("input");
  for (let input of inputs) {
    if (!input.value.trim()) {
      input.style.border = "1px solid red";
      return false;
    } else {
      input.style.border = "1px solid #ccc";
    }
  }
  return true;
}

// Submit form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  successMsg.style.display = "block";
  successMsg.textContent = "Registration Successful!";
  form.reset();
  formStep = 0;
  updateFormSteps();
  updateProgressBar();
});
