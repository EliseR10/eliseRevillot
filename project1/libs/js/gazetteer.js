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

/*COUNTRY SELECTION*/
$('#country').click(function() {  
    const selectedCountry = $('#country').val();

    if (selectedCountry) {
    $.ajax({
        url: "http://127.0.0.1:5500/project1/libs/json/countryBorders.geo.json",
        type: 'GET',
        dataType: 'json',
        data: { 
            country: selectedCountry
        },
        success: function(result) {
            console.log(JSON.stringify(result));

            const countryOptions = [];

            result.features.forEach(function(country) {
                countryOptions.push({
                    name: country.properties.name,
                    iso2: country.properties.iso_a2
                });
            });

            countryOptions.sort(function(a, b) {
                const nameA = a.name.toUpperCase(); // Convert to uppercase for case-insensitive sorting
                const nameB = b.name.toUpperCase();
                
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                    return 0;
            });

            console.log(countryOptions);

            const countryDropdown = $('#country');
            
            countryOptions.forEach(function(option) {
                const newOption = $('<option></option>')
                    .val(option.iso2)
                    .text(option.name);
                    countryDropdown.append(newOption);
            });
        },
        
        error: function(xhr, status, error) {
            console.error("Error loading country data:", error);
                alert("Error loading country data.");
        }
    });
}
});

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