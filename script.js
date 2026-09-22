const pitch = document.getElementById("pitch");

const marker = document.getElementById("marker");

const coordinates = document.getElementById("coordinates");

const clearButton = document.getElementById("clear-button");

const actionSection = document.getElementById("action-section");

const actionButtons = document.querySelectorAll(".action-button");

const selectedAction = document.getElementById("selected-action");


// ==========================================
// STORE THE CURRENT ACTION
// ==========================================

let currentAction = null;


// ==========================================
// PITCH TAP
// ==========================================

pitch.addEventListener("pointerdown", function(event) {

    /*
        Get the position and size of
        the pitch on the screen.
    */

    const rectangle = pitch.getBoundingClientRect();


    /*
        Convert the screen coordinates
        into our 120 x 68 pitch coordinates.
    */

    const x =
        ((event.clientX - rectangle.left)
        / rectangle.width) * 120;

    const y =
        ((event.clientY - rectangle.top)
        / rectangle.height) * 68;


    /*
        Move the red marker.
    */

    marker.setAttribute("cx", x);

    marker.setAttribute("cy", y);

    marker.style.visibility = "visible";


    /*
        Display the coordinates.
    */

    coordinates.textContent =
        `Pitch location: X = ${x.toFixed(1)}, Y = ${y.toFixed(1)}`;


    /*
        Show the Primary Action
        section.
    */

    actionSection.classList.remove("hidden");


    /*
        Because the user selected a
        new location, reset the action.
    */

    currentAction = null;

    selectedAction.textContent =
        "No action selected";


    /*
        Remove the selected appearance
        from all action buttons.
    */

    actionButtons.forEach(function(button) {

        button.classList.remove("selected");

    });

});


// ==========================================
// PRIMARY ACTION BUTTONS
// ==========================================

actionButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        /*
            Get the action stored in
            the button's data-action attribute.
        */

        currentAction =
            button.dataset.action;


        /*
            Remove the selected state
            from all buttons.
        */

        actionButtons.forEach(function(otherButton) {

            otherButton.classList.remove("selected");

        });


        /*
            Highlight the button
            that was selected.
        */

        button.classList.add("selected");


        /*
            Display the selection.
        */

        selectedAction.textContent =
            `Selected: ${currentAction}`;

    });

});


// ==========================================
// CLEAR EVERYTHING
// ==========================================

clearButton.addEventListener("click", function() {

    /*
        Hide marker.
    */

    marker.style.visibility = "hidden";


    /*
        Reset location information.
    */

    coordinates.textContent =
        "No location selected";


    /*
        Hide Primary Action section.
    */

    actionSection.classList.add("hidden");


    /*
        Reset selected action.
    */

    currentAction = null;

    selectedAction.textContent =
        "No action selected";


    /*
        Remove selected appearance
        from all buttons.
    */

    actionButtons.forEach(function(button) {

        button.classList.remove("selected");

    });

});