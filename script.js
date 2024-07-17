const apps = [
    { id: 1, name: 'Google', url: 'https://www.google.com/', image: 'https://www.google.com/s2/favicons?domain=www.google.com' },
    { id: 2, name: 'ChatGPT', url: 'https://chatgpt.com/', image: 'https://www.google.com/s2/favicons?domain=chatgpt.com' },
    { id: 3, name: 'Dropbox', url: 'https://www.dropbox.com/', image: 'https://www.google.com/s2/favicons?domain=www.dropbox.com' },
    { id: 4, name: 'Facebook', url: 'https://www.facebook.com/', image: 'https://www.google.com/s2/favicons?domain=www.facebook.com' },
    { id: 5, name: 'Instagram', url: 'https://www.instagram.com/', image: 'https://www.google.com/s2/favicons?domain=www.instagram.com' },
    { id: 6, name: 'Spotify', url: 'https://open.spotify.com/', image: 'https://www.google.com/s2/favicons?domain=open.spotify.com' },
    { id: 7, name: 'Snapchat', url: 'https://www.snapchat.com/', image: 'https://www.google.com/s2/favicons?domain=www.snapchat.com' },
    { id: 8, name: 'YouTube', url: 'https://www.youtube.com/', image: 'https://www.google.com/s2/favicons?domain=www.youtube.com' },
    { id: 9, name: 'LinkedIn', url: 'https://www.linkedin.com/', image: 'https://www.google.com/s2/favicons?domain=www.linkedin.com' },
    { id: 10, name: 'Naukri', url: 'https://www.naukri.com/', image: 'https://www.google.com/s2/favicons?domain=www.naukri.com' },
    { id: 11, name: 'WhatsApp', url: 'https://www.whatsapp.com/', image: 'https://www.google.com/s2/favicons?domain=www.whatsapp.com' },
    { id: 12, name: 'Skype', url: 'https://www.skype.com/en/features/skype-web/', image: 'https://www.google.com/s2/favicons?domain=www.skype.com' },
    { id: 13, name: 'PayPal', url: 'https://www.paypal.com/in/home', image: 'https://www.google.com/s2/favicons?domain=www.paypal.com' },
    { id: 14, name: 'Walmart', url: 'https://www.walmart.com/', image: 'https://www.google.com/s2/favicons?domain=www.walmart.com' },
    { id: 15, name: 'Pinterest', url: 'https://in.pinterest.com/', image: 'https://www.google.com/s2/favicons?domain=in.pinterest.com' },
    { id: 16, name: 'X', url: 'https://x.com/', image: 'https://www.google.com/s2/favicons?domain=x.com' }
];

const appGrid = document.getElementById('appGrid');
const searchInput = document.getElementById('search');
const showAddAppFormButton = document.getElementById('showAddAppForm');
const addAppForm = document.getElementById('addAppForm');
const overlay = document.getElementById('overlay');
const appForm = document.getElementById('appForm');
const appIdInput = document.getElementById('appId');
const appNameInput = document.getElementById('appName');
const appURLInput = document.getElementById('appURL');

const renderApps = (appsToRender) => {
    appGrid.innerHTML = '';
    appsToRender.forEach(app => {
        const appElement = document.createElement('div');
        appElement.className = 'app';
        appElement.innerHTML = `
            <div onclick="window.open('${app.url}', '_blank')" style="cursor: pointer;">
                <img src="${app.image}" alt="${app.name}">
                <div>${app.name}</div>
            </div>
            <div class="options" onclick="toggleOptions(event)">
                ⋮
                <ul class="hidden">
                    <li onclick="editApp(${app.id})">Edit</li>
                    <li onclick="deleteApp(${app.id})">Delete</li>
                </ul>
            </div>
        `;
        appGrid.appendChild(appElement);
    });
};


const toggleOptions = (event) => {
    event.stopPropagation();  
    const optionsDiv = event.currentTarget;
    const optionsList = optionsDiv.querySelector('ul');
    if (optionsList) {
        optionsList.classList.toggle('hidden'); 
    } else {
        console.error('Unable to find optionsList within optionsDiv:', optionsDiv);
    }
};

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim().toLowerCase(); 
    const filteredApps = apps.filter(app => app.name.toLowerCase().includes(searchTerm));
    renderApps(filteredApps);
});
showAddAppFormButton.addEventListener('click', () => {
    appIdInput.value = '';  
    appNameInput.value = '';  
    appURLInput.value = '';  
    addAppForm.style.display = 'block';  
    overlay.style.display = 'block';  
});

overlay.addEventListener('click', () => {
    addAppForm.style.display = 'none'; 
    overlay.style.display = 'none';  
});

appForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const appId = appIdInput.value;
    const appName = appNameInput.value;
    const appURL = appURLInput.value;
    const appImage = `https://www.google.com/s2/favicons?domain=${new URL(appURL).hostname}`;

    if (appId) {
        const appIndex = apps.findIndex(app => app.id === parseInt(appId));
        if (appIndex !== -1) {
            apps[appIndex].name = appName;
            apps[appIndex].url = appURL;
            apps[appIndex].image = appImage;
        }
    } else {
        const newApp = {
            id: apps.length + 1,
            name: appName,
            url: appURL,
            image: appImage
        };
        apps.push(newApp);
    }

    renderApps(apps);
    appForm.reset();
    addAppForm.style.display = 'none';
    overlay.style.display = 'none'; 
});

appGrid.addEventListener('click', (event) => {
    if (event.target.classList.contains('options')) {
        toggleOptions(event);
    }
});

const editApp = (appId) => {
    const appToEdit = apps.find(app => app.id === appId);
    if (appToEdit) {
        appIdInput.value = appToEdit.id;
        appNameInput.value = appToEdit.name;
        appURLInput.value = appToEdit.url;
        addAppForm.style.display = 'block';
        overlay.style.display = 'block';
    }
};

const deleteApp = (appId) => {
    const index = apps.findIndex(app => app.id === appId);
    if (index !== -1) {
        apps.splice(index, 1);
        renderApps(apps); 
    }
};

renderApps(apps);
