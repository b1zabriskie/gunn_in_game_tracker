const pitch = document.getElementById("pitch");

const marker = document.getElementById("marker");

const coordinates = document.getElementById("coordinates");

const clearButton = document.getElementById("clear-button");

const actionSection =
    document.getElementById("action-section");

const actionButtons =
    document.querySelectorAll(".action-button");

const selectedAction =
    document.getElementById("selected-action");

const outcomeSection =
    document.getElementById("outcome-section");

const successfulButton =
    document.getElementById("successful-button");

const unsuccessfulButton =
    document.getElementById("unsuccessful-button");

const selectedOutcome =
    document.getElementById("selected-outcome");

const resultSection =
    document.getElementById("result-section");

const resultButtons =
    document.querySelectorAll(".result-button");

const selectedResults =
    document.getElementById("selected-results");


// ==========================================
// STORE CURRENT SELECTIONS
// ==========================================

let currentAction = null;

let currentOutcome = null;

let currentResults = [];


// ==========================================
// PITCH TAP
// ==========================================

pitch.addEventListener("pointerdown", function(event) {

    const rectangle =
        pitch.getBoundingClientRect();


    /*
        Convert the screen coordinates
        into our 120 x 68 pitch.
    */

    const x =
        ((event.clientX - rectangle.left)
        / rectangle.width) * 120;

    const y =
        ((event.clientY - rectangle.top)
        / rectangle.height) * 68;


    /*
        Move the location marker.
    */

    marker.setAttribute("cx", x);

    marker.setAttribute("cy", y);

    marker.style.visibility = "visible";


    /*
        Display coordinates.
    */

    coordinates.textContent =
        `Pitch location: X = ${x.toFixed(1)}, Y = ${y.toFixed(1)}`;


    /*
        Show Primary Action.
    */

    actionSection.classList.remove("hidden");


    /*
        A new pitch location means
        we're starting a new event.
    */

    currentAction = null;

    selectedAction.textContent =
        "No action selected";


    actionButtons.forEach(function(button) {

        button.classList.remove("selected");

    });


    /*
        Reset Outcome.
    */

    outcomeSection.classList.add("hidden");

    currentOutcome = null;

    selectedOutcome.textContent =
        "No outcome selected";

    successfulButton.classList.remove("selected");

    unsuccessfulButton.classList.remove("selected");


    /*
        Reset Result Tags.
    */

    resultSection.classList.add("hidden");

    currentResults = [];

    selectedResults.textContent =
        "No results selected";

    resultButtons.forEach(function(button) {

        button.classList.remove("selected");

    });

});


// ==========================================
// PRIMARY ACTION SELECTION
// ==========================================

actionButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        /*
            Store selected action.
        */

        currentAction =
            button.dataset.action;


        /*
            Only one Primary Action
            can be selected.
        */

        actionButtons.forEach(function(otherButton) {

            otherButton.classList.remove("selected");

        });


        /*
            Highlight selected action.
        */

        button.classList.add("selected");


        /*
            Display selected action.
        */

        selectedAction.textContent =
            `Selected: ${currentAction}`;


        /*
            Show Outcome.
        */

        outcomeSection.classList.remove("hidden");


        /*
            Reset Outcome.
        */

        currentOutcome = null;

        selectedOutcome.textContent =
            "No outcome selected";

        successfulButton.classList.remove("selected");

        unsuccessfulButton.classList.remove("selected");


        /*
            Hide Result Tags until
            Successful is selected.
        */

        resultSection.classList.add("hidden");

        currentResults = [];

        selectedResults.textContent =
            "No results selected";

        resultButtons.forEach(function(resultButton) {

            resultButton.classList.remove("selected");

        });

    });

});


// ==========================================
// SUCCESSFUL
// ==========================================

successfulButton.addEventListener("click", function() {

    currentOutcome = "Successful";


    /*
        Highlight Successful.
    */

    successfulButton.classList.add("selected");

    unsuccessfulButton.classList.remove("selected");


    /*
        Display outcome.
    */

    selectedOutcome.textContent =
        "Selected: Successful";


    /*
        Show Result Tags.
    */

    resultSection.classList.remove("hidden");

});


// ==========================================
// UNSUCCESSFUL
// ==========================================

unsuccessfulButton.addEventListener("click", function() {

    currentOutcome = "Unsuccessful";


    /*
        Highlight Unsuccessful.
    */

    unsuccessfulButton.classList.add("selected");

    successfulButton.classList.remove("selected");


    /*
        Display outcome.
    */

    selectedOutcome.textContent =
        "Selected: Unsuccessful";


    /*
        Unsuccessful actions do not
        have Result Tags.

        Therefore hide them.
    */

    resultSection.classList.add("hidden");


    /*
        Clear any previous results.
    */

    currentResults = [];

    selectedResults.textContent =
        "No results selected";

    resultButtons.forEach(function(button) {

        button.classList.remove("selected");

    });

});


// ==========================================
// RESULT TAGS
// ==========================================

resultButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const result =
            button.dataset.result;


        /*
            Check whether this result
            is already selected.
        */

        const index =
            currentResults.indexOf(result);


        if (index === -1) {

            /*
                Result is NOT selected.

                Add it to the array.
            */

            currentResults.push(result);

            button.classList.add("selected");

        } else {

            /*
                Result IS already selected.

                Remove it from the array.
            */

            currentResults.splice(index, 1);

            button.classList.remove("selected");

        }


        /*
            Update the text underneath
            the buttons.
        */

        if (currentResults.length === 0) {

            selectedResults.textContent =
                "No results selected";

        } else {

            selectedResults.textContent =
                `Selected: ${currentResults.join(", ")}`;

        }

    });

});


// ==========================================
// CLEAR EVERYTHING
// ==========================================

clearButton.addEventListener("click", function() {

    /*
        Hide location marker.
    */

    marker.style.visibility = "hidden";


    /*
        Reset location.
    */

    coordinates.textContent =
        "No location selected";


    /*
        Hide all workflow sections.
    */

    actionSection.classList.add("hidden");

    outcomeSection.classList.add("hidden");

    resultSection.classList.add("hidden");


    /*
        Reset stored data.
    */

    currentAction = null;

    currentOutcome = null;

    currentResults = [];


    /*
        Reset Primary Action buttons.
    */

    actionButtons.forEach(function(button) {

        button.classList.remove("selected");

    });


    /*
        Reset Outcome buttons.
    */

    successfulButton.classList.remove("selected");

    unsuccessfulButton.classList.remove("selected");


    /*
        Reset Result buttons.
    */

    resultButtons.forEach(function(button) {

        button.classList.remove("selected");

    });


    /*
        Reset status text.
    */

    selectedAction.textContent =
        "No action selected";

    selectedOutcome.textContent =
        "No outcome selected";

    selectedResults.textContent =
        "No results selected";

});