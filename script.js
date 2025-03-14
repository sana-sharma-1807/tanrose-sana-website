// Timeline Events
const timelineEvents = [
    { date: "2023-01-01", event: "We met for the first time" },
    { date: "2023-06-15", event: "Our first date" },
    { date: "2023-12-25", event: "Our first Christmas together" },
];

// Dynamically add timeline events
const timelineList = document.getElementById("timeline-events");
timelineEvents.forEach(event => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${event.date}</strong>: ${event.event}`;
    timelineList.appendChild(li);
});

// Create photo albums dynamically
const albumsContainer = document.getElementById("albums-container");
const albums = ["Vacation", "Anniversary", "Family"];

albums.forEach(album => {
    const div = document.createElement("div");
    div.classList.add("album");
    div.innerText = album;
    albumsContainer.appendChild(div);
});

// Button functionality
const button = document.getElementById("btn");
button.addEventListener("click", () => {
    alert("Thank you for visiting our love story!");
});
