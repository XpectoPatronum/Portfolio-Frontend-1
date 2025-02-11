document.addEventListener('DOMContentLoaded', () => {

    function showLoginPrompt() {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p style="color: red; font-weight: bold;">Session expired. Please log in again.</p>
                <button onclick="${redirectToLogin()}" style="padding: 10px 15px; background: blue; color: white; border: none; cursor: pointer;">
                    Log In
                </button>
            </div>
        `;
    }

    function redirectToLogin() {
        localStorage.removeItem('accessToken');  
        window.location.href = "/pages/login.html";
    }

    const accessToken = localStorage.getItem('accessToken');
    const mainContent = document.getElementById('main-content');


    const loadData = async (url, tableHeaders, dataProcessor, summaryField) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                showLoginPrompt();
                return;
            }
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.status === 401) {
                // Token expired or invalid → Show login prompt
                console.error('Token expired or invalid');
                showLoginPrompt();
                return;
            }

            const data = await response.json();
            let name = data.name; // Extract the name from the response
            document.getElementsByClassName('profile-name')[0].innerHTML = name;
            name = name.split(' ')[0]; // Get the first name
            let summaryValue = data[summaryField];
            let tableRows = '';

            if (dataProcessor) {
                const portfolioData = data.portfolio || data.pnL; // Access nested data
                tableRows = dataProcessor(portfolioData);
            } else {
                console.error("No data processor provided");
                return;
            }

            mainContent.innerHTML = `
                <div class="content">
                    <div class="container">
                        <h2 class="mb-2">Hi, ${name}</h2> <p style="font-size: 1.1rem;" class="mb-2">Here's your ${tableHeaders.title}</p>
${summaryValue !== undefined ? `<p class="mb-3" style="font-size: 1.1rem;"><b>${tableHeaders.summaryLabel}:</b> <span style="color: ${summaryValue >= 0 ? 'green' : 'red'};">${summaryValue.toFixed(2)}</span></p>` : ''}                        <div class="table-responsive">
                            <table class="table table-striped custom-table">
                                <thead>
                                    <tr>
                                        ${tableHeaders.headers.map(header => `<th scope="col">${header}</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${tableRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error("Error fetching or processing data:", error);
            if(tableHeaders.title === "Portfolio"){
                        mainContent.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; height: calc(100vh - 200px); margin: 0; flex-direction: column; font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" ; text-align: center; background-color: transparent;">
                <div style="font-size: 30px; margin-bottom: 10px; color: white;">Uh oh 😬</div>
                <div style="font-size: 24px; font-weight: bold; color: white;">Your portfolio looks empty!</div>
                </div>`;
            }
            else{
                mainContent.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; height: calc(100vh - 200px); margin: 0; flex-direction: column; font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" ; text-align: center; background-color: transparent;">
                <div style="font-size: 30px; margin-bottom: 10px; color: white;">Uh oh 😬</div>
                <div style="font-size: 24px; font-weight: bold; color: white;">Seems like you haven't sold anything yet!</div>
                </div>`;
            }
        }
    };

    const portfolioDataProcessor = (data) => {
        return data.map(item => `
            <tr scope="row">
                <td>${item.stockName}<small class="d-block">${item.stockTicker}<span class="stock-sector">${item.stockSector}</span></small></td>
                <td>${item.averagePriceBought}</td>
                <td>${item.totalQuantity}</td>
            </tr>
        `).join('');
    };

    const pnlDataProcessor = (data) => {
        return data.map(item => `
            <tr scope="row">
                <td>${item.stockTicker}</td>
                <td>${item.realizedPnl}</td>
            </tr>
        `).join('');
    };

    const portfolioTableHeaders = {title: "Portfolio", 
        headers: ["Stock Name", "Average Price Bought", "Total Quantity"],
        summaryLabel: "Total Invested"
    }
    const pnlTableHeaders = {title: "Profit and Loss", 
        headers: ["Stock Ticker", "Realized PnL"],
        summaryLabel: "Realized Profit"
    }

    // Load Portfolio page by default
    loadData('https://portfolio-simulator-v1-0.onrender.com/app/v1/portfolio/show', portfolioTableHeaders, portfolioDataProcessor,"totalInvested");

    // Event listeners for navbar links
    document.getElementById('portfolio-link').addEventListener('click', (e) => {
        e.preventDefault();
        loadData('https://portfolio-simulator-v1-0.onrender.com/app/v1/portfolio/show', portfolioTableHeaders, portfolioDataProcessor,"totalInvested");
    });

    document.getElementById('pnl-link').addEventListener('click', (e) => {
        e.preventDefault();
        loadData('https://portfolio-simulator-v1-0.onrender.com/app/v1/pnl/show', pnlTableHeaders, pnlDataProcessor,"realizedProfit");
    });


    document.getElementById('logout-link').addEventListener('click', (e) => {
        e.preventDefault(); 

        localStorage.removeItem('accessToken');

        window.location.href = 'login.html';
    });


    const tradeModal = document.getElementById("tradeModal");
    const tradeTitle = tradeModal.querySelector("h2");
    const buyBtn = document.querySelector(".buy-btn");
    const sellBtn = document.querySelector(".sell-btn");
    const closeModal = tradeModal.querySelector(".my-close");

    function openModal(type) {
        if (type === "buy") {
            tradeTitle.textContent = "Buy Stocks";
            tradeTypeInput.value = "BUY";
        } else if (type === "sell") {
            tradeTitle.textContent = "Sell Stocks";
            tradeTypeInput.value = "SELL";
            // console.log(tradeTypeInput.value);
        }
        // console.log(tradeTypeInput.value);
        tradeModal.style.display = "block";
    }

    buyBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default anchor behavior
        openModal("buy");
    });

    sellBtn.addEventListener("click", function (event) {
        event.preventDefault();
        openModal("sell");
    });

    closeModal.addEventListener("click", function () {
        tradeModal.style.display = "none";
    });

    // Close modal if clicking outside content
    window.addEventListener("click", function (event) {
        if (event.target === tradeModal) {
            tradeModal.style.display = "none";
        }
    });


    // Form submission

    const tradeForm = document.getElementById('tradeForm');

    // Form submission handler
    tradeForm.addEventListener('submit', async (event) => {
        console.log('Form submitted');
        event.preventDefault();

        // Gather form data
        const stockTicker = document.getElementById('stockTicker').value.toUpperCase();
        const tradeType = document.getElementById('tradeTypeInput').value;
        const price = parseFloat(document.querySelector('input[name="price"]').value);
        const quantity = parseInt(document.querySelector('input[name="quantity"]').value);
        console.log(stockTicker, tradeType, price, quantity);
        // Validate inputs
        if (!stockTicker || isNaN(price) || isNaN(quantity) || quantity <= 0) {
            alert('Please fill in all fields correctly');
            return;
        }

        try {
            // Determine the correct endpoint based on action
            const endpoint = tradeType === 'BUY' ? '/buy' : '/sell';
            const url = `https://portfolio-simulator-v1-0.onrender.com/app/v1/stock` + endpoint;

            // Prepare request payload
            const payload = {
                stock_ticker: stockTicker,
                quantity: quantity,
                price: price,
                date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
            };

            // Make API call
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            // Handle response
            if (result.statusFinal == true) {
                alert(`${tradeType} order for ${stockTicker} completed successfully!`);
                loadData('https://portfolio-simulator-v1-0.onrender.com/app/v1/portfolio/show', portfolioTableHeaders, portfolioDataProcessor,"totalInvested");
                tradeForm.reset(); // Clear form
            } else {
                throw new Error('Trade order failed');
            }
        } catch (error) {
            console.error('Trade Error:', error);
            alert(`Error: ${error.message}`);
        }
    });

    const stockInput = document.getElementById("stockTicker");
    const suggestionsList = document.getElementById("suggestions");
    const tradeTypeInput = document.getElementById("tradeTypeInput");
    // console.log(tradeTypeInput.value);
    
    let debounceTimer;
    let validSelection = false; // Track if user selects a valid option
    
    const API_BASE_URL = "https://portfolio-simulator-v1-0.onrender.com/app/v1/search/suggestion/"; // Replace with actual API
    
    // Debounced API call
    function fetchSuggestions(query) {
        clearTimeout(debounceTimer);
        let buyOrSell = tradeTypeInput.value === "BUY" ? "buy/" : "sell/";
        debounceTimer = setTimeout(async () => {
            if (query.length < 2) {
                suggestionsList.innerHTML = "";
                return;
            }
    
            try {
                const response = await fetch(API_BASE_URL+buyOrSell+encodeURIComponent(query),{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });
                const data = await response.json();
    
                displaySuggestions(data);
            } catch (error) {
                console.error("Error fetching stock suggestions:", error);
            }
        }, 300); // 300ms debounce time
    }
    
    // Display suggestions in the dropdown
    function displaySuggestions(suggestions) {
        suggestionsList.innerHTML = "";
        validSelection = false; // Reset valid selection status
    
        if (!suggestions || suggestions.length === 0) return;
    
        suggestions.forEach(ticker => {
            const listItem = document.createElement("li");
            listItem.textContent = ticker;
    
            listItem.addEventListener("mousedown", (event) => { // Use mousedown instead of click
                event.preventDefault(); // Prevent blur event from firing first
                stockInput.value = ticker;
                validSelection = true; // Mark as valid selection
                suggestionsList.innerHTML = "";
                stockInput.blur(); // Remove focus from input field
            });
    
            suggestionsList.appendChild(listItem);
        });
    }
    
    // Handle input changes
    stockInput.addEventListener("input", (e) => {
        fetchSuggestions(e.target.value);
        validSelection = false; // Reset validation on new input
    });
    
    // Ensure only selected values persist on blur
    stockInput.addEventListener("blur", () => {
        setTimeout(() => {
            if (!validSelection) {
                stockInput.value = ""; // Clear if no valid selection was made
            }
            suggestionsList.innerHTML = "";
        }, 200); // Delay to allow selection before clearing
    });
    

});


