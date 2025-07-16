document.addEventListener('DOMContentLoaded', async () => {
    const homeScreen = document.getElementById('home-screen');
    const incomeMenu = document.getElementById('income-menu');
    const expenseMenu = document.getElementById('expense-menu');
    const historyScreen = document.getElementById('history-screen');
    const statsScreen = document.getElementById('stats-screen');
    const settingsScreen = document.getElementById('settings-screen');
    const totalIncomeScreen = document.getElementById('total-income-screen');
    const totalExpensesScreen = document.getElementById('total-expenses-screen');
    const totalBalanceScreen = document.getElementById('total-balance-screen');

    const totalExpensesFilterYearSelect = document.getElementById('total-expenses-filter-year');
    const totalExpensesFilterMonthSelect = document.getElementById('total-expenses-filter-month');
    const expensesByCategoryList = document.getElementById('expenses-by-category-list');

    const totalIncomesFilterYearSelect = document.getElementById('total-incomes-filter-year');
    const totalIncomesFilterMonthSelect = document.getElementById('total-incomes-filter-month');
    const incomesByCategoryList = document.getElementById('incomes-by-category-list');

    const allTransactionsTableContainer = document.getElementById('all-transactions-table-container');

    const homeButton = document.getElementById('home-button');
    const historyButton = document.getElementById('history-button');
    const statsButton = document.getElementById('stats-button');
    const settingsButton = document.getElementById('settings-button');
    const addButton = document.getElementById('add-button');
    const subtractButton = document.getElementById('subtract-button');
    const totalIncomeButton = document.getElementById('total-income-button');
    const totalExpensesButton = document.getElementById('total-expenses-button');
    const totalBalanceButton = document.getElementById('total-balance-button');

    const incomeTypeSelect = document.getElementById('income-type');
    const incomeNoteField = document.getElementById('income-note');

    const incomeForm = document.getElementById('income-form');
    const expenseForm = document.getElementById('expense-form');

    const incomeTotalDisplay = document.querySelector('.summary-data p:nth-child(1)');
    const expenseTotalDisplay = document.querySelector('.summary-data p:nth-child(2)');
    
    const incomeTransactionsList = document.getElementById('income-transactions-list');
    const expenseTransactionsList = document.getElementById('expense-transactions-list');

    const filterMonthSelect = document.getElementById('filter-month');
    const filterYearSelect = document.getElementById('filter-year');

    const statsFilterYearSelect = document.getElementById('stats-filter-year');

    const resetDataButton = document.getElementById('reset-data-button');

    // Firebase Configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBbwHWDd_ZCT70nueeaXQ9uHAE8AbzDhbo",
        authDomain: "expensemanagerapp-a1393.firebaseapp.com",
        projectId: "expensemanagerapp-a1393",
        storageBucket: "expensemanagerapp-a1393.firebasestorage.app",
        messagingSenderId: "369697587560",
        appId: "1:369697587560:web:a41c23a6a51f8cefa6d6dd"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    let incomes = [];
    let expenses = [];

    async function loadData() {
        try {
            const incomesSnapshot = await db.collection('incomes').get();
            incomes = incomesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const expensesSnapshot = await db.collection('expenses').get();
            expenses = expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Ensure all items have a transactionType and category for backward compatibility
            incomes.forEach(item => {
                if (!item.category) item.category = item.type;
                if (!item.transactionType) item.transactionType = 'income';
            });
            expenses.forEach(item => {
                if (!item.category) item.category = item.type;
                if (!item.transactionType) item.transactionType = 'expense';
            });

            console.log("Data loaded from Firestore:", { incomes, expenses });
        } catch (error) {
            console.error("Error loading data from Firestore:", error);
        }
    }

    async function saveData() {
        // Data is saved directly when adding/deleting transactions.
        // This function is now primarily for initial setup or if a batch save is needed.
        console.log("saveData() called. Data is saved directly to Firestore on transaction add/delete.");
    }

    const pieCtx = document.getElementById('expense-pie-chart').getContext('2d');
    let balanceChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['Entrate Totali', 'Spese Totali'],
            datasets: [{
                data: [],
                backgroundColor: ['#4CAF50', '#FF6384'],
                hoverOffset: 10,
                borderColor: 'white',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'top',
                    labels: { font: { size: 14 } }
                },
                title: {
                    display: true,
                    text: 'Bilancio Entrate vs Spese',
                    font: { size: 18 }
                }
            }
        }
    });

    const barCtx = document.getElementById('monthly-bar-chart').getContext('2d');
    let monthlyBarChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Entrate',
                    data: [],
                    backgroundColor: 'rgba(76, 175, 80, 0.8)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 1,
                    borderRadius: 5
                },
                {
                    label: 'Spese',
                    data: [],
                    backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    borderRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.1)' } }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { font: { size: 14 } }
                },
                title: {
                    display: true,
                    text: 'Entrate e Spese Mensili',
                    font: { size: 18 }
                }
            }
        }
    });

    function showScreen(screenToShow) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
            screen.style.display = 'none';
        });
        
        screenToShow.classList.add('active');
        screenToShow.style.display = 'block';

        [homeButton, historyButton, statsButton, totalIncomeButton, totalExpensesButton, totalBalanceButton, settingsButton].forEach(button => {
            button.classList.remove('active');
        });
        if (screenToShow === homeScreen) {
            homeButton.classList.add('active');
        } else if (screenToShow === historyScreen) {
            historyButton.classList.add('active');
            renderHistory();
        } else if (screenToShow === statsScreen) {
            statsButton.classList.add('active');
            updateMonthlyChart();
        } else if (screenToShow === totalIncomeScreen) {
            totalIncomeButton.classList.add('active');
        } else if (screenToShow === totalExpensesScreen) {
            totalExpensesButton.classList.add('active');
        } else if (screenToShow === totalBalanceScreen) {
            totalBalanceButton.classList.add('active');
        } else if (screenToShow === settingsScreen) {
            settingsButton.classList.add('active');
        }
    }

    function updateTotals() {
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const currentYear = new Date().getFullYear().toString();

        const monthlyIncomes = incomes.filter(item => {
            const itemDate = new Date(item.date);
            return (itemDate.getMonth() + 1).toString().padStart(2, '0') === currentMonth &&
                   itemDate.getFullYear().toString() === currentYear;
        });

        const monthlyExpenses = expenses.filter(item => {
            const itemDate = new Date(item.date);
            return (itemDate.getMonth() + 1).toString().padStart(2, '0') === currentMonth &&
                   itemDate.getFullYear().toString() === currentYear;
        });

        const totalIncome = monthlyIncomes.reduce((sum, item) => sum + item.amount, 0);
        const totalExpense = monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);

        incomeTotalDisplay.textContent = `Entrate: ${totalIncome.toFixed(2)} €`;
        expenseTotalDisplay.textContent = `Spese: ${totalExpense.toFixed(2)} €`;

        incomeTotalDisplay.classList.add('income-text');
        expenseTotalDisplay.classList.add('expense-text');

        updateBalanceChart(totalIncome, totalExpense);
    }

    function updateBalanceChart(totalIncome, totalExpense) {
        balanceChart.data.datasets[0].data = [totalIncome, totalExpense];
        balanceChart.update();
    }

    async function deleteTransaction(id, type) {
        if (confirm('Sei sicuro di voler eliminare questa transazione?')) {
            try {
                if (type === 'income') {
                    await db.collection('incomes').doc(id).delete();
                } else if (type === 'expense') {
                    await db.collection('expenses').doc(id).delete();
                }
                await loadData(); // Reload data after deleting
                updateTotals();
                renderHistory();
                updateMonthlyChart();
                populateMonthYearFilters();
                populateStatsYearFilter();
                alert('Transazione eliminata con successo!');
            } catch (error) {
                console.error("Error deleting transaction:", error);
                alert('Errore durante l\'eliminazione della transazione.');
            }
        }
    }

    function renderHistory() {
        const selectedMonth = filterMonthSelect.value;
        const selectedYear = filterYearSelect.value;

        let filteredIncomes = incomes.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const transactionMonth = (transactionDate.getMonth() + 1).toString().padStart(2, '0');
            const transactionYear = transactionDate.getFullYear().toString();

            return (selectedMonth === 'all' || transactionMonth === selectedMonth) &&
                   (selectedYear === 'all' || transactionYear === selectedYear);
        });

        let filteredExpenses = expenses.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const transactionMonth = (transactionDate.getMonth() + 1).toString().padStart(2, '0');
            const transactionYear = transactionDate.getFullYear().toString();

            return (selectedMonth === 'all' || transactionMonth === selectedMonth) &&
                   (selectedYear === 'all' || transactionYear === selectedYear);
        });

        filteredIncomes.sort((a, b) => new Date(b.date) - new Date(a.date));
        filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (filteredIncomes.length === 0) {
            incomeTransactionsList.innerHTML = '<p>Nessuna entrata registrata con i filtri selezionati.</p>';
        } else {
            let incomeHtml = '<table><thead><tr><th>Data</th><th>Categoria</th><th>Importo</th><th>Nota</th></tr></thead><tbody>';
            filteredIncomes.forEach(transaction => {
                const displayCategory = transaction.category ? 
                                        transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1).replace(/_/g, ' ') : 
                                        'N/A';
                const formattedDate = new Date(transaction.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' });
                const noteContent = transaction.category === 'stipendio' ? '' : (transaction.note || '-');
                incomeHtml += `
                    <tr class="transaction-row" data-id="${transaction.id}" data-type="income">
                        <td>${formattedDate}</td>
                        <td>${displayCategory}</td>
                        <td class="income-amount">${transaction.amount.toFixed(2)} €</td>
                        <td class="note-cell">${noteContent}<button class="delete-button">X</button></td>
                    </tr>
                `;
            });
            incomeHtml += '</tbody></table>';
            incomeTransactionsList.innerHTML = incomeHtml;
        }

        if (filteredExpenses.length === 0) {
            expenseTransactionsList.innerHTML = '<p>Nessuna spesa registrata con i filtri selezionati.</p>';
        } else {
            let expenseHtml = '<table><thead><tr><th>Data</th><th>Categoria</th><th>Importo</th><th>Nota</th></tr></thead><tbody>';
            filteredExpenses.forEach(transaction => {
                const displayCategory = transaction.category ? 
                                        transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1).replace(/_/g, ' ') : 
                                        'N/A';
                const formattedDate = new Date(transaction.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' });
                expenseHtml += `
                    <tr class="transaction-row" data-id="${transaction.id}" data-type="expense">
                        <td>${formattedDate}</td>
                        <td>${displayCategory}</td>
                        <td class="expense-amount">${transaction.amount.toFixed(2)} €</td>
                        <td class="note-cell">${transaction.note || '-'}<button class="delete-button">X</button></td>
                    </tr>
                `;
            });
            expenseHtml += '</tbody></table>';
            expenseTransactionsList.innerHTML = expenseHtml;
        }

        document.querySelectorAll('.transaction-row').forEach(row => {
            row.addEventListener('click', (event) => {
                document.querySelectorAll('.transaction-row').forEach(r => r.classList.remove('active'));
                row.classList.add('active');
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const row = event.target.closest('.transaction-row');
                const id = row.dataset.id;
                const type = row.dataset.type;
                deleteTransaction(id, type);
            });
        });
    }

    function populateMonthYearFilters() {
        const years = new Set();
        incomes.forEach(inc => years.add(new Date(inc.date).getFullYear()));
        expenses.forEach(exp => years.add(new Date(exp.date).getFullYear()));

        let yearOptionsHtml = '<option value="all">Tutti gli Anni</option>';
        Array.from(years).sort((a, b) => b - a).forEach(year => {
            yearOptionsHtml += `<option value="${year}">${year}</option>`;
        });
        filterYearSelect.innerHTML = yearOptionsHtml;

        const today = new Date();
        filterMonthSelect.value = (today.getMonth() + 1).toString().padStart(2, '0');
        filterYearSelect.value = today.getFullYear().toString();
    }

    function populateStatsYearFilter() {
        const years = new Set();
        incomes.forEach(inc => years.add(new Date(inc.date).getFullYear()));
        expenses.forEach(exp => years.add(new Date(exp.date).getFullYear()));

        let yearOptionsHtml = '<option value="all">Tutti gli Anni</option>';
        Array.from(years).sort((a, b) => b - a).forEach(year => {
            yearOptionsHtml += `<option value="${year}">${year}</option>`;
        });
        statsFilterYearSelect.innerHTML = yearOptionsHtml;

        statsFilterYearSelect.value = new Date().getFullYear().toString();
    }

    function updateMonthlyChart() {
        const selectedYear = statsFilterYearSelect.value;
        const monthlyData = {};

        const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
        for (let i = 0; i < 12; i++) {
            const monthKey = (i + 1).toString().padStart(2, '0');
            monthlyData[monthKey] = { income: 0, expense: 0 };
        }

        const allTransactions = [...incomes, ...expenses];

        allTransactions.forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            const transactionYear = transactionDate.getFullYear().toString();

            if (selectedYear === 'all' || transactionYear === selectedYear) {
                const month = (transactionDate.getMonth() + 1).toString().padStart(2, '0');
                monthlyData[month].income += (transaction.transactionType === 'income' ? transaction.amount : 0);
                monthlyData[month].expense += (transaction.transactionType === 'expense' ? transaction.amount : 0);
            }
        });

        const sortedMonthKeys = Object.keys(monthlyData).sort();
        const labels = sortedMonthKeys.map(monthKey => monthNames[parseInt(monthKey) - 1]);
        const monthlyIncomes = sortedMonthKeys.map(monthKey => monthlyData[monthKey].income);
        const monthlyExpenses = sortedMonthKeys.map(monthKey => monthlyData[monthKey].expense);

        monthlyBarChart.data.labels = labels;
        monthlyBarChart.data.datasets[0].data = monthlyIncomes;
        monthlyBarChart.data.datasets[1].data = monthlyExpenses;
        monthlyBarChart.update();
    }

    async function resetAllData() {
        if (confirm('Sei sicuro di voler resettare tutti i dati? Questa operazione è irreversibile.')) {
            try {
                // Delete all income documents
                const incomesSnapshot = await db.collection('incomes').get();
                const incomeDeletePromises = [];
                incomesSnapshot.docs.forEach(doc => {
                    incomeDeletePromises.push(db.collection('incomes').doc(doc.id).delete());
                });
                await Promise.all(incomeDeletePromises);

                // Delete all expense documents
                const expensesSnapshot = await db.collection('expenses').get();
                const expenseDeletePromises = [];
                expensesSnapshot.docs.forEach(doc => {
                    expenseDeletePromises.push(db.collection('expenses').doc(doc.id).delete());
                });
                await Promise.all(expenseDeletePromises);

                incomes = [];
                expenses = [];
                updateTotals();
                renderHistory();
                updateMonthlyChart();
                populateMonthYearFilters();
                populateStatsYearFilter();
                populateTotalExpensesYearFilter();
                populateTotalIncomesYearFilter();
                expensesByCategoryList.innerHTML = '<p>Seleziona un anno e/o un mese per visualizzare le spese per categoria.</p>';
                incomesByCategoryList.innerHTML = '<p>Seleziona un anno e/o un mese per visualizzare le entrate per categoria.</p>';
                alert('Tutti i dati sono stati resettati.');
                showScreen(homeScreen);
            } catch (error) {
                console.error("Error resetting data:", error);
                alert('Errore durante il reset dei dati.');
            }
        }
    }

    function populateTotalIncomesYearFilter() {
        const years = new Set();
        incomes.forEach(inc => years.add(new Date(inc.date).getFullYear()));

        let yearOptionsHtml = '<option value="all">Tutti gli Anni</option>';
        Array.from(years).sort((a, b) => b - a).forEach(year => {
            yearOptionsHtml += `<option value="${year}">${year}</option>`;
        });
        totalIncomesFilterYearSelect.innerHTML = yearOptionsHtml;

        totalIncomesFilterYearSelect.value = new Date().getFullYear().toString(); // Default to current year
    }

    function showTotalIncome() {
        const selectedYear = totalIncomesFilterYearSelect.value;
        const selectedMonth = totalIncomesFilterMonthSelect.value;

        let filteredIncomes = incomes.filter(item => {
            const itemDate = new Date(item.date);
            const itemYear = itemDate.getFullYear().toString();
            const itemMonth = (itemDate.getMonth() + 1).toString().padStart(2, '0');

            return (selectedYear === 'all' || itemYear === selectedYear) &&
                   (selectedMonth === 'all' || itemMonth === selectedMonth);
        });

        const totalIncomeAmount = filteredIncomes.reduce((sum, item) => sum + item.amount, 0);
        document.getElementById('total-income-value').textContent = `Entrate Totali: ${totalIncomeAmount.toFixed(2)} €`;

        if (selectedMonth !== 'all' && selectedYear !== 'all') {
            // Group by category for a specific month/year
            const incomesByCategory = filteredIncomes.reduce((acc, item) => {
                const category = item.category.charAt(0).toUpperCase() + item.category.slice(1).replace(/_/g, ' ');
                acc[category] = (acc[category] || 0) + item.amount;
                return acc;
            }, {});

            let categoryHtml = '<div class="category-grid">';
            for (const category in incomesByCategory) {
                categoryHtml += `
                    <div class="category-box income-category-box">
                        <h3>${category}</h3>
                        <p>${incomesByCategory[category].toFixed(2)} €</p>
                    </div>
                `;
            }
            categoryHtml += '</div>';
            incomesByCategoryList.innerHTML = categoryHtml;
        } else if (selectedYear !== 'all' && selectedMonth === 'all') {
            // Show total for the year and prompt for month selection
            incomesByCategoryList.innerHTML = '<p>Seleziona un mese per visualizzare le entrate per categoria.</p>';
        } else {
            // Default message if no specific year/month selected
            incomesByCategoryList.innerHTML = '<p>Seleziona un anno e/o un mese per visualizzare le entrate per categoria.</p>';
        }

        showScreen(totalIncomeScreen);
    }

    function populateTotalExpensesYearFilter() {
        const years = new Set();
        expenses.forEach(exp => years.add(new Date(exp.date).getFullYear()));

        let yearOptionsHtml = '<option value="all">Tutti gli Anni</option>';
        Array.from(years).sort((a, b) => b - a).forEach(year => {
            yearOptionsHtml += `<option value="${year}">${year}</option>`;
        });
        totalExpensesFilterYearSelect.innerHTML = yearOptionsHtml;

        totalExpensesFilterYearSelect.value = new Date().getFullYear().toString(); // Default to current year
    }

    function showTotalExpenses() {
        const selectedYear = totalExpensesFilterYearSelect.value;
        const selectedMonth = totalExpensesFilterMonthSelect.value;

        let filteredExpenses = expenses.filter(item => {
            const itemDate = new Date(item.date);
            const itemYear = itemDate.getFullYear().toString();
            const itemMonth = (itemDate.getMonth() + 1).toString().padStart(2, '0');

            return (selectedYear === 'all' || itemYear === selectedYear) &&
                   (selectedMonth === 'all' || itemMonth === selectedMonth);
        });

        const totalExpenseAmount = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
        document.getElementById('total-expenses-value').textContent = `Spese Totali: ${totalExpenseAmount.toFixed(2)} €`;

        if (selectedMonth !== 'all' && selectedYear !== 'all') {
            // Group by category for a specific month/year
            const expensesByCategory = filteredExpenses.reduce((acc, item) => {
                const category = item.category.charAt(0).toUpperCase() + item.category.slice(1).replace(/_/g, ' ');
                acc[category] = (acc[category] || 0) + item.amount;
                return acc;
            }, {});

            let categoryHtml = '<div class="category-grid">';
            for (const category in expensesByCategory) {
                categoryHtml += `
                    <div class="category-box">
                        <h3>${category}</h3>
                        <p>${expensesByCategory[category].toFixed(2)} €</p>
                    </div>
                `;
            }
            categoryHtml += '</div>';
            expensesByCategoryList.innerHTML = categoryHtml;
        } else if (selectedYear !== 'all' && selectedMonth === 'all') {
            // Show total for the year and prompt for month selection
            expensesByCategoryList.innerHTML = '<p>Seleziona un mese per visualizzare le spese per categoria.</p>';
        } else {
            // Default message if no specific year/month selected
            expensesByCategoryList.innerHTML = '<p>Seleziona un anno e/o un mese per visualizzare le spese per categoria.</p>';
        }

        showScreen(totalExpensesScreen);
    }

    function showTotalBalance() {
        const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
        const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
        const totalBalance = totalIncome - totalExpense;
        document.getElementById('total-balance-value').textContent = `Bilancio Totale: ${totalBalance.toFixed(2)} €`;

        const allTransactions = [...incomes, ...expenses];

        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        let tableHtml = '<table>';
        tableHtml += '<thead><tr><th>Data</th><th>Tipo</th><th>Categoria</th><th>Nota</th><th>Importo</th></tr></thead>';
        tableHtml += '<tbody>';

        if (allTransactions.length === 0) {
            tableHtml += '<tr><td colspan="4">Nessuna transazione registrata.</td></tr>';
        } else {
            allTransactions.forEach(transaction => {
                const formattedDate = new Date(transaction.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' });
                const type = transaction.transactionType === 'income' ? 'Entrata' : 'Spesa';
                const displayCategory = transaction.category ? 
                                        transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1).replace(/_/g, ' ') : 
                                        'N/A';
                const amountClass = transaction.transactionType === 'income' ? 'income-amount' : 'expense-amount';

                tableHtml += `
                    <tr>
                        <td>${formattedDate}</td>
                        <td>${type}</td>
                        <td>${displayCategory}</td>
                        <td>${transaction.note || '-'}</td>
                        <td class="${amountClass}">${transaction.amount.toFixed(2)} €</td>
                    </tr>
                `;
            });
        }

        tableHtml += '</tbody></table>';
        allTransactionsTableContainer.innerHTML = tableHtml;

        showScreen(totalBalanceScreen);
    }

    await loadData();
    showScreen(homeScreen);
    updateTotals();
    populateMonthYearFilters();
    populateStatsYearFilter();
    populateTotalExpensesYearFilter(); // Call new populate function
    populateTotalIncomesYearFilter(); // New: Call new populate function

    homeButton.addEventListener('click', () => showScreen(homeScreen));
    historyButton.addEventListener('click', () => showScreen(historyScreen));
    statsButton.addEventListener('click', () => showScreen(statsScreen));
    settingsButton.addEventListener('click', () => showScreen(settingsScreen));
    totalIncomeButton.addEventListener('click', () => {
        showTotalIncome();
        populateTotalIncomesYearFilter();
        totalIncomesFilterMonthSelect.value = 'all';
    });
    totalExpensesButton.addEventListener('click', () => {
        showTotalExpenses();
        // Ensure filters are populated and updated when screen is shown
        populateTotalExpensesYearFilter();
        // Set default month to 'all' when entering the screen
        totalExpensesFilterMonthSelect.value = 'all';
    });
    totalBalanceButton.addEventListener('click', showTotalBalance);

    // NEW EVENT LISTENERS
    totalExpensesFilterYearSelect.addEventListener('change', showTotalExpenses);
    totalExpensesFilterMonthSelect.addEventListener('change', showTotalExpenses);
    totalIncomesFilterYearSelect.addEventListener('change', showTotalIncome); // New: event listener for incomes year filter
    totalIncomesFilterMonthSelect.addEventListener('change', showTotalIncome); // New: event listener for incomes month filter

    addButton.addEventListener('click', () => {
        showScreen(incomeMenu);
        document.getElementById('income-date').valueAsDate = new Date();
    });

    subtractButton.addEventListener('click', () => {
        showScreen(expenseMenu);
        document.getElementById('expense-date').valueAsDate = new Date();
    });

    document.querySelectorAll('.cancel-button').forEach(button => {
        button.addEventListener('click', () => {
            showScreen(homeScreen);
            incomeForm.reset();
            expenseForm.reset();
            incomeNoteField.style.display = 'block';
            incomeNoteField.previousElementSibling.style.display = 'block';
        });
    });

    incomeTypeSelect.addEventListener('change', (event) => {
        if (event.target.value === 'stipendio') {
            incomeNoteField.style.display = 'none';
            incomeNoteField.previousElementSibling.style.display = 'none';
        } else {
            incomeNoteField.style.display = 'block';
            incomeNoteField.previousElementSibling.style.display = 'block';
        }
    });

    if (incomeTypeSelect.value === 'stipendio') {
        incomeNoteField.style.display = 'none';
        incomeNoteField.previousElementSibling.style.display = 'none';
    }

    incomeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const incomeData = {
            id: Date.now() + Math.random(),
            category: incomeTypeSelect.value, 
            date: document.getElementById('income-date').value,
            amount: parseFloat(document.getElementById('income-amount').value),
            note: incomeTypeSelect.value === 'altro' ? document.getElementById('income-note').value : '',
            transactionType: 'income' 
        };

        try {
            await db.collection('incomes').add(incomeData);
            await loadData(); // Reload data after adding
            updateTotals();
            showScreen(homeScreen);
            incomeForm.reset();
            if (incomeTypeSelect.value === 'stipendio') {
                incomeNoteField.style.display = 'none';
                incomeNoteField.previousElementSibling.style.display = 'none';
            }
            populateMonthYearFilters(); 
            populateStatsYearFilter(); 
            alert('Entrata aggiunta con successo!');
        } catch (error) {
            console.error("Error adding income:", error);
            alert('Errore durante l\'aggiunta dell\'entrata.');
        } 
    });

    expenseForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const expenseData = {
            id: Date.now() + Math.random(),
            category: document.getElementById('expense-type').value, 
            date: document.getElementById('expense-date').value,
            amount: parseFloat(document.getElementById('expense-amount').value),
            note: document.getElementById('expense-note').value,
            transactionType: 'expense' 
        };

        try {
            await db.collection('expenses').add(expenseData);
            await loadData(); // Reload data after adding
            updateTotals();
            showScreen(homeScreen);
            expenseForm.reset();
            populateMonthYearFilters(); 
            populateStatsYearFilter(); 
            alert('Spesa aggiunta con successo!');
        } catch (error) {
            console.error("Error adding expense:", error);
            alert('Errore durante l\'aggiunta della spesa.');
        } 
    });

    filterMonthSelect.addEventListener('change', renderHistory);
    filterYearSelect.addEventListener('change', renderHistory);
    statsFilterYearSelect.addEventListener('change', updateMonthlyChart);
});