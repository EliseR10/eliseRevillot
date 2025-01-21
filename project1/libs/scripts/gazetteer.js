/*MAP*/
//Initialize the map and set its view to show the entire world
const map = L.map('map').setView([0, 0], 2);

//Add tiles layer (shows the map in itself)
const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


/*LOADING SPINNER*/
function showSpinner() {
    document.getElementById('spinner-border').style.display = 'flex';
}

function hideSpinner() {
    document.getElementById('spinner-border').style.display = 'none';
}

map.on('loading', function() {
    showSpinner();
});

map.on('load', function() {
    hideSpinner();
});

//Get country name from JSON file and display it in my options
fetch('http://127.0.0.1:5500/project1/libs/scripts/countries.json')
    .then(response => response.json())
    .then(countries => {
        const selectElement = document.getElementById('country');

        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = country.name;
            selectElement.appendChild(option);
        });
    })
    .catch(error => console.error('Error loading countries: ', error));

/*EASY BUTTON MAP*/
L.easyButton({
    id: "mapBtn",
    position: "bottomleft",
    states: [{
        icon: 'fas fa-circle-info',
        title: 'Country Information',
        onClick: function() {
            alert("This button will show information about a country.");
        }
    }]
}).addTo(map);

L.easyButton({
    id: "mapBtn",
    position: "bottomleft",
    states: [{
        icon: 'fas fa-temperature-low',
        title: 'Weather Information',
        onClick: function() {
            alert("This button will show information about a the weather in the chosen country.");
        }
    }]
}).addTo(map);

L.easyButton({
    id: "mapBtn",
    position: "bottomleft",
    states: [{
        icon: 'fas fa-link',
        title: 'Wiki Links',
        onClick: function() {
            alert("This button will show information about links regarding the country.");
        }
    }]
}).addTo(map);

L.easyButton({
    id: "mapBtn",
    position: "bottomleft",
    states: [{
        icon: 'fas fa-money-bill-1',
        title: 'Currency',
        onClick: function() {
            alert("This button will show information about currency and exchange in the chosen country.");
        }
    }]
}).addTo(map);

L.easyButton({
    id: "mapBtn",
    position: "bottomleft",
    states: [{
        icon: 'fas fa-flag',
        title: 'Flag',
        onClick: function() {
            alert("This button will show the country flag.");
        }
    }]
}).addTo(map);