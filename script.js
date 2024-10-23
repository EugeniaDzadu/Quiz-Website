// Select elements from the DOM (HTML)
const questionElement = document.getElementById('quiz-question');
const optionsElements = document.querySelectorAll('.options label');
const nextButton = document.getElementById('next-btn');
const errorElement = document.getElementById('error');

// Variables to keep track of quiz state
let correctAnswer = ''; // Store the correct answer for each question
let questionIndex = 0;  // Track the number of questions answered
let totalQuestions = 5; // Total number of questions in the quiz

// Function to load a new trivia question
function fetchTrivia() {
    // Clear any previous error messages and reset styles
    errorElement.textContent = '';
    nextButton.disabled = true; // Disable the button until an answer is chosen

    // Fetch a question from the trivia API
    fetch('https://the-trivia-api.com/api/questions?limit=1') // Get 1 random question
        .then(response => response.json()) // Convert response to JSON
        .then(data => {
            // Extract the first question from the data
            const question = data[0];

            // Display the question text
            questionElement.textContent = question.question;

            // Store the correct answer
            correctAnswer = question.correctAnswer;

            // Get all the answers (correct + incorrect answers)
            const answers = [...question.incorrectAnswers, question.correctAnswer];

            // Shuffle the answers to randomize the order
            answers.sort(() => Math.random() - 0.5);

            // Loop through each option label and update the text and value
            optionsElements.forEach((label, index) => {
                const radioButton = label.querySelector('input');
                label.textContent = answers[index]; // Set the label text
                label.prepend(radioButton); // Keep the radio button inside the label
                radioButton.value = answers[index]; // Set the radio button value
                radioButton.checked = false; // Clear previous selection
            });
        })
        .catch(error => {
            // Display an error message if something goes wrong
            errorElement.textContent = "Error fetching trivia: " + error.message;
        });
}

// Function to handle the user's selection and check the answer
function checkAnswer() {
    // Find the selected answer
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) {
        errorElement.textContent = 'Please select an answer before proceeding.';
        return;
    }

    // Check if the selected answer is correct
    const userAnswer = selectedOption.value;
    if (userAnswer === correctAnswer) {
        alert('Correct!');
    } else {
        alert(`Incorrect. The correct answer was: ${correctAnswer}`);
    }

    // Move to the next question or end the quiz
    questionIndex++;
    if (questionIndex < totalQuestions) {
        fetchTrivia(); // Load the next question
    } else {
        // End the quiz and display a completion message
        questionElement.textContent = 'You have completed the quiz!';
        optionsElements.forEach(label => {
            label.textContent = ''; // Clear the options
        });
        nextButton.style.display = 'none'; // Hide the Next button
        alert('Congratulations! You have completed the quiz.');
    }
}

// Add an event listener to the "Next Question" button
nextButton.addEventListener('click', checkAnswer);

// Add event listener to enable the "Next Question" button after selecting an option
document.querySelectorAll('input[name="answer"]').forEach(input => {
    input.addEventListener('change', () => {
        nextButton.disabled = false; // Enable the Next button once an option is chosen
    });
});

// Call fetchTrivia when the page loads to display the first question
document.addEventListener('DOMContentLoaded', fetchTrivia);
