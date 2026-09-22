const pitch = document.getElementById("pitch");
const marker = document.getElementById("marker");
const coordinates = document.getElementById("coordinates");
const clearButton = document.getElementById("clear-button");

pitch.addEventListener("click", function(event) {

    // Find where the pitch is on the screen
    const pitchRectangle = pitch.getBoundingClientRect();

    // Find where the user clicked relative to the pitch
    const x = event.clientX - pitchRectangle.left;
    const y = event.clientY - pitchRectangle.top;

    // Convert to percentages
    const xPercent = (x / pitchRectangle.width) * 100;
    const yPercent = (y / pitchRectangle.height) * 100;

    // Move the marker
    marker.style.left = xPercent + "%";
    marker.style.top = yPercent + "%";
    marker.style.display = "block";

    // Display the coordinates
    coordinates.textContent =
        `Location: X = ${xPercent.toFixed(1)}%, Y = ${yPercent.toFixed(1)}%`;
});


clearButton.addEventListener("click", function() {

    marker.style.display = "none";

    coordinates.textContent = "No location selected";

});