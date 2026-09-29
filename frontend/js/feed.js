const API_URL = "http://localhost:5000/api";

let currentUserId = null;

if (token) {
    try {
        const tokenData = JSON.parse(
            atob(token.split(".")[1])
        );

        currentUserId = String(tokenData.userId);

        console.log("Logged-in User ID:", currentUserId);

    } catch (error) {
        console.error("Token error:", error);
    }
}

// ================= LOAD POSTS =================

async function loadPosts() {

    try {

        const response = await fetch(`${API_URL}/posts`);

        const data = await response.json();

        const postsContainer =
            document.getElementById("posts-container");

        postsContainer.innerHTML = "";


        if (!data.posts || data.posts.length === 0) {

            postsContainer.innerHTML = `
                <p>No posts yet. Be the first to share your journey! ✈️</p>
            `;

            return;
        }


        data.posts.forEach(post => {

            console.log("Post User ID:", String(post.user?._id));
            console.log("Current User ID:", String(currentUserId));

            const postElement =
                document.createElement("div");

            postElement.className = "post";


            postElement.innerHTML = `

                <div class="post-header">

                    <h3>
                        <a
                            href="user-profile.html?id=${post.user?._id}"
                            style="text-decoration:none;color:inherit;"
                        >
                            ${post.user?.name || "Wanderly User"}
                        </a>
                    </h3>

                    <span class="location">
                        📍 ${post.location}
                    </span>

                </div>


                ${
                    post.image
                    ? `
                        <img
                            src="${post.image}"
                            class="post-image"
                            alt="Travel photo"
                        >
                    `
                    : ""
                }


                <p class="post-content">
                    ${post.content}
                </p>


                <div class="post-actions">

                    <button onclick="likePost('${post._id}')">
                        ❤️
                        <span id="like-count-${post._id}">
                            ${post.likes?.length || 0}
                        </span>
                    </button>

                    <button onclick="showComments('${post._id}')">
                        💬 Comments
                    </button>

                    ${
                        currentUserId &&
                        String(post.user?._id) === String(currentUserId)
                        ? `
                            <button
                                onclick="deletePost('${post._id}')"
                                class="delete-button"
                            >
                                🗑️ Delete
                            </button>
                        `
                        : ""
                    }

                </div>


                <div
                    id="comments-${post._id}"
                    class="comments-section"
                >
                </div>

            `;


            postsContainer.appendChild(postElement);

        });

    } catch (error) {

        console.error("Load posts error:", error);

        document.getElementById("posts-container").innerHTML = `
            <p>Unable to load posts.</p>
        `;
    }
}



// ================= LIKE POST =================

async function likePost(postId) {

    if (!token) {

        alert("Please login to like a post.");

        window.location.href = "login.html";

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/posts/${postId}/like`,
            {
                method: "PUT",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data = await response.json();

        console.log("Like response:", data);


        if (response.ok) {

            // Update only the like count
            const likeCount =
                document.getElementById(`like-count-${postId}`);

            if (likeCount) {

                likeCount.textContent = data.likes;

            }

        } else {

            alert(data.message || "Unable to like post.");

        }

    } catch (error) {

        console.error("Like error:", error);

        alert("Like request failed. Check the browser console.");

    }

}



// ================= SHOW COMMENTS =================

async function showComments(postId) {

    const commentsBox =
        document.getElementById(`comments-${postId}`);


    // Close comments if already open
    if (commentsBox.dataset.open === "true") {

        commentsBox.innerHTML = "";

        commentsBox.dataset.open = "false";

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/posts/${postId}/comments`
        );


        const data = await response.json();

        console.log("Comments response:", data);


        if (!response.ok) {

            commentsBox.innerHTML = `
                <p>Unable to load comments.</p>
            `;

            return;
        }


        let html = "";


        if (!data.comments || data.comments.length === 0) {

            html += `
                <p>No comments yet.</p>
            `;

        } else {

            data.comments.forEach(comment => {

                html += `

                    <div class="comment">

                        <strong>
                            ${comment.user?.name || "User"}
                        </strong>

                        <p>
                            ${comment.text}
                        </p>

                    </div>

                `;

            });

        }


        // Comment input
        if (token) {

            html += `

                <div class="comment-form">

                    <input
                        type="text"
                        id="comment-input-${postId}"
                        placeholder="Write a comment..."
                    >

                    <button
                        onclick="addComment('${postId}')"
                    >
                        Send
                    </button>

                </div>

            `;

        } else {

            html += `

                <p>
                    <a href="login.html">
                        Login
                    </a>
                    to comment.
                </p>

            `;

        }


        commentsBox.innerHTML = html;

        commentsBox.dataset.open = "true";


    } catch (error) {

        console.error("Comments error:", error);

        commentsBox.innerHTML = `
            <p>Unable to load comments.</p>
        `;
    }

}



// ================= ADD COMMENT =================

async function addComment(postId) {

    const input =
        document.getElementById(`comment-input-${postId}`);


    const text = input.value.trim();


    if (!text) {

        alert("Please write a comment.");

        return;
    }


    if (!token) {

        alert("Please login first.");

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/posts/${postId}/comments`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",

                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    text: text
                })
            }
        );


        const data = await response.json();

        console.log("Comment response:", data);


        if (!response.ok) {

            alert(data.message || "Unable to add comment.");

            return;
        }


        // Clear input
        input.value = "";


        // Reload comments
        const commentsBox =
            document.getElementById(`comments-${postId}`);


        commentsBox.dataset.open = "false";

        await showComments(postId);


    } catch (error) {

        console.error("Comment error:", error);

        alert("Comment request failed. Check the browser console.");

    }

}

// ================= START =================

loadPosts();


// ================= DELETE POSTS =================
async function deletePost(postId) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/posts/${postId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert("Post deleted successfully 🗑️");

            loadPosts();

        } else {

            alert(
                data.message || "Unable to delete post."
            );
        }

    } catch (error) {

        console.error("Delete error:", error);

        alert("Delete request failed.");
    }
}