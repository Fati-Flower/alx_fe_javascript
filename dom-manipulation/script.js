const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
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
  let filtered = selectedCategory === "all" ? quotes : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
  if (filtered.length === 0) return quoteDisplay.innerHTML = "No quotes available in this category.";
  const random = Math.floor(Math.random() * filtered.length);
  quoteDisplay.innerHTML = `"${filtered[random].text}" — ${filtered[random].category}`;
  sessionStorage.setItem("lastQuote", JSON.stringify(filtered[random]));
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Please enter both quote and category.");
  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  postQuoteToServer(newQuote);
}

function createAddQuoteForm() {
  const container = document.createElement("div");
  container.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
  document.body.appendChild(container);
}

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  select.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join("");
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "quotes.json";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = e => {
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  reader.readAsText(event.target.files[0]);
}

async function fetchQuotesFromServer() {
  try {
    const res = await fetch(SERVER_URL);
    await res.json();
    return [
      { text: "Stay hungry, stay foolish.", category: "Inspiration" },
      { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
    ];
  } catch (err) {
    console.error("❌ Fetch error:", err);
    return [];
  }
}

async function postQuoteToServer(quote) {
  try {
    const res = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    const data = await res.json();
    console.log("✅ Quote posted:", data);
  } catch (err) {
    console.error("❌ Post error:", err);
  }
}

async function syncWithServer() {
  console.log("🔄 Syncing...");
  try {
    const serverQuotes = await fetchQuotesFromServer();
    let updated = false;
    serverQuotes.forEach(sq => {
      const i = quotes.findIndex(lq => lq.text === sq.text);
      if (i === -1) { quotes.push(sq); updated = true; }
      else if (quotes[i].category !== sq.category) {
        quotes[i].category = sq.category; updated = true;
      }
    });
    if (updated) {
      saveQuotes();
      populateCategories();
      showNotification("✅ Synced with server.");
    }
  } catch (err) {
    console.error("❌ Sync failed:", err);
  }
}

function showNotification(msg) {
  const note = document.createElement("div");
  note.textContent = msg;
  Object.assign(note.style, {
    background: "#e0ffe0", border: "1px solid #8f8", padding: "10px",
    margin: "10px 0", borderRadius: "5px"
  });
  document.body.prepend(note);
  setTimeout(() => note.remove(), 5000);
}

// DOM references & listeners
const quoteDisplay = document.getElementById("quoteDisplay");
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
document.getElementById("exportJson").addEventListener("click", exportToJsonFile);

// Init
loadQuotes();
createAddQuoteForm();
setInterval(syncWithServer, 15000);
