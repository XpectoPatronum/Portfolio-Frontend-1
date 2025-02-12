const loginForm = document.getElementById("loginForm");

// Add an event listener to the login form submit event
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the form from submitting

    // Get the login credentials from the form inputs
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Make the login POST request
    const response = await fetch("https://portfolio-simulator-v1-0.onrender.com/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    // Check if the login was successful
    if (response.ok) {
        // Parse the response JSON
        const data = await response.json();
        console.log(data);
        // Store the access token in localStorage
    localStorage.setItem("accessToken", data.access_token);

        // Redirect to the dashboard or perform any other action
        window.location.href = "/index";
    } else {
        // Handle login error
        document.getElementById("credentialMessage").innerText = "Invalid credentials";
        console.error("Login failed");
    }
});