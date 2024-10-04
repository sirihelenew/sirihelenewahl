import { doc, getDoc, updateDoc, arrayUnion, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { db } from './firebaseConfig.js';

// export async function displayOnRepeatPositions(container, groupId) {
//     const positionList = document.getElementById('selectedSongs');
//     setupField(positionField, 'var(--lilla)');
//     positionField.style.color = 'var(--white)';

//     const positionHeader = document.createElement('h3');
//     positionHeader.innerText = 'Disse sangene skal legges til:';
//     positionHeader.style.margin = '0';
//     positionField.appendChild(positionHeader);

//     const positionList = document.createElement('p');
//     positionList.id = 'selectedSongs';
//     positionList.style.padding = '5px';
//     positionList.style.margin = '0';
//     positionField.appendChild(positionList);

//     container.appendChild(positionField);

//     const groupRef = doc(db, 'vorsGrupper', groupId);
//     try {
//         const groupSnap = await getDoc(groupRef);
//         if (groupSnap.exists()) {
//             const groupData = groupSnap.data();
//             const positions = groupData.onRepeatPositions || [];
//             updateSelectedSongs(positionList, positions);
//         } else {
//             console.log('No such document!');
//         }
//     } catch (error) {
//         console.error('Error fetching document:', error);
//     }
// }

// function updateSelectedSongs(element, positions) {
//     if (positions.length === 0) {
//         element.textContent = 'Hosten har ikke valgt noen sanger';
//     } else if (positions.length === 1) {
//         element.textContent = `Hosten har valgt sang nummer ${positions[0]}`;
//     } else {
//         const lastPosition = positions.pop();
//         element.textContent = `Hosten har valgt sanger nummer ${positions.join(', ')} og ${lastPosition}`;
//     }
// }
export async function displayOnRepeatPositions(container, groupId) {
    const positionList = document.getElementById('selectedSongs');

    const groupRef = doc(db, 'vorsGrupper', groupId);
    try {
        const groupSnap = await getDoc(groupRef);
        if (groupSnap.exists()) {
            const groupData = groupSnap.data();
            const positions = groupData.onRepeatPositions || [];
            const playlistId = groupData.playlistId;
            localStorage.setItem('playlistId', playlistId);
            updateSelectedSongs(positionList, positions);
        } else {
            console.log('No such document!');
        }
    } catch (error) {
        console.error('Error fetching document:', error);
    }
}

function updateSelectedSongs(element, positions) {
    if (positions.length === 0) {
        element.innerHTML = 'Hosten har ikke valgt noen sanger';
    } else if (positions.length === 1) {
        element.innerHTML = `Hosten har valgt sang nummer <b>${positions[0]}</b>.`;
    } else {
        const lastPosition = positions.pop();
        element.innerHTML = `Hosten har valgt sang nummer <b>${positions.join(', ')}</b> og <b>${lastPosition}</b>.`;
    }
}
function setupField(field, color) {
        field.style.display = 'flex';
        field.style.flexDirection = 'column';
        field.style.justifyContent = 'center';
        field.style.width = '60%';
        field.style.padding = '10px';
        field.style.margin = '10px';
        field.style.borderRadius = '5px';
        field.style.backgroundColor = color;
    }