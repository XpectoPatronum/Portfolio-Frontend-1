document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', (event) => {
        console.log("Pressed");
        event.preventDefault();

        const name = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const data = {
            name: name,
            username: username,
            password: password
        };

        fetch('https://portfolio-simulator-v1-0.onrender.com/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    // Handle registration error
                    return response.json().then(err => {throw new Error(err.message || "Registration failed")})
                }
                return response.json();
            })
            .then(responseData => {
                console.log('Registration successful:', responseData);
                alert(responseData.message)
                window.location.href = "/login"; // Redirect to login after successful registration
            })
            .catch(error => {
                console.error('Registration error:', error.message);
                document.getElementById("credentialMessage").innerText = "Username already exists";
            });
    });
});