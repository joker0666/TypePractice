// Random Quotes Api URL
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
const countdownDisplay = document.getElementById("countdown");
const quoteChars = document.querySelectorAll(".quote-chars");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;
let countdown = 5;

 



// Function to update the countdown timer on the screen
function updateCountdown() {
  const countdownDisplay = document.getElementById("countdown");
  
  if (countdown === 0) {
    // Start the test when the countdown reaches 0
    startTest();
    // Remove the 'active' class and add the 'finished' class
    userInput.classList.remove("active");
    userInput.classList.add("finished");

    // Completely remove the parent <p> element
    const parentP = countdownDisplay.parentElement;
    parentP.parentNode.removeChild(parentP);
  } else {
    countdown--;
    countdownDisplay.innerText = countdown + "s";
    setTimeout(updateCountdown, 1000);
  }
}


// Function to handle user input and track mistakes
userInput.addEventListener("input", () => {
  if (countdown === 0) {
    const quoteChars = document.querySelectorAll(".quote-chars");
    const userInputChars = userInput.value.split("");

    quoteChars.forEach((char, index) => {
      if (char.innerText == userInputChars[index]) {
        char.classList.add("success");
        userInput.classList.remove("fail"); // Remove the red background when correct
      } else if (userInputChars[index] == null) {
        if (char.classList.contains("success")) {
          char.classList.remove("success");
        } else {
          char.classList.remove("fail");
        }
      } else {
        if (!char.classList.contains("fail")) {
          mistakes += 1;
          char.classList.add("fail");
          userInput.classList.add("fail"); // Add this line to highlight wrong input
        } else {
          userInput.classList.remove("fail"); // Remove the red background when corrected
        }
      }
    });

    let isQuoteCompleted = Array.from(quoteChars).every((element) => {
      return element.classList.contains("success");
    });

    if (isQuoteCompleted) {
      displayResult();
    }
  } else {
    userInput.value = "";
  }
});

// Function to update the placeholder when the text area is focused
function updatePlaceholder() {
  if (countdown === 0) {
    userInput.placeholder = ""; // Set an empty string when countdown is over
  } else {
    userInput.placeholder = "Type the text above once the cooldown is over";
  }
}

// Start Test
const startTest = () => {
  mistakes = 0;
  timer = "";
  userInput.disabled = false;
  timeReduce();
};

// Update Timer on screen
function updateTimer() {
  if (time == 0) {
    displayResult();
  } else {
    document.getElementById("timer").innerText = --time + "s";
  }
}

// Sets timer
const timeReduce = () => {
  time = 60;
  timer = setInterval(updateTimer, 1000);
};

// End Test
const displayResult = () => {
  // Hide the quote information initially
  document.getElementById("quoteInfo").style.display = "none";

  document.querySelector(".result").style.display = "block";
  clearInterval(timer);
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;

  let timeTaken = 1; // Ensure timeTaken is at least 1 to avoid division by zero
  if (time != 0) {
    timeTaken = (60 - time) / 60; // Calculate time in minutes
  }

  // Calculate WPM accurately:
  const totalWords = userInput.value.trim().split(/\s+/).length; // Count words
  const wpm = (totalWords / timeTaken).toFixed(2);

  document.getElementById("wpm").innerText = wpm + " wpm";
  document.getElementById("accuracy").innerText =
    Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + " %";
  document.getElementById("mistakes").innerText = mistakes;

  // Show the quote information after the test is finished
  document.getElementById("quoteInfo").style.display = "block";
};



// Initial setup on page load
document.addEventListener("DOMContentLoaded", () => {
  userInput.value = "";
  userInput.disabled = false; // Enable the text area initially
  renderNewQuote();
});

// Event listener for the text area click to start the countdown
userInput.addEventListener("focus", () => {
  if (countdown > 0) {
    // Start the countdown immediately when the user focuses on the text area
    updateCountdown();
  }
});


const renderNewQuote = async () => {
  try {
    const response = await fetch(quoteApiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch quote: ${response.statusText}`);
    }

    const data = await response.json();
    quote = data.content;
    quoteSection.innerHTML = quote
      .split("")
      .map((value) => `<span class='quote-chars'>${value}</span>`)
      .join("");

    // Add quote details to the quote info div
    document.getElementById("author").innerText = data.author;
    document.getElementById("tags").innerText = data.tags.join(", ");
  } catch (error) {
    console.error("Error fetching quote:", error); // Log the error for debugging
    // Handle the error gracefully for the user, e.g., display an error message
    alert("Failed to retrieve a new quote. Please try again later.");
  }
};

 