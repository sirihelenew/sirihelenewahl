import { createGroup, joinGroup } from './vorsFunctions.js';

export function hostVors() {
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
    container.style.backgroundColor = 'var(--rosa)';

    const header = document.createElement('div');
    header.className = 'header';
    header.style.backgroundColor = 'var(--rosa)';
    const img = document.createElement('img');
    img.id = 'vorsside-logo';
    img.src = 'images/VORSSIDE-logo.svg';
    img.alt = 'logo';
    img.style.width = '100%';
    img.style.height = 'auto';
    header.appendChild(img);

    const inputBox = document.createElement('input');
    inputBox.type = 'text';
    inputBox.placeholder = 'Lag en ID';
    inputBox.className = 'input-box';
    inputBox.id = 'groupIdInput';
    inputBox.autocomplete = "off";

    const submitButton = document.createElement('button');
    submitButton.innerText = 'START VORS';
    submitButton.className = 'submit-button';
    submitButton.style.backgroundColor = 'var(--green)';


    submitButton.onclick = async function() {
        const groupId = inputBox.value;
        if (groupId) {
            const success = await createGroup(groupId);
            if (success) {
                console.log('ID:', groupId);
                alert(`Vorsgruppe '${groupId}' er opprettet! Del ID-en med deltakerne.`);
                window.location.href = 'vorsside';
            } else {
                inputBox.value = '';
                inputBox.focus();
            }
        } else {
            alert('Du må skrive inn en ID');
        }
    };
    container.appendChild(homeButton);
    container.appendChild(header);
    container.appendChild(inputBox);
    container.appendChild(submitButton);
    document.body.appendChild(container);
}

export function joinVors() {
    // SPA: join skriver inn en ID som legges til i firebase og gruppen er opprettet
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
    container.style.backgroundColor = 'var(--green)';

    const header = document.createElement('div');
    header.className = 'header';
    header.style.backgroundColor = 'var(--green)';
    const img = document.createElement('img');
    img.id = 'vorsside-logo';
    img.src = 'images/VORSSIDE-logo.svg';
    img.alt = 'logo';
    img.style.width = '100%';
    img.style.height = 'auto';
    header.appendChild(img);

    const idBox = document.createElement('input');
    idBox.type = 'text';
    idBox.placeholder = 'Skriv inn ID';
    idBox.className = 'input-box';
    idBox.id = 'groupJoinIdInput';
    idBox.autocomplete = "off";

    const nameBox = document.createElement('input');
    nameBox.type = 'text';
    nameBox.placeholder = 'Skriv inn ditt navn';
    nameBox.className = 'input-box';

    const joinButton = document.createElement('button');
    joinButton.innerText = 'JOIN VORS';
    joinButton.className = 'submit-button';
    joinButton.style.backgroundColor = 'var(--rosa)';

    joinButton.onclick = async function() {
        const groupId = idBox.value.trim();
        const userName = nameBox.value.trim();
        if (groupId && userName) {
            const success = await joinGroup(groupId, userName);
            if (success) {
                alert(`Du har blitt med i vorsgruppen '${groupId}'!`);
                window.location.href = 'vorsside';
            } else {
                // Clear the input field and focus on it
                idBox.value = '';
                idBox.focus();
            }
        } else {
            alert('Du må fylle ut både gruppeID og navnet ditt.');
        }
    };
    container.appendChild(homeButton);
    container.appendChild(header);
    container.appendChild(idBox);
    container.appendChild(nameBox);
    container.appendChild(joinButton);
    document.body.appendChild(container);
}
