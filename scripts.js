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

// Attach event listeners
document.addEventListener('DOMContentLoaded', function() {
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

  // Load files when the page is loaded
  loadFiles();
});