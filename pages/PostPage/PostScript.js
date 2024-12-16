let loggedIn = true; // Assume the user is always logged in for simplicity

function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postContainer = document.querySelector('.post-container');
    postContainer.innerHTML = '';
    
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.id = post.id;
        postDiv.innerHTML = `
            <p>${post.content}</p>
            ${post.media ? renderMedia(post.media) : ''}
            <div class="post-time">${new Date(post.timestamp).toLocaleString()}</div>
            <div class="post-actions">
                <button onclick="editPostPrompt('${post.id}')" class="edit-btn">Edit</button>
                <button onclick="deletePost('${post.id}')" class="delete-btn">Delete</button>
            </div>
        `;
        postContainer.appendChild(postDiv);
    });
    paginatePosts(1, 5);
}

function createPostPrompt() {
    const contentInput = document.getElementById('post-content');
    const content = contentInput.value.trim();
    if (content) {
        createPost(content);
        contentInput.value = ''; // Clear the input field
    } else {
        alert('Please enter some content.');
    }
}

function createPost(content, media = null) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const newPost = {
        id: Date.now().toString(),
        content,
        media,
        timestamp: new Date()
    };
    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts();
    alert('Post created successfully!');
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
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const newContent = prompt('Edit post content:', post.content);
    if (newContent !== null) {
        editPost(postId, newContent);
    }
}

function editPost(postId, newContent) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    post.content = newContent;
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts();
}

function deletePost(postId) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts = posts.filter(p => p.id !== postId);
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts();
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

document.addEventListener('DOMContentLoaded', () => {
    loadPosts();

    // Create an audio object
    const hoverSound = new Audio('/soundeffects/clickpersonasfx.mp3');

    // Select all boxes
    const tablinks = document.querySelectorAll('.tablinks');

    // Add event listeners to each box
    tablinks.forEach(tablink => {
        tablink.addEventListener('mouseenter', () => {
            hoverSound.currentTime = 0; // Restart sound if already playing
            hoverSound.play().catch(error => {
                if (error.name === 'NotAllowedError') {
                    console.log('Audio play was prevented. User interaction is required.');
                } else {
                    console.error('Audio play error:', error);
                }
            });
        });
    });
});