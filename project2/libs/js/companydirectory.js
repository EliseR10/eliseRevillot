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
  
  $("#personnelBtn").click(function () {
    
    // Call function to refresh personnel table
    
  });
  
  $("#departmentsBtn").click(function () {
    
    // Call function to refresh department table
    
  });
  
  $("#locationsBtn").click(function () {
    
    // Call function to refresh location table
    
  });
  
  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    
    $.ajax({
      url:
        "./php/companydirectory/libs/php/getPersonnelByID.php",
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
  
  $("#editPersonnelForm").on("submit", function (e) {
    
    // Executes when the form button with type="submit" is clicked
    // stop the default browser behviour
  
    e.preventDefault();
  
    // AJAX call to save form data
    
  });

/*Get all data*/
$(document).ready(function() {
  $.ajax({
    url: "http://localhost:8080/itcareerswitch/project2/libs/php/getAll.php",
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
          const $Department = $('<td class="align-middle text-nowrap"></td>').text(`${person.department}`);
          const $Location = $('<td class="align-middle text-nowrap"></td>').text(`${person.location}`);
          const $JobTitle = $('<td class="align-middle text-nowrap"></td>').text(`${person.jobTitle}`);
          const $Email = $('<td class="align-middle text-nowrap"></td>').text(`${person.email}`);
          const $buttonCell = $('<td class="align-middle text-nowrap"></td>');

          //Modify Button
          const $editButton = $('<button class="btn btn-primary btn-sm button-spacing" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="' + person.id + '"></button>');
          $editButton.append('<i class="fa-solid fa-pencil fa-fw"></i>');

          //Delete Button
          const $deleteButton = $('<button class="btn btn-primary btn-sm button-spacing" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="' + person.id + '"></button>');
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
})
