document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Add your authentication logic here
    console.log('Login attempted:', username);
    
    // Animation effect on submit
    const loginBox = document.querySelector('.login-box');
    loginBox.style.transform = 'scale(0.98)';
    setTimeout(() => {
        loginBox.style.transform = 'scale(1)';
    }, 200);
});

// Add glitch effect on hover
document.querySelector('.login-box').addEventListener('mousemove', function(e) {
    const glitchText = document.querySelector('h2');
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    glitchText.style.textShadow = `
        ${x/50}px ${y/50}px 10px rgba(123, 10, 176, 0.8),
        ${-x/50}px ${-y/50}px 10px rgba(91, 47, 195, 0.8)
    `;
});

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
