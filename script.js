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

function initMap() {

    document.getElementById("question").innerHTML =
        "Double click where " +
        locations[currentLocation].name +
        " is";

    const csun = {
        lat: 34.2394,
        lng: -118.5287
    };

    const map = new google.maps.Map(
        document.getElementById("map"),
        {
            center: csun,
            zoom: 16.3,

            disableDefaultUI: true,
            draggable: false,
            scrollwheel: false,
            disableDoubleClickZoom: true
        }
    );

    map.addListener("dblclick", function(event) {

        if (currentLocation >= locations.length) {
            return;
        }

        const clickedLat = event.latLng.lat();
        const clickedLng = event.latLng.lng();
    
        const target = locations[currentLocation];

        const distance =
            Math.abs(clickedLat - target.lat) +
            Math.abs(clickedLng - target.lng);

        if (distance < 0.003) {

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

            document.getElementById("result").innerHTML = "Correct!";
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
            
            document.getElementById("result").innerHTML = "Wrong!";
        }

        currentLocation++;

        if (currentLocation < locations.length) {
            document.getElementById("question").innerHTML =
                "Double click where " +
                locations[currentLocation].name +
                " is";
        }
        else {
            document.getElementById("question").innerHTML =
            "Quiz Finished! Score: " +
                score +
                " / " +
                locations.length;
        }
    });
}