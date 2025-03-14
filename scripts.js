// Function to handle image upload and save to localStorage
function uploadImage(event, folder) {
  const file = event.target.files[0];
  const description = prompt('Enter a description for the photo:');
  
  if (file && description) {
    const reader = new FileReader();
    reader.onload = function(e) {
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

      // Save the photo to localStorage
      const albumName = folder.querySelector('h3').textContent;
      let album = JSON.parse(localStorage.getItem(albumName)) || [];
      album.push({ src: e.target.result, description });
      localStorage.setItem(albumName, JSON.stringify(album));
    };
    reader.readAsDataURL(file);
  } else {
    alert('Please provide a valid image and description.');
  }
}

// Function to create a new folder (album)
function createFolder() {
  const folderName = prompt('Enter the name of the new album:');
  if (folderName) {
    const folderContainer = document.createElement('div');
    folderContainer.classList.add('folder');
    folderContainer.innerHTML = `
      <h3>${folderName}</h3>
      <input type="file" accept="image/*" onchange="uploadImage(event, this.parentElement)">
      <div class="album"></div>
    `;
    document.getElementById('album-container').appendChild(folderContainer);

    // Load previously saved photos for this album from localStorage
    const savedPhotos = JSON.parse(localStorage.getItem(folderName)) || [];
    const albumDiv = folderContainer.querySelector('.album');
    savedPhotos.forEach(photo => {
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
  } else {
    alert('Please enter a valid album name.');
  }
}

// Function to add events to the timeline
function addEvent() {
  const timeline = document.getElementById('timeline');
  const eventDate = prompt('Enter the date of the event (e.g., 27th Feb 2025):');
  const eventDescription = prompt('Enter a short description of the event:');

  if (eventDate && eventDescription) {
    const newEvent = document.createElement('li');
    newEvent.innerHTML = `<strong>${eventDate}</strong>: ${eventDescription}`;
    timeline.appendChild(newEvent);

    // Save the event to localStorage
    let events = JSON.parse(localStorage.getItem('timelineEvents')) || [];
    events.push({ date: eventDate, description: eventDescription });
    localStorage.setItem('timelineEvents', JSON.stringify(events));
  } else {
    alert('Please fill in both fields.');
  }
}

// Load timeline events from localStorage when the page is loaded
window.onload = function() {
  const events = JSON.parse(localStorage.getItem('timelineEvents')) || [];
  const timeline = document.getElementById('timeline');
  events.forEach(event => {
    const newEvent = document.createElement('li');
    newEvent.innerHTML = `<strong>${event.date}</strong>: ${event.description}`;
    timeline.appendChild(newEvent);
  });
};
