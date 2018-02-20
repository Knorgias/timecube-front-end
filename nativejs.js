    function loadAllDataDailyHours(userId){
        ajaxData("GET", "http://localhost:8083/employee/"+userId+"/overviewHours", callbackGetAllHours, "");
    }
    function callbackGetAllHours(data){
        console.log("callbackGetAllHours");
        console.log(data);
        for(var x=0;x<data.length; x++){
            document.getElementById("hoursData").innerHTML = document.getElementById("hoursData").innerHTML + 
            "<tr><td>"+data[x].date+"</td><td>"+data[x].message+"</td><td>"+data[x].hours+"</td></tr>";
        }
    }
    function callbackSubmitHours(data){
        document.location = '/my-daily-hours.html'; 
    }
    function saveDayInfo(){
        var selectedDate = document.getElementById("myDate").value;
        if(selectedDate == ""){
            alert("Select a Date");
            return;
        }
        var dateObject = new Date(selectedDate);
        var dateForPost = ("0" + dateObject.getDate()).slice(-2)+"/"+("0" + (dateObject.getMonth()+1)).slice(-2)+"/"+dateObject.getFullYear();
//        var dateForPost = dateObject.getDate()+"/"+(dateObject.getMonth()+1)+"/"+dateObject.getFullYear();
        shData = {};
        shData.date = dateForPost;
        shData.employeeId = sessionStorage.getItem("loginUserDetails");
//        shData.hours = document.getElementById("activity-select").value;
//        shData.workplace = document.getElementById("employer-select").value
        shData = JSON.stringify(shData);
        ajaxData("POST", "http://localhost:8083/submitHours", callbackSubmitHours, shData);
    }
    function checkSessionLogin(origin){
        var codeword = "tellme";
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
    function callbackLoginResponse(response){
      if(response.statusCode == 0){
        document.location = '/my-days-overview.html'; 
        sessionStorage.setItem("loginDetails","tellme"+response.id);       
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