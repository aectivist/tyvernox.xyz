const vinylContainer = document.querySelector('.vinyl-reco');
const projectOutput = document.querySelector('.project-outp');
const switchButton = document.querySelector('.switch-btn');

const songs = [
    { path: '/songs/Persona 5 OST 59 - The Days When My Mother Was There .mp3', title: 'The Days When My Mother Was There' },
    { path: '/songs/Persona 5 OST 55 - Life Goes On.mp3', title: 'Life Goes On' },
    { path: '/songs/Persona 5 OST 09 - Beneath the Mask -instrumental version- .mp3', title: 'Beneath the Mask' },
    { path: '/songs/P5 OST 66 Break it Down  Elp Version.mp3', title: 'Break it Down' },
    { path: '/songs/P5 OST 62 Alright  Elp Version.mp3', title: 'Alright' }
];

const audioPlayer = document.getElementById('music-player');
const vinylImg = document.querySelector('.vinyl-img');
const notification = document.querySelector('.song-notification');
let currentSongIndex = Math.floor(Math.random() * songs.length);

function playSong(index) {
    audioPlayer.src = songs[index].path;
    audioPlayer.load(); // Explicitly load the audio
    audioPlayer.play().catch(error => {
        console.error('Error playing audio:', error);
        showNotification('Error playing audio. Please try again.');
    });
    showNotification(songs[index].title);
    vinylImg.classList.remove('paused');
}

// Add error handling for audio
audioPlayer.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    showNotification('Error loading audio file');
});

function showNotification(songTitle) {
    notification.textContent = `Now Playing: ${songTitle}`;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}

// Initial song play
playSong(currentSongIndex);

// Vinyl click handler
vinylImg.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        vinylImg.classList.remove('paused');
    } else {
        audioPlayer.pause();
        vinylImg.classList.add('paused');
    }
});

// Next song button handler
switchButton.addEventListener('click', () => {
    vinylContainer.classList.add('slide-left');
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    
    setTimeout(() => {
        vinylContainer.classList.remove('slide-left');
        playSong(currentSongIndex);
    }, 2000);
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

// Remove existing updateContent and content object as they're no longer needed

