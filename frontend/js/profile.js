
if (!token) {
    window.location.href = "login.html";
}

const profileContainer =
    document.getElementById("profile-container");

const postsContainer =
    document.getElementById("user-posts");


async function loadProfile() {

    try {

        // Get current user ID from token
        const tokenData =
            JSON.parse(atob(token.split(".")[1]));

        const userId = tokenData.userId;


        // ================= PROFILE =================

        const profileResponse = await fetch(
            `http://localhost:5000/api/users/${userId}`
        );

        const profileData =
            await profileResponse.json();


        if (!profileResponse.ok) {

            profileContainer.innerHTML =
                "<p>Unable to load profile.</p>";

            return;
        }


        const user = profileData.user;


        profileContainer.innerHTML = `

            <div class="profile-info">

                <div class="profile-avatar">

                    ${
                        user.profileImage
                        ? `
                            <img
                                src="${user.profileImage}"
                                class="profile-image"
                                alt="Profile"
                            >
                        `
                        : `
                            ${user.name.charAt(0).toUpperCase()}
                        `
                    }

                </div>


                <div>

                    <h1>${user.name}</h1>

                    <p>@${user.username}</p>

                    <p>
                        ${user.bio || "No bio added yet."}
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

                </div>

            </div>

        `;


        // ================= USER POSTS =================

        const postsResponse = await fetch(
            `http://localhost:5000/api/users/${userId}/posts`
        );

        const postsData =
            await postsResponse.json();


        postsContainer.innerHTML = "";


        if (
            !postsData.posts ||
            postsData.posts.length === 0
        ) {

            postsContainer.innerHTML = `
                <div class="empty-posts">
                    <p>You haven't created any posts yet. ✈️</p>

                    <a href="create-post.html">
                        Create your first post
                    </a>
                </div>
            `;

            return;
        }


        postsData.posts.forEach(post => {

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

                    <button>
                        ❤️ ${post.likes?.length || 0}
                    </button>


                    <button
                        onclick="deleteProfilePost('${post._id}')"
                        class="delete-button"
                    >
                        🗑️ Delete
                    </button>

                </div>

            `;


            postsContainer.appendChild(postElement);

        });


    } catch (error) {

        console.error(
            "Profile error:",
            error
        );

        profileContainer.innerHTML =
            "<p>Unable to connect to server.</p>";
    }
}



// ================= DELETE PROFILE POST =================

async function deleteProfilePost(postId) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `http://localhost:5000/api/posts/${postId}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        const data =
            await response.json();


        if (response.ok) {

            alert(
                "Post deleted successfully 🗑️"
            );

            loadProfile();

        } else {

            alert(
                data.message ||
                "Unable to delete post."
            );
        }


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );

        alert(
            "Delete request failed."
        );
    }
}


loadProfile();