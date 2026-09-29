const token = localStorage.getItem("token");

const navLinks = document.getElementById("nav-links");

if (token) {

    navLinks.innerHTML = `
        <a href="index.html">Home</a>
        <a href="explore.html">Explore</a>
        <a href="create-post.html">Create Post</a>
        <a href="profile.html">Profile</a>
        <a href="#" id="logout">Logout</a>
    `;

    document.getElementById("logout").addEventListener("click", (e) => {

        e.preventDefault();

        localStorage.removeItem("token");

        window.location.href = "login.html";
    });

} else {

    navLinks.innerHTML = `
        <a href="index.html">Home</a>
        <a href="explore.html">Explore</a>
        <a href="login.html">Login</a>
        <a href="register.html">Register</a>
    `;
}