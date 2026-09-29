const API_URL = "http://localhost:5000/api";

const postsContainer =
    document.getElementById("explore-posts");

const searchInput =
    document.getElementById("search-input");

let allPosts = [];


// ================= LOAD POSTS =================

async function loadPosts() {

    try {

        const response =
            await fetch(`${API_URL}/posts`);

        const data =
            await response.json();

        allPosts = data.posts || [];

        displayPosts(allPosts);

    } catch (error) {

        console.error(error);

        postsContainer.innerHTML = `
            <p>Unable to load posts.</p>
        `;

    }

}


// ================= DISPLAY POSTS =================

function displayPosts(posts) {

    postsContainer.innerHTML = "";


    if (posts.length === 0) {

        postsContainer.innerHTML = `
            <p>
                No travel posts found. 🔍
            </p>
        `;

        return;
    }


    posts.forEach(post => {

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

                <button>

                    ❤️ ${post.likes?.length || 0}

                </button>


                <button
                    onclick="openComments('${post._id}')"
                >

                    💬 Comments

                </button>

            </div>

        `;


        postsContainer.appendChild(postElement);

    });

}


// ================= SEARCH =================

searchInput.addEventListener(
    "input",
    function () {

        const searchText =
            searchInput.value
                .toLowerCase()
                .trim();


        if (!searchText) {

            displayPosts(allPosts);

            return;
        }


        const filteredPosts =
            allPosts.filter(post => {

                const location =
                    post.location?.toLowerCase() || "";

                const content =
                    post.content?.toLowerCase() || "";

                const name =
                    post.user?.name?.toLowerCase() || "";

                const username =
                    post.user?.username?.toLowerCase() || "";


                return (
                    location.includes(searchText) ||
                    content.includes(searchText) ||
                    name.includes(searchText) ||
                    username.includes(searchText)
                );

            });


        displayPosts(filteredPosts);

    }
);


// ================= COMMENTS =================

function openComments(postId) {

    window.location.href =
        `index.html#post-${postId}`;

}


// ================= START =================

loadPosts();