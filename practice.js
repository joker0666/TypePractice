const selectedBookId = sessionStorage.getItem('selectedBook');
const selectedBookParagraphs = JSON.parse(sessionStorage.getItem('selectedBookParagraphs'));

const quoteSection = document.getElementById("bookParagraphs");
const userInput = document.getElementById("quote-input");
const countdownDisplay = document.getElementById("countdown");

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

function updatePlaceholder() {
    if (countdown === 0) {
        userInput.placeholder = "";
    } else {
        userInput.placeholder = "Type the text above once the cooldown is over";
    }
}

const startTest = () => {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
};

function updateTimer() {
    if (time == 0) {
        displayResult();
    } else {
        document.getElementById("timer").innerText = --time + "s";
    }
}

const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
};

const displayResult = () => {
    document.getElementById("quoteInfo").style.display = "none";

    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;

    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 60;
    }

    const totalWords = userInput.value.trim().split(/\s+/).length;
    const wpm = (totalWords / timeTaken).toFixed(2);

    document.getElementById("wpm").innerText = wpm + " wpm";
    document.getElementById("accuracy").innerText =
        Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + " %";
    document.getElementById("mistakes").innerText = mistakes;

    document.getElementById("quoteInfo").style.display = "block";
};

document.addEventListener("DOMContentLoaded", () => {
    userInput.value = "";
    userInput.disabled = false;
    
    renderNewQuote();
});

userInput.addEventListener("click", () => {
    if (countdown > 0) {
        updateCountdown();
    }
});

const renderNewQuote = () => {
    const selectedBookDetails = JSON.parse(sessionStorage.getItem('selectedBookDetails'));
    
    // Display book details on the page
    document.getElementById("bookTitle").innerText = selectedBookDetails.title;
    document.getElementById("author").innerText = selectedBookDetails.author;
    document.getElementById("tags").innerText = selectedBookDetails.tags.join(", ");

    // Generate and display a random paragraph
    quote = getRandomParagraph(selectedBookDetails.paragraphs);
    quoteSection.innerHTML = quote
        .split("")
        .map((value) => `<span class='quote-chars'>${value}</span>`)
        .join("");
};


function getRandomParagraph(paragraphs) {
    return paragraphs[Math.floor(Math.random() * paragraphs.length)];
}
