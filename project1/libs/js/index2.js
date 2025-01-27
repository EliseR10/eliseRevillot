// ---------------------------------------------------------
// GLOBAL DECLARATIONS
// ---------------------------------------------------------

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

// buttons

var infoBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
  $("#exampleModal").modal("show");
});

// ---------------------------------------------------------
// EVENT HANDLERS
// ---------------------------------------------------------

// initialise and add controls once DOM is ready

$(document).ready(function () {
  
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
        url: `./libs/json/countries.json`,
        type: 'GET',
        dataType: 'json',
        success: function (countries) {
            const closestCountry = getClosestCountry(userLat, userLng, countries); // ISO2 country code
            
            if (closestCountry) {
                const userCountryCode = closestCountry.code;
                console.log('User Country Code:', userCountryCode);

                // Trigger the dropdown change to zoom to the user's country
                $('#countrySelect').val(userCountryCode).trigger('change');
            }
        },
        error: function (xhr, status, error) {
            console.error("Error reverse geocoding location:", error);
        }
    });
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

function getClosestCountry(userLat, userLng, countries) {
    // Loop through the countries to find the one with the closest match
    for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
        
        // Check if the coordinates of the country are very close to the user's location
        if (isCloseEnough(userLat, userLng, country.latitude, country.longitude)) {
            return country;  // return the country that matches
        }
    }

    return null; // No country found close enough
}

function isCloseEnough(userLat, userLng, countryLat, countryLng) {
    // Allow a certain tolerance for matching coordinates (e.g., within 5 degrees)
    const latTolerance = 5; // Can be adjusted based on your needs
    const lngTolerance = 5;

    return Math.abs(userLat - countryLat) <= latTolerance && Math.abs(userLng - countryLng) <= lngTolerance;
}

/*COUNTRY SELECTION*/
//Populate the dropdown when the page loads
$.ajax({
    url: "http://127.0.0.1:5500/project1/libs/json/countryBorders.geo.json",
    type: 'GET',
    dataType: 'json',
    success: function (result) {
        const countryDropdown = $('#countrySelect'); //Dropdown element
        const countryOptions = [];

        //Get country names and ISO2 codes
        result.features.forEach(function (country) {
            countryOptions.push({
                name: country.properties.name,
                iso2: country.properties.iso_a2
            });
        });

        //Sort countries alphabetically
        countryOptions.sort(function (a, b) {
            return a.name.localeCompare(b.name);
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
        alert("Error loading country data.");
    }
});

//Handle dropdown change
$('#countrySelect').change(function () {
    const selectedCountry = $(this).val(); //Get selected ISO2 code

    if (selectedCountry) {
        // Fetch GeoJSON data again to find the selected country's geometry
        $.ajax({
            url: "http://127.0.0.1:5500/project1/libs/json/countryBorders.geo.json",
            type: 'GET',
            dataType: 'json',
            success: function (result) {
                // Find the selected country's feature in the GeoJSON
                const selectedFeature = result.features.find(
                    feature => feature.properties.iso_a2 === selectedCountry
                );

                if (selectedFeature) {
                    //Clear existing layers from the map
                    map.eachLayer(function (layer) {
                        if (layer instanceof L.GeoJSON) {
                            map.removeLayer(layer);
                        }
                    });

                    // Add the selected country's borders to the map
                    L.geoJSON(selectedFeature.geometry, {
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
                
                    /*MARKERS*/
                    
                
                };
            },
            error: function (xhr, status, error) {
                console.error("Error loading country data:", error);
                alert("Error loading country data.");
            }
        })
    }
});

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

L.easyButton({
    id: "mapBtn",
    position: "bottomleft",
    states: [{
        icon: 'fas fa-circle-info',
        title: 'Country Information',
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
                    url: "http://localhost/itcareerswitch/project1/libs/php/countryInfo.php",
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
                                title: `Information about ${result.data.countryName}`,
                                html: `
                                    <p><strong>Capital of the country:</strong> ${result.data.capital}</p>
                                    <p><strong>Region:</strong> ${result.data.region}</p>
                                    <p><strong>Subregion:</strong> ${result.data.subregion}</p>
                                    <p><strong>Area:</strong> ${result.data.area} km²</p>
                                    <p><strong>Total population:</strong> ${result.data.population}</p>
                                    <p><strong>Language spoken:</strong> ${result.data.language}</p>
                                `,
                                icon: 'info'
                            });
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: result.status.description,
                                icon: 'error'
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
})