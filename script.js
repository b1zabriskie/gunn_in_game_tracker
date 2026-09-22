const pitch = document.getElementById("pitch");
const marker = document.getElementById("marker");
const coordinates = document.getElementById("coordinates");
const clearButton = document.getElementById("clear-button");


/*
    When the user touches or clicks
    the pitch...
*/

pitch.addEventListener("pointerdown", function(event) {

    /*
        Get the size and position of
        the SVG on the screen.
    */

    const rectangle = pitch.getBoundingClientRect();


    /*
        Convert the screen position
        into our pitch coordinate system.

        The pitch is:

        120 yards long
        68 yards wide
    */

    const x =
        ((event.clientX - rectangle.left)
        / rectangle.width) * 120;

    const y =
        ((event.clientY - rectangle.top)
        / rectangle.height) * 68;


    /*
        Move the red marker to the
        location that was tapped.
    */

    marker.setAttribute("cx", x);
    marker.setAttribute("cy", y);

    marker.style.visibility = "visible";


    /*
        Show the coordinates.
    */

    coordinates.textContent =
        `Pitch location: X = ${x.toFixed(1)}, Y = ${y.toFixed(1)}`;

});


/*
    Clear the selected location.
*/

clearButton.addEventListener("click", function() {

    marker.style.visibility = "hidden";

    coordinates.textContent =
        "No location selected";

});