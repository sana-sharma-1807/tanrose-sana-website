// Access Firebase from the global window object
const { db, collection, addDoc, getDocs } = window.firebase;

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
        const albumRef = collection(db, 'albums'); // albums collection in Firestore
        await addDoc(albumRef, {
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
    try {
      const albumRef = collection(db, 'albums');
      const querySnapshot = await getDocs(albumRef);
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
    } catch (e) {
      console.error('Error loading photos: ', e);
    }
  } else {
    alert('Please enter a valid album name.');
  }
}

// Function to add events to the timeline
async function addEvent() {
  const eventDate = prompt('Enter the date of the event (e.g., 27th Feb 2025):');
  const eventDescription = prompt('Enter a short description of the event:');

  if (eventDate && eventDescription) {
    try {
      const eventsRef = collection(db, 'events');
      await addDoc(eventsRef, {
        date: eventDate,
        description: eventDescription,
        timestamp: new Date()
      });
      console.log('Event added to Firestore');

      // Add the event to the timeline dynamically
      const timeline = document.getElementById('timeline');
      const newEvent = document.createElement('li');
      newEvent.innerHTML = `<strong>${eventDate}</strong>: ${eventDescription}`;
      timeline.appendChild(newEvent);
    } catch (e) {
      console.error('Error adding event: ', e);
    }
  } else {
    alert('Please fill in both fields.');
  }
}

// Load timeline events from Firestore when the page is loaded
async function loadTimelineEvents() {
  const timeline = document.getElementById('timeline');
  try {
    const eventsRef = collection(db, 'events');
    const querySnapshot = await getDocs(eventsRef);
    querySnapshot.forEach((doc) => {
      const eventData = doc.data();
      const newEvent = document.createElement('li');
      newEvent.innerHTML = `<strong>${eventData.date}</strong>: ${eventData.description}`;
      timeline.appendChild(newEvent);
    });
  } catch (e) {
    console.error('Error loading timeline events: ', e);
  }
}

// Load photo albums from Firestore when the page is loaded
async function loadPhotoAlbums() {
  const albumContainer = document.getElementById('album-container');
  try {
    const albumRef = collection(db, 'albums');
    const querySnapshot = await getDocs(albumRef);
    const albums = {};

    // Group photos by album name
    querySnapshot.forEach((doc) => {
      const albumData = doc.data();
      if (!albums[albumData.albumName]) {
        albums[albumData.albumName] = [];
      }
      albums[albumData.albumName].push(albumData);
    });

    // Create folders and populate them with photos
    for (const albumName in albums) {
      const folderContainer = document.createElement('div');
      folderContainer.classList.add('folder');
      folderContainer.innerHTML = 
        `<h3>${albumName}</h3>
        <input type="file" accept="image/*" onchange="uploadImage(event, this.parentElement)">
        <div class="album"></div>`;
      albumContainer.appendChild(folderContainer);

      const albumDiv = folderContainer.querySelector('.album');
      albums[albumName].forEach((photo) => {
        const photoContainer = document.createElement('div');
        photoContainer.classList.add('photo');
        
        const img = document.createElement('img');
        img.src = photo.src;
        photoContainer.appendChild(img);
        
        const imgDescription = document.createElement('div');
        imgDescription.classList.add('album-description');
        imgDescription.textContent = photo.description;
        photoContainer.appendChild(imgDescription);
        
        albumDiv.appendChild(photoContainer);
      });
    }
  } catch (e) {
    console.error('Error loading photo albums: ', e);
  }
}

// Load all data when the page is loaded
window.onload = async function() {
  await loadTimelineEvents();
  await loadPhotoAlbums();
};

// Attach event listeners to buttons after the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const addEventButton = document.getElementById('add-event-btn');
  addEventButton.addEventListener('click', addEvent);

  const createAlbumButton = document.getElementById('create-album-btn');
  createAlbumButton.addEventListener('click', createFolder);
});