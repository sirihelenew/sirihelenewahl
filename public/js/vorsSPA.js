import { createGroup, joinGroup } from './vorsFunctions.js';
const clientId = 'e766892102b04c559335509e3fa258ef';

export function hostVors() {
    console.log('Before clearing localStorage');
    removeLocalStorage();
    console.log('After clearing localStorage');

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

    const authButton = document.createElement('button');
    authButton.innerText = 'Autentiser deg via Spotify';
    authButton.className = 'auth-button';
    authButton.id = 'authButton';
    authButton.style.backgroundColor = 'var(--green)';

    authButton.onclick = async function() {
        localStorage.setItem('currentUserName', 'Host');
        redirectToAuthCodeFlow(clientId);
    };

    container.appendChild(homeButton);
    container.appendChild(header);
    container.appendChild(authButton);
    document.body.appendChild(container);
}

export function joinVors() {
    removeLocalStorage();
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

    const authButton = document.createElement('button');
    authButton.innerText = 'Autentiser deg via Spotify';
    authButton.className = 'auth-button';
    authButton.id = 'authButton';
    authButton.style.backgroundColor = 'var(--gul)';

    authButton.onclick = async function() {
        localStorage.setItem('currentUserName', 'Deltaker');
        redirectToAuthCodeFlow(clientId);
    };

    
    container.appendChild(homeButton);
    container.appendChild(header);
    container.appendChild(authButton);
    document.body.appendChild(container);
}

function removeLocalStorage() {
    // Remove all items from localStorage
    localStorage.clear();
}


async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    // Store the code verifier, current URL, and groupId in localStorage to use it later when fetching the access token
    localStorage.setItem("verifier", verifier);
    localStorage.setItem("original_url", window.location.href);
    // localStorage.setItem("pendingGroupId", groupId);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "https://sirihelenewahl.no/callback"); 
    params.append("scope", "user-read-private user-read-email playlist-modify-public playlist-modify-private user-read-recently-played");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

 function initiateVors() {
    localStorage.removeItem('CurrentUserName');
    console.log('Hello');
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

    container.appendChild(homeButton);
    container.appendChild(header);
    container.appendChild(inputBox);
    container.appendChild(submitButton);
    document.body.appendChild(container);

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
}
function joinVorsWithAuth() {
    localStorage.removeItem('CurrentUserName');
    console.log('Hellooo');
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

window.onload = async function() {
    console.log('Window loaded'); // Log to verify the function is executed
    const accessToken = localStorage.getItem('spotifyAccessToken');
    const groupId = localStorage.getItem('pendingGroupId'); 
    const hostOrParticipant = localStorage.getItem('currentUserName');
    if (!accessToken) {
        // Store the access token
        console.log('No access token');
    } else {
        if (!groupId && hostOrParticipant === 'Host') {
            initiateVors();
        } else if (!groupId && hostOrParticipant === 'Deltaker') {
            joinVorsWithAuth();
        }
        else {
            console.log('Group ID:', groupId);
        }
}
}