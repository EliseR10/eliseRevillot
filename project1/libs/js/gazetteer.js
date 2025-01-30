$(document).ready(function () {
    $('#preloader').show(); // Show preloader while loading

var map;

// tile layers
var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
  }
);

var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  }
);

var basemaps = {
  "Streets": streets,
  "Satellite": satellite
};

/*buttons
var infoBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
  $("#countryModal").modal("show");


});*/


map = L.map("map", {
    layers: [streets]
}).setView([54.5, -4], 6);
  
  // setView is not required in your application as you will be
  // deploying map.fitBounds() on the country border polygon

  layerControl = L.control.layers(basemaps).addTo(map);

  //infoBtn.addTo(map);

/*USER LOCATION*/
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true });
} else {
    console.error("Geolocation is not supported by this browser.");
}

function success(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    
    console.log(userLat, userLng);

    //Reverse geocode to get the user's country
    $.ajax({
        url: `./libs/json/countryBorders.geo.json`,
        type: 'GET',
        dataType: 'json',
        success: function (countries) {
            const userCountry = getUserCountry(userLat, userLng, countries); // ISO2 country code
            
            if (userCountry) {
                console.log('User Country Code:', userCountry);

                //Trigger the dropdown change to zoom to the user's country
                $('#countrySelect').val(userCountry).trigger('change');
                $('#preloader').hide();
                console.log('Preloader taken off');

            } else {
                console.error('Could not determine user country.');
                $('#preloader').hide();
            }
        },
        error: function (xhr, status, error) {
            console.error("Error reverse geocoding location:", error);
            $('#preloader').hide();
        }
    });
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    $('#preloader').hide();
}

/* Function to check if user is inside a country's polygon */
function getUserCountry(lat, lng, geoJsonData) {
    const userPoint = turf.point([lng, lat]); // Convert to GeoJSON point to work with turf

    for (const feature of geoJsonData.features) {
        const countryPolygon = feature.geometry;
        if (turf.booleanPointInPolygon(userPoint, countryPolygon)) { //return true if user inside the country
            return feature.properties.iso_a2; // Return ISO2 country code if above true
        }
    }
    return null; // No match found
}

/*COUNTRY SELECTION*/
//Populate the dropdown when the page loads
$.ajax({
    url: "http://localhost/itcareerswitch/project1/libs/php/countrySelection.php",
    type: 'GET',
    dataType: 'json',
    success: function (result) {
        const countryDropdown = $('#countrySelect'); //Dropdown element
        const countryOptions = [];

        //Get country names and ISO2 codes
        result.forEach(function (country) {
            countryOptions.push({
                name: country.name,
                iso2: country.iso2
            });
        });

        // Populate the dropdown
        countryOptions.forEach(function (option) {
            const newOption = $('<option></option>')
                .val(option.iso2)
                .text(option.name);
            countryDropdown.append(newOption);
        });
    },
    error: function (xhr, status, error) {
        console.error("Error loading country data:", error);
        console.log("Response:", xhr.responseText);
        alert("Error loading country data.");
    }
});

// Define marker LayerGroups
let citiesLayer = L.markerClusterGroup();
let airportsLayer = L.markerClusterGroup();
let countryBorderLayer = null;

//Handle dropdown change
$('#countrySelect').change(function () {
    const selectedCountry = $(this).val(); //Get selected ISO2 code

    if (selectedCountry) {
        // Fetch GeoJSON data again to find the selected country's geometry
        $.ajax({
            url: "http://localhost/itcareerswitch/project1/libs/php/getBorders.php",
            type: 'GET',
            dataType: 'json',
            data: {country: selectedCountry},
            success: function (result) {
                if (result.status.code === "ok") {
                    alert("Country not found.");
                    return;
                }

                const selectedFeature = result.feature;

                if (selectedFeature) {
                    if (countryBorderLayer) {
                        map.removeLayer(countryBorderLayer); // Remove previous border layer
                    }

                    // Add the selected country's borders to the map
                    countryBorderLayer = L.geoJSON(selectedFeature.geometry, {
                        style: {
                            color: "blue",    // Border color
                            weight: 2,       // Border thickness
                            fillColor: "lightblue", // Fill color
                            fillOpacity: 0.4 // Transparency of the fill
                        }
                    }).addTo(map);

                    /*ZOOM MAP*/
                    const borders = L.geoJSON(selectedFeature.geometry).getBounds(); //Get country's bounds
                    map.fitBounds(borders); //Zoom the map to the selected country's bounds

                    /* REMOVE EXISTING MARKERS */
                    citiesLayer.clearLayers(); // Clear previous city markers
                    airportsLayer.clearLayers(); // Clear previous airport markers

                    /*MARKERS*/
                    // Define custom icons for airports and cities
                    const airportIcon = L.icon({
                        iconUrl: './libs/plane-departure-solid.svg',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });

                    const cityIcon = L.icon({
                        iconUrl: './libs/tree-city-solid.svg',
                        iconSize: [40, 40],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });

                    // Define custom cluster icons
                    const clusterIcon = L.divIcon({
                        className: 'custom-cluster',
                        html: '<div class="cluster-number"></div>',
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                        popupAnchor: [0, -20]
                    });

                    // Customize the cluster appearance
                    citiesLayer.options.iconCreateFunction = function(cluster) {
                        return L.divIcon({
                            className: 'leaflet-cluster',
                            html: `<div style="background-color: purple; border-radius: 50%; color: white; font-size: 14px; text-align: center; line-height: 40px; width: 40px; height: 40px;">${cluster.getChildCount()}</div>`,
                            iconSize: [40, 40]
                        });
                    };

                    airportsLayer.options.iconCreateFunction = function(cluster) {
                        return L.divIcon({
                            className: 'leaflet-cluster',
                            html: `<div style="background-color: red; border-radius: 50%; color: white; font-size: 14px; text-align: center; line-height: 40px; width: 40px; height: 40px;">${cluster.getChildCount()}</div>`,
                            iconSize: [40, 40]
                        });
                    };

                    //Fetch marker data and populate layers
                    function fetchMarkers(countryCode) {
                        $.ajax({
                            url: 'http://localhost/itcareerswitch/project1/libs/php/getMarkersData.php',
                            method: 'GET',
                            data: { country: countryCode },
                            success: function (result) {
                                if (result.status.code === '200') {
                                    const cities = result.data.cities;
                                    const airports = result.data.airports;

                                    // Create city markers
                                    cities.forEach(city => {
                                        const cityMarker = L.marker([city.lat, city.lng], {icon: cityIcon})
                                            .bindPopup(`<b>City:</b> ${city.name}`);
                                        citiesLayer.addLayer(cityMarker);
                                    });
                    
                                    // Create airport markers
                                    airports.forEach(airport => {
                                        const airportMarker = L.marker([airport.lat, airport.lng], {icon: airportIcon})
                                            .bindPopup(`<b>Airport:</b> ${airport.name}`);
                                        airportsLayer.addLayer(airportMarker);
                                    });

                                                        
                                    // Add layers to map through Layer Control
                                    if (!map.hasLayer(citiesLayer) && !map.hasLayer(airportsLayer)) {
                                        citiesLayer.addTo(map);
                                        airportsLayer.addTo(map);
                                    }

                                } else {
                                    console.error('Failed to fetch marker data');
                                }
                            }
                        })
                    }
                    fetchMarkers(selectedCountry);
                };
            },
            error: function (xhr, status, error) {
                console.error("Error loading country data:", error);
                alert("Error loading country data.");
            }
        })
    }
});

const overlayMaps = {
    "Cities": citiesLayer,
    "Airports": airportsLayer
};

L.control.layers(null, overlayMaps, {collapsed: false}).addTo(map);

/*EASY BUTTON MAP*/
L.easyButton({
    id: "mapBtn",
    position: "bottomleft",
    states: [{
        icon: 'fas fa-flag',
        title: 'Flag',
        onClick: function() {
            const selectedCountry = $('#countrySelect').val();

            if (selectedCountry) {
                $.ajax({
                    url: "http://localhost/itcareerswitch/project1/libs/php/flag.php",
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        country: selectedCountry
                    },
                    success: function(result) {
                        console.log('Selected country: ', selectedCountry);

                        if (result.status.name === "ok") {
                            //SweetAlert2 popup
                            Swal.fire({
                                title: `Flag of ${result.data.countryName}`,
                                html: `
                                    <img src="${result.data.flag}" alt="${selectedCountry} Flag"/>
                                `,
                                icon: 'info'
                            });

                        } else {
                            Swal.fire({
                                title: 'Flag',
                                text: 'No country selected',
                                icon: 'warning'
                            });
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error(textStatus, errorThrown, jqXHR.responseText);
                            $().html("Error, unable to fetch data.");
                    } 
                });
            }  
        }
    }]
}).addTo(map);

L.easyButton({
    id: "mapBtn",
    position: "bottomleft",
    states: [{
        icon: 'fas fa-link',
        title: 'News',
        onClick: function() {
            const selectedCountry = $('#countrySelect').val();

            if(selectedCountry === "Select a country") {
                Swal.fire({
                    title: 'No country selected',
                    text: 'Please select a country from the dropdown before proceeding.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                return; // Stop further execution  
            }

            if (selectedCountry) {
                $.ajax({
                    url: "http://localhost/itcareerswitch/project1/libs/php/links.php",
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        country: selectedCountry
                    },
                    success: function(result) {
                        console.log('Selected country: ', selectedCountry);

                        if (result.status.name === "ok") {
                            
                            //SweetAlert2 popup
                            Swal.fire({
                                    title: `<i class="fa-regular fa-newspaper"></i> Headlines`,
                                    html: `
                                        <p><strong>Title:</strong> ${result.data.title}</p>
                                        <p><strong>Description:</strong> ${result.data.description}</p>
                                        <p><strong>Link to full article:</strong> ${result.data.link}</p>
                                        <p><strong>Published on:</strong> ${result.data.pubDate}</p>
                                    `,
                                    icon: 'info'
                                });
                        } else {
                            Swal.fire({
                                title: 'No articles found',
                                text: 'No articles are available for the selected country.',
                                icon: 'warning'
                            });
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error(textStatus, errorThrown, jqXHR.responseText);
                            $().html("Error, unable to fetch data.");
                    } 
                });
            }   
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
            const selectedCountry = $('#countrySelect').val();

            if(selectedCountry === "Select a country") {
                Swal.fire({
                    title: 'No country selected',
                    text: 'Please select a country from the dropdown before proceeding.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                return; // Stop further execution  
            }

            if (selectedCountry) {
                $.ajax({
                    url: "http://localhost/itcareerswitch/project1/libs/php/currency.php",
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        country: selectedCountry
                    },
                    success: function(result) {
                        console.log('Selected country: ', selectedCountry);

                        if (result.status.name === "ok") {
                            //SweetAlert2 popup
                            Swal.fire({
                                title: `<i class="fa-solid fa-coins"></i> ${result.data.currencyName}`,
                                
                                html: `
                                    <p><strong>Currency:</strong> ${result.data.currencyCode}</p>
                                    <p><strong>Currency Symbole:</strong> ${result.data.currencySymbole}</p>
                                    <p><strong>Currency Exchange</strong> £1 = ${result.data.exchangeRate}${result.data.currencySymbole}</p>

                                    <!--Input for amount-->
                                    <div>
                                        <label for="amount"></label>
                                        <input id="amount" type="number" class="swal2-input" placeholder="Amount in GBP" min="1">

                                        <!--Input for result-->
                                        <label for="conversion"></label>
                                        <input id="conversion" type="number" class="swal2-input" placeholder="Amount in ${result.data.currencyCode}" readonly min="1">
                                    </div>
                                `,
                                icon: 'info',
                                didOpen: () => {
                                    const amountInput = document.getElementById('amount');
                                    const conversionInput = document.getElementById('conversion');
                                    const exchangeRate = result.data.exchangeRate;
                        
                                    // Event listener to update the conversion field on input change
                                    amountInput.addEventListener('input', function() {
                                        const amount = parseFloat(amountInput.value);
                                        if (!isNaN(amount)) {
                                            const convertedAmount = (amount * exchangeRate).toFixed(2);  // Calculate conversion
                                            conversionInput.value = convertedAmount;  // Update the result
                                        } else {
                                            conversionInput.value = '';  // Clear the result if input is invalid
                                        }
                                    });
                                }
                            });

                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: 'No currency are available for the selected country.',
                                icon: 'warning'
                            });
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error(textStatus, errorThrown, jqXHR.responseText);
                            $().html("Error, unable to fetch data.");
                    }
                });
            }
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
            //Get latitude and longitude from the chosen country
            const selectedCountry = $('#countrySelect').val();

            if(selectedCountry === "Select a country") {
                Swal.fire({
                    title: 'No country selected',
                    text: 'Please select a country from the dropdown before proceeding.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                return; // Stop further execution  
            }

            if (selectedCountry) {
                $.ajax({
                    url: "http://127.0.0.1:5500/project1/libs/json/countries.json",
                    type: 'GET',
                    dataType: 'json',
                    success: function(result) {
                        console.log('Selected country: ', selectedCountry);
                        const selectedCountryData = result.find(country => country.code === selectedCountry);
                        console.log('Selected country data: ', selectedCountryData);

                        if (selectedCountryData) {
                            console.log(selectedCountryData);
                        } else {
                            console.log('Country not found in the list.')
                        }
                        
                        //Now get the weather data
                        $.ajax({
                            url: "http://localhost/itcareerswitch/project1/libs/php/weather.php",
                            type: 'GET',
                            dataType: 'json',
                            data: {
                                latitude: selectedCountryData.latitude,
                                longitude: selectedCountryData.longitude,
                            },
                            success: function(result) {
                                console.log(JSON.stringify(result));
                                    if (result.status.name === "ok") {
                                        let forecastHtml = Object.entries(result.data).map(([date, times]) => `
                                            <h3>${date}</h3>
                                            <p><strong>Morning:</strong> ${times.morning ? `${times.morning.temp}°C, ${times.morning.description} <img src="${times.morning.icon}" alt="Morning Icon">` : "No data"}</p>
                                            <p><strong>Afternoon:</strong> ${times.afternoon ? `${times.afternoon.temp}°C, ${times.afternoon.description} <img src="${times.afternoon.icon}" alt="Afternoon Icon">` : "No data"}</p>
                                            <p><strong>Evening:</strong> ${times.evening ? `${times.evening.temp}°C, ${times.evening.description} <img src="${times.evening.icon}" alt="Evening Icon">` : "No data"}</p>
                                            <hr>
                                        `).join("");
                                    
                                        Swal.fire({
                                            title: "3-Day Weather Forecast",
                                            html: forecastHtml,
                                            icon: "info"
                                        });
                                    } else {
                                        Swal.fire({
                                            title: "Error",
                                            text: result.status.description,
                                            icon: "warning"
                                        });
                                    }
                                    
                                
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.error(textStatus, errorThrown, jqXHR.responseText);
                                $().html("Error, unable to fetch data.");
                            }
                        });
                    }
                });
            }   
        }
    }]
}).addTo(map);

var infoBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
    // Open the modal when the button is clicked
    $("#countryModal").modal("show");

    const selectedCountry = $('#countrySelect').val();
    // AJAX request to fetch country information using the selected country
    $.ajax({
        url: 'http://localhost/itcareerswitch/project1/libs/php/countryInfo.php', // Your PHP script that provides the country data
        method: 'GET',
        data: { country: selectedCountry }, // Pass the selected country code
        success: function (response) {

            if (response.status.code === "200" && response.status.name === "ok") {
                // Access the country data from the 'data' key
                const countryData = response.data;

                const formattedPopulation = new Intl.NumberFormat().format(countryData.population);
                const formattedArea = new Intl.NumberFormat().format(countryData.area);

                $('#capital').text(countryData.capital || 'N/A');
                $('#region').text(countryData.region || 'N/A');
                $('#subregion').text(countryData.subregion || 'N/A');
                $('#area').text(formattedArea + " km²"|| 'N/A');
                $('#population').text(formattedPopulation || 'N/A');
                $('#language').text(countryData.language || 'N/A');

                
            }
        },
        error: function (xhr, status, error) {
            console.error('Error fetching country data: ', error);
            $('#capital').text('Error');
            $('#region').text('Error');
            $('#subregion').text('Error');
            $('#area').text('Error');
            $('#population').text('Error');
            $('#language').text('Error');
        }
    });
});

// Add the button to the map
infoBtn.addTo(map);

})