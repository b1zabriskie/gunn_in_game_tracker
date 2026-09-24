const pitch = document.getElementById("pitch");

const marker = document.getElementById("marker");

const coordinates = document.getElementById("coordinates");

const clearButton = document.getElementById("clear-button");

const clearGameButton =
    document.getElementById("clear-game-button");

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

const completeEventButton =
    document.getElementById("complete-event-button");

const completeUnsuccessfulSection =
    document.getElementById("complete-unsuccessful-section");

const completeUnsuccessfulButton =
    document.getElementById("complete-unsuccessful-button");

const eventStatus =
    document.getElementById("event-status");

const viewEventsButton =
    document.getElementById("view-events-button");

const eventsList =
    document.getElementById("events-list");

const eventsContainer =
    document.getElementById("events-container");


// ==========================================
// LOCAL STORAGE
// ==========================================

const STORAGE_KEY = "soccerDataCollectionEvents";


// ==========================================
// CURRENT EVENT DATA
// ==========================================

let currentX = null;

let currentY = null;

let currentAction = null;

let currentOutcome = null;

let currentResults = [];


// ==========================================
// LOAD SAVED EVENTS
// ==========================================

let events = loadEvents();


// ==========================================
// LOAD EVENTS FROM LOCAL STORAGE
// ==========================================

function loadEvents() {

    const savedEvents =
        localStorage.getItem(STORAGE_KEY);


    if (!savedEvents) {

        return [];

    }


    try {

        return JSON.parse(savedEvents);

    } catch (error) {

        console.error(
            "Could not load saved events:",
            error
        );

        return [];

    }

}


// ==========================================
// SAVE EVENTS TO LOCAL STORAGE
// ==========================================

function saveEvents() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(events)
    );

}


// ==========================================
// UPDATE EVENT COUNTER
// ==========================================

function updateEventCounter() {

    if (events.length === 1) {

        eventStatus.textContent =
            "1 event recorded";

    } else {

        eventStatus.textContent =
            `${events.length} events recorded`;

    }

}


// ==========================================
// PITCH TAP
// ==========================================

pitch.addEventListener("pointerdown", function(event) {

    const rectangle =
        pitch.getBoundingClientRect();


    /*
        Convert screen coordinates
        into our 120 x 68 pitch.
    */

    const x =
        ((event.clientX - rectangle.left)
        / rectangle.width) * 120;

    const y =
        ((event.clientY - rectangle.top)
        / rectangle.height) * 68;


    /*
        Store location.
    */

    currentX = Number(x.toFixed(2));

    currentY = Number(y.toFixed(2));


    /*
        Move location marker.
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

    resultButtons.forEach(function(resultButton) {

        resultButton.classList.remove("selected");

    });


    /*
        Reset unsuccessful
        completion section.
    */

    completeUnsuccessfulSection.classList.add("hidden");

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
            Hide Result Tags.
        */

        resultSection.classList.add("hidden");

        completeUnsuccessfulSection.classList.add("hidden");

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


    /*
        Hide unsuccessful completion.
    */

    completeUnsuccessfulSection.classList.add("hidden");

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


    /*
        Show completion button.
    */

    completeUnsuccessfulSection.classList.remove("hidden");

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
            Update text underneath
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
// COMPLETE SUCCESSFUL EVENT
// ==========================================

completeEventButton.addEventListener(
    "click",
    function() {

        recordEvent();

    }
);


// ==========================================
// COMPLETE UNSUCCESSFUL EVENT
// ==========================================

completeUnsuccessfulButton.addEventListener(
    "click",
    function() {

        recordEvent();

    }
);


// ==========================================
// RECORD EVENT
// ==========================================

function recordEvent() {

    /*
        Make sure the required information
        exists before saving.
    */

    if (
        currentX === null ||
        currentY === null ||
        currentAction === null ||
        currentOutcome === null
    ) {

        alert(
            "Please select a location, action, and outcome before completing the event."
        );

        return;

    }


    /*
        Create the event object.
    */

    const newEvent = {

        id: Date.now(),

        timestamp:
            new Date().toISOString(),

        x: currentX,

        y: currentY,

        action: currentAction,

        outcome: currentOutcome,

        results: [...currentResults]

    };


    /*
        Add event to our events array.
    */

    events.push(newEvent);


    /*
        Save the updated array
        to localStorage.
    */

    saveEvents();


    /*
        Update counter.
    */

    updateEventCounter();


    /*
        Show confirmation.
    */

    eventStatus.textContent =
        `Event recorded! ${events.length} total events`;


    /*
        Reset the current event
        so the next action can be entered.
    */

    resetCurrentEvent();


    /*
        After a short delay, restore
        the normal event counter.
    */

    setTimeout(function() {

        updateEventCounter();

    }, 1500);

}


// ==========================================
// RESET CURRENT EVENT
// ==========================================

function resetCurrentEvent() {

    /*
        Hide marker.
    */

    marker.style.visibility = "hidden";


    /*
        Reset location.
    */

    currentX = null;

    currentY = null;

    coordinates.textContent =
        "No location selected";


    /*
        Hide workflow sections.
    */

    actionSection.classList.add("hidden");

    outcomeSection.classList.add("hidden");

    resultSection.classList.add("hidden");

    completeUnsuccessfulSection.classList.add("hidden");


    /*
        Reset stored selections.
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

}


// ==========================================
// CLEAR CURRENT EVENT
// ==========================================

clearButton.addEventListener(
    "click",
    function() {

        resetCurrentEvent();

    }
);


// ==========================================
// VIEW EVENTS
// ==========================================

viewEventsButton.addEventListener(
    "click",
    function() {

        /*
            Toggle visibility.
        */

        eventsList.classList.toggle("hidden");


        /*
            Change button text.
        */

        if (eventsList.classList.contains("hidden")) {

            viewEventsButton.textContent =
                "View Events";

        } else {

            viewEventsButton.textContent =
                "Hide Events";

            displayEvents();

        }

    }
);


// ==========================================
// DISPLAY EVENTS
// ==========================================

function displayEvents() {

    /*
        No events.
    */

    if (events.length === 0) {

        eventsContainer.innerHTML =
            "<p>No events recorded.</p>";

        return;

    }


    /*
        Create HTML for each event.
    */

    eventsContainer.innerHTML =
        events.map(function(event, index) {

            const resultsText =
                event.results.length > 0
                    ? event.results.join(", ")
                    : "None";


            return `
                <div class="event-card">

                    <p>
                        <strong>Event ${index + 1}</strong>
                    </p>

                    <p>
                        <strong>Location:</strong>
                        X = ${event.x},
                        Y = ${event.y}
                    </p>

                    <p>
                        <strong>Action:</strong>
                        ${event.action}
                    </p>

                    <p>
                        <strong>Outcome:</strong>
                        ${event.outcome}
                    </p>

                    <p>
                        <strong>Results:</strong>
                        ${resultsText}
                    </p>

                </div>
            `;

        }).join("");

}


// ==========================================
// CLEAR ALL GAME DATA
// ==========================================

clearGameButton.addEventListener(
    "click",
    function() {

        /*
            Ask for confirmation before
            deleting all saved events.
        */

        const confirmed =
            confirm(
                "Are you sure you want to delete all recorded events?"
            );


        if (!confirmed) {

            return;

        }


        /*
            Empty events array.
        */

        events = [];


        /*
            Remove stored data.
        */

        localStorage.removeItem(STORAGE_KEY);


        /*
            Update counter.
        */

        updateEventCounter();


        /*
            Refresh event list.
        */

        displayEvents();

    }
);


// ==========================================
// INITIAL PAGE SETUP
// ==========================================

updateEventCounter();