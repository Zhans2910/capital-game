// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.

$( document ).ready(function() {
    window.pairs=[];
    $.ajax({
        url: "https://cs374.s3.ap-northeast-2.amazonaws.com/country_capital_pairs.csv",
        type: 'GET',
        success: function (csv) {
            var allTextLines = csv.split(/\r\n|\n/);
            var keys = allTextLines[0].split(',');
            var key1 = keys[0];
            var key2 = keys[1];
            for (var i = 1; i < allTextLines.length; i++) {
                var data = allTextLines[i].split(',');
                var tarr = {"country": data[0], "capital": data[1]};
                pairs.push(tarr);
            }
            var country_capital_pairs = pairs;
            console.log(window.pairs);
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }

            var question=document.getElementById("pr2__question");
            var ques1= getRandomInt(0,country_capital_pairs.length);
            question.innerHTML=country_capital_pairs[ques1]["country"];
            initMap(country_capital_pairs[ques1]["country"]);
            var correct=document.getElementById("correct");
            var incorrect=document.getElementById("incorrect");
            var all=document.getElementById("all");
            all.checked=true;



            var input = document.getElementById("pr2__answer");
            input.addEventListener("keyup", function(event) {
                // Number 13 is the "Enter" key on the keyboard
                if (event.keyCode === 13) {
                    // Cancel the default action, if needed
                    event.preventDefault();
                    // Trigger the button element with a click
                    document.getElementById("pr2__submit").click();
                }
            });

            var config = {
                apiKey: "AIzaSyBKNsj4Lbd3YSR1wEnDhjQm7V1geZotcIA",
                authDomain: "project3z.firebaseapp.com",
                databaseURL: "https://project3z.firebaseio.com",
                projectId: "project3z",
                storageBucket: "project3z.appspot.com",
                messagingSenderId: "7929831431",
                appId: "1:7929831431:web:04ad4148f2e049a5b9caa2",
                measurementId: "G-VRJYMRY1G2"
            };

            firebase.initializeApp(config);
            function initializeTable() {
                var myTable = document.getElementById('resultTable');

                var numRows = myTable.rows.length;

                for(var i=0;i<numRows-4;i++) {
                    myTable.deleteRow(4);
                }
            }
        

            function readFromDatabase() {
                return firebase.database().ref('/linesBox/').on('value', function(snapshot) {
                  var undoBtn= document.getElementById('pr3__undo');
                  var a = snapshot.numChildren();
                  var myTable = document.getElementById('resultTable');
if (a===1){
                var numRows = myTable.rows.length;

                if(numRows===4){
                    var newRow = myTable.insertRow(numRows);
                    var newCell1 = newRow.insertCell(0);
                    var newCell2 = newRow.insertCell(1);
                    var newCell3 = newRow.insertCell(2);
                    newCell2.innerHTML="No entry to show";                }
  else {
    myTable.deleteRow(4);
    var newRow = myTable.insertRow(4);
                    var newCell1 = newRow.insertCell(0);
                    var newCell2 = newRow.insertCell(1);
                    var newCell3 = newRow.insertCell(2);
                    newCell2.innerHTML="No entry to show";   
  }
  undoBtn.disabled=true;
}else{
  undoBtn.disabled=false;

                initializeTable();}
                var myValue = snapshot.val();
                 var keyList = Object.keys(myValue);
                console.log(keyList);
                for(var i=0;i<keyList.length;i++) {
                    var myKey = keyList[i];
                var capital = snapshot.child(myKey).child("capital").val();
                var row = snapshot.child(myKey).child("row").val();    if (capital!=="no"){
                 if (row==="open")                           
                 {addRow(myValue[myKey].answer,myValue[myKey].country,myValue[myKey].capital, myKey );}
                                        }}

                                        var numRows = myTable.rows.length;
                                        if(numRows===4){
                                                            var newRow = myTable.insertRow(numRows);
                                                            var newCell1 = newRow.insertCell(0);
                                                            var newCell2 = newRow.insertCell(1);
                                                            var newCell3 = newRow.insertCell(2);
                                                            newCell2.innerHTML="No entry to show";}

                                });
                            }
         function readCorrectsFromDatabase() {
                var myTable = document.getElementById('resultTable');
                var numRows = myTable.rows.length;
                var ref=firebase.database().ref('/linesBox/');
                return ref.on('value', function(snapshot) {
                    initializeTable();
                    var myValue = snapshot.val();
                    var keyList = Object.keys(myValue);
                    for(var i=0;i<keyList.length;i++) {
                        var myKey = keyList[i];
                      var answer = snapshot.child(myKey).child("answer").val();
                        var row = snapshot.child(myKey).child("row").val();
                        var capital = snapshot.child(myKey).child("capital").val();
                        if((capital===answer || answer.toLowerCase()===capital.toLowerCase()) && capital!=="no")
                        { if (row==="open")
                            {addRow(myValue[myKey].answer,myValue[myKey].country,myValue[myKey].capital, myKey );}}

                    }
                });
            }

            function readIncorrectsFromDatabase() {

                var ref=firebase.database().ref('/linesBox/');
                return ref.on('value', function(snapshot) {
                    initializeTable();
                    var myValue = snapshot.val();
                    var keyList = Object.keys(myValue);
                    for(var i=0;i<keyList.length;i++) {
                        var myKey = keyList[i];
                      var answer = snapshot.child(myKey).child("answer").val();
                        var row = snapshot.child(myKey).child("row").val();
                        var capital = snapshot.child(myKey).child("capital").val();
                        if(capital!==answer && answer.toLowerCase()!==capital.toLowerCase()){
                            if (row==="open"){
                            addRow(myValue[myKey].answer,myValue[myKey].country,myValue[myKey].capital, myKey );}
                        }

                    }
                });
            }
         
            function DeleteAll(){
                var undoBtn= document.getElementById('pr3__undo');
                                var clearBtn= document.getElementById('pr3__clear');
                                clearBtn.onclick = function() {
                               
                                  var lst=[];
                                    var ref = firebase.database().ref('linesBox/');
                                    ref.once("value").then(function(snapshot) {
                                        var a = snapshot.numChildren();
                                        var myValue = snapshot.val();
                                        var keyList = Object.keys(myValue);
                                        for(var i=0;i<keyList.length;i++) {
                                            var myKey = keyList[i];
                                            var capital = snapshot.child(myKey).child("capital").val();
                                          var row = snapshot.child(myKey).child("row").val();
                                            if(capital!=="no" && row==="open"){
                ref.child(myKey).update({row:'closed'});
                                            lst.push(myKey);}
                                          console.log(lst);
                                            initializeTable();
                                          readFromDatabase();
                                            if (all.checked)
                                            {all.onclick();}
                                            if (correct.checked){
                                                correct.onclick();
                                            }
                                            if (incorrect.checked){
                                                incorrect.onclick();
                                            }
                                        };
                                    })
                                //arr.push(lst);
                                  azz(lst,"clear");
                                clearBtn.disabled=true;
                                undoBtn.disabled=false;}
                              
                            }
                            function addRow(value,country, capital,idg) {
                                var myTable = document.getElementById('resultTable');
                                var numRows = myTable.rows.length;
                
                                var newRow = myTable.insertRow(numRows);
                                var newCell1 = newRow.insertCell(0);
                                var newCell2 = newRow.insertCell(1);
                                var newCell3 = newRow.insertCell(2);
                
                
                                if (value===capital || value.toLowerCase()===capital.toLowerCase()) {
                                    newCell1.innerHTML = country.fontcolor("blue");
                                    newCell2.innerHTML = value.fontcolor("blue");
                                    newCell3.innerHTML = capital.fontcolor("blue") + "<input type='button' class='deleteDep' value='Delete' id=" + idg+ ">" ;
                                }
                                else {
                                    newCell1.innerHTML = country.fontcolor("red");
                                    newCell2.innerHTML = value.fontcolor("red");
                                    newCell3.innerHTML = capital.fontcolor("red") +
                                        "<input type='button' class='deleteDep' value='Delete' id ="+ idg+ ">";
                                }
                            }
                          
            function error(capital, value){
                if (!all.checked && !incorrect.checked){
                    if (value===capital || value.toLowerCase()===capital.toLowerCase()){
                        console.log(false);
                        correct.onclick();
                    }
                    else all.onclick();

                }
                if (!correct.checked){
                    if (value===capital || value.toLowerCase()===capital.toLowerCase()){
                        console.log(true);
                        all.checked=true;
                        all.onclick();
                    }

                }
            }
            function bindEvent() {
  
                var clearBtn= document.getElementById('pr3__clear');
                 var undoBtn= document.getElementById('pr3__undo');
                var inputBox = document.getElementById('pr2__answer');
                var submitBtn = document.getElementById('pr2__submit');
                var ques= getRandomInt(0,country_capital_pairs.length);
                var precountry1=question.innerHTML=country_capital_pairs[ques]["country"];
                var cap=Object.values(country_capital_pairs[ques])[1];
                                initMap(precountry1);
                                submitBtn.onclick = function() {
                                  clearBtn.disabled=false;
                                  undoBtn.disabled=false;
                                    var myValue = inputBox.value;
                                    error(cap,myValue);
                                    if(myValue != '') {
                                        //addRow(myValue,precountry1,cap);
                                      
                                    //writeToDatabase(myValue,precountry1, cap);
                writeToDatabase(myValue, precountry1,cap,"open");
                readFromDatabase();
                                      arr.push(0);
                                       //Undo(); 
                                        inputBox.value = '';
                                    }
                                    bindEvent();
                                }
                            }
                
                function writeToDatabase(comment, country,capital,row)
                 {var hist=[];
                     var ref = firebase.database().ref('linesBox/');
                 ref.once("value").then(function(snapshot) {
                    var a = snapshot.numChildren();
                    var myValue = snapshot.val();
                    var keyList = Object.keys(myValue);
                for(var i=0;i<keyList.length;i++) {
                var myKey = keyList[i];
                var undoindex = snapshot.child(myKey).child("order").val();
                hist.push(undoindex);}
                var Lindex= Math.max.apply(Math, hist)+1;
                //Lineindex=Lineindex+1;
                  var newKey = ref.push();
                                newKey.set({
                                    answer: comment,
                                    country: country,
                                    capital : capital,
                                  order:Lindex,
                                  row:row
                                });
                                azz(newKey.key, "add");
                            })    
                            }
                          
                            var arr=[];
                            var count=0;
                            var index;
                            var key;
                            function findmax(){
                            var arrs=[];
                            
                            var ref = firebase.database().ref('linesBox/');
                                            ref.once("value").then(function(snapshot) {
                                                                    var a = snapshot.numChildren();
                                                                    var myValue = snapshot.val();
                                                                    var keyList = Object.keys(myValue);
                                            for(var i=0;i<keyList.length;i++) {
                                            var myKey = keyList[i];
                                            var undoindex = snapshot.child(myKey).child("order").val();
                                            arrs.push(undoindex);}
                                              index= Math.max.apply(Math, arrs);
                                              console.log(index);
                            for(var i=0;i<keyList.length;i++) {
                              var myKey = keyList[i];
                            var undoindex = snapshot.child(myKey).child("order").val();
                                 if (undoindex===index){
                                   key=myKey;
                                   console.log(key);
                                      ref.child(myKey).remove();
                                                }
                                              }
                              })           
                                            }
                                      
                                            function gte(){
                                                var myTable = document.getElementById('resultTable');
                                             
                                                             var numRows = myTable.rows.length;
                                             
                                             
                                                             if(numRows===4){
                                                                 var newRow = myTable.insertRow(numRows);
                                                                 var newCell1 = newRow.insertCell(0);
                                                                 var newCell2 = newRow.insertCell(1);
                                                                 var newCell3 = newRow.insertCell(2);
                                                                 newCell2.innerHTML="No entry to show";
                                                             
                                             }}
                                               //gte();          
                                              function Undo(){
                                             var clearBtn= document.getElementById('pr3__clear');
                                             //var inputBox = document.getElementById('pr2__answer');
                                             var undoBtn= document.getElementById('pr3__undo');
                                             undoBtn.onclick = function() {
                                              var ist=[];
                                             var ref = firebase.database().ref('Undo/');
                                             ref.once("value").then(function(snapshot) {
                                                                     var myValue = snapshot.val();
                                             var keyList = Object.keys(myValue);
                                             for(var i=0;i<keyList.length;i++) {
                                             var myKey = keyList[i];
                                             ist.push(myKey);}
                                             var index= Math.max.apply(Math, ist); 
                                               if (myValue[index].type==="add"){
                                                 findmax(); 
                                                 readFromDatabase();
                                                 ref.child(index).remove();
                                                 //console.log(true);
                                               }
                                               
                                               if (myValue[index].type==="del"){
                                             let userRef = firebase.database().ref('linesBox/'+ myValue[index].link);
                                                 userRef.update({row:'open'});
                                                 
                                               ref.child(index).remove();}
                                             if (myValue[index].type==="clear"){
                                                var aaa=myValue[index].link;
                                               console.log(aaa);
                                               for (var j=0; j< aaa.length; j++){
                                               let userRef = firebase.database().ref('linesBox/'+ aaa[j]);
                                                 userRef.update({row:'open'});
                                               }
                                               ref.child(index).remove();
                                               readFromDatabase();
                                               } 
                                               })
                                             readFromDatabase();
                                               //gte();
                                             clearBtn.disabled=false;
                                               Undo();
                                             }    }
                                             
                                             function Restart(){
                                                             var rstBtn= document.getElementById('pr3__restart');
                                                             rstBtn.onclick = function() {
                                             var reff=firebase.database().ref('linesBox/');
                                                                 reff.once("value").then(function(snapshot) {
                                                                     var a = snapshot.numChildren();
                                                                     var myValue = snapshot.val();
                                                                     var keyList = Object.keys(myValue);
                                             for(var i=0;i<keyList.length;i++) {
                                              var myKey = keyList[i];
                                              var capital = snapshot.child(myKey).child("capital").val();
                                                                         if(capital!=="no"){
                                                                             reff.child(myKey).remove();}}})                  
                                                               
                                                               
                                                                 var ref = firebase.database().ref('Undo/');
                                                                 ref.once("value").then(function(snapshot) {
                                                                     var a = snapshot.numChildren();
                                                                     var myValue = snapshot.val();
                                                                     var keyList = Object.keys(myValue);
                                                                     for(var i=0;i<keyList.length;i++) {
                                                                         var myKey = keyList[i];
                                                                         var capital = snapshot.child(myKey).child("type").val();
                                                                         if(capital!=="no"){
                                                                             ref.child(myKey).remove();}
                                                                         initializeTable();
                                                                         if (all.checked)
                                                                         {all.onclick();}
                                                                         if (correct.checked){
                                                                             correct.onclick();
                                                                         }
                                                                         if (incorrect.checked){
                                                                             incorrect.onclick();
                                                                         }
                                                                     };
                                                                 })
                                                              var clearBtn= document.getElementById('pr3__clear');
                                                             clearBtn.disabled=true;
                                                                var undoBtn= document.getElementById('pr3__undo');
                                                             undoBtn.disabled=true;
                                                               bindEvent();
                                                             }
                                                         }
                            //var undorBtn= document.getElementById('pr3__undo');          
                                        $('body').on('click', 'input.deleteDep', function() {   
                            $(this).closest('tr').remove();
                            //arr.push([this.id]);
                            azz(this.id,"del");
                            let userRef = firebase.database().ref('linesBox/'+ this.id);
                            userRef.update({row:'closed'});
                                          Undo();
                              if (all.checked)
                                                        {all.onclick();}
                                                        if (correct.checked){
                                                            correct.onclick();
                                                        }
                                                        if (incorrect.checked){
                                                            incorrect.onclick();
                                                        }
                           
                                        });
                            var undoBtn= document.getElementById('pr3__undo');
                            function azz(allo,type) {
                                var ist=[];
                                var ref = firebase.database().ref('Undo/');
                                ref.once("value").then(function(snapshot) {
                                                        var myValue = snapshot.val();
                                var keyList = Object.keys(myValue);
                                for(var i=0;i<keyList.length;i++) {
                                var myKey = keyList[i];
                                ist.push(myKey);}
                                var index= Math.max.apply(Math, ist)+1;
                                //var newKey = ref.push();
                                  for (var j=0; j< allo.length;j++){
                                    ref.child(index).set({link :allo, type : type});
                                  }
                                //ref.child(index).set(allo);
                                console.log(index);
                                })
                                }
                          
            bindEvent();
            Undo();
            readFromDatabase();
            DeleteAll();
            Restart();
            var map;
            
            function initMap(location) {
                var link=document.getElementById('map');
                link.src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAsewvPDV-n-xLbxtF7xN26EU6YYReojng  &maptype=roadmap&language=en&q=" +location  ;
            }
            
            

            all.onclick = function () {
                all.checked=true;
                correct.checked=false;
                incorrect.checked=false;
                readFromDatabase();
                var myTable = document.getElementById('resultTable');

                var numRows = myTable.rows.length;


                if(numRows===4){
                    var newRow = myTable.insertRow(numRows);
                    var newCell1 = newRow.insertCell(0);
                    var newCell2 = newRow.insertCell(1);
                    var newCell3 = newRow.insertCell(2);
                    newCell2.innerHTML="No entry to show";
                }
            }
            correct.onclick= function (){
                console.log(true);
                //initializeTable();
                readCorrectsFromDatabase();
                var myTable = document.getElementById('resultTable');

                var numRows = myTable.rows.length;


                if(numRows===4){
                    var newRow = myTable.insertRow(numRows);
                    var newCell1 = newRow.insertCell(0);
                    var newCell2 = newRow.insertCell(1);
                    var newCell3 = newRow.insertCell(2);
                    newCell2.innerHTML="No entry to show";
                }
            }
            incorrect.onclick=function() {
                console.log(false);
                readIncorrectsFromDatabase();
                var myTable = document.getElementById('resultTable');

                var numRows = myTable.rows.length;


                if(numRows===4){
                    var newRow = myTable.insertRow(numRows);
                    var newCell1 = newRow.insertCell(0);
                    var newCell2 = newRow.insertCell(1);
                    var newCell3 = newRow.insertCell(2);
                    newCell2.innerHTML="No entry to show";
                }
            }
            var capitals=[];
            for (let j=0; j<pairs.length; j++) {
                capitals.push(pairs[j]["capital"]);
            }
            $( function() {
                let names = capitals;

                let accentMap = {
                    "á": "a",
                    "ö": "o"
                };
                let normalize = function( term ) {
                    let ret = "";
                    for ( var i = 0; i < term.length; i++ ) {
                        ret += accentMap[ term.charAt(i) ] || term.charAt(i);
                    }
                    return ret;
                };

                $( "#pr2__answer" ).autocomplete({
                    source: function( request, response ) {
                        var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), "i" );
                        response( $.grep( names, function( value ) {
                            value = value.label || value.value || value;
                            return matcher.test( value ) || matcher.test( normalize( value ) );
                        }) );
                    },
                    minLength :2
                });

                function showResult(event, ui) {
                    //document.getElementById("pr2__answer").innerHTML="hi";
                    //$('#pr2__answer').text(ui.item.label);
                    //document.getElementById("pr2__submit").click();
                    //document.getElementById("pr2__answer").value="";
                }
                $("#pr2__answer").autocomplete("widget").attr('style', 'max-height: 200px; overflow-y: auto; overflow-x: hidden;');
            } );
            
        },
        dataType: "text"

    });
    function initMap(location) {
        var link=document.getElementById('map');
        link.src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAsewvPDV-n-xLbxtF7xN26EU6YYReojng  &maptype=roadmap&language=en&q=" +location  ;
    }
    $("table").delegate('tr:nth-child(1n+5) td:nth-child(1)','mouseover mouseout', function(e) {
        var timer;
        if (e.type == 'mouseover') {
           $(this).parent().addClass("hover");
            var text=$(this).text();
          timer = setTimeout(function(){
            initMap(text);
          $("#map").css('border', '3px orange solid');
          },500);
         }
         else {
           clearTimeout(timer);
           $(this).parent().removeClass("hover");
           $("#map").css('border', '0') ;
         }
       }
     );
      
      $("table").delegate('tr:nth-child(1n+5) td:nth-child(3)','mouseover mouseout', function(e) {
        var timer;
          if (e.type == 'mouseover') {
            $(this).parent().addClass("hover");
            var text=$(this).text();
            var link=document.getElementById('map');
            timer = setTimeout(function(){
          $("#map").css('border', '3px black solid') ; 
          link.src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAsewvPDV-n-xLbxtF7xN26EU6YYReojng  &maptype=roadmap&language=en&zoom=4&q=" + text ; 
        map.setOptions({ zoom: 10 });
            }, 500); 
        }
         else {
           clearTimeout(timer);
           $(this).parent().removeClass("hover");
           $("#map").css('border', '0') ;
         }
       }
     );
     $("table").delegate('tr:nth-child(2) td:nth-child(1)','mouseover mouseout', function(e) {
        var timer;
          if (e.type == 'mouseover') {
            $(this).parent().addClass("hover");
            var text=$(this).text();
            timer = setTimeout(function(){
          $("#map").css('border', '3px orange solid') ; 
          initMap(text);
            }, 500); 
        }
         else {
           clearTimeout(timer);
           $(this).parent().removeClass("hover");
           $("#map").css('border', '0') ;
         }
       }
     );
     $("table").delegate('tr:nth-child(3) td:nth-child(1)','mouseover mouseout', function(e) {
          if (e.type == 'mouseover') {
            $("#map").css('border', '0') ; 
        }
         else {
           $("#map").css('border', '0') ;
         }
       }
     );
});
