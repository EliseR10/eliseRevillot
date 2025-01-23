$(document).ready(function () {

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
        icon: 'fas fa-flag',
        title: 'Flag',
        onClick: function() {
            const selectedCountry = $('#country').val();

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

L.easyButton({
    id: "mapBtn",
    position: "bottomleft",
    states: [{
        icon: 'fas fa-link',
        title: 'News',
        onClick: function() {
            const selectedCountry = $('#country').val();

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
                                    title: `Headlines`,
                                    html: `
                                        <p><strong>Title:</strong> ${result.data.title}</p>
                                        <p><strong>Description:</strong> ${result.data.description}</p>
                                        <p><strong>Link to full article:</strong> ${result.data.url}</p>
                                        <p><strong>Published on:</strong> ${result.data.publishedAt}</p>
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
            const selectedCountry = $('#country').val();

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
                                title: `${result.data.currencyName}`,
                                
                                html: `
                                    <p><strong>Currency:</strong> ${result.data.currencyCode}</p>
                                    <p><strong>Currency Symbole:</strong> ${result.data.currencySymbole}</p>
                                    <p><strong>Currency Exchange</strong> £1 = ${result.data.exchangeRate}${result.data.currencySymbole}</p>
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

L.easyButton({
    id: "mapBtn",
    position: "bottomleft",
    states: [{
        icon: 'fas fa-temperature-low',
        title: 'Weather Information',
        onClick: function() {
            //Get latitude and longitude from the chosen country
            const selectedCountry = $('#country').val();

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
                                    //SweetAlert2 popup
                                    Swal.fire({
                                        title: `Weather in ${result.data.location}`,
                                        html: `
                                            <p><strong>Temperature:</strong> ${result.data.temperature} C</p>
                                            <p><strong>Description:</strong> ${result.data.description}</p>
                                            <p><strong>Wind Speed:</strong> ${result.data.wind_speed} m/s</p>
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
            const selectedCountry = $('#country').val();

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