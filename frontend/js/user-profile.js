const API_URL = "http://localhost:5000/api";

const profileContainer = document.getElementById("profile-container");
const postsContainer = document.getElementById("user-posts");


// Get user ID from URL
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");


// ================= LOAD PROFILE =================

if (!userId) {

    profileContainer.innerHTML = `
        <p>User profile not found.</p>
    `;

} else {

    loadUserProfile();
    loadUserPosts();

}


async function loadUserProfile() {

    try {

        const response = await fetch(
            `${API_URL}/users/${userId}`
        );

        const data = await response.json();

        if (!response.ok) {

            profileContainer.innerHTML = `
                <p>${data.message}</p>
            `;

            return;
        }

        const user = data.user;

        let followButton = "";


        if (token) {

            const tokenData =
                JSON.parse(atob(token.split(".")[1]));

            const currentUserId = tokenData.userId;


            if (currentUserId !== userId) {

                const isFollowing = user.followers.includes(currentUserId);

                followButton = `
                    <button
                        id="follow-button"
                        onclick="followUser()"
                    >
                        ${isFollowing ? "Unfollow" : "Follow"}
                    </button>
                `;

            }

        }


        profileContainer.innerHTML = `

            <div class="profile-info">

                <div class="profile-avatar">
                    ${user.name.charAt(0).toUpperCase()}
                </div>

                <div>

                    <h1>${user.name}</h1>

                    <p>@${user.username}</p>

                    <p>
                        ${user.bio || "Travel enthusiast ✈️"}
                    </p>

                    <div class="profile-stats">

                        <span>
                            <strong>
                                ${user.followers.length}
                            </strong>
                            Followers
                        </span>

                        <span>
                            <strong>
                                ${user.following.length}
                            </strong>
                            Following
                        </span>

                    </div>

                    ${followButton}

                </div>

            </div>

        `;

    } catch (error) {

        console.error(error);

        profileContainer.innerHTML = `
            <p>Unable to connect to server.</p>
        `;
    }
}



// ================= LOAD USER POSTS =================

async function loadUserPosts() {

    try {

        const response = await fetch(
            `${API_URL}/users/${userId}/posts`
        );

        const data = await response.json();

        postsContainer.innerHTML = "";


        if (!data.posts || data.posts.length === 0) {

            postsContainer.innerHTML = `
                <p>No travel posts yet. ✈️</p>
            `;

            return;
        }


        data.posts.forEach(post => {

            const postElement =
                document.createElement("div");

            postElement.className = "post";


            postElement.innerHTML = `

                <div class="post-header">

                    <h3>
                        📍 ${post.location}
                    </h3>

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

                    <button
                        onclick="likePost('${post._id}')"
                    >
                        ❤️
                        <span id="like-count-${post._id}">
                            ${post.likes?.length || 0}
                        </span>
                    </button>


                    <button
                        onclick="showComments('${post._id}')"
                    >
                        💬 Comments
                    </button>

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

        console.error(error);

        postsContainer.innerHTML = `
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
                    Authorization: `Bearer ${token}`
                }
            }
        );


        const data = await response.json();

        console.log("Like response:", data);


        if (response.ok) {

            const likeCount =
                document.getElementById(
                    `like-count-${postId}`
                );


            if (likeCount) {

                likeCount.textContent = data.likes;

            }

        } else {

            alert(
                data.message ||
                "Unable to like post."
            );

        }


    } catch (error) {

        console.error("Like error:", error);

        alert("Like request failed.");

    }

}



// ================= SHOW COMMENTS =================

async function showComments(postId) {

    const commentsBox =
        document.getElementById(
            `comments-${postId}`
        );


    // Close comments
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


        if (!response.ok) {

            commentsBox.innerHTML = `
                <p>Unable to load comments.</p>
            `;

            return;
        }


        let html = "";


        if (
            !data.comments ||
            data.comments.length === 0
        ) {

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

        console.error("Comment error:", error);

        commentsBox.innerHTML = `
            <p>Unable to load comments.</p>
        `;

    }

}



// ================= ADD COMMENT =================

async function addComment(postId) {

    const input =
        document.getElementById(
            `comment-input-${postId}`
        );


    const text = input.value.trim();


    if (!text) {

        alert("Please write a comment.");

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/posts/${postId}/comments`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    text: text
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to add comment."
            );

            return;
        }


        // Reload comments
        const commentsBox =
            document.getElementById(
                `comments-${postId}`
            );

        commentsBox.dataset.open = "false";

        await showComments(postId);


    } catch (error) {

        console.error("Add comment error:", error);

        alert("Comment request failed.");

    }

}



// ================= FOLLOW USER =================

async function followUser() {

    if (!token) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/users/${userId}/follow`,
            {
                method: "PUT",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        if (response.ok) {

            alert(data.message);

            loadUserProfile();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Follow request failed.");

    }

}