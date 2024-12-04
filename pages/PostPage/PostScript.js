let loggedIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;

function login(username, password) {
    console.log("Login attempted"); // Debug line
    if (username === "admin" && password === "IDAWG") {
        loggedIn = true;
        localStorage.setItem('isLoggedIn', true);
        alert("Login successful!");
        const content = prompt("Enter your post content:");
        if (content) {
            createPost(content);
        }
        document.querySelector('.login-form').style.display = 'none';
        document.querySelector('.new-post-button').style.display = 'block';
    } else {
        alert("Invalid credentials!");
    }
}

function createPostPrompt() {
    const content = prompt("Enter your post content:");
    if (content) {
        const hasEmbed = confirm("Would you like to add media (image/video)?");
        if (hasEmbed) {
            const mediaType = prompt("Enter media type (image/video):");
            const mediaUrl = prompt("Enter media URL:");
            if (mediaUrl && (mediaType === 'image' || mediaType === 'video')) {
                createPost(content, { type: mediaType, url: mediaUrl });
            } else {
                createPost(content);
            }
        } else {
            createPost(content);
        }
    }
}

function loadPostsFromStorage() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postContainer = document.querySelector('.post-container');
    postContainer.innerHTML = ''; // Clear existing posts
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.id = post.id;
        postDiv.innerHTML = `
            <p>${post.content}</p>
            ${post.media ? renderMedia(post.media) : ''}
            <div class="post-time">${post.timestamp}</div>
            ${loggedIn ? `
                <div class="post-actions">
                    <button onclick="editPostPrompt('${post.id}')" class="edit-btn">Edit</button>
                    <button onclick="deletePost('${post.id}')" class="delete-btn">Delete</button>
                </div>
            ` : ''}
        `;
        postContainer.appendChild(postDiv);
    });
    paginatePosts(1, 5);
}

function createPost(content, media = null) {
    if (!loggedIn) {
        alert("You must be logged in to create a post.");
        return;
    }
    
    const newPost = {
        id: 'post_' + Date.now(),
        content: content,
        timestamp: new Date().toLocaleString(),
        media: media
    };

    // Save to localStorage
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.unshift(newPost); // Add new post at the beginning
    localStorage.setItem('posts', JSON.stringify(posts));

    // Update display
    loadPostsFromStorage();
}

function renderMedia(media) {
    if (!media) return '';
    
    if (media.type === 'image') {
        return `<img src="${media.url}" alt="Post image" class="post-media">`;
    } else if (media.type === 'video') {
        return `<video controls class="post-media">
            <source src="${media.url}" type="video/mp4">
            Your browser does not support the video tag.
        </video>`;
    }
    return '';
}

function editPostPrompt(postId) {
    const newContent = prompt("Enter new content for the post:");
    if (newContent) {
        editPost(postId, newContent);
    }
}

function editPost(postId, newContent) {
    if (!loggedIn) {
        alert("You must be logged in to edit a post.");
        return;
    }
    
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
        posts[postIndex].content = newContent;
        localStorage.setItem('posts', JSON.stringify(posts));
        loadPostsFromStorage();
    }
}

function deletePost(postId) {
    if (!loggedIn) {
        alert("You must be logged in to delete a post.");
        return;
    }
    
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts = posts.filter(post => post.id !== postId);
    localStorage.setItem('posts', JSON.stringify(posts));
    
    loadPostsFromStorage();
}

function paginatePosts(pageNumber, postsPerPage) {
    const posts = document.querySelectorAll('.post');
    const totalPages = Math.ceil(posts.length / postsPerPage);
    posts.forEach((post, index) => {
        post.style.display = (index >= (pageNumber - 1) * postsPerPage && index < pageNumber * postsPerPage) ? 'block' : 'none';
    });
    renderPagination(totalPages, pageNumber);
}

function renderPagination(totalPages, currentPage) {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.innerText = i;
        pageLink.href = "#";
        pageLink.className = (i === currentPage) ? 'active' : '';
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            paginatePosts(i, 5);
        });
        paginationContainer.appendChild(pageLink);
    }
}

// Add these new functions
function handleVisibilityChange() {
    if (document.hidden) {
        // User left the page
        localStorage.removeItem('isLoggedIn');
        loggedIn = false;
    }
}

function resetLoginState() {
    const loginElements = document.querySelectorAll('.login-trigger, .login-form');
    const newPostButton = document.querySelector('.new-post-button');
    
    loginElements.forEach(el => {
        el.style.display = 'block';
        if (el.classList.contains('login-form')) {
            el.style.left = '-300px'; // Reset position of login form
        }
    });
    newPostButton.style.display = 'none';
    loadPostsFromStorage(); // Reload posts without edit buttons
}

// Update the event listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginElements = document.querySelectorAll('.login-trigger, .login-form');
    const newPostButton = document.querySelector('.new-post-button');
    
    if (loggedIn) {
        loginElements.forEach(el => el.style.display = 'none');
        newPostButton.style.display = 'block';
    } else {
        loginElements.forEach(el => el.style.display = 'block');
        newPostButton.style.display = 'none';
    }
    
    loadPostsFromStorage();
    
    // Add visibility change detection
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

// Update the page leave/return handling
window.addEventListener('beforeunload', () => {
    localStorage.removeItem('isLoggedIn');
    loggedIn = false;
});

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Page is loaded from cache (user used back/forward)
        loggedIn = false;
        resetLoginState();
    }
});

// Optional: Add a logout function if you want to use it elsewhere
function logout() {
    localStorage.removeItem('isLoggedIn');
    loggedIn = false;
    const loginElements = document.querySelectorAll('.login-trigger, .login-form');
    const newPostButton = document.querySelector('.new-post-button');
    loginElements.forEach(el => el.style.display = 'block');
    newPostButton.style.display = 'none';
    loadPostsFromStorage(); // Reload posts without edit/delete buttons
}
