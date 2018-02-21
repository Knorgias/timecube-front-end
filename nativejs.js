    var baseurl = "http://localhost:8083";
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
        ajaxData("POST", baseurl +"/register", callbackRegistration, registration);
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
        console.log("userId:"+userId+":url:"+baseurl);
        ajaxData("GET", baseurl +"/employee/"+userId+"/overviewHours/0", callbackGetAllHours, "");
    }
    function callbackGetAllHours(data){
        console.log("callbackGetAllHours");
        console.log(data);
        for(var x=0;x<data.length; x++){
            document.getElementById("hoursData").innerHTML = document.getElementById("hoursData").innerHTML + 
            "<tr><td>"+data[x].date+
            "</td><td>"+data[x].finalized+
            "</td><td>"+data[x].hours+
            "</td><td>"+data[x].workplace+
            "</td><td>"+data[x].employeeId+
            "</td><td>"+data[x].activity+
            '</td><td><button type="button" class="btn btn-success" onclick="finalizeHours(\''+data[x].date+'\','+data[x].employeeId+')">OK</button>'+
            "</td></tr>";
        }
    }
    function finalizeHours(workdate, employeeId){
        workdayData = {};
        workdayData.date = workdate;
        workdayData.employeeId = employeeId;
        workdayData.finalized = true;
        workdayData = JSON.stringify(workdayData);
        ajaxData("POST", baseurl +"/submitHours", callbackFinalizeHours, workdayData);
    }
    function callbackFinalizeHours(data){
        console.log(data);
        document.location = '/my-daily-hours.html';
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
        ajaxData("POST", baseurl +"/submitHours", callbackSubmitHours, shData);
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
      ajaxData("POST", baseurl +"/login", callbackLoginResponse, loginData);
    }
    function logoutUser(){
        sessionStorage.setItem("loginDetails","loggedout");  
        document.location = '/index.html'; 
    }
    function callbackLoginResponse(response){
      if(response.statusCode == 0){
        sessionStorage.setItem("loginDetails","approved"+response.id);       
        sessionStorage.setItem("loginUserDetails",response.id);
        sessionStorage.setItem("roleInfo", response.role);
        sessionStorage.setItem("loginUserInfo", response);
        document.location = '/my-days-overview.html';
    
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