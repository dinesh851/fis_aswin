 // Fetch data from list.json
 async function fetchApps() {
    try {
        const response = await fetch('list.json');
        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        // Parse the JSON data
        const data = await response.json();
        // Process the JSON data
        const apps = data.map(item => ({
            groupid: item.group_id, 
            group_name:item.group_name,
            id: item.id,
            name: item.name,
            url: item.url,
            image: item.image
        }));
        
        // Return the resulting array
        return apps;
    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('There was a problem with the fetch operation:', error);
        return []; // Return an empty array in case of an error
    }
}

 

const appGrid = document.getElementById('appGrid');
const searchInput = document.getElementById('search');
// const showAddAppFormButton = document.getElementById('showAddAppForm');
const addAppForm = document.getElementById('addAppForm');
const appForm = document.getElementById('appForm');
const overlay = document.getElementById('overlay');

let draggedElementIndex;

const renderApps = (appsToRender) => {
    fetchApps().then(a => {
        console.log(a); // Logs the apps array to the console
        apps=a
    
    appGrid.innerHTML = '';
    apps.forEach((app, index) => {
        const appElement = document.createElement('div');
        appElement.className = 'app';
        // appElement.setAttribute('draggable', 'true');
        appElement.setAttribute('data-index', index);
        appElement.innerHTML = `
            <div onclick="window.open('${app.url}', '_blank')" style="cursor: pointer;">
                <img src="${app.image}" alt="${app.name}">
                <div>${app.name}</div>
            </div>
        
        `;
  
        appGrid.appendChild(appElement);
    });
});
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

// const showAddAppForm = () => {
//     addAppForm.style.display = 'block';
//     overlay.style.display = 'block';
// };

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
 

document.addEventListener('click', () => {
    document.querySelectorAll('.options ul').forEach(ul => ul.classList.add('hidden'));
});

overlay.addEventListener('click', hideAddAppForm);
// showAddAppFormButton.addEventListener('click', showAddAppForm);
appForm.addEventListener('submit', saveApp);
searchInput.addEventListener('input', filterApps);


document.addEventListener('DOMContentLoaded', (event) => {
    let keySequence = [];
    const correctSequence = ['9', '5', '9', '5'];

    document.addEventListener('keydown', (event) => {
        keySequence.push(event.key);

        if (keySequence.length > correctSequence.length) {
            keySequence.shift();
        }

        // Check if the sequence matches
        if (keySequence.join('') === correctSequence.join('')) {
            window.location.href = 'http://127.0.0.1:5000/admin';
        }
    });
});

setTimeout(() => {
    renderApps( );
}, 20);