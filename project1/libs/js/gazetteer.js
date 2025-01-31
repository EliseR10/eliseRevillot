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

map = L.map("map", {
    layers: [streets]
}).setView([54.5, -4], 6);

var layerControl = L.control.layers(basemaps).addTo(map);

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

                    /*Get Markers*/
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

                // Define custom icons for airports and cities
                const airportIcon = L.ExtraMarkers.icon({
                    icon: 'fa-solid fa-plane-departure',
                    markerColor: 'red',
                    shape: 'square',
                    prefix: 'fa',
                    shadowUrl: './leaflet/images/markers_shadow.png'
                });

                const cityIcon = L.ExtraMarkers.icon({
                    icon: 'fa-solid fa-landmark-dome',
                    markerColor: 'purple',
                    shape: 'square',
                    prefix: 'fa',
                    shadowUrl: './leaflet/images/markers_shadow.png'
                });

                // Create city markers
                cities.forEach(city => {
                    const cityMarker = L.marker([city.lat, city.lng], {icon: cityIcon})
                        .bindTooltip(`<b>City:</b> ${city.name}`);
                    citiesLayer.addLayer(cityMarker);
                });

                // Create airport markers
                airports.forEach(airport => {
                    const airportMarker = L.marker([airport.lat, airport.lng], {icon: airportIcon})
                        .bindTooltip(`<b>Airport:</b> ${airport.name}`);
                    airportsLayer.addLayer(airportMarker);
                });

                  // Only add marker layers if not already added to the map
                  if (!map.hasLayer(citiesLayer)) {
                    citiesLayer.addTo(map);
                }

                if (!map.hasLayer(airportsLayer)) {
                    airportsLayer.addTo(map);
                }

                // Add marker layers to the layer control only once
                layerControl.removeLayer(citiesLayer);
                layerControl.removeLayer(airportsLayer);

                layerControl.addOverlay(citiesLayer, "Cities");
                layerControl.addOverlay(airportsLayer, "Airports");

            } else {
                console.error('Failed to fetch marker data');
            }
        }
    })
}

/*BUTTONS*/
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

var weatherBtn = L.easyButton("fas fa-temperature-low fa-xl", function (btn, map) {
    // Open the modal when the button is clicked
    $("#weatherModal").modal("show");

    //Get latitude and longitude from the chosen country
            const selectedCountry = $('#countrySelect').val();

            if (selectedCountry) {
                $.ajax({
                    url: "http://127.0.0.1:5500/project1/libs/json/countryBorders.geo.json",
                    type: 'GET',
                    dataType: 'json',
                    success: function(result) {
                        const country = result.features.find(feature => feature.properties.iso_a2 === selectedCountry);
                        
                        if (country) {
                            let coordinates = country.geometry.coordinates; // GeoJSON structure
                            let firstPolygon = coordinates[0]; // First polygon of the country

                            // If the country has multiple polygons, we need to check for nesting
                            while (Array.isArray(firstPolygon[0][0])) {
                                firstPolygon = firstPolygon[0]; 
                            }

                            let firstCoordinate = firstPolygon[0]; // Get the first point in the polygon
                            let longitude = firstCoordinate[0];
                            let latitude = firstCoordinate[1];
                    
                            console.log(`Country: ${country.properties.name}, Lat: ${latitude}, Lon: ${longitude}`);
                                           
                            //Now get the weather data
                            $.ajax({
                                url: "http://localhost/itcareerswitch/project1/libs/php/weather.php",
                                type: 'GET',
                                dataType: 'json',
                                data: {
                                    latitude: latitude,
                                    longitude: longitude
                                },
                                success: function(result) {
                                    console.log(JSON.stringify(result));
                                    if (result.status.name === "ok") {
                                        let forecastData = result.data;
                                        let forecastDates = Object.keys(forecastData);

                                        if (forecastDates.length < 3) {
                                            console.warn("Not enough forecast data available!");
                                            return;
                                        }
                                        
                                       // TODAY (First Day in Forecast)
                                        let today = forecastData[forecastDates[0]];
                                        $("#todayConditions").text(today.description);
                                        $("#todayIcon").attr("src", today.icon).attr("alt", today.description);
                                        $("#todayMaxTemp").text(Math.round(today.max_temp));
                                        $("#todayMinTemp").text(Math.round(today.min_temp));

                                        // DAY +1
                                        let day1 = forecastData[forecastDates[1]];
                                        $("#day1Date").text(formatDate(forecastDates[1])); // Format to readable date
                                        $("#day1Icon").attr("src", day1.icon).attr("alt", day1.description);
                                        $("#day1MaxTemp").text(Math.round(day1.max_temp));
                                        $("#day1MinTemp").text(Math.round(day1.min_temp));

                                        // DAY +2
                                        let day2 = forecastData[forecastDates[2]];
                                        $("#day2Date").text(formatDate(forecastDates[2]));
                                        $("#day2Icon").attr("src", day2.icon).attr("alt", day2.description);
                                        $("#day2MaxTemp").text(Math.round(day2.max_temp));
                                        $("#day2MinTemp").text(Math.round(day2.min_temp));
                                    }
                                },
                                error: function () {
                                    console.error("Failed to fetch weather data");
                                }                           
                            });
                        
                        } else {
                            console.log("Country not found in GeoJSON!");
                        }
                        
                        // Function to format date (e.g., "2024-02-01" → "Thu 1st")
                        function formatDate(dateStr) {
                            let date = new Date(dateStr);
                            let options = { weekday: 'short', day: 'numeric', month: 'short' };
                            return date.toLocaleDateString('en-GB', options);
                        }
                    }
                })
            }    
});

// Add the button to the map
weatherBtn.addTo(map);

var currencyBtn = L.easyButton("fas fa-money-bill-1 fa-xl", function (btn, map) {
    $("#currencyModal").modal("show");
  
    const selectedCountry = $('#countrySelect').val();

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
                            $('#currencyName').text('Currency Code: ' + result.data.currencyCode);
                            $('#currencyCode').text('(' + result.data.currencySymbol + ')');
                            $('#exchangeRate').text(result.data.currencyCode);

                            // Add event listener to perform currency conversion
                            const exchangeRate = result.data.exchangeRate;
                            const oneDollarConverted = (1 * exchangeRate).toFixed(2);

                            // Prepopulate the result input field with the conversion from 1 USD
                            $('#toAmount').val(oneDollarConverted);

                            // Handle changes to the amount input (in case the user wants to enter a different amount)
                            $('#fromAmount').val(1); // Set default to 1
                            $('#fromAmount').on('input', function() {
                                const fromAmount = parseFloat($(this).val());

                            if (!isNaN(fromAmount)) {
                                const toAmount = (fromAmount * exchangeRate).toFixed(2);
                                $('#toAmount').val(toAmount); // Update result field
                            } else {
                                $('#toAmount').val(''); // Clear result if input is invalid
                            }
                            })
                        }
                    }
                })    
            }
});

currencyBtn.addTo(map);

var newsBtn = L.easyButton("fa-regular fa-newspaper fa-xl", function (btn, map) {
    $("#newsModal").modal("show");
    
    const selectedCountry = $('#countrySelect').val();
    console.log(selectedCountry);

    if (selectedCountry) {
        $.ajax({
            url: "http://localhost/itcareerswitch/project1/libs/php/links.php",
            type: 'GET',
            dataType: 'json',
            data: {
                country: selectedCountry
            },
            success: function(result) {
                console.log('AJAX response: ', result);
                if (result.status.name === "ok") {

                    let articles = result.data;
                    let modalBody = $("#news");

                    modalBody.empty(); // Clear existing content

                    console.log(articles);

                    articles.forEach(article => {
                        let articleHTML = `
                            <table class="table table-borderless">
                                <tr>
                                    <td rowspan="2" width="50%">
                                        <img class="img-fluid rounded" src="${article.image}" alt="${article.title}" title="${article.title}">
                                    </td>
                                    <td>
                                        <a href="${article.link}" class="fw-bold fs-6 text-black" target="_blank">${article.title}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="align-bottom pb-0">
                                        <p class="fw-light fs-6 mb-1">${article.source}</p>
                                    </td>            
                                </tr>
                            </table>
                        `;
        
                        modalBody.append(articleHTML);
                    });
                } else {
                    $(".modal-body").html("<p>No articles available.</p>");     
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error(textStatus, errorThrown, jqXHR.responseText);
                $(".modal-body").html("<p>Error fetching news.</p>");
            } 
        });
    }   
})
//Add the button to the map
newsBtn.addTo(map);


var flagBtn = L.easyButton("fas fa-flag fa-xl", function (btn, map) {
    $("#flagModal").modal("show");
    
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
                        // Set the flag image and country name
                        $("#flag").html('<img src="' + result.data.flag + '" alt="Country Flag" class="img-fluid" />');
                    } else {
                        $("#flag").html('<img src="./libs/no-image.png" alt="No flag available" class="img-fluid" />');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error(textStatus, errorThrown, jqXHR.responseText);
                    $().html("Error, unable to fetch data.");
                    $("#flag").html("Error, unable to fetch data.");
                }
            
            });
        }
})

flagBtn.addTo(map);


})