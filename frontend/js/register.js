const form = document.getElementById("register-form");
const message = document.getElementById("register-message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                username,
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {

            message.textContent = "Account created successfully! ✈️";

            form.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);

        } else {

            message.textContent = data.message || "Registration failed.";

        }

    } catch (error) {

        console.error(error);
        message.textContent = "Server connection error.";

    }
});