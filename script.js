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
const appForm = document.getElementById('appForm');
const overlay = document.getElementById('overlay');

let draggedElementIndex;

const renderApps = (appsToRender) => {
    appGrid.innerHTML = '';
    appsToRender.forEach((app, index) => {
        const appElement = document.createElement('div');
        appElement.className = 'app';
        appElement.setAttribute('draggable', 'true');
        appElement.setAttribute('data-index', index);
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
        appElement.addEventListener('dragstart', handleDragStart);
        appElement.addEventListener('dragover', handleDragOver);
        appElement.addEventListener('drop', handleDrop);
        appElement.addEventListener('dragend', handleDragEnd);
        appGrid.appendChild(appElement);
    });
};

const handleDragStart = (event) => {
    draggedElementIndex = event.currentTarget.getAttribute('data-index');
    event.currentTarget.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', event.currentTarget.innerHTML);
};

const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    event.currentTarget.classList.add('over');
};

const handleDrop = (event) => {
    event.stopPropagation();
    const targetElementIndex = event.currentTarget.getAttribute('data-index');
    if (draggedElementIndex !== targetElementIndex) {
        const temp = apps[draggedElementIndex];
        apps[draggedElementIndex] = apps[targetElementIndex];
        apps[targetElementIndex] = temp;
        renderApps(apps);
    }
    event.currentTarget.classList.remove('over');
};

const handleDragEnd = () => {
    const draggingElement = document.querySelector('.dragging');
    if (draggingElement) {
        draggingElement.classList.remove('dragging');
    }
    draggedElementIndex = null;
};

const filterApps = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredApps = apps.filter(app => app.name.toLowerCase().includes(searchTerm));
    renderApps(filteredApps);
};

const toggleOptions = (event) => {
    event.stopPropagation();
    const options = event.currentTarget.querySelector('ul');
    options.classList.toggle('hidden');
};

const showAddAppForm = () => {
    addAppForm.style.display = 'block';
    overlay.style.display = 'block';
};

const hideAddAppForm = () => {
    addAppForm.style.display = 'none';
    overlay.style.display = 'none';
};

const saveApp = (event) => {
    event.preventDefault();
    const appId = document.getElementById('appId').value;
    const appName = document.getElementById('appName').value;
    const appURL = document.getElementById('appURL').value;
    if (appId) {
        const appIndex = apps.findIndex(app => app.id == appId);
        apps[appIndex] = { id: parseInt(appId), name: appName, url: appURL, image: `https://www.google.com/s2/favicons?domain=${appURL}` };
    } else {
        const newApp = {
            id: apps.length ? Math.max(...apps.map(app => app.id)) + 1 : 1,
            name: appName,
            url: appURL,
            image: `https://www.google.com/s2/favicons?domain=${appURL}`
        };
        apps.push(newApp);
    }
    renderApps(apps);
    hideAddAppForm();
    appForm.reset();
};

const editApp = (id) => {
    const app = apps.find(app => app.id === id);
    document.getElementById('appId').value = app.id;
    document.getElementById('appName').value = app.name;
    document.getElementById('appURL').value = app.url;
    showAddAppForm();
};

const deleteApp = (id) => {
    const appIndex = apps.findIndex(app => app.id === id);
    apps.splice(appIndex, 1);
    renderApps(apps);
};

document.addEventListener('click', () => {
    document.querySelectorAll('.options ul').forEach(ul => ul.classList.add('hidden'));
});

overlay.addEventListener('click', hideAddAppForm);
showAddAppFormButton.addEventListener('click', showAddAppForm);
appForm.addEventListener('submit', saveApp);
searchInput.addEventListener('input', filterApps);

renderApps(apps);
