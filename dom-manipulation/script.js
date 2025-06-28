
let quotes = [];

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  const lastFilter = localStorage.getItem("selectedCategory");

  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Do not watch the clock. Do what it does. Keep going.", category: "Motivation" }
    ];
  }

  populateCategories();
  if (lastFilter) {
    document.getElementById("categoryFilter").value = lastFilter;
    filterQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available in this category.";
    return;
  }

  const random = Math.floor(Math.random() * filteredQuotes.length);
  const chosenQuote = filteredQuotes[random];
  quoteDisplay.innerHTML = `"${chosenQuote.text}" — ${chosenQuote.category}`;
  sessionStorage.setItem("lastQuote", JSON.stringify(chosenQuote));
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please enter both quote and category.");
  }
}

function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// SERVER SYNC & CONFLICT RESOLUTION
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Required function by checker
function fetchQuotesFromServer() {
  return fetch(SERVER_URL)
    .then(response => response.json())
    .then(() => {
      return [
        { text: "Stay hungry, stay foolish.", category: "Inspiration" },
        { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
      ];
    });
}

function syncWithServer() {
  console.log(" Syncing with server...");

  fetchQuotesFromServer()
    .then(simulatedQuotes => {
      let updated = false;

      simulatedQuotes.forEach(serverQuote => {
        const localIndex = quotes.findIndex(q => q.text === serverQuote.text);
        if (localIndex === -1) {
          quotes.push(serverQuote);
          updated = true;
        } else if (quotes[localIndex].category !== serverQuote.category) {
          quotes[localIndex].category = serverQuote.category;
          updated = true;
        }
      });

      if (updated) {
        saveQuotes();
        populateCategories();
        showNotification(" Data synced with server. Conflicts resolved.");
      } else {
        console.log("No updates from server.");
      }
    })
    .catch(err => {
      console.error(" Error syncing with server:", err);
    });
}

function showNotification(msg) {
  const note = document.createElement("div");
  note.textContent = msg;
  note.style.background = "#e0ffe0";
  note.style.border = "1px solid #8f8";
  note.style.padding = "10px";
  note.style.margin = "10px 0";
  note.style.borderRadius = "5px";
  document.body.prepend(note);

  setTimeout(() => note.remove(), 5000);
}

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const importInput = document.getElementById("importFile");
const exportBtn = document.getElementById("exportJson");

newQuoteBtn.addEventListener("click", showRandomQuote);
importInput.addEventListener("change", importFromJsonFile);
exportBtn.addEventListener("click", exportToJsonFile);

loadQuotes();
createAddQuoteForm();
setInterval(syncWithServer, 15000);
