$(document).ready(function() {

    var trainName = $("#trainName").val();
    var destination = $("#destination").val();
    var firstTrain = $("#firstTrain").val();
    var frequency = $("#frequency").val();

    var currentTime = moment();

    document.getElementById("trainName").focus();
    
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
    
    //PULL EVERYTHING BACK FROM DB
    //Child added function also gets run on load
    database.ref().on("child_added", function(snapshot) {
    
        console.log("This DB event function is firing");
    
        //dynamically create the HTML
        var tableBody = $("#tableBody")
        var newTable = $("<tr>");
        var tdTrainName = $("<td>");
        var tdDestination = $("<td>");
        var tdFrequency = $("<td>");
        var tdNextArrival = $("<td>");
        var tdMinutesAway = $("<td>");
    
        //Append all of the newly created divs to the right place
        tableBody.append(newTable);
        newTable.append(tdTrainName);
        newTable.append(tdDestination);
        newTable.append(tdFrequency);
        newTable.append(tdNextArrival);
        newTable.append(tdMinutesAway);
    
        //Store what you get back from the DB
        trainNameDB = snapshot.val().trainName;
        destinationDB = snapshot.val().destination;
        firstTrainDB = snapshot.val().firstTrain;
        frequencyDB = snapshot.val().frequency;

        //NEED LOOP HERE FOR CALCULATIONS *************************************
        //each train needs it own nextArrival and MinutesAway calc

        //calculate Minutes Away *****
        //not sure if we need the date

        // // var momentDateFormat = "MM/DD/YYYY";
        // var momentTimeFormat = "HH:mm"
        // // var convertedDate = moment(/*dateInput*/, momentDateFormat);
        // var convertedTime = moment(firstTrainDB, momentTimeFormat);
        // // var monthsWorked = moment(convertedDate).diff(moment(), "months");
        // var minutesAway = moment(convertedTime).diff(moment(), "minutes");
        // var minutesAway = -minutesAway;
        // console.log(nextArrival);
    
        //calculate Next Arrival *****

        ////if a train comes, trainIndex++ .. Somthing like this
        // var trainIndex = 1;
        // if(currentTime > firstTrain + (trainIndex*frequency)){
        //     trainIndex++;
        // }
        
        // var nextArrivalTime = (firstTrain + (trainIndex*frequency)) + frequency

        var nextArrivalDB = 0;
        var minutesAwayDB = 0;
        
        //Add the DB data to the HTML
        tdTrainName.text(trainNameDB);
        tdDestination.text(destinationDB);
        tdFrequency.text(frequencyDB);
        tdNextArrival.text(nextArrivalDB);
        tdMinutesAway.text(minutesAwayDB);
    
    }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
    });
    
    // PUSH EVERYTHING TO DB
    $("#submitButton").on("click", function(event) {
    
        trainName = $("#trainName").val();
        destination = $("#destination").val();
        firstTrain = $("#firstTrain").val();
        frequency = $("#frequency").val();
    
        console.log(trainName);
        console.log(destination);
        console.log(firstTrain);
        console.log(frequency);
    
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    });
    
    $("#clearButton").on("click", function(event) {
        trainName = $("#trainName").val("");
        destination = $("#destination").val("");
        firstTrain = $("#firstTrain").val("");
        frequency = $("#frequency").val("");
    });

});


