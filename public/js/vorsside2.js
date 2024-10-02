import { doc, getDoc, updateDoc, arrayUnion, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
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

    container.appendChild(homeButton);
    container.appendChild(header);
    document.body.appendChild(container);

    if (type==='groupInfo') {
        const groupId = localStorage.getItem('pendingGroupId');
        console.log('Group ID fuck you:', groupId);
        visGruppeInfo(groupId, container);
    }
    if (type==='repeatInfo') {
        const userName = localStorage.getItem('currentUserName');
        const groupId = localStorage.getItem('pendingGroupId');
        if (userName === 'Host') {
            onRepeatInfo(container, true, groupId, false);
        } else {
            onRepeatInfo(container, false, groupId, false);
        }
    }
    if (type==='repeatInfoReload') {
        const userName = localStorage.getItem('currentUserName');
        const groupId = localStorage.getItem('pendingGroupId');
        if (userName === 'Host') {
            onRepeatInfoReload(container, true, groupId);
        } else {
            onRepeatInfo(container, false, groupId, false);
        }
    }
}

async function onRepeatInfo(container, isHost, groupId, reloadBool) {
    const ruleBox = document.createElement('div');
    setupField(ruleBox, 'var(--white)');
    ruleBox.style.alignItems = 'center';
    ruleBox.style.width = '80%';

    const rulesHeader = document.createElement('h3');
    rulesHeader.innerHTML = isHost ? 'FOR HOST: REGLER FOR PÅ REPEAT' : 'FOR DELTAKER: REGLER FOR PÅ REPEAT';
    const rules = isHost ? [
        '1. Skriv inn hvilken/hvilke sanger som skal legges til (posisjonen i "På Repeat"-lista).',
        '2. Alle søker opp "På Repeat" på Spotify, og legger til sine sanger fra sin liste.',
        '3. Du laster ned spillelisten når alle er ferdige. En sang spilles av i 30 sekunder, så peker alle på den de tror eier sangen.',
        '4. Din sang = drikk antall slurker som antall pek du har på deg.',
        '5. Ikke din sang = drikk hvis du peker FEIL.'
    ] : [
        '1. Hosten legger inn fra sin mobil hvilken/hvilke sanger som skal legges til.',
        '2. Søk opp "På Repeat" på Spotify, og legg til dine sanger i feltet under.',
        '3. Hosten laster ned spillelisten når alle er ferdige. En sang spilles av i 30 sekunder, så peker alle på den de tror eier sangen.',
        '4. Din sang = drikk antall slurker som antall pek du har på deg.',
        '5. Ikke din sang = drikk hvis du peker FEIL.'
    ];
    const rulesList = document.createElement('ul');
    rulesList.style.listStyleType = 'none';
    rulesList.style.padding = '0';
    rulesList.style.alignItems = 'left';

    rules.forEach(rule => {
        const ruleItem = document.createElement('li');
        ruleItem.innerText = rule;
        ruleItem.style.fontSize = '15px';
        rulesList.appendChild(ruleItem);
    });

    ruleBox.appendChild(rulesHeader);
    ruleBox.appendChild(rulesList);
    container.appendChild(ruleBox);

    if (isHost) {
        const inputPosition = document.createElement('input');
        inputPosition.type = 'number';
        inputPosition.placeholder = 'Skriv inn posisjon for sang 1';
        inputPosition.style.width = '50%';
        inputPosition.style.margin = '10px';
        inputPosition.style.marginBottom = '0';
        inputPosition.style.padding = '10px';
        inputPosition.style.border = 'none';

        const addField = document.createElement('button');
        addField.innerText = 'Legg til flere posisjoner';
        addField.style.backgroundColor = 'var(--rosa)';
        addField.style.color = 'var(--white)';
        addField.style.border = '1px solid var(--white)';
        addField.style.borderRadius = '5px';
        addField.style.padding = '10px';
        addField.style.margin = '10px';
        addField.style.marginTop = '5px';
        addField.className = 'pos-button';

        const submitPosButton = document.createElement('button');
        submitPosButton.innerText = 'Send inn';
        submitPosButton.className = 'submit-button';
        submitPosButton.style.backgroundColor = 'var(--green)';

        container.appendChild(inputPosition);
        container.appendChild(addField);
        container.appendChild(submitPosButton);
        if(reloadBool){
            container.removeChild(inputPosition);
            container.removeChild(addField);
            container.removeChild(submitPosButton);
        }

        function addInputField() {
            const inputField = document.createElement('input');
            inputField.type = 'number';
            inputField.placeholder = 'Skriv inn posisjon';
            inputField.style.marginTop = '10px';
            inputField.style.padding = '10px';
            inputField.style.border = '1px solid var(--gray)';
            inputField.style.borderRadius = '5px';
            inputField.style.width = '50%';

            container.insertBefore(inputField, addField);
        }
        addField.addEventListener('click', addInputField);

        submitPosButton.addEventListener('click', async () => {
            const positionFields = document.querySelectorAll('input[type="number"]');
            const positions = [];
            positionFields.forEach(field => {
                if (field.value) {
                    positions.push(field.value);
                }
            });
            console.log('Positions:', positions);
        
            const groupId = localStorage.getItem('pendingGroupId'); 
            if (!groupId) {
                console.error('Group ID is missing.');
                return;
            }
            const groupRef = doc(db, 'vorsGrupper', groupId);
            try {
                await updateDoc(groupRef, {
                    onRepeatPositions: arrayUnion(...positions)
                });
                console.log('Positions added to Firestore.');
   
                await createSpotifyPlaylist(groupId);
                let accessToken = localStorage.getItem('spotifyAccessToken');
                if (!accessToken) {
                    localStorage.setItem("pendingGroupId", groupId); 
                    localStorage.setItem("positions", JSON.stringify(positions));
                    redirectToAuthCodeFlow(clientId, groupId); 
                    return; 
                }
        
            } catch (error) {
                console.error('Error adding positions to Firestore:', error);
            }
        });
    } else {
        const positionField = document.createElement('div');
        setupField(positionField, 'var(--lilla)');
        positionField.style.color = 'var(--white)';

        const positionHeader = document.createElement('h3');
        positionHeader.innerText = 'Disse sangene skal legges til:';
        positionHeader.style.margin = '0';
        positionField.appendChild(positionHeader);

        const positionList = document.createElement('ul');
        positionList.style.listStyleType = 'none';
        positionList.style.alignItems = 'left';
        positionList.style.padding = '5px';
        positionList.style.margin = '0';
        positionField.appendChild(positionList);

        const groupRef = doc(db, 'vorsGrupper', groupId);
        try {
            const groupSnap = await getDoc(groupRef);
            if (groupSnap.exists()) {
                const groupData = groupSnap.data();
                const positions = groupData.onRepeatPositions || [];

                positions.forEach((position, index) => {
                    const positionText = document.createElement('li');
                    positionText.innerHTML = `<strong>Sang ${index + 1}</strong>: Posisjon ${position}`;
                    positionText.style.fontSize = '15px';
                    positionText.style.margin = '5px';
                    positionList.appendChild(positionText);
                });

                container.appendChild(positionField);
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }

        const addSongField = document.createElement('div');
        setupField(addSongField, 'var(--green)');
        addSongField.style.cursor = 'pointer';

        const img = document.createElement('img');
        img.id = 'addSongs';
        img.src = 'images/addSongs.svg';
        img.alt = 'logo';
        img.style.width = '80%';
        img.style.height = 'auto';
        addSongField.appendChild(img);

        addSongField.addEventListener('click', () => {
            redirectToAuthCodeFlow(clientId);
            console.log('addSongField clicked');
        });

        container.appendChild(addSongField);
    }
}

async function onRepeatInfoReload(container, isHost, groupId) {
    onRepeatInfo(container, isHost, groupId, true);
    const addSongField = document.createElement('div');
        setupField(addSongField, 'var(--green)');
        addSongField.style.cursor = 'pointer';

        const img = document.createElement('img');
        img.id = 'addSongs';
        img.src = 'images/addSongs.svg';
        img.alt = 'logo';
        img.style.width = '80%';
        img.style.height = 'auto';
        addSongField.appendChild(img);

        addSongField.addEventListener('click', () => {
            window.location.href = 'success';
            console.log('addSongField clicked');
        });
        container.appendChild(addSongField);



}

function setupField(field, color) {
    field.style.display = 'flex';
    field.style.flexDirection = 'column';
    field.style.justifyContent = 'center';
    field.style.width = '60%';
    field.style.backgroundColor = color;
    field.style.padding = '10px';
    field.style.margin = '10px';
    field.style.borderRadius = '5px';
}


const clientId = 'e766892102b04c559335509e3fa258ef'; // Replace with your actual Spotify client ID

async function redirectToAuthCodeFlow(clientId, groupId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    // Store the code verifier, current URL, and groupId in localStorage to use it later when fetching the access token
    localStorage.setItem("verifier", verifier);
    localStorage.setItem("original_url", window.location.href);
    localStorage.setItem("pendingGroupId", groupId);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://127.0.0.1:5002/callback"); 
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


async function createSpotifyPlaylist(groupId) {
    const accessToken = localStorage.getItem('spotifyAccessToken');
    console.log('Creating playlist for groupId:', groupId); // Debugging log
    if (!accessToken) {
        redirectToAuthCodeFlow(clientId, groupId);
        console.error('No access token found');
        return;
    }
    try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: `På Repeat gruppe: ${groupId}`,
                description: 'Spilleliste for På Repeat-leken <3',
                public: false
            })
        });

        if (response.ok) {
            const data = await response.json();
            const playlistId = data.id;
            localStorage.setItem('playlistId', playlistId);
            const groupRef = doc(db, 'vorsGrupper', groupId);
            try {
                await updateDoc(groupRef, {
                    playlistId: playlistId
                });
                console.log('Playlist created:', data);
                console.log('Playlist ID saved to Firestore.');
                alert('Spilleliste er laget og linket til gruppen din!');
                singlePageApplication('var(--rosa)', 'repeatInfoReload');
                } catch (error) {
                    console.error('Error updating Firestore with playlistId:', error);
                }
        } else {
            console.error('Error creating playlist:', response.statusText);
            alert('Det skjedde en feil under oppretting av spillelisten.');
        }
    } catch (error) {
        console.error('Error creating Spotify playlist:', error);
        alert('Det skjedde en feil under oppretting av spillelisten.');
    }
}

async function getOnRepeatPlaylistTracks() {
    const accessToken = localStorage.getItem('spotifyAccessToken');
    if (!accessToken) {
        console.error('Access token missing. Cannot fetch playlists.');
        return;
    }

    // "On Repeat" playlist ID (this is consistent for all users)
    const onRepeatPlaylistId = '37i9dQZF1EppDS2s8FzxMK'; 

    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${onRepeatPlaylistId}/tracks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.items;  // Return an array of tracks
        } else {
            console.error('Error fetching On Repeat playlist tracks:', response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error fetching On Repeat playlist tracks:', error);
        return [];
    }
}

async function displayOnRepeatPlaylist() {
    const tracks = await getOnRepeatPlaylistTracks();
    if (tracks.length === 0) {
        alert('No songs found in your "On Repeat" playlist.');
        return;
    }

    const trackList = document.createElement('ul');
    tracks.forEach(trackItem => {
        const track = trackItem.track; // Access the track object
        const trackListItem = document.createElement('li');
        trackListItem.innerText = `${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;
        trackListItem.style.cursor = 'pointer';

        // When a user clicks on the track, add it to the shared playlist
        trackListItem.addEventListener('click', () => {
            const trackUri = track.uri;  // Get the track URI
            addSongToPlaylist(playlistId, trackUri);  // Add to the shared playlist
        });

        trackList.appendChild(trackListItem);
    });

    // Display the track list in the UI (replace this with your actual UI logic)
    const container = document.getElementById('track-container');  // Assuming you have a container to display tracks
    container.innerHTML = '';  // Clear previous results
    container.appendChild(trackList);  // Add the track list
}



window.onload = async function() {
    console.log('Page loaded');
    const accessToken = localStorage.getItem('spotifyAccessToken');
    const groupId = localStorage.getItem('pendingGroupId'); 
    const positions = JSON.parse(localStorage.getItem('positions'));

    console.log('Access Token:', accessToken);
    console.log('Group ID:', groupId);

    // if (accessToken && groupId) {
    //     const groupRef = doc(db, 'vorsGrupper', groupId);
    //     const groupDoc = await getDoc(groupRef);
    //         if (groupDoc.exists() && !groupDoc.data().playlistId) {
    //             console.log('Playlist already exists for this group.');
    //             await createSpotifyPlaylist(groupId);
    //         } else {
    //             console.log('Access token found, creating Spotify playlist...');
    //             await createSpotifyPlaylist(groupId); 
    //         }
    // } else if (!accessToken && groupId) {
    //     console.log('Access token not found, redirecting to Spotify authorization...');
    // } else {
    //     console.error('Missing groupId or accessToken. Unable to create playlist.');
    // }
    if (accessToken && groupId && positions) {
        console.log('Resuming playlist creation after redirect...');

        const groupRef = doc(db, 'vorsGrupper', groupId);
        const groupDoc = await getDoc(groupRef);

        // Ensure playlist hasn't already been created
        if (groupDoc.exists() && !groupDoc.data().playlistId) {
            await createSpotifyPlaylist(groupId); 
            localStorage.removeItem('positions');
            //localStorage.removeItem('pendingGroupId');
            singlePageApplication('var(--rosa)', 'repeatInfoReload',);
        }
    } else {
        console.error('Missing accessToken or groupId. Unable to create playlist.');
    }
};
function removePendingGroupId() {
    localStorage.removeItem("pendingGroupId");
    console.log("Pending Group ID removed.");
}
