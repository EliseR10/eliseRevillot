$(window).on('load', function() {
  $('#preloader').fadeOut('slow'); // Use fadeOut for smooth transition
});

$(document).ready(function() {
  /*SEARCH BAR FOR PERSONNEL*/
  $("#searchInp").on("keyup", function () {
    let activeTab = $('.nav-link.active').attr('id'); //grab the id of the current active tab
    let searchTerm = $(this).val().trim(); //get search input value

    if (searchTerm.length > 0) { //display result
      if (activeTab === "personnelBtn") {
        $.ajax({
          url: "http://localhost:8080/itcareerswitch/project2/libs/php/SearchAll.php",
          type: 'GET',
          data: { txt: searchTerm },
          dataType: 'json',
          success: function (result) {

            if (result.status.code === '200')  {
              let resultsArray = result.data.found;

              const $personnelTableBody = $('#personnelTableBody');
              $personnelTableBody.empty(); //clear the table before displaying new results

              var frag = document.createDocumentFragment();
             
              if (resultsArray.length > 0) {
                $.each(result.data.found, function(index, person) {
                var row = document.createElement("tr");
                           
                var id = document.createElement("td");
                id.classList.add("hidden-id");
                id.setAttribute("data-id", person.id);
                id.textContent = person.id;
                row.appendChild(id);
                
                var name = document.createElement("td");
                name.classList.add("name-cell");
                var nameText = document.createTextNode(`${person.lastName}, ${person.firstName}`);
                name.append(nameText);
                
                row.append(name);
    
                var department = document.createElement("td");
                department.classList.add("department-cell");
                var departmentName = document.createTextNode(person.departmentName || 'N/A');
                department.append(departmentName);
                
                row.append(department);
    
                var location = document.createElement("td");
                location.classList.add("location-cell");
                var locationName = document.createTextNode(person.locationName || 'N/A');
                location.append(locationName);
                
                row.append(location);
    
                var jobTitle = document.createElement("td");
                jobTitle.classList.add("job-title-cell");
                var jobTitleName = document.createTextNode(person.jobTitle || 'N/A');
                jobTitle.append(jobTitleName);
                
                row.append(jobTitle);  
                
                var email = document.createElement("td");
                email.classList.add("email-cell");
                var emailName = document.createTextNode(person.email || 'N/A');
                email.append(emailName);
                
                row.append(email);     
                
                // Create the Modify button
                var editButton = document.createElement("button");
                editButton.className = "btn btn-primary btn-sm editBtn";
                editButton.setAttribute("data-bs-toggle", "modal");
                editButton.setAttribute("data-bs-target", "#editPersonnelModal");
                editButton.setAttribute("data-id", person.id);
    
                // Add the Font Awesome icon inside the button
                var editIcon = document.createElement("i");
                editIcon.className = "fa-solid fa-pencil fa-fw";
                editButton.append(editIcon);
    
                // Create the Delete button
                var deleteButton = document.createElement("button");
                deleteButton.className = "btn btn-primary btn-sm";
                deleteButton.setAttribute("data-bs-toggle", "modal");
                deleteButton.setAttribute("data-bs-target", "#areYouSurePersonnelModal");
                deleteButton.setAttribute("data-id", person.id);
    
                // Add the Font Awesome icon inside the button
                var deleteIcon = document.createElement("i");
                deleteIcon.className = "fa-solid fa-trash fa-fw";
                deleteButton.append(deleteIcon);
    
                // Create a table cell to hold the buttons  
                var buttonCell = document.createElement("td");
                buttonCell.className = "actions-cell";
                buttonCell.append(editButton);
                buttonCell.append(deleteButton);
    
                // Append the cell to the row
                row.append(buttonCell); 
    
                frag.append(row);
              });                
            
              $('#personnelTableBody').append(frag);
            } else {
              var row = document.createElement("tr");

              var noResult = document.createElement("td");
              noResult.className = "text-center";
              var noResultText = document.createTextNode('No results found.');
              noResult.append(noResultText);
                
              row.append(noResult);
              frag.append(row);
              $('#personnelTableBody').append(frag);
            }
          }
        },
        error: function(xhr, status, error) {
          console.error('Error loading data: ', error);
          console.log("Response:", xhr.responseText);
        }
        })
        //end of activeTab = personnel Tab

      } else if (activeTab === "departmentsBtn") {
        $.ajax({
          url: "http://localhost:8080/itcareerswitch/project2/libs/php/searchDepartments.php",
          type: "GET",
          dataType: "json",
          data: { txt: searchTerm },
          success: function (result) {

            if(result.status.code == 200) {
              let resultsArray = result.data.found;

              const $departmentTableBody = $('#departmentTableBody');
              $departmentTableBody.empty(); //clear the table before displaying new results

              var frag = document.createDocumentFragment();

              if (resultsArray.length > 0) {
                console.log(resultsArray);

                $.each(result.data.found, function(index, department) {
                  var row = document.createElement("tr");
                       
                  var id = document.createElement("td");
                  id.classList.add("hidden-id");
                  id.setAttribute("data-id", department.departmentID);
                  id.textContent = department.departmentID;
                  row.appendChild(id);
            
                  var name = document.createElement("td");
                  name.classList.add("name-cell");
                  var nameText = document.createTextNode(department.departmentName);
                  name.append(nameText);
            
                  row.append(name);

                  var location = document.createElement("td");
                  var locationName = document.createTextNode(department.locationName || 'N/A');
                  location.append(locationName);
            
                  row.append(location);  
            
                  // Create the Modify button
                  var editButton = document.createElement("button");
                  editButton.className = "btn btn-primary btn-sm editBtn";
                  editButton.setAttribute("data-bs-toggle", "modal");
                  editButton.setAttribute("data-bs-target", "#editDepartmentModal");
                  editButton.setAttribute("data-id", department.departmentID);

                  // Add the Font Awesome icon inside the button
                  var editIcon = document.createElement("i");
                  editIcon.className = "fa-solid fa-pencil fa-fw";
                  editButton.append(editIcon);

                  // Create the Delete button
                  var deleteButton = document.createElement("button");
                  deleteButton.className = "btn btn-primary btn-sm";
                  deleteButton.setAttribute("data-id", department.id);
                  deleteButton.setAttribute("onclick", `checkDepartmentBeforeDelete(${department.departmentID}, '${department.departmentName}')`);

                  // Add the Font Awesome icon inside the button
                  var deleteIcon = document.createElement("i");
                  deleteIcon.className = "fa-solid fa-trash fa-fw";
                  deleteButton.append(deleteIcon);

                  // Create a table cell to hold the buttons  
                  var buttonCell = document.createElement("td");
                  buttonCell.className = "actions-cell";
                  buttonCell.append(editButton);
                  buttonCell.append(deleteButton);

                  // Append the cell to the row
                  row.append(buttonCell); 

                  frag.append(row);
                })
                  
                  $('#departmentTableBody').append(frag);
                } else {
                  var row = document.createElement("tr");

                  var noResult = document.createElement("td");
                  noResult.className = "text-center";
                  var noResultText = document.createTextNode('No results found.');
                  noResult.append(noResultText);
                
                  row.append(noResult);
                  frag.append(row);
                  $('#departmentTableBody').append(frag);
                }
              }
          },
          error: function(xhr, status, error) {
            console.error('Error loading data: ', error);
            console.log("Response:", xhr.responseText);
          }
        })
        //end of activeTab = department Tab
      
      } else if (activeTab === "locationsBtn") {
        $.ajax({
          url: "http://localhost:8080/itcareerswitch/project2/libs/php/searchLocation.php",
          type: "GET",
          dataType: "json",
          data: { txt: searchTerm },
          success: function (result) {

            if(result.status.code == 200) {
              let resultsArray = result.data.found;

              const $locationTableBody = $('#locationTableBody');
              $locationTableBody.empty(); //clear the table before displaying new results

              var frag = document.createDocumentFragment();

              if (resultsArray.length > 0) {
                $.each(result.data.found, function(index, location) {
                  var row = document.createElement("tr");
                       
                  var id = document.createElement("td");
                  id.classList.add("hidden-id");
                  id.setAttribute("data-id", location.id);
                  id.textContent = location.id;
                  row.appendChild(id);
                  
                  var name = document.createElement("td");
                  name.classList.add("name-cell");
                  var nameText = document.createTextNode(location.name);
                  name.append(nameText);
                  
                  row.append(name);
      
                  // Create the Modify button
                  var editButton = document.createElement("button");
                  editButton.className = "btn btn-primary btn-sm editBtn";
                  editButton.setAttribute("data-bs-toggle", "modal");
                  editButton.setAttribute("data-bs-target", "#editLocationModal");
                  editButton.setAttribute("data-id", location.id);
      
                  // Add the Font Awesome icon inside the button
                  var editIcon = document.createElement("i");
                  editIcon.className = "fa-solid fa-pencil fa-fw";
                  editButton.append(editIcon);
      
                  // Create the Delete button
                  var deleteButton = document.createElement("button");
                  deleteButton.className = "btn btn-primary btn-sm";
                  deleteButton.setAttribute("data-id", location.id);
                  deleteButton.setAttribute("onclick", `checkLocationBeforeDelete(${location.id}, '${location.name}')`);
      
                  // Add the Font Awesome icon inside the button
                  var deleteIcon = document.createElement("i");
                  deleteIcon.className = "fa-solid fa-trash fa-fw";
                  deleteButton.append(deleteIcon);
      
                  // Create a table cell to hold the buttons  
                  var buttonCell = document.createElement("td");
                  buttonCell.className = "actions-cell";
                  buttonCell.append(editButton);
                  buttonCell.append(deleteButton);
      
                  // Append the cell to the row
                  row.append(buttonCell); 
      
                  frag.append(row);
                })

                $('#locationTableBody').append(frag);

              } else {
                  var row = document.createElement("tr");

                  var noResult = document.createElement("td");
                  noResult.className = "text-center";
                  var noResultText = document.createTextNode('No results found.');
                  noResult.append(noResultText);
                
                  row.append(noResult);
                  frag.append(row);
                  $('#locationTableBody').append(frag);
              }
            }
          },
          error: function(xhr, status, error) {
            console.error('Error loading data: ', error);
            console.log("Response:", xhr.responseText);
          }
        })
      } //end of activeTab = location Tab
    
    } else { // If search is empty, reload all data
      if (activeTab === "personnelBtn") {
        //display all personnel data
        $.ajax({
          url: "http://localhost:8080/itcareerswitch/project2/libs/php/GET/getAll.php",
          type: 'GET',
          dataType: 'json',
          success: function (result) {
            if (result.status.code === '200')  {
              const $personnelTableBody = $('#personnelTableBody');
              $personnelTableBody.empty(); //clear the table before displaying new results

              const personnelData = result.data;
              var frag = document.createDocumentFragment();
             
              personnelData.forEach(person => {
                var row = document.createElement("tr");
                           
                var id = document.createElement("td");
                id.classList.add("hidden-id");
                id.setAttribute("data-id", person.id);
                id.textContent = person.id;
                row.appendChild(id);
                
                var name = document.createElement("td");
                name.classList.add("name-cell");
                var nameText = document.createTextNode(`${person.lastName}, ${person.firstName}`);
                name.append(nameText);
                
                row.append(name);
    
                var department = document.createElement("td");
                department.classList.add("department-cell");
                var departmentName = document.createTextNode(person.department || 'N/A');
                department.append(departmentName);
                
                row.append(department);
    
                var location = document.createElement("td");
                location.classList.add("location-cell");
                var locationName = document.createTextNode(person.location || 'N/A');
                location.append(locationName);
                
                row.append(location);
    
                var jobTitle = document.createElement("td");
                jobTitle.classList.add("job-title-cell");
                var jobTitleName = document.createTextNode(person.jobTitle || 'N/A');
                jobTitle.append(jobTitleName);
                
                row.append(jobTitle);  
                
                var email = document.createElement("td");
                email.classList.add("email-cell");
                var emailName = document.createTextNode(person.email || 'N/A');
                email.append(emailName);
                
                row.append(email);     
                
                // Create the Modify button
                var editButton = document.createElement("button");
                editButton.className = "btn btn-primary btn-sm editBtn";
                editButton.setAttribute("data-bs-toggle", "modal");
                editButton.setAttribute("data-bs-target", "#editPersonnelModal");
                editButton.setAttribute("data-id", person.id);
    
                // Add the Font Awesome icon inside the button
                var editIcon = document.createElement("i");
                editIcon.className = "fa-solid fa-pencil fa-fw";
                editButton.append(editIcon);
    
                // Create the Delete button
                var deleteButton = document.createElement("button");
                deleteButton.className = "btn btn-primary btn-sm";
                deleteButton.setAttribute("data-bs-toggle", "modal");
                deleteButton.setAttribute("data-bs-target", "#areYouSurePersonnelModal");
                deleteButton.setAttribute("data-id", person.id);
    
                // Add the Font Awesome icon inside the button
                var deleteIcon = document.createElement("i");
                deleteIcon.className = "fa-solid fa-trash fa-fw";
                deleteButton.append(deleteIcon);
    
                // Create a table cell to hold the buttons  
                var buttonCell = document.createElement("td");
                buttonCell.className = "actions-cell";
                buttonCell.append(editButton);
                buttonCell.append(deleteButton);
    
                // Append the cell to the row
                row.append(buttonCell); 
    
                frag.append(row);
    
              });                
            
              $('#personnelTableBody').append(frag);
            }
          },
          error: function(xhr, status, error) {
            console.error('Error loading data: ', error);
            console.log("Response:", xhr.responseText);
          }
        })
      } else if (activeTab === "departmentsBtn") {
        //display all departments data
        $.ajax({
          url: "http://localhost:8080/itcareerswitch/project2/libs/php/GET/getAllDepartmentsDisplay.php",
          type: 'GET',
          dataType: 'json',
          success: function (result) {
            const $departmentTableBody = $('#departmentTableBody');
            $departmentTableBody.empty(); //clear the table before displaying new results

            if (result.status.code === '200')  {
                const departmentData = result.data;
                var frag = document.createDocumentFragment();
             
                departmentData.forEach(department => {
                var row = document.createElement("tr");
                           
                var id = document.createElement("td");
                id.classList.add("hidden-id");
                id.setAttribute("data-id", department.id);
                id.textContent = department.id;
                row.appendChild(id);
                
                var name = document.createElement("td");
                name.classList.add("name-cell");
                var nameText = document.createTextNode(department.department);
                name.append(nameText);
                
                row.append(name);
    
                var location = document.createElement("td");
                var locationName = document.createTextNode(department.location || 'N/A');
                location.append(locationName);
                
                row.append(location);  
                
                // Create the Modify button
                var editButton = document.createElement("button");
                editButton.className = "btn btn-primary btn-sm editBtn";
                editButton.setAttribute("data-bs-toggle", "modal");
                editButton.setAttribute("data-bs-target", "#editDepartmentModal");
                editButton.setAttribute("data-id", department.id);
    
                // Add the Font Awesome icon inside the button
                var editIcon = document.createElement("i");
                editIcon.className = "fa-solid fa-pencil fa-fw";
                editButton.append(editIcon);
    
                // Create the Delete button
                var deleteButton = document.createElement("button");
                deleteButton.className = "btn btn-primary btn-sm";
                deleteButton.setAttribute("data-id", department.id);
                deleteButton.setAttribute("onclick", `checkDepartmentBeforeDelete(${department.id}, '${department.department}')`);
    
                // Add the Font Awesome icon inside the button
                var deleteIcon = document.createElement("i");
                deleteIcon.className = "fa-solid fa-trash fa-fw";
                deleteButton.append(deleteIcon);
    
                // Create a table cell to hold the buttons  
                var buttonCell = document.createElement("td");
                buttonCell.className = "actions-cell";
                buttonCell.append(editButton);
                buttonCell.append(deleteButton);
    
                // Append the cell to the row
                row.append(buttonCell); 
    
                frag.append(row);
    
              });                
            
              $('#departmentTableBody').append(frag);
            }
          },
          error: function(xhr, status, error) {
            console.error('Error loading data: ', error);
            console.log("Response:", xhr.responseText);
          }
        })
      } else if (activeTab === "locationsBtn") {
        //display all location data
        $.ajax({
          url: "http://localhost:8080/itcareerswitch/project2/libs/php/GET/getAllLocations.php",
          type: 'GET',
          dataType: 'json',
          success: function (result) {
            const $locationTableBody = $('#locationTableBody');
            $locationTableBody.empty(); //clear the table before displaying new results
  
            if (result.status.code === '200')  {
              const locationData = result.data;
              var frag = document.createDocumentFragment();
           
              locationData.forEach(location => {
  
              var row = document.createElement("tr");
                         
              var id = document.createElement("td");
              id.classList.add("hidden-id");
              id.setAttribute("data-id", location.id);
              id.textContent = location.id;
              row.appendChild(id);
              
              var name = document.createElement("td");
              name.classList.add("name-cell");
              var nameText = document.createTextNode(location.location);
              name.append(nameText);
              
              row.append(name);
  
              // Create the Modify button
              var editButton = document.createElement("button");
              editButton.className = "btn btn-primary btn-sm editBtn";
              editButton.setAttribute("data-bs-toggle", "modal");
              editButton.setAttribute("data-bs-target", "#editLocationModal");
              editButton.setAttribute("data-id", location.id);
  
              // Add the Font Awesome icon inside the button
              var editIcon = document.createElement("i");
              editIcon.className = "fa-solid fa-pencil fa-fw";
              editButton.append(editIcon);
  
              // Create the Delete button
              var deleteButton = document.createElement("button");
              deleteButton.className = "btn btn-primary btn-sm";
              deleteButton.setAttribute("data-id", location.id);
              deleteButton.setAttribute("onclick", `checkLocationBeforeDelete(${location.id}, '${location.location}')`);
  
              // Add the Font Awesome icon inside the button
              var deleteIcon = document.createElement("i");
              deleteIcon.className = "fa-solid fa-trash fa-fw";
              deleteButton.append(deleteIcon);
  
              // Create a table cell to hold the buttons  
              var buttonCell = document.createElement("td");
              buttonCell.className = "actions-cell";
              buttonCell.append(editButton);
              buttonCell.append(deleteButton);
  
              // Append the cell to the row
              row.append(buttonCell); 
  
              frag.append(row);
            });                
            $('#locationTableBody').append(frag);
          }
        },
        error: function(xhr, status, error) {
          console.error('Error loading data: ', error);
          console.log("Response:", xhr.responseText);
        }
      })
      }
    }
  });
  
  /*REFRESH BUTTON*/
  $("#refreshBtn").click(function () {
    if ($("#personnelBtn").hasClass("active")) {
      // Call function to refresh personnel table
      $.ajax({
        url: "http://localhost:8080/itcareerswitch/project2/libs/php/GET/getAll.php",
        type: 'GET',
        dataType: 'json',
        success: function (result) {
          if (result.status.code === '200')  {
            const $personnelTableBody = $('#personnelTableBody');
            //Empty the current table body to avoid duplicate rows
            $personnelTableBody.empty();

            const personnelData = result.data;
            var frag = document.createDocumentFragment();
           
            personnelData.forEach(person => {
              var row = document.createElement("tr");
                         
              var id = document.createElement("td");
              id.classList.add("hidden-id");
              id.setAttribute("data-id", person.id);
              id.textContent = person.id;
              row.appendChild(id);
              
              var name = document.createElement("td");
              name.classList.add("name-cell");
              var nameText = document.createTextNode(`${person.lastName}, ${person.firstName}`);
              name.append(nameText);
              
              row.append(name);
  
              var department = document.createElement("td");
              department.classList.add("department-cell");
              var departmentName = document.createTextNode(person.department || 'N/A');
              department.append(departmentName);
              
              row.append(department);
  
              var location = document.createElement("td");
              location.classList.add("location-cell");
              var locationName = document.createTextNode(person.location || 'N/A');
              location.append(locationName);
              
              row.append(location);
  
              var jobTitle = document.createElement("td");
              jobTitle.classList.add("job-title-cell");
              var jobTitleName = document.createTextNode(person.jobTitle || 'N/A');
              jobTitle.append(jobTitleName);
              
              row.append(jobTitle);  
              
              var email = document.createElement("td");
              email.classList.add("email-cell");
              var emailName = document.createTextNode(person.email || 'N/A');
              email.append(emailName);
              
              row.append(email);     
              
              // Create the Modify button
              var editButton = document.createElement("button");
              editButton.className = "btn btn-primary btn-sm editBtn";
              editButton.setAttribute("data-bs-toggle", "modal");
              editButton.setAttribute("data-bs-target", "#editPersonnelModal");
              editButton.setAttribute("data-id", person.id);
  
              // Add the Font Awesome icon inside the button
              var editIcon = document.createElement("i");
              editIcon.className = "fa-solid fa-pencil fa-fw";
              editButton.append(editIcon);
  
              // Create the Delete button
              var deleteButton = document.createElement("button");
              deleteButton.className = "btn btn-primary btn-sm";
              deleteButton.setAttribute("data-bs-toggle", "modal");
              deleteButton.setAttribute("data-bs-target", "#areYouSurePersonnelModal");
              deleteButton.setAttribute("data-id", person.id);
  
              // Add the Font Awesome icon inside the button
              var deleteIcon = document.createElement("i");
              deleteIcon.className = "fa-solid fa-trash fa-fw";
              deleteButton.append(deleteIcon);
  
              // Create a table cell to hold the buttons  
              var buttonCell = document.createElement("td");
              buttonCell.className = "actions-cell";
              buttonCell.append(editButton);
              buttonCell.append(deleteButton);
  
              // Append the cell to the row
              row.append(buttonCell); 
  
              frag.append(row);
  
            });                
          
            $('#personnelTableBody').append(frag);
          }
        },
        error: function(xhr, status, error) {
          console.error('Error loading data: ', error);
          console.log("Response:", xhr.responseText);
        }
      });
      //Reset filter button color
      $('#filterBtn').removeClass('btn-success').addClass('btn-primary');

      $('#searchInp').val(''); // Clear search input when clicking on any tab
    
    } else {  
      if ($("#departmentsBtn").hasClass("active")) {
      // Call function to refresh department table
      $.ajax({
        url: "http://localhost:8080/itcareerswitch/project2/libs/php/GET/getAllDepartmentsDisplay.php",
        type: 'GET',
        dataType: 'json',
        success: function (result) {
  
          if (result.status.code === '200')  {
              const $departmentTableBody = $('#departmentTableBody');
              //Empty the current table body to avoid duplicate rows
              $departmentTableBody.empty();

              const departmentData = result.data;
              var frag = document.createDocumentFragment();
           
              departmentData.forEach(department => {
              var row = document.createElement("tr");
                         
              var id = document.createElement("td");
              id.classList.add("hidden-id");
              id.setAttribute("data-id", department.id);
              id.textContent = department.id;
              row.appendChild(id);
              
              var name = document.createElement("td");
              name.classList.add("name-cell");
              var nameText = document.createTextNode(department.department);
              name.append(nameText);
              
              row.append(name);
  
              var location = document.createElement("td");
              var locationName = document.createTextNode(department.location || 'N/A');
              location.append(locationName);
              
              row.append(location);  
              
              // Create the Modify button
              var editButton = document.createElement("button");
              editButton.className = "btn btn-primary btn-sm editBtn";
              editButton.setAttribute("data-bs-toggle", "modal");
              editButton.setAttribute("data-bs-target", "#editDepartmentModal");
              editButton.setAttribute("data-id", department.id);
  
              // Add the Font Awesome icon inside the button
              var editIcon = document.createElement("i");
              editIcon.className = "fa-solid fa-pencil fa-fw";
              editButton.append(editIcon);
  
              // Create the Delete button
              var deleteButton = document.createElement("button");
              deleteButton.className = "btn btn-primary btn-sm";
              deleteButton.setAttribute("data-id", department.id);
              deleteButton.setAttribute("onclick", `checkDepartmentBeforeDelete(${department.id}, '${department.department}')`);
  
              // Add the Font Awesome icon inside the button
              var deleteIcon = document.createElement("i");
              deleteIcon.className = "fa-solid fa-trash fa-fw";
              deleteButton.append(deleteIcon);
  
              // Create a table cell to hold the buttons  
              var buttonCell = document.createElement("td");
              buttonCell.className = "actions-cell";
              buttonCell.append(editButton);
              buttonCell.append(deleteButton);
  
              // Append the cell to the row
              row.append(buttonCell); 
  
              frag.append(row);
  
            });                
          
            $('#departmentTableBody').append(frag);
          }
        },
        error: function(xhr, status, error) {
          console.error('Error loading data: ', error);
          console.log("Response:", xhr.responseText);
        }
      })
      //Reset filter button color
      $('#filterBtn').removeClass('btn-success').addClass('btn-primary');

      $('#searchInp').val(''); // Clear search input when clicking on any tab

    } else {
        // Call function to refresh locations table
        $.ajax({
          url: "http://localhost:8080/itcareerswitch/project2/libs/php/GET/getAllLocations.php",
          type: 'GET',
          dataType: 'json',
          success: function (result) {
  
            if (result.status.code === '200')  {
              const $locationTableBody = $('#locationTableBody');
              //Empty the current table body to avoid duplicate rows
              $locationTableBody.empty();

              const locationData = result.data;
              var frag = document.createDocumentFragment();
           
              locationData.forEach(location => {
  
              var row = document.createElement("tr");
                         
              var id = document.createElement("td");
              id.classList.add("hidden-id");
              id.setAttribute("data-id", location.id);
              id.textContent = location.id;
              row.appendChild(id);
              
              var name = document.createElement("td");
              name.classList.add("name-cell");
              var nameText = document.createTextNode(location.location);
              name.append(nameText);
              
              row.append(name);
  
              // Create the Modify button
              var editButton = document.createElement("button");
              editButton.className = "btn btn-primary btn-sm editBtn";
              editButton.setAttribute("data-bs-toggle", "modal");
              editButton.setAttribute("data-bs-target", "#editLocationModal");
              editButton.setAttribute("data-id", location.id);
  
              // Add the Font Awesome icon inside the button
              var editIcon = document.createElement("i");
              editIcon.className = "fa-solid fa-pencil fa-fw";
              editButton.append(editIcon);
  
              // Create the Delete button
              var deleteButton = document.createElement("button");
              deleteButton.className = "btn btn-primary btn-sm";
              deleteButton.setAttribute("data-id", location.id);
              deleteButton.setAttribute("onclick", `checkLocationBeforeDelete(${location.id}, '${location.location}')`);
  
              // Add the Font Awesome icon inside the button
              var deleteIcon = document.createElement("i");
              deleteIcon.className = "fa-solid fa-trash fa-fw";
              deleteButton.append(deleteIcon);
  
              // Create a table cell to hold the buttons  
              var buttonCell = document.createElement("td");
              buttonCell.className = "actions-cell";
              buttonCell.append(editButton);
              buttonCell.append(deleteButton);
  
              // Append the cell to the row
              row.append(buttonCell); 
  
              frag.append(row);
            });                
             $('#locationTableBody').append(frag);
            }
          },
          error: function(xhr, status, error) {
            console.error('Error loading data: ', error);
            console.log("Response:", xhr.responseText);
          }
        })
        
        //Reset filter button color
        $('#filterBtn').removeClass('btn-success').addClass('btn-primary');

        $('#searchInp').val(''); // Clear search input when clicking on any tab
    }
    }
  });

  $("#personnelBtn").click(function () {
    // Call function to refresh personnel table
    $('#searchInp').val(''); // Clear search input when clicking on any tab

    // Reset the filter location selection
    $('#filterLocationLocation').val('');
  
    // Reset the color of the filter button to default (btn-primary)
    $('#filterBtn').removeClass('btn-success').addClass('btn-primary');

    $("#filterBtn").prop("disabled", false).removeClass("disabled"); // Enable it back

    $('#personnelTableBody').empty();
    displayPersonnel();
  });
  
  $("#departmentsBtn").click(function () {
    // Call function to refresh department table
    $('#searchInp').val(''); // Clear search input when clicking on any tab

    // Reset the filter location selection
    $('#filterLocationLocation').val('');
  
    // Reset the color of the filter button to default (btn-primary)
    $('#filterBtn').removeClass('btn-success').addClass('btn-primary');

    $("#filterBtn").prop("disabled", true).addClass("disabled"); // Disable and visually indicate

    $('#departmentTableBody').empty();
    displayDepartment();

  });
  
  $("#locationsBtn").click(function () {
    // Call function to refresh location table
    $('#searchInp').val(''); // Clear search input when clicking on any tab

    // Reset the filter location selection
    $('#filterLocationLocation').val('');
  
    // Reset the color of the filter button to default (btn-primary)
    $('#filterBtn').removeClass('btn-success').addClass('btn-primary');

    $("#filterBtn").prop("disabled", true).addClass("disabled"); // Disable and visually indicate

    $('#locationTableBody').empty();
    displayLocation();
  });
  
  $("#filterBtn").click(function () {
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
    const modal = {
      personnelBtn: '#filterEmployeeModal',
      departmentsBtn: '#filterDepartmentModal',
      locationsBtn: '#filterLocationModal',
    };

    let activeTab = $('.nav-link.active').attr('id'); //grab the id of the current active tab

    if (activeTab === "departmentsBtn" || activeTab === "locationsBtn") {
      return;
    } else {
      $(modal[activeTab]).modal("show");
    }
  });
  
  $("#addBtn").click(function () {
    // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
    const modal = {
      personnelBtn: '#addPersonnelModal',
      departmentsBtn: '#addDepartmentModal',
      locationsBtn: '#addLocationModal',
    };

    let activeTab = $('.nav-link.active').attr('id'); //grab the id of the current active tab

    if (activeTab && modal[activeTab]) {
      $(modal[activeTab]).modal("show");
    }
  });

  /*FILTER*/
  /*Personnel Filter Button*/
  $('#filterEmployeeModal').on('show.bs.modal', function() {
    /*Populate location selection in filterDepartmentModal*/
    $.ajax({
      url: "http://localhost:8080/itcareerswitch/project2/libs/php/GET/getAllDepartments.php",
      type: 'GET',
      dataType: 'json',
      success: function (result) {
        var resultCode = result.status.code;

        if (resultCode == 200) {
          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted

          $("#filterEmployeeDepartment").html("<option value='all'>All</option>");

          $.each(result.data, function (index, department) {
            $("#filterEmployeeDepartment").append(
              $("<option>", {
                value: department.id,
                text: department.name
              })
            );
          });

          $("#filterEmployeeDepartment").val('all');
        
        } else {
          $("#filterEmployeeModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      }
    })

    /*Populate location selection in filterDepartmentModal*/
    $.ajax({
      url: "http://localhost:8080/itcareerswitch/project2/libs/php/GET/getAllLocations.php",
      type: 'GET',
      dataType: 'json',
      success: function (result) {
        var resultCode = result.status.code;

        if (resultCode == 200) {
          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted

          $("#filterEmployeeLocation").html("<option value='all'>All</option>");

          $.each(result.data, function (index, location) {
            $("#filterEmployeeLocation").append(
              $("<option>", {
                value: location.id,
                text: location.location
              })
            );
          });

          $("#filterEmployeeLocation").val('all');
        
        } else {
          $("#filterEmployeeModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      }
    })

    //When user select a loc or dep, automatically change the other selection to all
    $('#filterEmployeeDepartment').on('change', function() {
      if ($(this).val() !== 'all') {
        $('#filterEmployeeLocation').val('all');
      }
    });

    $('#filterEmployeeLocation').on('change', function() {
      if ($(this).val() !== 'all') {
        $('#filterEmployeeDepartment').val('all');
      }
    });

  })

  //Set the filters
  $('#filterEmployeeForm').on('submit', function(event) {
    event.preventDefault(); // Prevent the form submission (page reload)

    const departmentID = $('#filterEmployeeDepartment').val();
    const locationID = $('#filterEmployeeLocation').val();

    const filteredParams = {};
    if (departmentID !== 'all') {
      filteredParams.departmentID = departmentID;
    }
    if (locationID !== 'all') {
      filteredParams.locationID = locationID;
    }

      $.ajax({
        url: 'http://localhost:8080/itcareerswitch/project2/libs/php/FILTER/filterPersonnel.php',
        type: 'GET',
        dataType: 'json',
        data : filteredParams,
        success: function (result) {
          const $personnelTableBody = $('#personnelTableBody');
        
          $personnelTableBody.empty(); //clear the table before displaying new results
          const personnelData = result.data;
          var frag = document.createDocumentFragment();

          if (result.status.code === '200' && result.data.length > 0)  {

            personnelData.forEach(person => {
              var row = document.createElement("tr");
                       
              var id = document.createElement("td");
              id.classList.add("hidden-id");
              id.setAttribute("data-id", person.id);
              id.textContent = person.id;
              row.appendChild(id);
            
              var name = document.createElement("td");
              name.classList.add("name-cell");
              var nameText = document.createTextNode(`${person.lastName}, ${person.firstName}`);
              name.append(nameText);
            
              row.append(name);

              var department = document.createElement("td");
              department.classList.add("department-cell");
              var departmentName = document.createTextNode(person.departmentName || 'N/A');
              department.append(departmentName);
            
              row.append(department);

              var location = document.createElement("td");
              location.classList.add("location-cell");
              var locationName = document.createTextNode(person.location || 'N/A');
              location.append(locationName);
            
              row.append(location);

              var jobTitle = document.createElement("td");
              jobTitle.classList.add("job-title-cell");
              var jobTitleName = document.createTextNode(person.jobTitle || 'N/A');
              jobTitle.append(jobTitleName);
            
              row.append(jobTitle);  
            
              var email = document.createElement("td");
              email.classList.add("email-cell");
              var emailName = document.createTextNode(person.email || 'N/A');
              email.append(emailName);
            
              row.append(email);     
            
              // Create the Modify button
              var editButton = document.createElement("button");
              editButton.className = "btn btn-primary btn-sm editBtn";
              editButton.setAttribute("data-bs-toggle", "modal");
              editButton.setAttribute("data-bs-target", "#editPersonnelModal");
              editButton.setAttribute("data-id", person.id);

              // Add the Font Awesome icon inside the button
              var editIcon = document.createElement("i");
              editIcon.className = "fa-solid fa-pencil fa-fw";
              editButton.append(editIcon);

              // Create the Delete button
              var deleteButton = document.createElement("button");
              deleteButton.className = "btn btn-primary btn-sm";
              deleteButton.setAttribute("data-bs-toggle", "modal");
              deleteButton.setAttribute("data-bs-target", "#areYouSurePersonnelModal");
              deleteButton.setAttribute("data-id", person.id);

              // Add the Font Awesome icon inside the button
              var deleteIcon = document.createElement("i");
              deleteIcon.className = "fa-solid fa-trash fa-fw";
              deleteButton.append(deleteIcon);

              // Create a table cell to hold the buttons  
              var buttonCell = document.createElement("td");
              buttonCell.className = "actions-cell";
              buttonCell.append(editButton);
              buttonCell.append(deleteButton);

              // Append the cell to the row
              row.append(buttonCell); 

              frag.append(row);

            })

            $('#personnelTableBody').append(frag);

            //Close Modal
            $('#filterEmployeeModal').modal("hide");
  
            //Make the filter button different color when filters selected
            $('#filterBtn').removeClass('btn-primary').addClass('btn-success');
      
          } else {
            //Close Modal
            $('#filterEmployeeModal').modal("hide");
  
            //Make the filter button different color when filters selected
            $('#filterBtn').removeClass('btn-primary').addClass('btn-success');

            var row = document.createElement("tr");

            var noResult = document.createElement("td");
            noResult.className = "text-center";
            var noResultText = document.createTextNode('No results found.');
            noResult.append(noResultText);
                
            row.append(noResult);
            frag.append(row);
            $('#personnelTableBody').append(frag);
          }
        }
      })
  })

  /*DISPLAY EMPLOYEE DATA*/
  function displayPersonnel() {
    $.ajax({
      url: "http://localhost:8080/itcareerswitch/project2/libs/php/GET/getAll.php",
      type: 'GET',
      dataType: 'json',
      success: function (result) {
        if (result.status.code === '200')  {
          const personnelData = result.data;
          var frag = document.createDocumentFragment();
         
          personnelData.forEach(person => {
            var row = document.createElement("tr");
                       
            var id = document.createElement("td");
            id.classList.add("hidden-id");
            id.setAttribute("data-id", person.id);
            id.textContent = person.id;
            row.appendChild(id);
            
            var name = document.createElement("td");
            name.classList.add("name-cell");
            var nameText = document.createTextNode(`${person.lastName}, ${person.firstName}`);
            name.append(nameText);
            
            row.append(name);

            var department = document.createElement("td");
            department.classList.add("department-cell");
            var departmentName = document.createTextNode(person.department || 'N/A');
            department.append(departmentName);
            
            row.append(department);

            var location = document.createElement("td");
            location.classList.add("location-cell");
            var locationName = document.createTextNode(person.location || 'N/A');
            location.append(locationName);
            
            row.append(location);

            var jobTitle = document.createElement("td");
            jobTitle.classList.add("job-title-cell");
            var jobTitleName = document.createTextNode(person.jobTitle || 'N/A');
            jobTitle.append(jobTitleName);
            
            row.append(jobTitle);  
            
            var email = document.createElement("td");
            email.classList.add("email-cell");
            var emailName = document.createTextNode(person.email || 'N/A');
            email.append(emailName);
            
            row.append(email);     
            
            // Create the Modify button
            var editButton = document.createElement("button");
            editButton.className = "btn btn-primary btn-sm editBtn";
            editButton.setAttribute("data-bs-toggle", "modal");
            editButton.setAttribute("data-bs-target", "#editPersonnelModal");
            editButton.setAttribute("data-id", person.id);

            // Add the Font Awesome icon inside the button
            var editIcon = document.createElement("i");
            editIcon.className = "fa-solid fa-pencil fa-fw";
            editButton.append(editIcon);

            // Create the Delete button
            var deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-primary btn-sm";
            deleteButton.setAttribute("data-bs-toggle", "modal");
            deleteButton.setAttribute("data-bs-target", "#areYouSurePersonnelModal");
            deleteButton.setAttribute("data-id", person.id);

            // Add the Font Awesome icon inside the button
            var deleteIcon = document.createElement("i");
            deleteIcon.className = "fa-solid fa-trash fa-fw";
            deleteButton.append(deleteIcon);

            // Create a table cell to hold the buttons  
            var buttonCell = document.createElement("td");
            buttonCell.className = "actions-cell";
            buttonCell.append(editButton);
            buttonCell.append(deleteButton);

            // Append the cell to the row
            row.append(buttonCell); 

            frag.append(row);

          });                
        
          $('#personnelTableBody').append(frag);
        }
    },
    error: function(xhr, status, error) {
      console.error('Error loading data: ', error);
      console.log("Response:", xhr.responseText);
    }
    })
  }
  displayPersonnel();

  /*DISPLAY DEPARTMENT DATA*/
  function displayDepartment() {
    $.ajax({
      url: "http://localhost:8080/itcareerswitch/project2/libs/php/GET/getAllDepartmentsDisplay.php",
      type: 'GET',
      dataType: 'json',
      success: function (result) {

        if (result.status.code === '200')  {
            const departmentData = result.data;
            var frag = document.createDocumentFragment();
         
            departmentData.forEach(department => {
            var row = document.createElement("tr");
                       
            var id = document.createElement("td");
            id.classList.add("hidden-id");
            id.setAttribute("data-id", department.id);
            id.textContent = department.id;
            row.appendChild(id);
            
            var name = document.createElement("td");
            name.classList.add("name-cell");
            var nameText = document.createTextNode(department.department);
            name.append(nameText);
            
            row.append(name);

            var location = document.createElement("td");
            var locationName = document.createTextNode(department.location || 'N/A');
            location.append(locationName);
            
            row.append(location);  
            
            // Create the Modify button
            var editButton = document.createElement("button");
            editButton.className = "btn btn-primary btn-sm editBtn";
            editButton.setAttribute("data-bs-toggle", "modal");
            editButton.setAttribute("data-bs-target", "#editDepartmentModal");
            editButton.setAttribute("data-id", department.id);

            // Add the Font Awesome icon inside the button
            var editIcon = document.createElement("i");
            editIcon.className = "fa-solid fa-pencil fa-fw";
            editButton.append(editIcon);

            // Create the Delete button
            var deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-primary btn-sm";
            deleteButton.setAttribute("data-id", department.id);
            deleteButton.setAttribute("onclick", `checkDepartmentBeforeDelete(${department.id}, '${department.department}')`);

            // Add the Font Awesome icon inside the button
            var deleteIcon = document.createElement("i");
            deleteIcon.className = "fa-solid fa-trash fa-fw";
            deleteButton.append(deleteIcon);

            // Create a table cell to hold the buttons  
            var buttonCell = document.createElement("td");
            buttonCell.className = "actions-cell";
            buttonCell.append(editButton);
            buttonCell.append(deleteButton);

            // Append the cell to the row
            row.append(buttonCell); 

            frag.append(row);

          });                
        
          $('#departmentTableBody').append(frag);
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
  }


    /*DISPLAY LOCATION DATA*/
    function displayLocation() {
      $.ajax({
        url: "http://localhost:8080/itcareerswitch/project2/libs/php/GET/getAllLocations.php",
        type: 'GET',
        dataType: 'json',
        success: function (result) {

          if (result.status.code === '200')  {
            const locationData = result.data;
            var frag = document.createDocumentFragment();
         
            locationData.forEach(location => {

            var row = document.createElement("tr");
                       
            var id = document.createElement("td");
            id.classList.add("hidden-id");
            id.setAttribute("data-id", location.id);
            id.textContent = location.id;
            row.appendChild(id);
            
            var name = document.createElement("td");
            name.classList.add("name-cell");
            var nameText = document.createTextNode(location.location);
            name.append(nameText);
            
            row.append(name);

            // Create the Modify button
            var editButton = document.createElement("button");
            editButton.className = "btn btn-primary btn-sm editBtn";
            editButton.setAttribute("data-bs-toggle", "modal");
            editButton.setAttribute("data-bs-target", "#editLocationModal");
            editButton.setAttribute("data-id", location.id);

            // Add the Font Awesome icon inside the button
            var editIcon = document.createElement("i");
            editIcon.className = "fa-solid fa-pencil fa-fw";
            editButton.append(editIcon);

            // Create the Delete button
            var deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-primary btn-sm";
            deleteButton.setAttribute("data-id", location.id);
            deleteButton.setAttribute("onclick", `checkLocationBeforeDelete(${location.id}, '${location.location}')`);

            // Add the Font Awesome icon inside the button
            var deleteIcon = document.createElement("i");
            deleteIcon.className = "fa-solid fa-trash fa-fw";
            deleteButton.append(deleteIcon);

            // Create a table cell to hold the buttons  
            var buttonCell = document.createElement("td");
            buttonCell.className = "actions-cell";
            buttonCell.append(editButton);
            buttonCell.append(deleteButton);

            // Append the cell to the row
            row.append(buttonCell); 

            frag.append(row);
          });                
          $('#locationTableBody').append(frag);
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
  }

  /*ADD PERSONNEL*/
  /*Populate department selection in addPersonnelModal*/
  $('#addPersonnelModal').on('show.bs.modal', function() {
    const $select = $('#addPersonnelDepartment');
    $select.empty(); // Clear previous options to not show the dep in duplicate
    
    $.ajax({
      url: "http://localhost:8080/itcareerswitch/project2/libs/php/GET/getAllDepartments.php",
      type: 'GET',
      dataType: 'json',
      success: function (result) {

        if (result.status.code === '200')  {
          $.each(result.data, function(index, department) {
            $select.append(
              $('<option>', {
                value: department.id,
                text: department.name
              })
            );
          })
        } else {
          alert('Error loading departments');
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
  })

  $('#addPersonnelForm').on('submit', function(event) {
    event.preventDefault(); // Prevent the form submission (page reload)

    const newFirstName = $('#addPersonnelFirstName').val();
    const newLastName = $('#addPersonnelLastName').val();
    const newJobTitle = $('#addPersonnelJobTitle').val();
    const newEmail = $('#addPersonnelEmailAddress').val();
    const newDepartment = $('#addPersonnelDepartment').val();

    if (newFirstName, newLastName, newJobTitle, newEmail, newDepartment) {
    $.ajax({
      url: 'http://localhost:8080/itcareerswitch/project2/libs/php/INSERT/insertPersonnel.php',
      type: 'POST',
      dataType: 'json',
      data : {
        firstName: newFirstName,
        lastName: newLastName,
        jobTitle: newJobTitle,
        email: newEmail,
        departmentID: newDepartment
      },
      success: function(result) {
        if (result.status.code === '200') {

          //Reset the form inputs
          $('#addPersonnelFirstName').val('');
          $('#addPersonnelLastName').val('');
          $('#addPersonnelJobTitle').val('');
          $('#addPersonnelEmailAddress').val('');
          $('#addPersonnelDepartment').val('');

          //Close Modal
          $('#addPersonnelModal').modal("hide");
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
    } else {
      alert('Please fill in all the informations needed.');
    }
  })

  /*ADD DEPARTMENTS*/
  /*Populate location selection in addDepartmentModal*/
  $('#addDepartmentModal').on('show.bs.modal', function() {
    const $select = $('#addDepartmentLocation');
    $select.empty(); // Clear previous options to not show the loc in duplicate

    $.ajax({
      url: "http://localhost:8080/itcareerswitch/project2/libs/php/GET/getAllLocations.php",
      type: 'GET',
      dataType: 'json',
      success: function (result) {

        if (result.status.code === '200')  {
          $.each(result.data, function(index, location) {
            $select.append(
              $('<option>', {
                value: location.id,
                text: location.location
              })
            );
          })
        } else {
          alert('Error loading locations');
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
  })

  $('#addDepartmentForm').on('submit', function(event) {
    event.preventDefault(); // Prevent the form submission (page reload)

    const newDepartment = $('#addDepartmentName').val();
    const departmentLocation = $('#addDepartmentLocation').val();

    if (newDepartment && departmentLocation) {
    $.ajax({
      url: 'http://localhost:8080/itcareerswitch/project2/libs/php/INSERT/insertDepartment.php',
      type: 'POST',
      dataType: 'json',
      data : {
        name: newDepartment,
        locationID: departmentLocation
      },
      success: function(result) {
        if (result.status.code === '200') {

          //Reset the form inputs
          $('#addDepartmentName').val('');
          $('#addDepartmentLocation').val('');

          //Close Modal
          $('#addDepartmentModal').modal("hide");
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
    }
  })

  /*ADD LOCATIONS*/
  $('#addLocationForm').on('submit', function(event) {
    event.preventDefault(); // Prevent the form submission (page reload)

    const newLocation = $('#addLocationName').val();

    if (newLocation) {
    $.ajax({
      url: 'http://localhost:8080/itcareerswitch/project2/libs/php/INSERT/insertLocations.php',
      type: 'POST',
      dataType: 'json',
      data : {
        name: newLocation,
      },
      success: function(result) {
        if (result.status.code === '200') {
          //Reset the form inputs
          $('#addLocationName').val('');

          //Close Modal
          $('#addLocationModal').modal("hide");
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
    }
  })

  /*MODIFY EMPLOYEE*/
  $("#editPersonnelModal").on("show.bs.modal", function (e) {

    $.ajax({
      url:"http://localhost:8080/itcareerswitch/project2/libs/php/GET/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        // Retrieve the data-id attribute from the calling button
        // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
        // for the non-jQuery JavaScript alternative
        id: $(e.relatedTarget).attr("data-id") 
      },
      success: function (result) {
        var resultCode = result.status.code;

        if (resultCode == 200) {
          
          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted
  
          $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
  
          $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
          $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
          $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
          $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
  
          $("#editPersonnelDepartment").html("");
  
          $.each(result.data.department, function () {
            $("#editPersonnelDepartment").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          });
  
          $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
          
        } else {
          $("#editPersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
  });
  
  // Executes when the form button with type="submit" is clicked
  $("#editPersonnelForm").on("submit", function (event) {
    event.preventDefault(); // Prevent the form submission (page reload)

    const id = $('#editPersonnelEmployeeID').val();
    const firstName = $('#editPersonnelFirstName').val();
    const lastName = $('#editPersonnelLastName').val();
    const jobTitle = $('#editPersonnelJobTitle').val();
    const email = $('#editPersonnelEmailAddress').val();
    const department = $('#editPersonnelDepartment').val();

    $.ajax({
      url: 'http://localhost:8080/itcareerswitch/project2/libs/php/UPDATE/updatePersonnel.php',
      type: 'POST',
      dataType: 'json',
      data : {
        id: id,
        firstName: firstName,
        lastName: lastName,
        jobTitle: jobTitle,
        email: email,
        departmentID: department
      },
      success: function(result) {
        if (result.status.code === '200') {
          //Close Modal
          $('#editPersonnelModal').modal("hide");
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
  });

  /*MODIFY DEPARTMENT*/
  $("#editDepartmentModal").on("show.bs.modal", function (e) {

    $.ajax({
      url:"http://localhost:8080/itcareerswitch/project2/libs/php/GET/getDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        // Retrieve the data-id attribute from the calling button
        // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
        // for the non-jQuery JavaScript alternative
        id: $(e.relatedTarget).attr("data-id") 
      },
      success: function (result) {
        var resultCode = result.status.code;
        console.log(result);

        if (resultCode == 200) {

          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted
  
          $("#editDepartmentID").val(result.data.department[0].department_id);
          $("#editDepartmentName").val(result.data.department[0].department_name);
  
          $("#editDepartmentLocation").html("");
  
          $.each(result.data.location, function () {
            $("#editDepartmentLocation").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          });
  
          $("#editDepartmentLocation").val(result.data.department[0].location_id);
          
        } else {
          $("#editDepartmentModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editDepartmentModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
  });
  
  // Executes when the form button with type="submit" is clicked
  $("#editDepartmentForm").on("submit", function (event) {
    event.preventDefault(); // Prevent the form submission (page reload)

    const id = $('#editDepartmentID').val();
    const departmentName = $('#editDepartmentName').val();
    const locationID = $('#editDepartmentLocation').val();

    $.ajax({
      url: 'http://localhost:8080/itcareerswitch/project2/libs/php/UPDATE/updateDepartment.php',
      type: 'POST',
      dataType: 'json',
      data : {
        id: id,
        name: departmentName,
        locationID: locationID
      },
      success: function(result) {
        if (result.status.code === '200') {
          //Close Modal
          $('#editDepartmentModal').modal("hide");
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
  });


  /*MODIFY LOCATION*/
  $("#editLocationModal").on("show.bs.modal", function (e) {

    $.ajax({
      url:"http://localhost:8080/itcareerswitch/project2/libs/php/GET/getLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        // Retrieve the data-id attribute from the calling button
        // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
        // for the non-jQuery JavaScript alternative
        id: $(e.relatedTarget).attr("data-id") 
      },
      success: function (result) {
        var resultCode = result.status.code;

        if (resultCode == 200) {
          
          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted
  
          $("#editLocationID").val(result.data[0].id);
          $("#editLocationName").val(result.data[0].name);
          
        } else {
          $("#editLocationModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editLocationModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
  });
  
  // Executes when the form button with type="submit" is clicked
  $("#editLocationForm").on("submit", function (event) {
    event.preventDefault(); // Prevent the form submission (page reload)

    const id = $('#editLocationID').val();
    const editLocation = $('#editLocationName').val();

    $.ajax({
      url: 'http://localhost:8080/itcareerswitch/project2/libs/php/UPDATE/updateLocations.php',
      type: 'POST',
      dataType: 'json',
      data : {
        id: id,
        name: editLocation
      },
      success: function(result) {
        if (result.status.code === '200') {
          //Close Modal
          $('#editLocationModal').modal("hide");
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
  });

  /*DELETE PERSONNEL*/
  $("#areYouSurePersonnelModal").on("show.bs.modal", function (e) {
    $.ajax({
      url:"http://localhost:8080/itcareerswitch/project2/libs/php/GET/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        // Retrieve the data-id attribute from the calling button
        // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
        // for the non-jQuery JavaScript alternative
        id: $(e.relatedTarget).attr("data-id") 
      },
      success: function (result) {
        var resultCode = result.status.code;

        if (resultCode == 200) {
          
          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted
          $("#areYouSurePersonnelID").val(result.data.personnel[0].id);
          $("#areYouSurePersonnelName").html("<p><strong>" + result.data.personnel[0].lastName + ", " + result.data.personnel[0].firstName + "</strong></p>");

        } else {
          $("#areYouSurePersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#areYouSurePersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
  })

  // Executes when the form button with type="submit" is clicked
  $("#areYouSurePersonnelForm").on("submit", function (event) {
    event.preventDefault(); // Prevent the form submission (page reload)

    const id = $('#areYouSurePersonnelID').val();

    $.ajax({
      url: 'http://localhost:8080/itcareerswitch/project2/libs/php/DELETE/deletePersonnelByID.php',
      type: 'POST',
      dataType: 'json',
      data : {
        id: id,
      },
      success: function(result) {
        if (result.status.code === '200') {
          //Close Modal
          $('#areYouSurePersonnelModal').modal("hide");
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
  });
}); //document.ready

//Check if department has employees and show modal
function checkDepartmentBeforeDelete(departmentId, departmentName) {

  $.ajax({
    url: "http://localhost:8080/itcareerswitch/project2/libs/php/COUNT/countPersonnel.php",
    type: 'GET',
    dataType: 'json',
    data: {
      id: departmentId,
    },
    success: function (result) {

        if (result.data.department.employee_count.employee_count > 0) {
          $('#cantDeleteDeptName').text(departmentName);
          $('#personnelCount').text(result.data.department.employee_count.employee_count);
          $('#cantDeleteDepartmentModal').modal('show');
        } else {
          $('#areYouSureDeptName').text(departmentName); // Set department name dynamically
          $('#deleteDepartmentID').val(departmentId); // Set department ID for deletion
          $('#areYouSureDeleteDepartmentModal').modal('show');
        }
    },
    error: function(xhr, status, error) {
      console.error("Ajax Error: ", status, error);
      console.log("Full Response: ", xhr.responseText);
    }
  })

  // Executes when the form button with type="submit" is clicked
  $("#deleteDepartmentForm").on("submit", function (event) {
    event.preventDefault(); // Prevent the form submission (page reload)

    const id = $('#deleteDepartmentID').val();

    $.ajax({
      url: 'http://localhost:8080/itcareerswitch/project2/libs/php/DELETE/deleteDepartmentByID.php',
      type: 'POST',
      dataType: 'json',
      data : {
        id: id,
      },
      success: function(result) {
        if (result.status.code === '200') {
          //Close Modal
          $('#areYouSureDeleteDepartmentModal').modal("hide");
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
  })
}

//Check if location has employees and show modal
function checkLocationBeforeDelete(locationId, locationName) {

  $.ajax({
    url: "http://localhost:8080/itcareerswitch/project2/libs/php/COUNT/countDepartment.php",
    type: 'GET',
    dataType: 'json',
    data: {
      id: locationId,
    },
    success: function (result) {

        if (result.data.location.department_count.department_count > 0) {
          $('#cantDeleteLocName').text(locationName);
          $('#departmentCount').text(result.data.location.department_count.department_count);
          $('#cantDeleteLocationModal').modal('show');
        } else {
          $('#areYouSureLocName').text(locationName); // Set department name dynamically
          $('#deleteLocationID').val(locationId); // Set department ID for deletion
          $('#areYouSureDeleteLocationModal').modal('show');
        }
    },
    error: function(xhr, status, error) {
      console.error("Ajax Error: ", status, error);
      console.log("Full Response: ", xhr.responseText);
    }
  })

  // Executes when the form button with type="submit" is clicked
  $("#deleteLocationForm").on("submit", function (event) {
    event.preventDefault(); // Prevent the form submission (page reload)

    const id = $('#deleteLocationID').val();

    $.ajax({
      url: 'http://localhost:8080/itcareerswitch/project2/libs/php/DELETE/deleteLocationByID.php',
      type: 'POST',
      dataType: 'json',
      data : {
        id: id,
      },
      success: function(result) {
        if (result.status.code === '200') {
          //Close Modal
          $('#areYouSureDeleteLocationModal').modal("hide");
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
  })
}