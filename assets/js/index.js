$(document).ready(function() {

    var employeeName = $("#employeeName").val();
    var role = $("#role").val();
    var startDate = $("#startDate").val();
    var monthlyRate = $("#monthlyRate").val();
    
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCjtvd1OZm6BCpaJcFznRSvyIs1n9rS788",
        authDomain: "trainschedule-b0085.firebaseapp.com",
        databaseURL: "https://trainschedule-b0085.firebaseio.com",
        projectId: "trainschedule-b0085",
        storageBucket: "trainschedule-b0085.appspot.com",
        messagingSenderId: "566567800628"
      };
    
      firebase.initializeApp(config);
    
    var database = firebase.database();
    
    database.ref().on("child_added", function(snapshot) {
    
        console.log("This DB event function is firing");
    
        //dynamically create the HTML
        var tableBody = $("#tableBody")
        var newTable = $("<tr>");
        var tdEmployeeName = $("<td>");
        var tdRole = $("<td>");
        var tdStartDate = $("<td>");
        var tdMonthsWorked = $("<td>");
        var tdMonthlyRate = $("<td>");
        var tdTotalBilled = $("<td>");
    
        //Append all of the newly created divs to the right place
        tableBody.append(newTable);
        newTable.append(tdEmployeeName);
        newTable.append(tdRole);
        newTable.append(tdStartDate);
        newTable.append(tdMonthsWorked);
        newTable.append(tdMonthlyRate);
        newTable.append(tdTotalBilled);
    
        //Store what you get back from the DB
        employeeNameDB = snapshot.val().employeeName;
        roleDB = snapshot.val().role;
        startDateDB = snapshot.val().startDate;
        monthlyRateDB = snapshot.val().monthlyRate;
    
        //calculate months worked
        var momentFormat = "MM/DD/YYYY";
        var convertedDate = moment(startDateDB, momentFormat);
        var monthsWorked = moment(convertedDate).diff(moment(), "months");
        var monthsWorked = -monthsWorked;
        console.log(monthsWorked);
    
        //calculate total $ billed
        var totalBilled = monthsWorked * monthlyRateDB;
        console.log(totalBilled);
        
        //Add the DB data to the HTML
        tdEmployeeName.text(employeeNameDB);
        tdRole.text(roleDB);
        tdStartDate.text(startDateDB);
        tdMonthlyRate.text(monthlyRateDB);
        tdMonthsWorked.text(monthsWorked);
        tdTotalBilled.text(totalBilled);
    
    }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
    });
    
    $("#submitButton").on("click", function(event) {
    
        employeeName = $("#employeeName").val();
        role = $("#role").val();
        startDate = $("#startDate").val();
        monthlyRate = $("#monthlyRate").val();
    
        console.log(employeeName);
        console.log(role);
        console.log(startDate);
        console.log(monthlyRate);
    
        database.ref().push({
            employeeName: employeeName,
            role: role,
            startDate: startDate,
            monthlyRate: monthlyRate,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    });
    
    $("#clearButton").on("click", function(event) {
        employeeName = $("#employeeName").val("");
        role = $("#role").val("");
        startDate = $("#startDate").val("");
        monthlyRate = $("#monthlyRate").val("");
    });

});


