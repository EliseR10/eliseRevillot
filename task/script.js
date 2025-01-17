$(document).ready(function () {

//Neighbours
$('#NeighboursBtn').click(function() {  

    $.ajax({
        url: "http://localhost/task/getCountry.php",
        type: 'POST',
        dataType: 'json',
        data: { 
            country: $('#country').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name === "ok") {
                $("#resultNeighbours").html(result.data.map(n => n.countryName).join(', '));
            } else {
                $('#resultNeighbours').html('Error: ' + result.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(textStatus, errorThrown, jqXHR.responseText);
            $('#resultNeighbours').html("Error, unable to fetch data.");
        }
    }); 

});

//Siblings
$('#SiblingsBtn').click(function() {

    $.ajax({
        url: "http://localhost/task/getGeonameId.php",
        type: 'POST',
        dataType: 'json',
        data: { 
            geonameId: $('#geonameId').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name === "ok") {
                const countrySiblingsData = result.data[0];

                $('#asciiName').text(countrySiblingsData.asciiName);
                $('#countryCode').text(countrySiblingsData.countryCode);
                $('#population').text(countrySiblingsData.population);

            } else {
                alert("Error: " + result.status.description);
            }    
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(textStatus, errorThrown, jqXHR.responseText);
            $('#resultSiblings').html("Error: Unable to fetch data");
        }
    }); 

});

//Hierarchy
$('#HierarchyBtn').click(function() {
    
    $.ajax({
        url: "http://localhost/task/getHierarchy.php",
        type: 'POST',
        dataType: 'json',
        data: { 
            geonameidHierarchy: $('#geonameidHierarchy').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            const countryHierarchyData = result.data[1];

            if (result.status.name === "ok") {
                $('#asciiNameH').text(countryHierarchyData.asciiName);
                $('#lat').text(countryHierarchyData.lat);
                $('#lng').text(countryHierarchyData.lng);
            } else {
                $('#resultHierarchy').html('Error: ' + result.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(textStatus, errorThrown, jqXHR.responseText);
            $('#resultHierarchy').html("Error: Unable to fetch data");
        }
    }); 

});
});