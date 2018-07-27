$(document).ready(function() {

    var trainName = $("#trainName").val();
    var destination = $("#destination").val();
    var firstTrain = $("#firstTrain").val();
    var frequency = $("#frequency").val();

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

    var childKey = "";
    
    //PULL EVERYTHING BACK FROM DB
    //Child added function also gets run on load
    database.ref().on("child_added", function(snapshot) {
    
        // console.log("child_added DB event function is firing");
        childKey = snapshot.key;
    
        //dynamically create the HTML
        var tableBody = $("#tableBody")
        var newTable = $("<tr>");
        newTable.attr("id", snapshot.key);
        var tdTrainName = $("<td>");
        var tdDestination = $("<td>");;
        var tdFrequency = $("<td>");
        var tdNextArrival = $("<td>");
        var tdMinutesAway = $("<td>");

        //delete button
        var tdDeleteButton = $("<td>");
        var deleteButton = $("<button>")
        deleteButton.attr("id", "deleteButton");
        deleteButton.attr("class", snapshot.key);

        //img in button
        var deleteImg = $("<img>")
        var deleteImgUrl = "https://png.icons8.com/metro/1600/delete.png"
        deleteImg.attr("src", deleteImgUrl);
        deleteImg.attr("id", "deleteImg");

    
        //Append all of the newly created divs to the right place
        tableBody.append(newTable);
        newTable.append(tdTrainName);
        newTable.append(tdDestination);
        newTable.append(tdFrequency);
        newTable.append(tdNextArrival);
        newTable.append(tdMinutesAway);

        newTable.append(tdDeleteButton);
        tdDeleteButton.append(deleteButton);
        deleteButton.append(deleteImg);

    
        //Store what you get back from the DB
        trainNameDB = snapshot.val().trainName;
        destinationDB = snapshot.val().destination;
        firstTrainDB = snapshot.val().firstTrain; //firstTime
        frequencyDB = snapshot.val().frequency;

        //NEED LOOP HERE FOR CALCULATIONS *************************************
        //*********************************************************************
        //each train needs it own nextArrival and MinutesAway calc


        var currentTime = moment().format('LT');
        console.log("firstTrainDB: " + firstTrainDB);
        //to make sure that the first time is before the current time
        var firstTimeConverted = moment(frequencyDB, "HH:mm").subtract(1, "years");
        console.log("firstTimeConverted: " + firstTimeConverted);

        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("difference in time in minutes: " + diffTime);

        var tRemainder = diffTime % frequencyDB;
        console.log("tRemainder: " + tRemainder);

        var tMinutesTillTrain = frequencyDB - tRemainder;
        console.log("minutes till train: " + tMinutesTillTrain);

        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("next arrival: " + moment(nextTrain).format("hh:mm"));


        //**********************************************************************
        //**********************************************************************

        //get rid of this later
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

    $(document).on('click', '#deleteButton', function(e){

        //Use Event Object to look at parameters of element you are clicking
        // console.log(e);
        var DatabaseId = e.originalEvent.target.className;
        // console.log("Database Id: " + DatabaseId);

        //confirm delete alert
        swal({
            title: "Are you sure?",
            text: "Are you sure you would like to delete this train from the schedule?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                database.ref(DatabaseId).remove().then(function () {
                    //deleted out of DB
                });
            } else {
                //Canceled
            }
        });

    });

    //This is listening when an item get removerd from DB, update the HTML
    //Need to figure out how to remove from DB from the site
    database.ref().on("child_removed", function(snapshot) {
    
        const changedItems = document.getElementById(snapshot.key)
        changedItems.remove();
        console.log("Deleted Item from DB");

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

        clearInputFields();
    });
    
    $("#clearButton").on("click", function(event) {
        clearInputFields();
    });

    function clearInputFields() {
        trainName = $("#trainName").val("");
        destination = $("#destination").val("");
        firstTrain = $("#firstTrain").val("");
        frequency = $("#frequency").val("");
    }
});

//#region Experimenting with new Library

//# Smooth Doodle
//Demonstrates the use of `toxi.geom.Spline2D`

// window.onload = init;
// var gui = new dat.GUI();
// var canvas, ctx, spline, points;

// var params = {
//     distance: 60,
//     tightness: 0.25
// };

// function init(){
//     canvas = document.getElementById('example');
//     // canvas.style.backgroundColor = e9ecef;
//     ctx = canvas.getContext('2d');
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight - 100;
//     spline = new toxi.geom.Spline2D();
//     points = [];
//     //controls
//     gui.add( params, 'distance', 5, 200 );
//     gui.add( params, 'tightness', 0.001, 0.5).step(0.025).onChange(function(){
//         spline.setTightness( params.tightness );
//     });
//     gui.add({
//         clear: function(){ ctx.clearRect(0,0,canvas.width,canvas.height); }
//     }, 'clear');

//     window.onmousemove = function(e){
//         update(e.pageX,e.pageY);
//     };
// }


// function update(mouseX,mouseY){
//     var numP=points.length;
//     var currP=new toxi.geom.Vec2D(mouseX,mouseY);
//     if (numP>0) {
//         var prevP=points[numP-1];
//         if (currP.distanceTo(prevP)> params.distance) {
//             points.push(currP);
//             ctx.strokeStyle = "rgba(0,0,0,.5)";
//             ctx.beginPath();
//             //this creates circle
//             ctx.arc(currP.x,currP.y,10,0,Math.PI*2);
//             ctx.stroke();
//             ctx.closePath();
//             spline.add(currP);
//             if (numP > 1) {
//                 var lastP = points[numP-2];
//                 var p = points[numP-1];
//                 line(lastP.x,lastP.y,p.x,p.y);
//                 ctx.strokeStyle = "rgba(0,0,0,0.5)";
//                 ctx.arc(p.x,p.y,7,0,Math.PI*2);
//             }
//             // need at least 4 vertices for a spline
//             if (numP>3) {
//                 ctx.strokeStyle = "rgba(0,0,0,.125)";
//                 // sample the curve at a higher resolution
//                 // so that we get extra 8 points between each original pair of points
//                 var vertices=spline.computeVertices(8);
//                 // draw the smoothened curve
//                 ctx.beginPath();
//                 var numRecent = Math.max(vertices.length-64,0);
//                 for(var i=numRecent;i<vertices.length;i++) {
//                     var v = vertices[i];
//                     if(i == numRecent){
//                         ctx.moveTo(v.x,v.y);
//                     }
//                     else {
//                         ctx.lineTo(v.x,v.y);
//                     }
//                 }
//                 ctx.stroke();
//                 ctx.closePath();
//             }
//         }
//     }
//     else {
//         points.push(currP);
//     }
// }

// function line(x1,y1,x2,y2){
//     ctx.beginPath();
//     ctx.strokeStyle = "rgba(255,0,0,0.25)";
//     ctx.moveTo(x1,y1);
//     ctx.lineTo(x2,y2);
//     ctx.stroke();
//     ctx.closePath();
// }

// document.ontouchmove = function(e){
//     if( e.target === canvas ){
//         e.preventDefault(); //prevents scrolling
//     }
//     for(var i=0;i<e.touches.length;i++){
//         update(e.touches[i].pageX,e.touches[i].pageY);
//     }
// };
//#endregion

