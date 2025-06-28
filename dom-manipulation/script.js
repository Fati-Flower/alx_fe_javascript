let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not watch the clock. Do what it does. Keep going.", category: "Motivation" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuote");
const quoteTextInput = document.getElementById("newQuoteText");
const quoteCategoryInput = document.getElementById("newQuoteCategory");
const categorySelect = document.getElementById("categorySelect");

function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available in this category.";
    return;
  }

  const random = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.innerHTML = `"${filteredQuotes[random].text}" — ${filteredQuotes[random].category}`;
}

function addQuote() {
  const text = quoteTextInput.value.trim();
  const category = quoteCategoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });

    if (![...categorySelect.options].some(opt => opt.value.toLowerCase() === category.toLowerCase())) {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    }

    quoteTextInput.value = "";
    quoteCategoryInput.value = "";
  } else {
    alert("Please enter both quote and category.");
  }
}

newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
