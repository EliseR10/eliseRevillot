$(document).ready(function() {
$("#searchInp").on("keyup", function () {
  
    // your code
    
});
  
$("#refreshBtn").click(function () {
    
  if ($("#personnelBtn").hasClass("active")) {
      
      // Refresh personnel table
      
  } else {
      
    if ($("#departmentsBtn").hasClass("active")) {
        
        // Refresh department table
        
    } else {
        
        // Refresh location table
        
    }
      
    }
    
});
  
  $("#filterBtn").click(function () {
    
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
    const modal = {
      personnelBtn: '#filterEmployeeModal',
      departmentsBtn: '#filterDepartmentModal',
      locationsBtn: '#filterLocationModal',
    };

    let activeTab = $('.nav-link.active').attr('id'); //grab the id of the current active tab

    if (activeTab && modal[activeTab]) {
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
  
  /*Refresh depending which tab is active*/
  $('#refreshBtn').click(function () {
    const modal = {
      personnelBtn: '#addPersonnelModal',
      departmentsBtn: '#addDepartmentModal',
      locationsBtn: '#addLocationModal',
    }

    let activeTab = $('.nav-link.active').attr('id');

    if (activeTab && modal[activeTab]) {
      switch (activeTab) {
        case 'personnelBtn':
          refreshPersonnelTable();
          break;
        case 'departmentsBtn':
          refreshDepartmentsTable();
          break;
        case 'locationsBtn':
          refreshLocationsTable();
          break;
        default:
          console.log('No active tab found');
        }
    }
  })
  

  /*$("#personnelBtn").click(function () {
    
    // Call function to refresh personnel table
    
  });
  
  $("#departmentsBtn").click(function () {
  
  });

  $("#locationsBtn").click(function () {
    
    // Call function to refresh location table
    
  });*/

  function refreshPersonnelTable() {
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
  
          $.each(result.data, function(index, person) {
            //create a new row and its columns
            const $tr = $('<tr></tr>');
  
            //column for Name/Department/Location/JobTitle/Email/Buttons
            const $Name = $('<td class="align-middle text-nowrap"></td>').text(`${person.lastName}, ${person.firstName}`);
            const $Department = $('<td class="align-middle text-nowrap d-none d-md-table-cell"></td>').text(`${person.department}`);
            const $Location = $('<td class="align-middle text-nowrap d-none d-md-table-cell"></td>').text(`${person.location}`);
            const $JobTitle = $('<td class="align-middle text-nowrap d-none d-md-table-cell"></td>').text(`${person.jobTitle}`);
            const $Email = $('<td class="align-middle text-nowrap d-none d-md-table-cell"></td>').text(`${person.email}`);
            const $buttonCell = $('<td class="text-end d-md-table-cell"></td>');
  
            //Modify Button
            const $editButton = $('<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="' + person.id + '"></button>');
            $editButton.append('<i class="fa-solid fa-pencil fa-fw"></i>');
  
            //Delete Button
            const $deleteButton = $('<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="' + person.id + '"></button>');
            $deleteButton.append('<i class="fa-solid fa-trash fa-fw"></i>');
  
            //Append the buttons to the button cell
            $buttonCell.append($editButton).append($deleteButton);
  
            //Append the columns to the row
            $tr.append($Name).append($Department).append($Location).append($JobTitle).append($Email).append($buttonCell);
  
            //Append the row to the table body
            $personnelTableBody.append($tr);
          })
          alert('Personnel table has been refreshed.');
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
  };

  function refreshDepartmentsTable() {
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

          $.each(result.data, function(index, department) {
            //create a new row and its columns
            const $tr = $('<tr></tr>');
  
            //column for Name/Department/Location/JobTitle/Email/Buttons
            const $Name = $('<td class="align-middle text-nowrap"></td>').text(`${department.department}`);
            const $Location = $('<td class="align-middle text-nowrap"></td>').text(`${department.location}`);
            const $buttonCell = $('<td class="text-end d-md-table-cell"></td>');
  
            //Modify Button
            const $editButton = $('<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="' + department.id + '"></button>');
            $editButton.append('<i class="fa-solid fa-pencil fa-fw"></i>');
  
            //Delete Button
            const $deleteButton = $('<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="' + department.id + '"></button>');
            $deleteButton.append('<i class="fa-solid fa-trash fa-fw"></i>');
  
            //Append the buttons to the button cell
            $buttonCell.append($editButton).append($deleteButton);
  
            //Append the columns to the row
            $tr.append($Name).append($Location).append($buttonCell);
  
            //Append the row to the table body
            $departmentTableBody.append($tr);
          })

          alert('Department table has been refreshed.');
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
  };
  
  function refreshLocationsTable() {
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

          $.each(result.data, function(index, location) {
            //create a new row and its columns
            const $tr = $('<tr></tr>');

            //column for Name/Department/Location/JobTitle/Email/Buttons
            const $Location = $('<td class="align-middle text-nowrap"></td>').text(`${location.location}`);
            const $buttonCell = $('<td class="text-end d-md-table-cell"></td>');

            //Modify Button
            const $editButton = $('<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="' + location.id + '"></button>');
            $editButton.append('<i class="fa-solid fa-pencil fa-fw"></i>');

            //Delete Button
            const $deleteButton = $('<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id="' + location.id + '"></button>');
            $deleteButton.append('<i class="fa-solid fa-trash fa-fw"></i>');

            //Append the buttons to the button cell
            $buttonCell.append($editButton).append($deleteButton);

            //Append the columns to the row
            $tr.append($Location).append($buttonCell);

            //Append the row to the table body
            $locationTableBody.append($tr);
          })
            alert('Locations Table has been refreshed.');
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
  }

/*DISPLAY EMPLOYEE DATA*/
  $.ajax({
    url: "http://localhost:8080/itcareerswitch/project2/libs/php/GET/getAll.php",
    type: 'GET',
    dataType: 'json',
    success: function (result) {
      if (result.status.code === '200')  {
        const $personnelTableBody = $('#personnelTableBody');

        $.each(result.data, function(index, person) {
          //create a new row and its columns
          const $tr = $('<tr></tr>');

          //column for Name/Department/Location/JobTitle/Email/Buttons
          const $Name = $('<td class="align-middle text-nowrap"></td>').text(`${person.lastName}, ${person.firstName}`);
          const $Department = $('<td class="align-middle text-nowrap d-none d-md-table-cell"></td>').text(`${person.department}`);
          const $Location = $('<td class="align-middle text-nowrap d-none d-md-table-cell"></td>').text(`${person.location}`);
          const $JobTitle = $('<td class="align-middle text-nowrap d-none d-md-table-cell"></td>').text(`${person.jobTitle}`);
          const $Email = $('<td class="align-middle text-nowrap d-none d-md-table-cell"></td>').text(`${person.email}`);
          const $buttonCell = $('<td class="text-end d-md-table-cell"></td>');

          //Modify Button
          const $editButton = $('<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="' + person.id + '"></button>');
          $editButton.append('<i class="fa-solid fa-pencil fa-fw"></i>');

          //Delete Button
          const $deleteButton = $('<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="' + person.id + '"></button>');
          $deleteButton.append('<i class="fa-solid fa-trash fa-fw"></i>');

          //Append the buttons to the button cell
          $buttonCell.append($editButton).append($deleteButton);

          //Append the columns to the row
          $tr.append($Name).append($Department).append($Location).append($JobTitle).append($Email).append($buttonCell);

          //Append the row to the table body
          $personnelTableBody.append($tr);
        })
      }
    },
    error: function(xhr, status, error) {
      console.error('Error loading data: ', error);
      console.log("Response:", xhr.responseText);
    }
  })


/*DISPLAY DEPARTMENT DATA*/
  $.ajax({
    url: "http://localhost:8080/itcareerswitch/project2/libs/php/GET/getAllDepartmentsDisplay.php",
    type: 'GET',
    dataType: 'json',
    success: function (result) {

      if (result.status.code === '200')  {
        const $departmentTableBody = $('#departmentTableBody');

        $.each(result.data, function(index, department) {
          //create a new row and its columns
          const $tr = $('<tr></tr>');

          //column for Name/Department/Location/JobTitle/Email/Buttons
          const $Name = $('<td class="align-middle text-nowrap"></td>').text(`${department.department}`);
          const $Location = $('<td class="align-middle text-nowrap"></td>').text(`${department.location}`);
          const $buttonCell = $('<td class="text-end d-md-table-cell"></td>');

          //Modify Button
          const $editButton = $('<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="' + department.id + '"></button>');
          $editButton.append('<i class="fa-solid fa-pencil fa-fw"></i>');

          //Delete Button
          const $deleteButton = $('<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="' + department.id + '"></button>');
          $deleteButton.append('<i class="fa-solid fa-trash fa-fw"></i>');

          //Append the buttons to the button cell
          $buttonCell.append($editButton).append($deleteButton);

          //Append the columns to the row
          $tr.append($Name).append($Location).append($buttonCell);

          //Append the row to the table body
          $departmentTableBody.append($tr);
        })
      }
    },
    error: function(xhr, status, error) {
      console.error('Error loading data: ', error);
      console.log("Response:", xhr.responseText);
    }
  })

  /*DISPLAY LOCATION DATA*/
  $.ajax({
    url: "http://localhost:8080/itcareerswitch/project2/libs/php/GET/getAllLocations.php",
    type: 'GET',
    dataType: 'json',
    success: function (result) {

      if (result.status.code === '200')  {
        const $locationTableBody = $('#locationTableBody');

        $.each(result.data, function(index, location) {
          //create a new row and its columns
          const $tr = $('<tr></tr>');

          //column for Name/Department/Location/JobTitle/Email/Buttons
          const $Location = $('<td class="align-middle text-nowrap"></td>').text(`${location.location}`);
          const $buttonCell = $('<td class="text-end d-md-table-cell"></td>');

          //Modify Button
          const $editButton = $('<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="' + location.id + '"></button>');
          $editButton.append('<i class="fa-solid fa-pencil fa-fw"></i>');

          //Delete Button
          const $deleteButton = $('<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id="' + location.id + '"></button>');
          $deleteButton.append('<i class="fa-solid fa-trash fa-fw"></i>');

          //Append the buttons to the button cell
          $buttonCell.append($editButton).append($deleteButton);

          //Append the columns to the row
          $tr.append($Location).append($buttonCell);

          //Append the row to the table body
          $locationTableBody.append($tr);
        })
      }
    },
    error: function(xhr, status, error) {
      console.error('Error loading data: ', error);
      console.log("Response:", xhr.responseText);
    }
  })

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
          alert('Employee added successfully.');

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

    console.log('Department name: ', newDepartment);
    console.log('Location: ', departmentLocation);

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
          alert('Department added successfully.');

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
    } else {
      alert('Please fill in both the department name and select a location.');
    }
  })

  /*ADD LOCATIONS*/
  $('#addLocationForm').on('submit', function(event) {
    event.preventDefault(); // Prevent the form submission (page reload)

    const newLocation = $('#addLocationName').val();

    console.log('Location: ', newLocation);

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

          alert('Location added successfully.');
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
    } else {
      alert('Please fill in the location.');
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
          alert('Employee updated successfully.');

          //Close Modal
          $('#editPersonnelModal').modal("hide");
        } else {
          alert('Error udpating employee.');
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
          alert('Department updated successfully.');

          //Close Modal
          $('#editDepartmentModal').modal("hide");
        } else {
          alert('Error udpating department.');
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
          alert('Location updated successfully.');

          //Close Modal
          $('#editLocationModal').modal("hide");
        } else {
          alert('Error udpating location.');
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
  });


}); //document.ready