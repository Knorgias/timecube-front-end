   function registerUser(){
        var registration = {};
        registration.emailAddress = document.getElementById("email").value;
        registration.username = document.getElementById("username").value;
        registration.password = document.getElementById("password").value;
        registration.role = document.getElementById("role-select").value;
        registration.hourlyWage = document.getElementById("hourly-wage").value;
        registration.daysOff = document.getElementById("daysoff").value;
        registration.firstName = document.getElementById("name").value;
        registration.lastName = document.getElementById("surname").value;
        registration = JSON.stringify(registration);
        ajaxData("POST", "http://localhost:8083/register", callbackRegistration, registration);
    }
    function callbackRegistration(response){
        if(response.statusCode == 0){
            document.location = '/index.html';
        } else {
            console.log(response);
            alert("Not registered");
        }
    }
    // For my-daily-hours get-table
    function loadAllDataDailyHours(userId){
        ajaxData("GET", "http://localhost:8083/employee/"+userId+"/overviewHours", callbackGetAllHours, "");
    }
    function callbackGetAllHours(data){
        console.log("callbackGetAllHours");
        console.log(data);
        for(var x=0;x<data.length; x++){
            document.getElementById("hoursData").innerHTML = document.getElementById("hoursData").innerHTML + 
            "<tr><td>"+data[x].date+
            "</td><td>"+data[x].message+
            "</td><td>"+data[x].hours+
            "</td><td>"+data[x].workplace+
            "</td><td>"+data[x].employeeId+
            "</td><td>"+data[x].activity+
            '</td><td><button type="button" class="btn btn-success">OK</button>'+
            "</td></tr>";
        }
    }
    function createWorkdayRow(){}

    function callbackSubmitHours(data){
        document.location = '/my-daily-hours.html'; 
    }
    // For my-daily-hours get-table END
    function saveDayInfo(){
        var selectedDate = document.getElementById("myDate").value;
        if(selectedDate == ""){
            alert("Select a Date");
            return;
        }
        var dateObject = new Date(selectedDate);
        var dateForPost = ("0" + dateObject.getDate()).slice(-2)+"/"+("0" + (dateObject.getMonth()+1)).slice(-2)+"/"+dateObject.getFullYear();
        shData = {};
        shData.date = dateForPost;
        shData.activity = document.getElementById("activity-select").value;
        shData.workplace = document.getElementById("employer-select").value
        shData.hours = document.getElementById("hours-select").value;
        shData.employeeId = sessionStorage.getItem("loginUserDetails");
        shData = JSON.stringify(shData);
        ajaxData("POST", "http://localhost:8083/submitHours", callbackSubmitHours, shData);
    }
    function checkSessionLogin(origin){
        var codeword = "approved";
        var loginStatus = sessionStorage.getItem("loginDetails");  
        var loginId = sessionStorage.getItem("loginUserDetails");  
        if(origin == "index" && loginStatus == codeword+""+loginId){
          document.location = '/my-days-overview.html'; 
        }
        if(origin != "index" && loginStatus != codeword+""+loginId){
            document.location = '/index.html'; 
        }
  
    }
    function loginUser(){
      var loginData={};
      loginData.username = document.getElementById("username").value;
      loginData.password = document.getElementById("password").value;
      loginData = JSON.stringify(loginData);
      ajaxData("POST", "http://localhost:8083/login", callbackLoginResponse, loginData);
    }
    function logoutUser(){
        sessionStorage.setItem("loginDetails","loggedout");  
        document.location = '/index.html'; 
    }
    function callbackLoginResponse(response){
      if(response.statusCode == 0){
        document.location = '/my-days-overview.html'; 
        sessionStorage.setItem("loginDetails","approved"+response.id);       
        sessionStorage.setItem("loginUserDetails",response.id);       
      }
      if(response.statusCode == 1){
        alert("You are not logged in correct");
      }
    }
   function ajaxData(typeRequest, url, callback, objectToSend){
        $.ajax({
        url: url,
        data: objectToSend,
        type: typeRequest,
        beforeSend: function(xhr){xhr.setRequestHeader('Content-type', 'application/json');},
        success: function(data) { callback(data); }
      });
    }