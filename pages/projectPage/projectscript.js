const vinylContainer = document.querySelector('.vinyl-reco');
const projectOutput = document.querySelector('.project-outp');
const switchButton = document.querySelector('.switch-btn');

const content = {
    default: {
        title: "Project Title",
        description: "Project description goes here. This is the default content that will be displayed."
    },
    alternate: {
        title: "Alternative View",
        description: "This is the alternative content that appears after switching."
    }
};

let isDefaultView = true;
let isAnimating = false;

function updateContent() {
    const currentContent = isDefaultView ? content.default : content.alternate;
    const titleElement = projectOutput.querySelector('h2');
    const descriptionElement = projectOutput.querySelector('p');
    
    titleElement.textContent = currentContent.title;
    descriptionElement.textContent = currentContent.description;
}

switchButton.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    vinylContainer.classList.add('slide-left');
    isDefaultView = !isDefaultView;
    updateContent();
    projectOutput.classList.toggle('alt-bg');
    
    setTimeout(() => {
        vinylContainer.classList.remove('slide-left');
        isAnimating = false;
    }, 500);
    print("Switch button clicked");
});
