const STORIES_API = "http://localhost:5000/api";


// ================= LOAD STORIES =================

async function loadStories() {

    try {

        const response = await fetch(
            `${STORIES_API}/stories`
        );

        const data = await response.json();

        const container =
            document.getElementById("stories-container");

        container.innerHTML = "";

        if (!data.stories || data.stories.length === 0) {

            return;
        }

        data.stories.forEach(story => {

            const storyElement =
                document.createElement("div");

            storyElement.className = "story";

           storyElement.innerHTML = `
                <img
                    src="${story.image}"
                    alt="${story.user?.name || "Story"}"
                    class="story-image"
                    onclick="openStory('${story.image}')"
                >

                <p>
                    ${story.user?.username || "User"}
                </p>
            `;

            container.appendChild(storyElement);

        });

    } catch (error) {

        console.error(
            "Stories loading error:",
            error
        );
    }
}


// ================= ADD STORY =================

const storyInput =
    document.getElementById("story-image-input");


if (storyInput) {

    storyInput.addEventListener(
        "change",
        async function () {

            const file = this.files[0];

            if (!file) {
                return;
            }

            if (!token) {

                alert(
                    "Please login to add a story."
                );

                window.location.href =
                    "login.html";

                return;
            }


            const formData = new FormData();

            formData.append(
                "image",
                file
            );


            try {

                const response = await fetch(
                    `${STORIES_API}/stories`,
                    {
                        method: "POST",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`
                        },

                        body: formData
                    }
                );


                const data =
                    await response.json();


                if (response.ok) {

                    alert(
                        "Story added successfully ✈️"
                    );

                    this.value = "";

                    loadStories();

                } else {

                    alert(
                        data.message ||
                        "Unable to add story."
                    );
                }

            } catch (error) {

                console.error(
                    "Story upload error:",
                    error
                );

                alert(
                    "Story upload failed."
                );
            }

        }
    );
}

loadStories();

// ================= STORY VIEWER =================

function openStory(imageUrl) {

    const viewer = document.createElement("div");

    viewer.className = "story-viewer";

    viewer.innerHTML = `
        <div class="story-viewer-content">

            <button
                class="story-close"
                onclick="this.closest('.story-viewer').remove()"
            >
                ✕
            </button>

            <img
                src="${imageUrl}"
                class="story-viewer-image"
            >

        </div>
    `;

    document.body.appendChild(viewer);
}