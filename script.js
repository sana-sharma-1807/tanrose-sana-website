// Function to handle image upload
function uploadImage(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        document.getElementById('album').appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Function to add new event to the timeline
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
  