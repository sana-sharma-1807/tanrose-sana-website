// Access Firebase from the global window object
const { db, collection, addDoc, getDocs } = window.firebase;

// Secret code to access the photos
const SECRET_CODE = "TanroseSana123"; // Change this to your desired secret code

// Function to handle file upload
async function uploadFile(file) {
  const description = prompt('Enter a description for the file:');
  if (file && description) {
    const reader = new FileReader();
    reader.onload = async function (e) {
      // Save the file to Firestore
      try {
        const filesRef = collection(db, 'files');
        await addDoc(filesRef, {
          description: description,
          type: file.type,
          src: e.target.result,
          timestamp: new Date(),
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

// Function to extract the first frame of a video
function extractFirstFrame(videoSrc, callback) {
  const video = document.createElement('video');
  video.src = videoSrc;
  video.crossOrigin = 'anonymous'; // Handle cross-origin issues if any
  video.muted = true; // Mute the video to avoid autoplay restrictions
  video.preload = 'metadata'; // Preload metadata to get the first frame

  video.addEventListener('loadedmetadata', () => {
    video.currentTime = 0.1; // Seek to a small time to capture the first frame
  });

  video.addEventListener('seeked', () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const thumbnail = canvas.toDataURL('image/jpeg'); // Convert canvas to image URL
    callback(thumbnail);
  });

  video.load();
}

// Function to display files in the gallery
function displayFile(fileData) {
  const galleryContainer = document.getElementById('album-container');
  const fileItem = document.createElement('div');
  fileItem.classList.add('file-item');

  if (fileData.type.startsWith('image')) {
    // Display images immediately
    fileItem.innerHTML = `
      <img src="${fileData.src}" alt="${fileData.description}" class="file-icon">
      <div class="file-name">${fileData.description}</div>
    `;
    galleryContainer.appendChild(fileItem);

    // Add click event to open image in full screen
    const imageElement = fileItem.querySelector('.file-icon');
    imageElement.addEventListener('click', () => openFullscreen(fileData));
  } else if (fileData.type.startsWith('video')) {
    // Display a loading placeholder for videos
    fileItem.innerHTML = `
      <div class="video-container">
        <div class="loading-placeholder">Loading video thumbnail...</div>
        <video class="file-icon" controls style="display: none;">
          <source src="${fileData.src}" type="${fileData.type}">
          Your browser does not support the video tag.
        </video>
      </div>
      <div class="file-name">${fileData.description}</div>
    `;

    // Extract the first frame of the video and use it as the icon
    extractFirstFrame(fileData.src, (thumbnail) => {
      const videoContainer = fileItem.querySelector('.video-container');
      videoContainer.innerHTML = `
        <img src="${thumbnail}" alt="Video Thumbnail" class="video-thumbnail">
        <video class="file-icon" controls style="display: none;">
          <source src="${fileData.src}" type="${fileData.type}">
          Your browser does not support the video tag.
        </video>
      `;

      // Add click event to play the video when the thumbnail is clicked
      const videoThumbnail = videoContainer.querySelector('.video-thumbnail');
      const videoElement = videoContainer.querySelector('video');
      videoThumbnail.addEventListener('click', () => {
        videoThumbnail.style.display = 'none'; // Hide the thumbnail
        videoElement.style.display = 'block'; // Show the video
        videoElement.play(); // Play the video
      });

      // Add click event to open video in full screen
      videoThumbnail.addEventListener('click', () => openFullscreen(fileData));
    });

    galleryContainer.appendChild(fileItem);
  }
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

  // Prompt for secret code
  const userCode = prompt('Enter the secret code to view the photos:');
  if (userCode !== SECRET_CODE) {
    alert('Incorrect code. Access denied.');
    return;
  }

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
        timestamp: new Date(),
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

    // Convert querySnapshot to an array of events
    const events = [];
    querySnapshot.forEach((doc) => {
      const eventData = doc.data();
      events.push({ ...eventData, id: doc.id }); // Include the document ID for sorting
    });

    // Sort events by timestamp (oldest first)
    events.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());

    // Display sorted events
    events.forEach((eventData) => {
      const newEvent = document.createElement('li');
      newEvent.innerHTML = `<strong>${eventData.date}</strong>: ${eventData.description}`;
      timeline.appendChild(newEvent);
    });
  } catch (e) {
    console.error('Error loading timeline events: ', e);
  }
}

// Load all data when the page is loaded
window.onload = async function () {
  await loadTimelineEvents(); // Load timeline events
  await loadFiles(); // Load files
};

// Attach event listeners to buttons after the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
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