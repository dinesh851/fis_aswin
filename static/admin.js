const appGrid = document.getElementById('appGrid');
const searchInput = document.getElementById('search');
const showAddAppFormButton = document.getElementById('showAddAppForm');
const addAppForm = document.getElementById('addAppForm');
const appForm = document.getElementById('appForm');
const overlay = document.getElementById('overlay');
const appGroup = document.getElementById('appGroup');
const newGroupName = document.getElementById('newGroupName');
const newGroupNameContainer = document.getElementById('newGroupNameContainer');
const saveButton = document.getElementById('saveButton');
const saveChangesButton = document.getElementById('saveChangesButton');
const folderPath = '/static/icons';  
const defaulticon = 0

let draggedElement;
let draggedElementGroup;
let apps = [];
let groups = {};
let groupHighestId = {};  
let highestGroupId = 0;

const renderApps = (appsToRender = []) => {
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
             <div class="options" onclick="toggleOptions(event)">
                    ⋮
                    <ul class="hidden">
                        <li onclick="deleteApp('${app.groupid}',${app.id})">Delete</li>
                    </ul>
                </div>
                <div onclick="window.open('${app.url}', '_blank')" style="cursor: pointer;">
                    <img src="${app.image}"  alt="${app.name}">
                    <div>${app.name}</div>
                </div>
               
            `;
            appElement.addEventListener('dragstart', handleDragStart);
            appElement.addEventListener('dragover', handleDragOver);
            appElement.addEventListener('drop', handleDrop);
            appElement.addEventListener('dragend', handleDragEnd);
            appsContainer.appendChild(appElement);
        });

        appGrid.appendChild(groupElement);
    }
};

const populateGroupOptions = () => {
    appGroup.innerHTML = '<option value="no">Select Group</option><option value="new">New Group</option>';
    for (const groupId in groups) {
        const option = document.createElement('option');
        option.value = groupId;
        option.textContent = groups[groupId];
        appGroup.appendChild(option);
    }
};

const handleGroupChange = () => {
    if (appGroup.value === 'new') {
        newGroupNameContainer.style.display = 'block';
        newGroupName.required = true;
        saveButton.disabled = !newGroupName.value.trim();
    } else if (appGroup.value === 'no') {
        newGroupNameContainer.style.display = 'none';
        newGroupName.required = false;
        newGroupName.value = '';  

        saveButton.disabled = true; 
    } else {
        newGroupName.value = "";
        newGroupNameContainer.style.display = 'none';
        newGroupName.required = false;
        saveButton.disabled = false; 
    }
};

const handleNewGroupNameChange = () => {
    if (appGroup.value === 'new') {
        saveButton.disabled = !newGroupName.value.trim();
    }
};

appGroup.addEventListener('change', handleGroupChange);
newGroupName.addEventListener('input', handleNewGroupNameChange);

const handleDragStart = (event) => {
    draggedElement = event.currentTarget;
    draggedElementGroup = draggedElement.closest('.group');
    draggedElement.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', draggedElement.innerHTML);
};

const handleDragOver = (event) => {
    event.preventDefault();
    const targetElement = event.currentTarget;
    const targetGroup = targetElement.closest('.group');

    if (targetGroup === draggedElementGroup) {
        event.dataTransfer.dropEffect = 'move';
        targetElement.classList.add('over');
    } else {
        event.dataTransfer.dropEffect = 'none';
    }
};

const handleDrop = (event) => {
    event.stopPropagation();
    const targetElement = event.currentTarget;
    const targetGroup = targetElement.closest('.group');

    if (targetGroup === draggedElementGroup && draggedElement !== targetElement) {
        const targetIndex = Array.from(targetGroup.querySelectorAll('.app')).indexOf(targetElement);
        const draggedIndex = Array.from(draggedElementGroup.querySelectorAll('.app')).indexOf(draggedElement);

        if (draggedIndex !== targetIndex) {
            const appsInGroup = apps.filter(app => app.groupid == draggedElementGroup.dataset.groupid);
            const draggedApp = appsInGroup[draggedIndex];
            const targetApp = appsInGroup[targetIndex];

            const tempId = draggedApp.id;
            draggedApp.id = targetApp.id;
            targetApp.id = tempId;

            appsInGroup[draggedIndex] = targetApp;
            appsInGroup[targetIndex] = draggedApp;
            apps = apps.filter(app => app.groupid != draggedElementGroup.dataset.groupid).concat(appsInGroup);
            renderApps(apps);
        }
    }
};
    
const handleDragEnd = (event) => {
    draggedElement.classList.remove('dragging');
    document.querySelectorAll('.app').forEach(app => app.classList.remove('over'));
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
    appForm.reset();
    appGroup.innerHTML = '';
    populateGroupOptions();
    addAppForm.style.display = 'block';
    overlay.style.display = 'block';
    handleGroupChange();  
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
    const appGroupValue = appGroup.value;
    let groupId;
    let groupName;
    // console.log(highestGroupId);

    if (appGroupValue === 'new') {
        console.log(highestGroupId);
        groupId =highestGroupId+ 1;
        groupName = newGroupName.value;
        groups[groupId] = groupName;
        groupHighestId[groupId] = 0;  
        highestGroupId = groupId;  


    } else {
        groupId = Number(appGroupValue);  
        groupName = groups[groupId];
    }

    let newId;
    if (appId) {
        newId = parseInt(appId);
    } else {
        groupHighestId[groupId] = (groupHighestId[groupId] || 0) + 1;
        newId = groupHighestId[groupId];
    }

    const app = {
        id: newId,
        name: appName,
        url: appURL,
        groupid: groupId,
        group_name: groupName,
        icon :0,
        image:`${folderPath}/${defaulticon}.png`
    };
    // console.log(app);
    if (appId) {
        const index = apps.findIndex(a => a.id === parseInt(appId));
        apps[index] = app;
    } else {
        apps.push(app);
    }

    renderApps(apps);
    hideAddAppForm();
};


 

const deleteApp = (groupId, appId) => {
    const numericGroupId = Number(groupId); 
    const numericAppId = Number(appId);     
 
    
    // console.log(groupId,appId   );
    // console.log(apps);
    apps = apps.filter(app => app.groupid !== numericGroupId || app.id !== numericAppId);
    // console.log(apps);
    renderApps(apps);
};


const saveChanges = () => {

    const groupedData = apps.reduce((acc, app) => {
        const group_id = parseInt(app.groupid);
        if (!acc[group_id]) {
            acc[group_id] = [];
        }
        acc[group_id].push({
            group_id,
            group_name: app.group_name,
            id: app.id,
            name: app.name,
            url: app.url,
            icon: app.icon
        });
        return acc;
    }, {});

    const updatedData = Object.values(groupedData).flatMap(group => {
        group.sort((a, b) => a.id - b.id);
        return group.map((item, index) => ({
            ...item,
            id: index + 1
        }));
    });
    // console.log(updatedData);

    fetch(`http://${publicIp}:5000/api/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if (response.status === 401) {   
            window.location.href = '/login';   
            throw new Error('Unauthorized - Redirecting to login.');
        } else if (response.ok) {   
            return response.json();
        } else {
            throw new Error('Network response was not ok.');
        }
    })
    .then(data => {
        // console.log('Success:', data);
        saveChangesButton.innerText = 'Saving';
        setTimeout(() => {
            saveChangesButton.innerText = 'Saved';
        }, 1000);
        setTimeout(() => {
            saveChangesButton.innerText = 'Save Changes';
        }, 4000); 
    })
    .catch((error) => {
        console.error('Error:', error);
        saveChangesButton.innerText = 'Error try again';
        setTimeout(() => {
            saveChangesButton.innerText = 'Save Changes';
        }, 2000);  
    });
    
};


saveChangesButton.addEventListener('click', saveChanges);
showAddAppFormButton.addEventListener('click', showAddAppForm);
overlay.addEventListener('click', hideAddAppForm);
searchInput.addEventListener('input', filterApps);
appForm.addEventListener('submit', saveApp);

const fetchApps = async () => {
    try {
        const response = await fetch(`http://${publicIp}:5000/api/get_data`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        // console.log('Fetched data:', data);
        apps = data.map(item => ({
            groupid: item.group_id,
            group_name: item.group_name,
            id: item.id,
            name: item.name,
            url: item.url,
            icon:item.icon,
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
         highestGroupId = apps.reduce((max, app) => {
            return (app.groupid > max) ? app.groupid : max;
          }, 0);
        renderApps(apps);
        populateGroupOptions();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};
const logoutButton = document.getElementById('logout');
    
logoutButton.addEventListener('click', () => {
    window.location.href = `http://${publicIp}:5000/logout`;
});
const addicons = document.getElementById('addicons');
function refreshPage() {
    location.reload();
}
addicons.addEventListener('click', () => {
    window.location.href =`http://${publicIp}:5000/icon`;
});
fetchApps();
