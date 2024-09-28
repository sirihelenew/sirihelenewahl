import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { db } from './firebaseConfig.js';
    
    
    export async function createGroup(groupId) {
        const groupRef = doc(collection(db, 'vorsGrupper'), groupId);

        const existingGroupRef = await getDoc(groupRef);
        if (existingGroupRef.exists()) {
            alert('Denne ID-en er allerede i bruk. Velg en annen.');
            return;
        }

        await setDoc(groupRef, {
            groupID: groupId,
            playlistId: null,
            createdAt: new Date(),
            songs: [],
            members: []
        });
        console.log(`Gruppen '${groupId}' er opprettet i Firestore.`);

        localStorage.setItem('currentGroupId', groupId);
        localStorage.setItem('currentUserName', 'Host');
    }

    export async function joinGroup(groupId, userName) {
        // Sjekk om gruppen finnes i Firestore
        const groupRef = doc(collection(db, 'vorsGrupper'), groupId);
        const existingGroupRef = await getDoc(groupRef);
    
        if (!existingGroupRef.exists()) {
            alert('Denne vorsgruppen finnes ikke. Sjekk at du har skrevet riktig ID.');
            return;
        }
    
        // Legg til brukeren som medlem av vorsgruppen
        const memberData = {
            id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Genererer en unik ID for brukeren
            name: userName // Forutsatt at brukeren skriver inn navnet sitt
        };
    
        // Oppdater gruppen i Firestore med det nye medlemmet
        await updateDoc(groupRef, {
            members: arrayUnion(memberData)
        });
    
        console.log(`Bruker '${userName}' ble lagt til vorsgruppen med ID: ${groupId}`);
        // window.location.href = 'vorside.html';

        localStorage.setItem('currentGroupId', groupId);
        localStorage.setItem('currentUserName', userName);
    }
    
