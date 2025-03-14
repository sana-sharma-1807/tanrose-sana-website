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
      photoContainer.classList.add('photo-icon');
      
      const img = document.createElement('img');
      img.src = e.target.result;
      img.classList.add('thumbnail');
      photoContainer.appendChild(img);
      
      const imgDescription = document.createElement('div');
      imgDescription.classList.add('album-description');
      imgDescription.textContent = description;
      photoContainer.appendChild(imgDescription);
      
      folder.querySelector('.album').appendChild(photoContainer);

      // Save the photo to Firestore
      const albumName = folder.querySelector('h3').textContent;
      try {
        const albumRef = collection(db, 'albums');
        await addDoc(albumRef, {
          albumName: albumName,
          src: e.target.result,
          description: description,
          timestamp: new Date()
        });
        console.log('Photo added to Firestore:', { albumName, src: e.target.result, description }); // Log added photo
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
      <div class="album"></div>
      <button class="done-btn">Done</button>`;
    document.getElementById('album-container').appendChild(folderContainer);

    // Load previously saved photos for this album from Firestore
    try {
      const albumRef = collection(db, 'albums');
      const querySnapshot = await getDocs(albumRef);
      console.log('Loading photos from Firestore for album:', folderName); // Log album name
      querySnapshot.forEach((doc) => {
        const albumData = doc.data();
        console.log('Loaded photo:', albumData); // Log loaded photo
        if (albumData.albumName === folderName) {
          const photoContainer = document.createElement('div');
          photoContainer.classList.add('photo-icon');
          
          const img = document.createElement('img');
          img.src = albumData.src;
          img.classList.add('thumbnail');
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

    // Add event listener to the "Done" button
    folderContainer.querySelector('.done-btn').addEventListener('click', () => {
      alert('Album saved!'); // Optional: Notify the user
    });
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
      console.log('Event added to Firestore:', { date: eventDate, description: eventDescription }); // Log added event
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

// Load all data when the page is loaded
window.onload = async function() {
  await loadTimelineEvents();
};

// Attach event listeners to buttons after the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const addEventButton = document.getElementById('add-event-btn');
  addEventButton.addEventListener('click', addEvent);

  const createAlbumButton = document.getElementById('create-album-btn');
  createAlbumButton.addEventListener('click', createFolder);
});