// Load from localStorage
let books = JSON.parse(localStorage.getItem("books")) || [
  {id: 1, name: "DSA Basics", available: true},
  {id: 2, name: "Algorithms", available: true},
  {id: 3, name: "Operating System", available: true},
  {id: 4, name: "DBMS", available: true}
];

let issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];
let waitingQueue = JSON.parse(localStorage.getItem("queue")) || [];
let returnStack = JSON.parse(localStorage.getItem("stack")) || [];

// Save Data
function saveData() {
  localStorage.setItem("books", JSON.stringify(books));
  localStorage.setItem("issuedBooks", JSON.stringify(issuedBooks));
  localStorage.setItem("queue", JSON.stringify(waitingQueue));
  localStorage.setItem("stack", JSON.stringify(returnStack));
}

// Display Books
function displayBooks() {
  let tbody = document.querySelector("#bookTable tbody");
  tbody.innerHTML = "";

  books.forEach(book => {
    let row = `<tr>
      <td>${book.id}</td>
      <td>${book.name}</td>
      <td>${book.available ? "Available" : "Issued"}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// Issue Book
function issueBook() {
  let id = parseInt(document.getElementById("issueId").value);
  let student = document.getElementById("studentName").value;

  let book = books.find(b => b.id === id);

  if (!book || !student) {
    alert("Enter valid details");
    return;
  }

  if (book.available) {
    book.available = false;
    issuedBooks.push({student, book: book.name});
    alert("Book Issued");
  } else {
    waitingQueue.push({student, bookId: id});
    alert("Added to waiting queue");
  }

  saveData();
  updateUI();
}

// Return Book
function returnBook() {
  let id = parseInt(document.getElementById("returnId").value);
  let book = books.find(b => b.id === id);

  if (!book) {
    alert("Invalid Book ID");
    return;
  }

  book.available = true;

  // Remove issued entry
  issuedBooks = issuedBooks.filter(i => i.book !== book.name);

  // Push to stack
  returnStack.push(book.name);

  // Queue logic
  let index = waitingQueue.findIndex(q => q.bookId === id);

  if (index !== -1) {
    let next = waitingQueue.splice(index, 1)[0];
    book.available = false;
    issuedBooks.push({student: next.student, book: book.name});
    alert("Auto-issued to " + next.student);
  } else {
    alert("Book returned");
  }

  saveData();
  updateUI();
}

// Update UI
function updateUI() {
  displayBooks();

  let issuedList = document.getElementById("issuedList");
  issuedList.innerHTML = "";
  issuedBooks.forEach(i => {
    issuedList.innerHTML += `<li>${i.student} → ${i.book}</li>`;
  });

  let queueList = document.getElementById("queueList");
  queueList.innerHTML = "";
  waitingQueue.forEach(q => {
    queueList.innerHTML += `<li>${q.student} (Book ID: ${q.bookId})</li>`;
  });

  let stackList = document.getElementById("stackList");
  stackList.innerHTML = "";
  returnStack.slice().reverse().forEach(s => {
    stackList.innerHTML += `<li>${s}</li>`;
  });
}

// Initialize
updateUI();
