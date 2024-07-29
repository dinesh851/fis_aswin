const appGrid = document.getElementById('appGrid');
const searchInput = document.getElementById('search');
const newGroupName = document.getElementById('newGroupName');
const newGroupNameContainer = document.getElementById('newGroupNameContainer');
const folderPath = '/static/icons';  
console.log(publicIp);
let apps = [];
let groups = {};
let groupHighestId = {};  
const renderApps = (appsToRender = []) => {
    console.log(appsToRender);
    appGrid.innerHTML = '';
    const groupedApps = appsToRender.reduce((groups, app) => {
        if (!groups[app.groupid]) {
            groups[app.groupid] = {
                group_name: app.group_name,
                apps: []
            };
        }
        groups[app.groupid].apps.push(app);
        return groups;
    }, {});
    for (const groupId in groupedApps) {
        const group = groupedApps[groupId];
        const groupElement = document.createElement('div');
        groupElement.className = 'group';
        groupElement.dataset.groupid = groupId;
        groupElement.innerHTML = `
            <div class="group-title">${group.group_name}</div>
            <div class="apps"></div>
        `;
        const appsContainer = groupElement.querySelector('.apps');
        group.apps.forEach((app, index) => {
            const appElement = document.createElement('div');
            appElement.className = 'app';
            appElement.setAttribute('draggable', 'true');
            appElement.setAttribute('data-index', index);
            appElement.innerHTML = `
                <div onclick="window.open('${app.url}', '_blank')" style="cursor: pointer;">
                    <img src="${app.image}" alt="${app.name}">
                    <div>${app.name}</div>
                </div>
                
            `;
 
            appsContainer.appendChild(appElement);
        });
        appGrid.appendChild(groupElement);
    }
};
const filterApps = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredApps = apps.filter(app => app.name.toLowerCase().includes(searchTerm));
    console.log(apps);
    console.log(searchTerm);
    console.log(filteredApps);

    renderApps(filteredApps);
};
function redirectToAdmin() {
    window.location.href = `http://${publicIp}:5000/login`;

}
function refreshPage() {
    location.reload();
}
const fetchApps = async () => {
    try {
        const response = await fetch(`http://${publicIp}:5000/api/get_data`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Fetched data:', data);
          apps = data.map(item => ({
            groupid: item.group_id,
            group_name: item.group_name,
            id: item.id,
            name: item.name,
            url: item.url,
            image: `${folderPath}/${item.icon}.png`
        }));
        groups = apps.reduce((acc, app) => {
            if (!acc[app.groupid]) {
                acc[app.groupid] = app.group_name;
            }
            return acc;
        }, {});
        groupHighestId = apps.reduce((acc, app) => {
            if (!acc[app.groupid] || acc[app.groupid] < app.id) {
                acc[app.groupid] = app.id;
            }
            return acc;
        }, {});
        renderApps(apps);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};
searchInput.addEventListener('input', filterApps);

fetchApps();
document.addEventListener('DOMContentLoaded', (event) => {
    let keySequence = [];
    const correctSequence = ['9', '5', '9', '5'];

    document.addEventListener('keydown', (event) => {
        keySequence.push(event.key);

        if (keySequence.length > correctSequence.length) {
            keySequence.shift();
        }

        if (keySequence.join('') === correctSequence.join('')) {
            window.location.href = 'http://${publicIp}::5000/admin';
        }
    });
});