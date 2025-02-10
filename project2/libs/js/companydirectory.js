$(document).ready(function() {
  //Disable search bar if department or location tab open
  $('.nav-link').on('click', function() {
    let activeTab = $('.nav-link.active').attr('id'); //grab the id of the current active tab

    if (activeTab === 'departmentsBtn' || activeTab === 'locationsBtn') {
      $('#searchInp').prop('disabled', true);
    } else {
      $('#searchInp').prop('disabled', false);
    }
  });

  /*SEARCH BAR FOR PERSONNEL*/
  $("#searchInp").on("keyup", function () {
    let searchTerm = $(this).val().trim(); //get search input value
    console.log(searchTerm);

    if (searchTerm.length > 0) {
      $.ajax({
        url: "http://localhost:8080/itcareerswitch/project2/libs/php/SearchAll.php",
        type: "GET",
        dataType: "json",
        data: { txt: searchTerm },
        success: function (result) {
          console.log("Filtered: ", result);

          if(result.status.code == 200) {
            let resultsArray = result.data.found;

            const $personnelTableBody = $('#personnelTableBody');
            $personnelTableBody.empty(); //clear the table before displaying new results

            if (resultsArray.length > 0) {
              $.each(result.data.found, function(index, person) {
                //create a new row and its columns
                const $tr = $('<tr></tr>');

                //column for Name/Department/Location/JobTitle/Email/Buttons
                const $Name = $('<td class="align-middle text-nowrap"></td>').text(`${person.lastName}, ${person.firstName}`);
                const $Department = $('<td class="align-middle text-nowrap d-none d-md-table-cell"></td>').text(`${person.departmentName}`);
                const $Location = $('<td class="align-middle text-nowrap d-none d-md-table-cell"></td>').text(`${person.locationName}`);
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
            } else {
              //If no result found, display a message
              $personnelTableBody.append('<tr><td colspan="6" class="text-center">No results found.</td></tr>');
            }
          }
        } 
      })
    } else {
      // If search is empty, reload all data
      $.ajax({
        url: "http://localhost:8080/itcareerswitch/project2/libs/php/GET/getAll.php",
        type: 'GET',
        dataType: 'json',
        success: function (result) {
          if (result.status.code === '200')  {
            const $personnelTableBody = $('#personnelTableBody');
            
            $personnelTableBody.empty(); //clear the table before displaying new results

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
    }
  });

  //Clear the input when the user clicks outside
  $('#searchInp').on("blur", function() {
    $(this).val("");
  })

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
      });
      
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

  /*$("#personnelBtn").click(function () {
    
    // Call function to refresh personnel table
    refreshPersonnelTable();
  });
  
  $("#departmentsBtn").click(function () {
    refreshDepartmentsTable();
  });

  $("#locationsBtn").click(function () {
    
    // Call function to refresh location table
    refreshLocationsTable();
  });*/


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

  /*DELETE PERSONNEL*/
  $("#deletePersonnelModal").on("show.bs.modal", function (e) {
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
          $("#deletePersonnelID").val(result.data.personnel[0].id);
          $("#deleteName").html("<p><strong>" + result.data.personnel[0].lastName + ", " + result.data.personnel[0].firstName + "</strong></p>");

        } else {
          $("#deletePersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#deletePersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
  })

  // Executes when the form button with type="submit" is clicked
  $("#deletePersonnelForm").on("submit", function (event) {
    event.preventDefault(); // Prevent the form submission (page reload)

    const id = $('#deletePersonnelID').val();

    $.ajax({
      url: 'http://localhost:8080/itcareerswitch/project2/libs/php/DELETE/deletePersonnelByID.php',
      type: 'POST',
      dataType: 'json',
      data : {
        id: id,
      },
      success: function(result) {
        if (result.status.code === '200') {
          alert('Personnel deleted successfully.');

          //Close Modal
          $('#deletePersonnelModal').modal("hide");
        } else {
          alert('Error deleting personnel.');
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
  });

  /*DELETE DEPARTMENTS*/
  $("#deleteDepartmentModal").on("show.bs.modal", function (e) {
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
          $("#deleteDepartmentID").val(result.data.department[0].department_id);

          if(result.data.department.employee_count > 0) {
            $('#deleteDepartmentForm').html("<p>You cannot delete <strong>" + result.data.department[0].department_name + "</strong> from the departments at this moment.</p><p>This department has <strong>" + result.data.department.employee_count + " employee(s)</strong> assigned to it.</p>");
            $('.btn-submit-delete').prop("disabled", true); //disable the delete button
          } else {
            $('#deleteDepartmentForm').html("<p>Are you sure you want to delete the following department? </p>" + "<p><strong>" + result.data.department[0].department_name + "</strong></p>");
            $(".btn-submit-delete").prop("disabled", false);
          }

        } else {
          $("#deleteDepartmentModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#deleteDepartmentModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
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
          alert('Department deleted successfully.');

          //Close Modal
          $('#deleteDepartmentModal').modal("hide");
        } else {
          alert('Error deleting department.');
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
  });

  /*DELETE LOCATIONS*/
  $("#deleteLocationModal").on("show.bs.modal", function (e) {
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
          $("#deleteLocationID").val(result.data[0].id);

          if(result.data.department_count > 0) {
            $('#deleteLocationForm').html("<p>You cannot delete <strong>" + result.data[0].name + "</strong> from the location at this moment.</p><p>This location has <strong>" + result.data.department_count + " department(s)</strong> assigned to it.</p>");
            $('.btn-submit-delete').prop("disabled", true); //disable the delete button
          } else {
            $('#deleteLocationForm').html("<p>Are you sure you want to delete the following location? </p>" + "<p><strong>" + result.data[0].name + "</strong></p>");
            $(".btn-submit-delete").prop("disabled", false);
          }
          
        } else {
          $("#deleteLocationModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#deleteLocationModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
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
          alert('Location deleted successfully.');

          //Close Modal
          $('#deleteLocationModal').modal("hide");
        } else {
          alert('Error deleting location.');
        }
      },
      error: function(xhr, status, error) {
        console.error('Error loading data: ', error);
        console.log("Response:", xhr.responseText);
      }
    })
  });

}); //document.ready