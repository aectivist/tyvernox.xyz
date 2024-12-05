let loggedIn = false;
let authToken = null;
const API_URL = 'http://localhost:3000/api';

async function login(username, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            loggedIn = true;
            authToken = data.token;
            document.querySelector('.login-form').style.display = 'none';
            document.querySelector('.new-post-button').style.display = 'block';
            loadPosts();
        } else {
            alert('Invalid credentials!');
        }
    } catch (err) {
        console.error('Login error:', err);
        alert('Login failed');
    }
}

async function loadPosts() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        const posts = await response.json();
        const postContainer = document.querySelector('.post-container');
        postContainer.innerHTML = '';
        
        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            postDiv.id = post._id;
            postDiv.innerHTML = `
                <p>${post.content}</p>
                ${post.media ? renderMedia(post.media) : ''}
                <div class="post-time">${new Date(post.timestamp).toLocaleString()}</div>
                ${loggedIn ? `
                    <div class="post-actions">
                        <button onclick="editPostPrompt('${post._id}')" class="edit-btn">Edit</button>
                        <button onclick="deletePost('${post._id}')" class="delete-btn">Delete</button>
                    </div>
                ` : ''}
            `;
            postContainer.appendChild(postDiv);
        });
        paginatePosts(1, 5);
    } catch (err) {
        console.error('Error loading posts:', err);
    }
}

async function createPost(content, media = null) {
    if (!loggedIn) {
        alert("You must be logged in to create a post.");
        return;
    }
    
    try {
        await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ content, media })
        });
        loadPosts();
    } catch (err) {
        console.error('Error creating post:', err);
    }
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

async function editPost(postId, newContent) {
    if (!loggedIn) {
        alert("You must be logged in to edit a post.");
        return;
    }
    
    try {
        await fetch(`${API_URL}/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ content: newContent })
        });
        loadPosts();
    } catch (err) {
        console.error('Error editing post:', err);
    }
}

async function deletePost(postId) {
    if (!loggedIn) {
        alert("You must be logged in to delete a post.");
        return;
    }
    
    try {
        await fetch(`${API_URL}/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        loadPosts();
    } catch (err) {
        console.error('Error deleting post:', err);
    }
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

function logout() {
    loggedIn = false;
    authToken = null;
    const loginElements = document.querySelectorAll('.login-trigger, .login-form');
    const newPostButton = document.querySelector('.new-post-button');
    loginElements.forEach(el => el.style.display = 'block');
    newPostButton.style.display = 'none';
    loadPosts();
}

document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
});

