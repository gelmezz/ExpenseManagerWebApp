document.addEventListener('DOMContentLoaded', () => {
    const homeScreen = document.getElementById('home-screen');
    const incomeMenu = document.getElementById('income-menu');
    const expenseMenu = document.getElementById('expense-menu');
    const historyScreen = document.getElementById('history-screen');
    const statsScreen = document.getElementById('stats-screen');
    const settingsScreen = document.getElementById('settings-screen');

    const homeButton = document.getElementById('home-button');
    const historyButton = document.getElementById('history-button');
    const statsButton = document.getElementById('stats-button');
    const settingsButton = document.getElementById('settings-button');
    const addButton = document.getElementById('add-button');
    const subtractButton = document.getElementById('subtract-button');

    const incomeTypeSelect = document.getElementById('income-type');
    const incomeNoteField = document.getElementById('income-note');

    const incomeForm = document.getElementById('income-form');
    const expenseForm = document.getElementById('expense-form');

    const incomeTotalDisplay = document.querySelector('.summary-data p:nth-child(1)');
    const expenseTotalDisplay = document.querySelector('.summary-data p:nth-child(2)');
    
    // Updated transaction lists
    const incomeTransactionsList = document.getElementById('income-transactions-list');
    const expenseTransactionsList = document.getElementById('expense-transactions-list');

    // Filter elements (History Screen)
    const filterMonthSelect = document.getElementById('filter-month');
    const filterYearSelect = document.getElementById('filter-year');

    // Filter elements (Stats Screen)
    const statsFilterYearSelect = document.getElementById('stats-filter-year');

    // Settings elements
    const resetDataButton = document.getElementById('reset-data-button');

    let incomes = [];
    let expenses = [];

    // Funzione per caricare i dati dal localStorage
    function loadData() {
        const storedIncomes = localStorage.getItem('incomes');
        const storedExpenses = localStorage.getItem('expenses');

        if (storedIncomes) {
            incomes = JSON.parse(storedIncomes);
            // Ensure old data has 'category' and 'transactionType' and a unique ID
            incomes.forEach(item => {
                if (!item.category) item.category = item.type; // Migrate old 'type' to 'category'
                if (!item.transactionType) item.transactionType = 'income';
                if (!item.id) item.id = Date.now() + Math.random(); // Add unique ID
            });
        }
        if (storedExpenses) {
            expenses = JSON.parse(storedExpenses);
            // Ensure old data has 'category' and 'transactionType' and a unique ID
            expenses.forEach(item => {
                if (!item.category) item.category = item.type; // Migrate old 'type' to 'category'
                if (!item.transactionType) item.transactionType = 'expense';
                if (!item.id) item.id = Date.now() + Math.random(); // Add unique ID
            });
        }
    }

    // Funzione per salvare i dati nel localStorage
    function saveData() {
        localStorage.setItem('incomes', JSON.stringify(incomes));
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    // Inizializzazione del grafico a torta (Bilancio Entrate vs Spese)
    const pieCtx = document.getElementById('expense-pie-chart').getContext('2d');
    let balanceChart = new Chart(pieCtx, {
        type: 'doughnut', // Cambiato da 'pie' a 'doughnut'
        data: {
            labels: ['Entrate Totali', 'Spese Totali'],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#4CAF50', // Verde per le entrate
                    '#FF6384'  // Rosso per le spese
                ],
                hoverOffset: 10, // Effetto hover
                borderColor: 'white', // Bordo bianco tra le fette
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Permette il ridimensionamento
            cutout: '70%', // Crea il buco al centro (70% del raggio)
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Bilancio Entrate vs Spese',
                    font: {
                        size: 18
                    }
                }
            }
        }
    });

    // Inizializzazione del grafico a barre (Statistiche Mensili)
    const barCtx = document.getElementById('monthly-bar-chart').getContext('2d');
    let monthlyBarChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Entrate',
                    data: [],
                    backgroundColor: 'rgba(76, 175, 80, 0.8)', // Verde più scuro
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 1,
                    borderRadius: 5 // Bordi arrotondati
                },
                {
                    label: 'Spese',
                    data: [],
                    backgroundColor: 'rgba(255, 99, 132, 0.8)', // Rosso più scuro
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    borderRadius: 5 // Bordi arrotondati
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Permette il ridimensionamento
            scales: {
                x: {
                    grid: {
                        display: false // Rimuove le linee della griglia sull'asse X
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)' // Colore più chiaro per la griglia sull'asse Y
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Entrate e Spese Mensili',
                    font: {
                        size: 18
                    }
                }
            }
        }
    });

    // Funzione per mostrare una schermata e nascondere le altre
    function showScreen(screenToShow) {
        // Nascondi tutte le schermate
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
            screen.style.display = 'none'; // Assicurati che siano nascoste
        });
        
        // Mostra la schermata desiderata
        screenToShow.classList.add('active');
        screenToShow.style.display = 'block'; // Assicurati che sia visibile

        // Aggiorna lo stato attivo dei pulsanti di navigazione
        [homeButton, historyButton, statsButton, settingsButton].forEach(button => {
            button.classList.remove('active');
        });
        if (screenToShow === homeScreen) {
            homeButton.classList.add('active');
        } else if (screenToShow === historyScreen) {
            historyButton.classList.add('active');
            renderHistory(); // Renderizza lo storico quando si va alla schermata storico
        } else if (screenToShow === statsScreen) {
            statsButton.classList.add('active');
            updateMonthlyChart(); // Aggiorna il grafico mensile quando si va alla schermata statistiche
        } else if (screenToShow === settingsScreen) {
            settingsButton.classList.add('active');
        }
    }

    // Funzione per aggiornare i totali visualizzati
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

        // Aggiungi le classi per il colore
        incomeTotalDisplay.classList.add('income-text');
        expenseTotalDisplay.classList.add('expense-text');

        updateBalanceChart(totalIncome, totalExpense);
    }

    // Funzione per aggiornare il grafico del bilancio
    function updateBalanceChart(totalIncome, totalExpense) {
        balanceChart.data.datasets[0].data = [totalIncome, totalExpense];
        balanceChart.update();
    }

    // Funzione per eliminare una transazione
    function deleteTransaction(id, type) {
        if (confirm('Sei sicuro di voler eliminare questa transazione?')) {
            if (type === 'income') {
                incomes = incomes.filter(item => item.id !== id);
            } else if (type === 'expense') {
                expenses = expenses.filter(item => item.id !== id);
            }
            saveData();
            updateTotals();
            renderHistory();
            updateMonthlyChart();
            populateMonthYearFilters();
            populateStatsYearFilter();
        }
    }

    // Funzione per renderizzare lo storico delle transazioni
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

        // Render Income Transactions
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

        // Render Expense Transactions
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

        // Add event listeners for delete buttons
        document.querySelectorAll('.transaction-row').forEach(row => {
            row.addEventListener('click', (event) => {
                // Nascondi tutti i pulsanti di eliminazione
                document.querySelectorAll('.transaction-row').forEach(r => r.classList.remove('active'));
                // Mostra il pulsante di eliminazione solo per la riga cliccata
                row.classList.add('active');
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Evita che il click sulla X propaghi alla riga
                const row = event.target.closest('.transaction-row');
                const id = parseFloat(row.dataset.id);
                const type = row.dataset.type;
                deleteTransaction(id, type);
            });
        });
    }

    // Funzione per popolare i filtri di mese e anno (schermata storico)
    function populateMonthYearFilters() {
        const years = new Set();
        incomes.forEach(inc => years.add(new Date(inc.date).getFullYear()));
        expenses.forEach(exp => years.add(new Date(exp.date).getFullYear()));

        let yearOptionsHtml = '<option value="all">Tutti gli Anni</option>';
        Array.from(years).sort((a, b) => b - a).forEach(year => {
            yearOptionsHtml += `<option value="${year}">${year}</option>`;
        });
        filterYearSelect.innerHTML = yearOptionsHtml;

        // Set current month and year as default filters
        const today = new Date();
        filterMonthSelect.value = (today.getMonth() + 1).toString().padStart(2, '0');
        filterYearSelect.value = today.getFullYear().toString();
    }

    // Funzione per popolare i filtri dell'anno (schermata statistiche)
    function populateStatsYearFilter() {
        const years = new Set();
        incomes.forEach(inc => years.add(new Date(inc.date).getFullYear()));
        expenses.forEach(exp => years.add(new Date(exp.date).getFullYear()));

        let yearOptionsHtml = '<option value="all">Tutti gli Anni</option>';
        Array.from(years).sort((a, b) => b - a).forEach(year => {
            yearOptionsHtml += `<option value="${year}">${year}</option>`;
        });
        statsFilterYearSelect.innerHTML = yearOptionsHtml;

        // Set current year as default filter
        statsFilterYearSelect.value = new Date().getFullYear().toString();
    }

    // Funzione per aggiornare il grafico mensile
    function updateMonthlyChart() {
        const selectedYear = statsFilterYearSelect.value;
        const monthlyData = {};

        // Inizializza monthlyData per tutti i mesi con valori a zero
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
                const month = (transactionDate.getMonth() + 1).toString().padStart(2, '0'); // MM
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

    // Funzione per resettare tutti i dati
    function resetAllData() {
        if (confirm('Sei sicuro di voler resettare tutti i dati? Questa operazione è irreversibile.')) {
            localStorage.clear();
            incomes = [];
            expenses = [];
            updateTotals(); // Aggiorna i totali e il grafico
            renderHistory(); // Aggiorna lo storico
            updateMonthlyChart(); // Aggiorna il grafico mensile
            populateMonthYearFilters(); // Ripopola i filtri storico
            populateStatsYearFilter(); // Ripopola i filtri statistiche
            alert('Tutti i dati sono stati resettati.');
            showScreen(homeScreen); // Torna alla schermata Home
        }
    }

    // Carica i dati all'avvio e aggiorna i totali
    loadData();
    showScreen(homeScreen);
    updateTotals();
    populateMonthYearFilters(); // Popola i filtri mese/anno all'avvio
    populateStatsYearFilter(); // Popola i filtri anno statistiche all'avvio

    // Gestione click pulsanti di navigazione
    homeButton.addEventListener('click', () => showScreen(homeScreen));
    historyButton.addEventListener('click', () => showScreen(historyScreen));
    statsButton.addEventListener('click', () => showScreen(statsScreen));
    settingsButton.addEventListener('click', () => showScreen(settingsScreen));

    // Gestione click pulsante '+'
    addButton.addEventListener('click', () => {
        showScreen(incomeMenu);
        // Imposta la data corrente come valore predefinito
        document.getElementById('income-date').valueAsDate = new Date();
    });

    // Gestione click pulsante '-'
    subtractButton.addEventListener('click', () => {
        showScreen(expenseMenu);
        // Imposta la data corrente come valore predefinito
        document.getElementById('expense-date').valueAsDate = new Date();
    });

    // Gestione click pulsanti 'Annulla'
    document.querySelectorAll('.cancel-button').forEach(button => {
        button.addEventListener('click', () => {
            showScreen(homeScreen);
            // Resetta i form quando si annulla
            incomeForm.reset();
            expenseForm.reset();
            // Assicurati che la nota sia nascosta se il tipo è stipendio
            incomeNoteField.style.display = 'block'; // Mostra per reset
            incomeNoteField.previousElementSibling.style.display = 'block';
        });
    });

    // Gestione visibilità nota per entrate (stipendio/altro)
    incomeTypeSelect.addEventListener('change', (event) => {
        if (event.target.value === 'stipendio') {
            incomeNoteField.style.display = 'none';
            incomeNoteField.previousElementSibling.style.display = 'none'; // Nasconde anche la label
        } else {
            incomeNoteField.style.display = 'block';
            incomeNoteField.previousElementSibling.style.display = 'block';
        }
    });

    // Inizializza lo stato della nota al caricamento
    if (incomeTypeSelect.value === 'stipendio') {
        incomeNoteField.style.display = 'none';
        incomeNoteField.previousElementSibling.style.display = 'none';
    }

    // Gestione invio form Entrate
    incomeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const incomeData = {
            id: Date.now() + Math.random(), // Aggiungi un ID univoco
            category: incomeTypeSelect.value, 
            date: document.getElementById('income-date').value,
            amount: parseFloat(document.getElementById('income-amount').value),
            note: incomeTypeSelect.value === 'altro' ? document.getElementById('income-note').value : '',
            transactionType: 'income' 
        };

        incomes.push(incomeData);
        saveData(); 
        updateTotals();
        showScreen(homeScreen);
        incomeForm.reset();
        // Reimposta lo stato della nota dopo il reset del form
        if (incomeTypeSelect.value === 'stipendio') {
            incomeNoteField.style.display = 'none';
            incomeNoteField.previousElementSibling.style.display = 'none';
        }
        populateMonthYearFilters(); 
        populateStatsYearFilter(); 
    });

    // Gestione invio form Spese
    expenseForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const expenseData = {
            id: Date.now() + Math.random(), // Aggiungi un ID univoco
            category: document.getElementById('expense-type').value, 
            date: document.getElementById('expense-date').value,
            amount: parseFloat(document.getElementById('expense-amount').value),
            note: document.getElementById('expense-note').value,
            transactionType: 'expense' 
        };

        expenses.push(expenseData);
        saveData(); 
        updateTotals();
        showScreen(homeScreen);
        expenseForm.reset();
        populateMonthYearFilters(); 
        populateStatsYearFilter(); 
    });

    // Event listeners for filters
    filterMonthSelect.addEventListener('change', renderHistory);
    filterYearSelect.addEventListener('change', renderHistory);
    statsFilterYearSelect.addEventListener('change', updateMonthlyChart);
});
