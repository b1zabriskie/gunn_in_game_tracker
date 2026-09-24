/* ========================= */
/* STORAGE */
/* ========================= */

const STORAGE_KEY =
    "soccerDataCollectionEvents";


let events =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];


/* ========================= */
/* CURRENT EVENT STATE */
/* ========================= */

let currentX = null;
let currentY = null;

let currentHalf = 1;
let currentGameTime = null;

let currentAction = null;
let currentOutcome = null;

let currentResults = [];


/* ========================= */
/* CLOCK STATE */
/* ========================= */

let clockRunning = false;

let clockElapsedMilliseconds = 0;

let clockStartedAt = null;

let clockAnimationFrame = null;


/* ========================= */
/* DOM ELEMENTS */
/* ========================= */

/* Data collection */

const soccerPitch =
    document.getElementById(
        "soccer-pitch"
    );

const locationMarker =
    document.getElementById(
        "location-marker"
    );

const locationDisplay =
    document.getElementById(
        "location-display"
    );


/* Clock */

const gameClock =
    document.getElementById(
        "game-clock"
    );

const halfIndicator =
    document.getElementById(
        "half-indicator"
    );

const startClockButton =
    document.getElementById(
        "start-clock-button"
    );

const pauseClockButton =
    document.getElementById(
        "pause-clock-button"
    );

const startSecondHalfButton =
    document.getElementById(
        "start-second-half-button"
    );

const clockStatus =
    document.getElementById(
        "clock-status"
    );


/* Sections */

const actionSection =
    document.getElementById(
        "action-section"
    );

const outcomeSection =
    document.getElementById(
        "outcome-section"
    );

const resultSection =
    document.getElementById(
        "result-section"
    );

const completeEventSection =
    document.getElementById(
        "complete-event-section"
    );

const completeUnsuccessfulSection =
    document.getElementById(
        "complete-unsuccessful-section"
    );


/* Buttons */

const primaryActionButtons =
    document.querySelectorAll(
        ".primary-action"
    );

const outcomeButtons =
    document.querySelectorAll(
        ".outcome-button"
    );

const resultButtons =
    document.querySelectorAll(
        ".result-button"
    );


/* Complete buttons */

const completeEventButton =
    document.getElementById(
        "complete-event-button"
    );

const completeUnsuccessfulButton =
    document.getElementById(
        "complete-unsuccessful-button"
    );


/* Status */

const eventStatus =
    document.getElementById(
        "event-status"
    );


/* Event controls */

const eventCounter =
    document.getElementById(
        "event-counter"
    );

const clearCurrentEventButton =
    document.getElementById(
        "clear-current-event"
    );

const viewEventsButton =
    document.getElementById(
        "view-events-button"
    );

const viewHeatmapButton =
    document.getElementById(
        "view-heatmap-button"
    );

const clearAllDataButton =
    document.getElementById(
        "clear-all-data-button"
    );


/* Views */

const dataCollectionView =
    document.getElementById(
        "data-collection-view"
    );

const eventsView =
    document.getElementById(
        "events-view"
    );

const heatmapView =
    document.getElementById(
        "heatmap-view"
    );


/* Events */

const eventsList =
    document.getElementById(
        "events-list"
    );

const backToDataButton =
    document.getElementById(
        "back-to-data-button"
    );


/* Heatmap */

const backFromHeatmapButton =
    document.getElementById(
        "back-from-heatmap-button"
    );

const heatmapPoints =
    document.getElementById(
        "heatmap-points"
    );

const heatmapActionFilter =
    document.getElementById(
        "heatmap-action-filter"
    );

const heatmapEventCount =
    document.getElementById(
        "heatmap-event-count"
    );

const heatmapDescription =
    document.getElementById(
        "heatmap-description"
    );


/* ========================= */
/* STORAGE FUNCTIONS */
/* ========================= */

function saveEvents() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(events)
    );
}


function updateEventCounter() {

    eventCounter.textContent =
        events.length;
}


/* ========================= */
/* CLOCK FUNCTIONS */
/* ========================= */

function formatGameTime(milliseconds) {

    const totalSeconds =
        Math.floor(
            milliseconds / 1000
        );

    const minutes =
        Math.floor(
            totalSeconds / 60
        );

    const seconds =
        totalSeconds % 60;

    return (
        String(minutes).padStart(2, "0")
        +
        ":"
        +
        String(seconds).padStart(2, "0")
    );
}


function updateClockDisplay() {

    let elapsed =
        clockElapsedMilliseconds;

    if (
        clockRunning &&
        clockStartedAt !== null
    ) {
        elapsed +=
            Date.now() -
            clockStartedAt;
    }

    gameClock.textContent =
        formatGameTime(elapsed);
}


function runClock() {

    updateClockDisplay();

    if (clockRunning) {

        clockAnimationFrame =
            requestAnimationFrame(
                runClock
            );
    }
}


function startClock() {

    if (clockRunning) {
        return;
    }

    clockRunning = true;

    clockStartedAt =
        Date.now();

    startClockButton.disabled =
        true;

    pauseClockButton.disabled =
        false;

    startSecondHalfButton.disabled =
        true;

    clockStatus.textContent =
        "Clock running";

    runClock();
}


function pauseClock() {

    if (!clockRunning) {
        return;
    }

    clockElapsedMilliseconds +=
        Date.now() -
        clockStartedAt;

    clockStartedAt = null;

    clockRunning = false;

    if (
        clockAnimationFrame !== null
    ) {
        cancelAnimationFrame(
            clockAnimationFrame
        );

        clockAnimationFrame = null;
    }

    updateClockDisplay();

    startClockButton.disabled =
        false;

    pauseClockButton.disabled =
        true;

    startSecondHalfButton.disabled =
        false;

    clockStatus.textContent =
        "Clock stopped";
}


function startSecondHalf() {

    /*
     * Stop the current clock first.
     */

    if (clockRunning) {
        pauseClock();
    }

    /*
     * Reset the clock.
     */

    clockElapsedMilliseconds =
        0;

    clockStartedAt = null;

    /*
     * Change half.
     */

    currentHalf = 2;

    halfIndicator.textContent =
        "2nd Half";

    /*
     * Update display before starting.
     */

    updateClockDisplay();

    /*
     * Start second half.
     */

    startSecondHalfButton.disabled =
        true;

    startClock();
}


startClockButton.addEventListener(
    "click",
    startClock
);


pauseClockButton.addEventListener(
    "click",
    pauseClock
);


startSecondHalfButton.addEventListener(
    "click",
    startSecondHalf
);


/* ========================= */
/* PITCH LOCATION */
/* ========================= */

soccerPitch.addEventListener(
    "pointerdown",
    function(event) {

        /*
         * Convert the browser pointer
         * coordinates into SVG coordinates.
         */

        const svgPoint =
            soccerPitch.createSVGPoint();

        svgPoint.x =
            event.clientX;

        svgPoint.y =
            event.clientY;

        const svgCoordinates =
            svgPoint.matrixTransform(
                soccerPitch
                    .getScreenCTM()
                    .inverse()
            );

        /*
         * Keep the location inside
         * the pitch boundaries.
         */

        currentX =
            Math.max(
                0,
                Math.min(
                    120,
                    svgCoordinates.x
                )
            );

        currentY =
            Math.max(
                0,
                Math.min(
                    68,
                    svgCoordinates.y
                )
            );


        /*
         * IMPORTANT:
         *
         * Capture the game time immediately
         * when the location is tapped.
         *
         * This means the event time represents
         * the moment the action happened rather
         * than the moment the user finishes
         * entering the event.
         */

        let elapsed =
            clockElapsedMilliseconds;

        if (
            clockRunning &&
            clockStartedAt !== null
        ) {
            elapsed +=
                Date.now() -
                clockStartedAt;
        }

        currentGameTime =
            formatGameTime(elapsed);


        /*
         * Move marker.
         */

        locationMarker.setAttribute(
            "cx",
            currentX
        );

        locationMarker.setAttribute(
            "cy",
            currentY
        );

        locationMarker.setAttribute(
            "visibility",
            "visible"
        );


        /*
         * Display location and time.
         */

        locationDisplay.textContent =
            `Pitch location: X = ${currentX.toFixed(1)}, Y = ${currentY.toFixed(1)} | ` +
            `${currentHalf === 1 ? "1st" : "2nd"} Half ${currentGameTime}`;


        /*
         * Show primary action section.
         */

        actionSection.classList.remove(
            "hidden"
        );


        /*
         * Clear any previous selections
         * because this is a new event.
         */

        currentAction = null;
        currentOutcome = null;
        currentResults = [];

        clearButtonSelections();

        outcomeSection.classList.add(
            "hidden"
        );

        resultSection.classList.add(
            "hidden"
        );

        completeEventSection.classList.add(
            "hidden"
        );

        completeUnsuccessfulSection.classList.add(
            "hidden"
        );

        eventStatus.textContent = "";
    }
);


/* ========================= */
/* PRIMARY ACTION */
/* ========================= */

primaryActionButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                primaryActionButtons
                    .forEach(
                        function(otherButton) {

                            otherButton.classList
                                .remove(
                                    "selected"
                                );
                        }
                    );

                button.classList.add(
                    "selected"
                );

                currentAction =
                    button.dataset.action;

                currentOutcome = null;

                currentResults = [];

                outcomeButtons.forEach(
                    function(
                        outcomeButton
                    ) {

                        outcomeButton.classList
                            .remove(
                                "selected"
                            );
                    }
                );

                resultButtons.forEach(
                    function(
                        resultButton
                    ) {

                        resultButton.classList
                            .remove(
                                "selected"
                            );
                    }
                );

                outcomeSection.classList
                    .remove(
                        "hidden"
                    );

                resultSection.classList.add(
                    "hidden"
                );

                completeEventSection.classList
                    .add(
                        "hidden"
                    );

                completeUnsuccessfulSection.classList
                    .add(
                        "hidden"
                    );

                eventStatus.textContent = "";
            }
        );
    }
);


/* ========================= */
/* OUTCOME */
/* ========================= */

outcomeButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                outcomeButtons.forEach(
                    function(otherButton) {

                        otherButton.classList
                            .remove(
                                "selected"
                            );
                    }
                );

                button.classList.add(
                    "selected"
                );

                currentOutcome =
                    button.dataset.outcome;

                currentResults = [];

                resultButtons.forEach(
                    function(resultButton) {

                        resultButton.classList
                            .remove(
                                "selected"
                            );
                    }
                );


                if (
                    currentOutcome ===
                    "Successful"
                ) {

                    resultSection.classList
                        .remove(
                            "hidden"
                        );

                    completeEventSection.classList
                        .remove(
                            "hidden"
                        );

                    completeUnsuccessfulSection.classList
                        .add(
                            "hidden"
                        );

                } else {

                    resultSection.classList
                        .add(
                            "hidden"
                        );

                    completeEventSection.classList
                        .add(
                            "hidden"
                        );

                    completeUnsuccessfulSection.classList
                        .remove(
                            "hidden"
                        );
                }

                eventStatus.textContent = "";
            }
        );
    }
);


/* ========================= */
/* RESULTS */
/* ========================= */

resultButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const result =
                    button.dataset.result;

                /*
                 * Results are multi-select.
                 */

                if (
                    currentResults.includes(
                        result
                    )
                ) {

                    currentResults =
                        currentResults.filter(
                            function(item) {

                                return (
                                    item !==
                                    result
                                );
                            }
                        );

                    button.classList.remove(
                        "selected"
                    );

                } else {

                    currentResults.push(
                        result
                    );

                    button.classList.add(
                        "selected"
                    );
                }
            }
        );
    }
);


/* ========================= */
/* RECORD EVENT */
/* ========================= */

function recordEvent() {

    /*
     * Basic validation.
     */

    if (
        currentX === null ||
        currentY === null
    ) {

        eventStatus.textContent =
            "Please select a location on the pitch.";

        return;
    }

    if (!currentAction) {

        eventStatus.textContent =
            "Please select a primary action.";

        return;
    }

    if (!currentOutcome) {

        eventStatus.textContent =
            "Please select an outcome.";

        return;
    }

    if (
        currentOutcome ===
        "Successful" &&
        currentResults.length === 0
    ) {

        eventStatus.textContent =
            "Please select at least one result.";

        return;
    }


    /*
     * Create event object.
     */

    const newEvent = {

        id:
            Date.now(),

        timestamp:
            new Date().toISOString(),

        /*
         * Match information
         */

        half:
            currentHalf,

        gameTime:
            currentGameTime,

        /*
         * Location
         */

        x:
            currentX,

        y:
            currentY,

        /*
         * Event information
         */

        action:
            currentAction,

        outcome:
            currentOutcome,

        results:
            [...currentResults]
    };


    /*
     * Add to event list.
     */

    events.push(
        newEvent
    );


    /*
     * Save to localStorage.
     */

    saveEvents();


    /*
     * Update counter.
     */

    updateEventCounter();


    /*
     * Display confirmation.
     */

    eventStatus.textContent =
        `Event recorded at ` +
        `${currentHalf === 1 ? "1st" : "2nd"} Half ` +
        `${currentGameTime}.`;


    /*
     * Reset current event.
     */

    resetCurrentEvent();
}


/* ========================= */
/* COMPLETE BUTTONS */
/* ========================= */

completeEventButton.addEventListener(
    "click",
    recordEvent
);


completeUnsuccessfulButton.addEventListener(
    "click",
    recordEvent
);


/* ========================= */
/* RESET CURRENT EVENT */
/* ========================= */

function resetCurrentEvent() {

    currentX = null;
    currentY = null;

    currentGameTime = null;

    currentAction = null;
    currentOutcome = null;

    currentResults = [];


    /*
     * Hide marker.
     */

    locationMarker.setAttribute(
        "visibility",
        "hidden"
    );


    /*
     * Reset location display.
     */

    locationDisplay.textContent =
        "Tap the pitch to select a location.";


    /*
     * Hide sections.
     */

    actionSection.classList.add(
        "hidden"
    );

    outcomeSection.classList.add(
        "hidden"
    );

    resultSection.classList.add(
        "hidden"
    );

    completeEventSection.classList.add(
        "hidden"
    );

    completeUnsuccessfulSection.classList.add(
        "hidden"
    );


    /*
     * Clear button selections.
     */

    clearButtonSelections();
}


function clearButtonSelections() {

    primaryActionButtons.forEach(
        function(button) {

            button.classList.remove(
                "selected"
            );
        }
    );

    outcomeButtons.forEach(
        function(button) {

            button.classList.remove(
                "selected"
            );
        }
    );

    resultButtons.forEach(
        function(button) {

            button.classList.remove(
                "selected"
            );
        }
    );
}


clearCurrentEventButton.addEventListener(
    "click",
    function() {

        resetCurrentEvent();

        eventStatus.textContent =
            "Current event cleared.";
    }
);


/* ========================= */
/* EVENTS VIEW */
/* ========================= */

viewEventsButton.addEventListener(
    "click",
    function() {

        dataCollectionView.classList
            .add("hidden");

        heatmapView.classList
            .add("hidden");

        eventsView.classList
            .remove("hidden");

        displayEvents();
    }
);


backToDataButton.addEventListener(
    "click",
    function() {

        eventsView.classList
            .add("hidden");

        heatmapView.classList
            .add("hidden");

        dataCollectionView.classList
            .remove("hidden");
    }
);


/* ========================= */
/* DISPLAY EVENTS */
/* ========================= */

function displayEvents() {

    eventsList.innerHTML = "";


    if (events.length === 0) {

        eventsList.innerHTML =
            "<p>No events recorded yet.</p>";

        return;
    }


    /*
     * Display newest events first.
     */

    const reversedEvents =
        [...events].reverse();


    reversedEvents.forEach(
        function(event) {

            const card =
                document.createElement(
                    "div"
                );

            card.classList.add(
                "event-card"
            );


            if (
                event.outcome ===
                "Successful"
            ) {

                card.classList.add(
                    "successful"
                );

            } else {

                card.classList.add(
                    "unsuccessful"
                );
            }


            /*
             * Handle old events that were
             * recorded before the clock existed.
             */

            let timeText =
                "Time not recorded";

            if (
                event.gameTime &&
                event.half
            ) {

                const halfText =
                    event.half === 1
                        ? "1st Half"
                        : "2nd Half";

                timeText =
                    `${halfText} — ${event.gameTime}`;
            }


            /*
             * Results.
             */

            let resultsHTML =
                "";

            if (
                event.results &&
                event.results.length > 0
            ) {

                resultsHTML =
                    event.results
                        .map(
                            function(result) {

                                return `
                                    <span class="result-tag">
                                        ${result}
                                    </span>
                                `;
                            }
                        )
                        .join("");
            } else {

                resultsHTML =
                    "None";
            }


            card.innerHTML = `

                <h3>
                    ${event.action}
                </h3>

                <p>
                    <strong>Time:</strong>
                    ${timeText}
                </p>

                <p>
                    <strong>Outcome:</strong>
                    ${event.outcome}
                </p>

                <p>
                    <strong>Location:</strong>
                    X = ${Number(event.x).toFixed(1)},
                    Y = ${Number(event.y).toFixed(1)}
                </p>

                <p>
                    <strong>Results:</strong>
                    ${resultsHTML}
                </p>

            `;


            eventsList.appendChild(
                card
            );
        }
    );
}


/* ========================= */
/* CLEAR ALL GAME DATA */
/* ========================= */

clearAllDataButton.addEventListener(
    "click",
    function() {

        const confirmed =
            confirm(
                "Are you sure you want to delete all recorded game data?"
            );

        if (!confirmed) {
            return;
        }


        events = [];

        saveEvents();

        updateEventCounter();

        resetCurrentEvent();

        eventStatus.textContent =
            "All game data has been cleared.";
    }
);


/* ========================= */
/* HEATMAP VIEW */
/* ========================= */

viewHeatmapButton.addEventListener(
    "click",
    function() {

        dataCollectionView.classList
            .add("hidden");

        eventsView.classList
            .add("hidden");

        heatmapView.classList
            .remove("hidden");

        drawHeatmap();
    }
);


backFromHeatmapButton.addEventListener(
    "click",
    function() {

        heatmapView.classList
            .add("hidden");

        eventsView.classList
            .add("hidden");

        dataCollectionView.classList
            .remove("hidden");
    }
);


/* ========================= */
/* HEATMAP FILTER */
/* ========================= */

heatmapActionFilter.addEventListener(
    "change",
    drawHeatmap
);


/* ========================= */
/* DRAW HEATMAP */
/* ========================= */

function drawHeatmap() {

    heatmapPoints.innerHTML = "";


    const selectedAction =
        heatmapActionFilter.value;


    let filteredEvents;


    if (
        selectedAction ===
        "All Events"
    ) {

        filteredEvents =
            events;

    } else {

        filteredEvents =
            events.filter(
                function(event) {

                    return (
                        event.action ===
                        selectedAction
                    );
                }
            );
    }


    /*
     * Event count.
     */

    if (
        filteredEvents.length === 1
    ) {

        heatmapEventCount.textContent =
            "1 event";

    } else {

        heatmapEventCount.textContent =
            `${filteredEvents.length} events`;
    }


    /*
     * Description.
     */

    if (
        selectedAction ===
        "All Events"
    ) {

        heatmapDescription.textContent =
            "Spatial distribution of all recorded events.";

    } else {

        heatmapDescription.textContent =
            `Spatial distribution of ${selectedAction} events.`;
    }


    /*
     * Nothing to draw.
     */

    if (
        filteredEvents.length === 0
    ) {

        return;
    }


    /*
     * Draw event circles.
     */

    filteredEvents.forEach(
        function(event) {

            const circle =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "circle"
                );


            circle.setAttribute(
                "cx",
                event.x
            );

            circle.setAttribute(
                "cy",
                event.y
            );

            circle.setAttribute(
                "r",
                "5"
            );


            circle.classList.add(
                "heatmap-point"
            );


            /*
             * Low opacity allows overlapping
             * points to become darker.
             */

            circle.style.opacity =
                "0.18";


            heatmapPoints.appendChild(
                circle
            );
        }
    );
}


/* ========================= */
/* INITIALIZATION */
/* ========================= */

updateEventCounter();

updateClockDisplay();

pauseClockButton.disabled =
    true;