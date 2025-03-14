// Access Firebase from the global window object
const { db, collection, addDoc, getDocs } = window.firebase;

// Function to handle file upload
async function uploadFile(file) {
  const description = prompt('Enter a description for the file:');
  if (file && description) {
    const reader = new FileReader();
    reader.onload = async function(e) {
      // Save the file to Firestore
      try {
        const filesRef = collection(db, 'files');
        await addDoc(filesRef, {
          description: description,
          type: file.type,
          src: e.target.result,
          timestamp: new Date()
        });
        console.log('File added to Firestore:', { description, type: file.type }); // Log added file
        loadFiles(); // Reload files after upload
      } catch (e) {
        console.error('Error adding file: ', e);
      }
    };
    reader.readAsDataURL(file);
  } else {
    alert('Please provide a valid file and description.');
  }
}

// Function to display files in the gallery
function displayFile(fileData) {
  const galleryContainer = document.getElementById('album-container');
  const fileItem = document.createElement('div');
  fileItem.classList.add('file-item');

  if (fileData.type.startsWith('image')) {
    fileItem.innerHTML = `
      <img src="${fileData.src}" alt="${fileData.description}" class="file-icon">
      <div class="file-name">${fileData.description}</div>
    `;
  } else if (fileData.type.startsWith('video')) {
    fileItem.innerHTML = `
      <video class="file-icon">
        <source src="${fileData.src}" type="${fileData.type}">
        Your browser does not support the video tag.
      </video>
      <div class="file-name">${fileData.description}</div>
    `;
  }

  // Add click event to open file in full screen
  const fileIcon = fileItem.querySelector('.file-icon');
  fileIcon.addEventListener('click', () => openFullscreen(fileData));

  galleryContainer.appendChild(fileItem);
}

// Function to open file in full screen
function openFullscreen(fileData) {
  const overlay = document.createElement('div');
  overlay.classList.add('fullscreen-overlay');

  const content = document.createElement('div');
  content.classList.add('fullscreen-content');

  if (fileData.type.startsWith('image')) {
    const img = document.createElement('img');
    img.src = fileData.src;
    content.appendChild(img);
  } else if (fileData.type.startsWith('video')) {
    const video = document.createElement('video');
    video.src = fileData.src;
    video.controls = true;
    video.autoplay = true;
    content.appendChild(video);
  }

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('close-btn');
  closeBtn.textContent = 'Close';
  closeBtn.addEventListener('click', () => document.body.removeChild(overlay));

  overlay.appendChild(content);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);
}

// Function to load files from Firestore
async function loadFiles() {
  const galleryContainer = document.getElementById('album-container');
  galleryContainer.innerHTML = ''; // Clear the gallery before loading

  try {
    const filesRef = collection(db, 'files');
    const querySnapshot = await getDocs(filesRef);
    querySnapshot.forEach((doc) => {
      const fileData = doc.data();
      displayFile(fileData); // Display each file
    });
  } catch (e) {
    console.error('Error loading files: ', e);
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
      loadTimelineEvents(); // Reload timeline after adding event
    } catch (e) {
      console.error('Error adding event: ', e);
    }
  } else {
    alert('Please fill in both fields.');
  }
}

// Function to load timeline events from Firestore
async function loadTimelineEvents() {
  const timeline = document.getElementById('timeline');
  timeline.innerHTML = ''; // Clear the timeline before loading

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
  await loadTimelineEvents(); // Load timeline events
  await loadFiles(); // Load files
};

// Attach event listeners to buttons after the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const addEventButton = document.getElementById('add-event-btn');
  addEventButton.addEventListener('click', addEvent);

  const uploadBtn = document.getElementById('upload-btn');
  const fileInput = document.getElementById('file-input');

  // Trigger file input when upload button is clicked
  uploadBtn.addEventListener('click', () => fileInput.click());

  // Handle file upload
  fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    for (const file of files) {
      uploadFile(file);
    }
  });
});