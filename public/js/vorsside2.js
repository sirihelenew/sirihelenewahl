import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { db } from './firebaseConfig.js';

async function visGruppeInfo(groupId, container) {
    try {
        const groupRef = doc(db, 'vorsGrupper', groupId);
        const groupDoc = await getDoc(groupRef);

        if (groupDoc.exists()) {
            const groupData = groupDoc.data();
            const members = groupData.members || [];
            const groupID = groupData.groupID;

            console.log(`GruppeID: ${groupID}`);
            console.log('Medlemmer:', members);

            const groupIdElement = document.createElement('h2');
            groupIdElement.innerText = `GruppeID: ${groupID}`;
            container.appendChild(groupIdElement);

            const membersHeader = document.createElement('h3');
            membersHeader.innerText = 'Medlemmer:';
            membersHeader.style.margin = '0';
            container.appendChild(membersHeader);
            const membersList = document.createElement('ul');
            membersList.style.listStyleType = 'none';
            membersList.style.padding = '0';
            membersList.style.alignItems = 'left';
            members.forEach(member => {
                const memberItem = document.createElement('li');
                memberItem.innerText = member.name;
                memberItem.style.fontSize = '20px';
                membersList.appendChild(memberItem);
            });
            container.appendChild(membersList);

            document.body.appendChild(container);
        } else {
            console.log('No such group!');
        }
    } catch (error) {
        console.error('Error fetching group info:', error);
    }
}
    
    

export function singlePageApplication(color, type) {
    const article = document.querySelector('article');
    if (article) {
        article.style.display = 'none';
    }
    const homeButton = document.getElementById('home-button');
    homeButton.style.display = 'flex';

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = color;

    const header = document.createElement('div');
    header.className = 'header';
    header.style.backgroundColor = color;
    const img = document.createElement('img');
    img.id = 'vorsside-logo';
    img.src = 'images/VORSSIDE-logo.svg';
    img.alt = 'logo';
    img.style.width = '100%';
    img.style.height = 'auto';
    header.appendChild(img);

    if (type==='groupInfo') {
        const groupId = localStorage.getItem('currentGroupId');
        visGruppeInfo(groupId, container);
    }

    container.appendChild(homeButton);
    container.appendChild(header);
    document.body.appendChild(container);
}