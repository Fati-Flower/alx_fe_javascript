// Initial array of quotes
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

// Show a random quote from selected category
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const random = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[random].text}" — ${filteredQuotes[random].category}`;
}

// Add new quote dynamically
function addQuote() {
  const text = quoteTextInput.value.trim();
  const category = quoteCategoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });

    // If category is not in select, add it
    if (![...categorySelect.options].some(opt => opt.value.toLowerCase() === category.toLowerCase())) {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    }

    // Clear inputs
    quoteTextInput.value = "";
    quoteCategoryInput.value = "";
    alert("Quote added!");
  } else {
    alert("Please enter both quote and category.");
  }
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
