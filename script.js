// Timeline Functions
function addEvent() {
    const date = prompt("Enter the event date (e.g., 2025-02-27):");
    const description = prompt("Enter the event description:");
    if (date && description) {
      const ul = document.getElementById("timeline-events");
      const li = document.createElement("li");
      li.innerHTML = `<span class="date">${date}:</span> ${description} <button onclick="removeEvent(this)">Remove</button>`;
      ul.appendChild(li);
    }
  }
  
  function removeEvent(button) {
    const li = button.parentNode;
    li.parentNode.removeChild(li);
  }
  
  // Photo Album Functions
  function addPhoto(albumId) {
    const photoUrl = prompt("Enter the photo URL:");
    if (photoUrl) {
      const album = document.getElementById(albumId);
      const photoDiv = album.querySelector(".photos");
      const newPhoto = document.createElement("img");
      newPhoto.src = photoUrl;
      newPhoto.alt = "New Photo";
      newPhoto.classList.add("photo");
      photoDiv.appendChild(newPhoto);
    }
  }
  
  function removePhoto(photoElement) {
    photoElement.parentNode.removeChild(photoElement);
  }
  