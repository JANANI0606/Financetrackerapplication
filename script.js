
document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");
    const budgetInput = document.getElementById("monthly-budget");
    const loginBtn = document.getElementById("login-btn");
    const userEmailInput = document.getElementById("user-email");

    let expenses = [];
    let monthlyBudget = 0;
    let currentUser = null; // 🆕 Stores authenticated user info

    // 🆕 User Authentication
    loginBtn.addEventListener("click", () => {
        const userEmail = userEmailInput.value.trim();

        if (userEmail === "" || (!userEmail.includes("@") && isNaN(userEmail))) {
            alert("Please enter a valid email or phone number.");
            return;
        }

        currentUser = userEmail;
        alert(`Logged in as: ${currentUser}`);
        userEmailInput.disabled = true;
        loginBtn.disabled = true;
    });

    // 🆕 Listen for budget input change
    if (budgetInput) {
        budgetInput.addEventListener("input", () => {
            monthlyBudget = parseFloat(budgetInput.value) || 0;
            checkBudget();
        });
    }

    // 🆕 Function to check if the budget is exceeded
    function checkBudget() {
        const budgetValue = document.getElementById("monthly-budget").value.trim();
        if (budgetValue === "" || isNaN(budgetValue) || parseFloat(budgetValue) <= 0) {
            return; // No valid budget set
        }
    
        const monthlyBudget = parseFloat(budgetValue);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
    
        // 🔹 Filter expenses only for the current month & year
        const monthlyExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        });
    
        // 🔹 Calculate total expenses for the month
        const totalMonthlyExpense = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
        // 🔹 Show alert if budget exceeded
        if (totalMonthlyExpense > monthlyBudget) {
            alert(`⚠️ Budget Exceeded! Your total expenses ($${totalMonthlyExpense.toFixed(2)}) have exceeded the set budget of $${monthlyBudget}.`);
        }
    }
    

    // 🆕 Prevent adding expenses if the user is not authenticated
    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();
    
        if (!currentUser) {
            alert("Please log in before adding expenses.");
            return;
        }
    
        const name = document.getElementById("expense-name").value.trim();
        const amountValue = document.getElementById("expense-amount").value.trim();
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;
    
        // 🛑 Check if amount is a valid number
        if (amountValue === "" || isNaN(amountValue) || parseFloat(amountValue) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
    
        const amount = parseFloat(amountValue); // Convert to number
    
        const expense = {
            id: Date.now(),
            name,
            amount,
            category,
            date
        };
    
        expenses.push(expense);
        displayExpenses(expenses);
        updateTotalAmount();
        checkBudget();
    
        expenseForm.reset();
    });
    
    
        

    function displayExpenses(expenses) {
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `;

            expenseList.appendChild(row);
        });
    }

    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }

    // 🆕 Handle Delete & Edit Actions
    expenseList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const id = parseInt(e.target.dataset.id);
            expenses = expenses.filter(expense => expense.id !== id);
            displayExpenses(expenses);
            updateTotalAmount();
            checkBudget();
        }

        if (e.target.classList.contains("edit-btn")) {
            const id = parseInt(e.target.dataset.id);
            const expense = expenses.find(expense => expense.id === id);

            document.getElementById("expense-name").value = expense.name;
            document.getElementById("expense-amount").value = expense.amount;
            document.getElementById("expense-category").value = expense.category;
            document.getElementById("expense-date").value = expense.date;

            expenses = expenses.filter(expense => expense.id !== id);
            displayExpenses(expenses);
            updateTotalAmount();
            checkBudget();
        }
    });

    // 🆕 Handle Filter Category
    filterCategory.addEventListener("change", (e) => {
        const category = e.target.value;
        if (category === "All") {
            displayExpenses(expenses);
        } else {
            const filteredExpenses = expenses.filter(expense => expense.category === category);
            displayExpenses(filteredExpenses);
        }
    });
});

    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");

    let expenses = [];

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();
    
        // Get amount input value
        let amountValue = document.getElementById("expense-amount").value.trim();
    
        // 🔹 Ensure input is not empty and contains only numbers
        if (amountValue === "" || isNaN(amountValue) || parseFloat(amountValue) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
    
        const amount = parseFloat(amountValue);
    
        // Create expense object
        const expense = {
            id: Date.now(),
            name: document.getElementById("expense-name").value.trim(),
            amount,
            category: document.getElementById("expense-category").value,
            date: document.getElementById("expense-date").value
        };
    
        expenses.push(expense);
        displayExpenses(expenses);
        updateTotalAmount();
        checkBudget();
    
        expenseForm.reset();
    });
    

    expenseList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const id = parseInt(e.target.dataset.id);
            expenses = expenses.filter(expense => expense.id !== id);
            displayExpenses(expenses);
            updateTotalAmount();
        }

        if (e.target.classList.contains("edit-btn")) {
            const id = parseInt(e.target.dataset.id);
            const expense = expenses.find(expense => expense.id === id);

            document.getElementById("expense-name").value = expense.name;
            document.getElementById("expense-amount").value = expense.amount;
            document.getElementById("expense-category").value = expense.category;
            document.getElementById("expense-date").value = expense.date;

            expenses = expenses.filter(expense => expense.id !== id);
            displayExpenses(expenses);
            updateTotalAmount();
        }
    });

    filterCategory.addEventListener("change", (e) => {
        const category = e.target.value;
        if (category === "All") {
            displayExpenses(expenses);
        } else {
            const filteredExpenses = expenses.filter(expense => expense.category === category);
            displayExpenses(filteredExpenses);
        }
    });

    function displayExpenses(expenses) {
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `;

            expenseList.appendChild(row);
        });
    }

    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }

