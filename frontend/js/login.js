const form = document.getElementById("login-form");
const message = document.getElementById("login-message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);

            message.textContent = "Login successful! ✈️";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 800);
        } else {
            message.textContent = data.message || "Login failed.";
        }

    } catch (error) {
        console.error(error);
        message.textContent = "Server connection error.";
    }
});