// ==================== GAME STATE ====================
let gameStarted = false;

const locations = [
    {
        name: "Cypress Hall",
        lat: 34.23664894748542,
        lng: -118.52974866439058
    },
    {
        name: "Bayramian Hall",
        lat: 34.24039000943884,
        lng: -118.5313452520829
    },
    {
        name: "Laurel Hall",
        lat: 34.24246984829599,
        lng: -118.52902097286845
    },
    {
        name: "University Student Union",
        lat: 34.240234795535265,
        lng: -118.52708978255896
    },
    {
        name: "Live Oak Hall",
        lat: 34.23856843922073,
        lng: -118.52821207299945
    }
];

let currentLocation = 0;
let score = 0;

// ==================== EXTRA FEATURE: TIMER ====================
let secondsElapsed = 0;
let timerInterval;

// ==================== EXTRA FEATURE: BEST SCORE & TIME ====================
let bestScore = localStorage.getItem("bestScore") || 0;
let bestTime = localStorage.getItem("bestTime") || null;

// ==================== MAIN FUNCTION ====================
// Initializes the Google Map and sidebar question list
function initMap() {

    // Display saved best score and best time from previous sessions
    document.getElementById("stats").innerHTML =
        "Best Score: " + bestScore +
        "<br>Best Time: " +
        (bestTime ? bestTime + " seconds" : "None");

    // Build the question list dynamically in the sidebar
    const questionList =
        document.getElementById("question-list");

    for (let i = 0; i < locations.length; i++) {

        questionList.innerHTML += `

            <li id="q${i}" hidden>

                Where is ${locations[i].name}?

            </li>

            <p id="r${i}"></p>
        `;
    }

    // CSUN campus center coordinates
    const csun = {
        lat: 34.2394,
        lng: -118.5287
    };

    const map = new google.maps.Map(
        document.getElementById("map"),
        {
            center: csun,
            zoom: 16.3,

            clickableIcons: false,
            
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels.icon",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "transit",
                    elementType: "labels.icon",
                    stylers: [{ visibility: "off" }]
                }
            ],

            disableDefaultUI: true,
            draggable: false,
            scrollwheel: false,
            disableDoubleClickZoom: true
        }
    );

    // Start button click handler
    document
        .getElementById("start-button")
        .addEventListener("click", function() {

            gameStarted = true;

            document.getElementById("q0").hidden = false;

            document.getElementById("start-button")
                .style.display = "none";

            document.getElementById("restart-button")
                .style.display = "block";

            // Start the timer when the quiz begins
            timerInterval =
                setInterval(updateTimer, 1000);
    });

    // Handle user guesses via double-click on the map
    map.addListener("dblclick", function(event) {

        if (!gameStarted) {
            return;
        }

        if (currentLocation >= locations.length) {
            return;
        }

        const clickedLat = event.latLng.lat();
        const clickedLng = event.latLng.lng();

        const target = locations[currentLocation];

        const distance =
            Math.abs(clickedLat - target.lat) +
            Math.abs(clickedLng - target.lng);

        // Correct guess when the click is close enough to the target
        if (distance < 0.001) {

            score++;

            new google.maps.Rectangle({

                strokeColor: "#00FF00",
                strokeOpacity: 0.8,
                strokeWeight: 2,

                fillColor: "#00FF00",
                fillOpacity: 0.35,

                map: map,

                bounds: {
                    north: target.lat + 0.00045,
                    south: target.lat - 0.00045,
                    east: target.lng + 0.00045,
                    west: target.lng - 0.00045
                }
            });

            document.getElementById(
                `r${currentLocation}`
            ).innerHTML =
                '<span class="correct">Correct</span>';
        }
        else {

            new google.maps.Rectangle({

                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,

                fillColor: "#FF0000",
                fillOpacity: 0.35,

                map: map,

                bounds: {
                    north: target.lat + 0.00045,
                    south: target.lat - 0.00045,
                    east: target.lng + 0.00045,
                    west: target.lng - 0.00045
                }
            });

            document.getElementById(
                `r${currentLocation}`
            ).innerHTML =
                '<span class="wrong">Wrong</span>';
        }

        currentLocation++;

        document.getElementById("current-score").innerHTML =
            "Score: " +
            score +
            " / " +
            locations.length;

        if (currentLocation < locations.length) {

            document.getElementById(
                `q${currentLocation}`
            ).hidden = false;
        }
        else {

            clearInterval(timerInterval);

            if (score > bestScore) {

                bestScore = score;

                localStorage.setItem(
                    "bestScore",
                    bestScore
                );
            }

            if (
                score === locations.length &&
                (!bestTime || secondsElapsed < bestTime)
            ) {

                bestTime = secondsElapsed;

                localStorage.setItem(
                    "bestTime",
                    bestTime
                );
            }

            document.getElementById("stats").innerHTML =
                "Best Score: " + bestScore +
                "<br>Best Time: " +
                (bestTime ? bestTime + " seconds" : "None");
        }
    });
}

// ==================== EXTRA FEATURE: TIMER ====================
// Updates the display timer every second during the quiz
function updateTimer() {

    secondsElapsed++;

    document.getElementById("timer").innerHTML =
        "Time: " +
        secondsElapsed +
        "s";
}