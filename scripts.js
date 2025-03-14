// Function to handle image upload
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
    } else {
      alert('Please fill in both fields.');
    }
  }
  