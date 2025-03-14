// Initialize Firebase (ensure you have Firebase correctly set up)
const firebaseConfig = {
  apiKey: "AIzaSyAUhwQmx-MojiORgvXquSz5W-Kvv0exipc",
  authDomain: "tanrose-aac1f.firebaseapp.com",
  projectId: "tanrose-aac1f",
  storageBucket: "tanrose-aac1f.appspot.com",
  messagingSenderId: "426233210838",
  appId: "1:426233210838:web:e90a6cd06000a991f7a677",
  measurementId: "G-BJNXJ3JM4W"
};

// Initialize Firebase and Firestore
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to handle image upload and save to Firestore
async function uploadImage(event, folder) {
  const file = event.target.files[0];
  const description = prompt('Enter a description for the photo:');
  
  if (file && description) {
    const reader = new FileReader();
    reader.onload = async function(e) {
      const photoContainer = document.createElement('div');
      photoContainer.classList.add('photo');
      
      const img = document.createElement('img');
      img.src = e.target.result;
      photoContainer.appendChild(img);
      
      const imgDescription = document.createElement('div');
      imgDescription.classList.add('album-description');
      imgDescription.textContent = description;
      photoContainer.appendChild(imgDescription);
      
      folder.appendChild(photoContainer);

      // Save the photo to Firestore
      const albumName = folder.querySelector('h3').textContent;
      try {
        const albumRef = db.collection('albums'); // albums collection in Firestore
        await albumRef.add({
          albumName: albumName,
          src: e.target.result,
          description: description,
          timestamp: new Date()
        });
        console.log('Photo added to Firestore');
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    };
    reader.readAsDataURL(file);
  } else {
    alert('Please provide a valid image and description.');
  }
}

// Function to create a new folder (album)
async function createFolder() {
  const folderName = prompt('Enter the name of the new album:');
  if (folderName) {
    const folderContainer = document.createElement('div');
    folderContainer.classList.add('folder');
    folderContainer.innerHTML = 
      `<h3>${folderName}</h3>
      <input type="file" accept="image/*" onchange="uploadImage(event, this.parentElement)">
      <div class="album"></div>`;
    document.getElementById('album-container').appendChild(folderContainer);

    // Load previously saved photos for this album from Firestore
    const albumRef = db.collection('albums');
    const querySnapshot = await albumRef.get();
    querySnapshot.forEach((doc) => {
      const albumData = doc.data();
      if (albumData.albumName === folderName) {
        const photoContainer = document.createElement('div');
        photoContainer.classList.add('photo');
        
        const img = document.createElement('img');
        img.src = albumData.src;
        photoContainer.appendChild(img);
        
        const imgDescription = document.createElement('div');
        imgDescription.classList.add('album-description');
        imgDescription.textContent = albumData.description;
        photoContainer.appendChild(imgDescription);
        
        folderContainer.querySelector('.album').appendChild(photoContainer);
      }
    });
  } else {
    alert('Please enter a valid album name.');
  }
}

// Function to add events to the timeline
async function addEvent() {
  const timeline = document.getElementById('timeline');
  const eventDate = prompt('Enter the date of the event (e.g., 27th Feb 2025):');
  const eventDescription = prompt('Enter a short description of the event:');

  if (eventDate && eventDescription) {
    const newEvent = document.createElement('li');
    newEvent.innerHTML = `<strong>${eventDate}</strong>: ${eventDescription}`;
    timeline.appendChild(newEvent);

    // Save the event to Firestore
    try {
      const eventsRef = db.collection('events');
      await eventsRef.add({
        date: eventDate,
        description: eventDescription,
        timestamp: new Date()
      });
      console.log('Event added to Firestore');
    } catch (e) {
      console.error('Error adding event: ', e);
    }
  } else {
    alert('Please fill in both fields.');
  }
}

// Load timeline events from Firestore when the page is loaded
window.onload = async function() {
  const timeline = document.getElementById('timeline');
  const eventsRef = db.collection('events');
  const querySnapshot = await eventsRef.get();
  querySnapshot.forEach((doc) => {
    const eventData = doc.data();
    const newEvent = document.createElement('li');
    newEvent.innerHTML = `<strong>${eventData.date}</strong>: ${eventData.description}`;
    timeline.appendChild(newEvent);
  });
};

// Attach event listeners to buttons after the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const addEventButton = document.getElementById('add-event-btn');
  addEventButton.addEventListener('click', addEvent);

  const createAlbumButton = document.getElementById('create-album-btn');
  createAlbumButton.addEventListener('click', createFolder);
});