const form = document.getElementById("create-post-form");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const location = document.getElementById("location").value;
    const content = document.getElementById("content").value;
    const image = document.getElementById("image").files[0];

    const token = localStorage.getItem("token");

    if (!token) {
        message.textContent = "Please login first.";
        return;
    }

    const formData = new FormData();

    formData.append("location", location);
    formData.append("content", content);

    if (image) {
        formData.append("image", image);
    }

    try {
        const response = await fetch("http://localhost:5000/api/posts", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            message.textContent = "Post created successfully! ✈️";

            form.reset();

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            message.textContent = data.message || "Failed to create post.";
        }

    } catch (error) {
        console.error(error);
        message.textContent = "Server connection error.";
    }
});