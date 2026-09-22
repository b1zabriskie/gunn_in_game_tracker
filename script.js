const pitch = document.getElementById("pitch");
const marker = document.getElementById("marker");
const coordinates = document.getElementById("coordinates");
const clearButton = document.getElementById("clear-button");


/*
    When the user touches or clicks the pitch,
    determine where they touched it.
*/

pitch.addEventListener("pointerdown", function(event) {

    // Get the pitch's position and size
    const pitchRectangle = pitch.getBoundingClientRect();

    // Find the touch/click position
    // relative to the pitch
    const x = event.clientX - pitchRectangle.left;
    const y = event.clientY - pitchRectangle.top;

    // Convert the position into percentages
    const xPercent =
        (x / pitchRectangle.width) * 100;

    const yPercent =
        (y / pitchRectangle.height) * 100;


    /*
        Move the red marker
    */

    marker.style.left = xPercent + "%";
    marker.style.top = yPercent + "%";

    marker.style.display = "block";


    /*
        Display the coordinates
    */

    coordinates.textContent =
        `Location: X = ${xPercent.toFixed(1)}%, Y = ${yPercent.toFixed(1)}%`;

});


/*
    Clear the selected location
*/

clearButton.addEventListener("click", function() {

    marker.style.display = "none";

    coordinates.textContent =
        "No location selected";

});