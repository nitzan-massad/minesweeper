
var numOfRows  = 10;
var numOfColums = 10 ;
var numOfmines  = 10;
var numOfFlags = numOfmines ;
var m_mineField ;
var superman= false ;
var keysDown ; // dictionary
var intreval ;
var popupIntreval ;
var groupOfEmptyCalls ;
var index ;
var mapOfEmptyCell= {} ;
var listOfAdjecentGroups ;

(function(angular) {
    'use strict';
   const app= angular.module('scopeController', [])
        .controller('MinesweeperController', ['$scope', function($scope) {




            $scope.onRightClick = function (spot){
                if (spot.isCovered){
                    if (!spot.isFlaged && numOfFlags==0){
                        alertUser("sorry you dont have any flags left")
                        return ;
                    }

                    spot.isFlaged =!spot.isFlaged;
                    console.log('nitz'+JSON.stringify(spot))

                    if (spot.isFlaged) {
                        numOfFlags--;
                    }
                    else{
                        numOfFlags++ ;
                    }
                    $scope.widget4 = {nomOfFlags: numOfFlags};

                }
            }

            $scope.minefield = createMinefield();
            $scope.uncoverSpot = function(spot) {
               if ($scope.minefield.gameOver){
                   return
               }
                if (keysDown[16] && spot.isCovered){
                   if (!spot.isFlaged && numOfFlags==0){
                       alertUser("sorry you dont have any flags left")
                       return ;
                   }
                   spot.isFlaged =!spot.isFlaged;
                    if (spot.isFlaged) {
                        numOfFlags--;
                    }
                    else{
                        numOfFlags++ ;
                    }
                    $scope.widget4 = {nomOfFlags: numOfFlags};

                }else {
                    manageGmae(spot, $scope.minefield);
                }
                if(hasWon($scope.minefield) )
                {
                    $scope.minefield.gameOver=true ;
                    alertUser("you won !! ")
                }
            };
            $scope.widget1 = {numOfRows: '10'};
            $scope.widget2 = {nomOfColm: '10'};
            $scope.widget3 = {nomOfMines: '10'};
            $scope.widget4 = {nomOfFlags: '10'};


            $scope.set = function() {
                 numOfRows  = this.widget1.numOfRows;
                 numOfColums = this.widget2.nomOfColm ;
                 numOfmines  =  this.widget3.nomOfMines ;
                 numOfFlags = numOfmines ;
                $scope.widget4 = {nomOfFlags: numOfFlags};
                $scope.minefield = createMinefield () ;
            };


            $scope.supermanBox =function () {
               superman =!superman;
             /*   for (var i =0 ; i < numOfRows ; i++){
                    for (var j = 0 ;j< numOfColums ; j++) {
                        var spot =getSpot(m_mineField,i,j);
                        spot.superman = superman ;
                    }
                }
                */
                m_mineField.superman = superman ;
                $scope.minefield = m_mineField ;
            }

        }])

/*
    angular.module('app', [])
        .controller('MainCtrl', function($scope) {
            $scope.widget = {title: 'abc'};
            $scope.set = function(new_title) {
                this.widget.title = new_title;
            }
        });
*/
    app.directive('ngRightClick', function($parse) {
        return function(scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function(event) {
                scope.$apply(function() {
                    event.preventDefault();
                    fn(scope, {$event:event});
                });
            });
        };
    });

})(window.angular);




function manageGmae (spot , mineField)
{
    if (spot.isFlaged)
    {
        return;
    }

    spot.isCovered = false;
    if (spot.content=="empty")
    {
        //openAllNearByEmptyDFS(spot.row,spot.colm);
        openAllNearByEmptFromDic2(spot.emptyNum ,mineField);
    }
    if(spot.content == "mine") { // new

        alertUser("you lost");
       spot.content = "9" ;
       //alert(spot.content) ;
       mineField.gameOver  = true ;
    }
}
function openAllNearByEmptyDFS(row, colm)
{
    getSpot(m_mineField ,row,colm).isCovered = false ;
    if (getSpot(m_mineField ,row,colm).content=="empty")
    {
        //up and left
        if (row>0 && colm>0 && getSpot(m_mineField ,row-1,colm-1).isCovered)
        {
            openAllNearByEmptyDFS(row-1,colm-1)
        }
        //up
        if (row>0 && getSpot(m_mineField ,row-1,colm).isCovered)
        {
            openAllNearByEmptyDFS(row-1,colm)
        }
        // up and right
        if (row>0 && colm < numOfColums-1 && getSpot(m_mineField ,row-1,colm+1).isCovered )
        {
            openAllNearByEmptyDFS(row-1,colm+1)
        }
        //left
        if (colm>0 &&  getSpot(m_mineField ,row,colm-1).isCovered )
        {
            openAllNearByEmptyDFS(row,colm-1)
        }
        // right
        if (colm<numOfColums-1 && getSpot(m_mineField ,row,colm+1).isCovered)
        {
            openAllNearByEmptyDFS(row,colm+1)
        }
        // down and left
        if (row<numOfRows-1&&colm>0 && getSpot(m_mineField ,row+1,colm-1).isCovered)
        {
            openAllNearByEmptyDFS(row+1,colm-1)
        }
        // down
        if (row<numOfRows-1 && getSpot(m_mineField ,row+1,colm).isCovered)
        {
            openAllNearByEmptyDFS(row+1,colm)
        }
        // down and right
        if (row<numOfRows-1&& colm < numOfColums-1  && getSpot(m_mineField ,row+1,colm+1).isCovered)
        {
            openAllNearByEmptyDFS(row+1,colm+1);
        }
    }
}
// a function that preparing all the rmpty spots in grops that it will be quick to open
function prepareAllNearByGroups2(mineField, row ,colum)
{
    var empty1 = -1 ;
    var empty2 = -1 ;
    var empty3 = -1 ;
    var empty4 = -1 ;
    var thisSpot = getSpot(mineField, row ,colum) ;
    var tmpSpot ;


   if (colum>0 && ((tmpSpot =getSpot(mineField, row ,colum-1)).content  == 'empty'))
   {
           var empty1 = tmpSpot.emptyNum;
   }
    if(colum>0 && row>0 && ((tmpSpot =getSpot(mineField, row-1 ,colum-1)).content  == 'empty'))
    {
        var empty2 = tmpSpot.emptyNum;
    }
    if( row>0 && ((tmpSpot =getSpot(mineField, row-1 ,colum)).content  == 'empty'))
    {
        var empty3 = tmpSpot.emptyNum;
    }
    if( row>0 && colum<numOfColums-1 && ((tmpSpot =getSpot(mineField, row-1 ,colum+1)).content  == 'empty'))
    {
        var empty4 = tmpSpot.emptyNum;
    }
    if ((empty1+empty2 +empty3+empty4)==-4)
    {
       thisSpot.emptyNum = index ;
       index ++ ;
        groupOfEmptyCalls[thisSpot.emptyNum]= [];
    }else if ((empty1 == empty2)&& (empty1==empty3)&& (empty1==empty4))
    {
        thisSpot.emptyNum = empty1 ;
    }else if ((empty2 != -1)&&(empty4!=-1)&& (empty2!=empty4))
    {
        thisSpot.emptyNum = empty2 ;
        groupOfEmptyCalls[thisSpot.emptyNum]=connectTwoArray(groupOfEmptyCalls[thisSpot.emptyNum], groupOfEmptyCalls[empty4])
        groupOfEmptyCalls[empty4]= [] ;
        mapOfEmptyCell[empty4]= [] ;
        mapOfEmptyCell[empty4].push(empty2) ;
       // console.log("2-4"   +"empty4: "+empty4+" --->  empty2:"+empty2);

    }else if ((empty1 != -1)&&(empty4!=-1)&& (empty1!=empty4)){

        thisSpot.emptyNum = empty1 ;
        groupOfEmptyCalls[thisSpot.emptyNum]= connectTwoArray(groupOfEmptyCalls[thisSpot.emptyNum], groupOfEmptyCalls[empty4]) ;
        groupOfEmptyCalls[empty4]= [] ;
        mapOfEmptyCell[empty4]= [] ;
        mapOfEmptyCell[empty4].push(empty1) ;
       //console.log("1-4   emtpy4: "+empty4+" ---> empty1:"+empty1);
    }
    else if ((empty1 != -1)){  thisSpot.emptyNum = empty1 ; }
    else if ((empty2 != -1)){  thisSpot.emptyNum = empty2 ;   }
    else if ((empty3 != -1)){  thisSpot.emptyNum = empty3 ;   }
    else if ((empty4 != -1)){  thisSpot.emptyNum = empty4 ;   }
   // console.log("thisSpot.emptyNum: "+ thisSpot.emptyNum + "  row: "+row+"  colum: "+colum );
  // console.log(groupOfEmptyCalls[thisSpot.emptyNum]);
    pushAllRelventCells(row, colum , thisSpot.emptyNum);
}
function pushAllRelventCells (row,colum ,index){

    groupOfEmptyCalls[index].push(row) ;
    groupOfEmptyCalls[index].push(colum) ;

    if (row >0 && colum>0) {
        groupOfEmptyCalls[index].push(row - 1);
        groupOfEmptyCalls[index].push(colum - 1);
    }
    if(row>0) {
        groupOfEmptyCalls[index].push(row - 1);
        groupOfEmptyCalls[index].push(colum);
    }
    if(row>0 && colum<numOfColums-1) {
        groupOfEmptyCalls[index].push(row - 1);
        groupOfEmptyCalls[index].push(colum + 1);
    }
    if (colum<numOfColums-1) {
        groupOfEmptyCalls[index].push(row);
        groupOfEmptyCalls[index].push(colum + 1);
    }
    if(row<numOfRows-1 && colum<numOfColums-1) {
        groupOfEmptyCalls[index].push(row + 1);
        groupOfEmptyCalls[index].push(colum + 1);
    }
    if(row<numOfRows-1) {
        groupOfEmptyCalls[index].push(row + 1);
        groupOfEmptyCalls[index].push(colum);
    }
    if(row<numOfRows-1&& colum>0) {
        groupOfEmptyCalls[index].push(row + 1);
        groupOfEmptyCalls[index].push(colum - 1);
    }
    if(colum>0) {
        groupOfEmptyCalls[index].push(row);
        groupOfEmptyCalls[index].push(colum - 1);
    }
 }
function createMinefield(){
if(!checkIput())
{
    return ;
}
    var minefield = {};
    listOfAdjecentGroups = {};
    minefield.rows = [];
    keysDown = {};
    for(var i = 0; i < numOfRows; i++) {
        var row = {};
        row.spots = [];

        for(var j = 0; j < numOfColums; j++) {
            var spot = {};
            spot.isCovered = true;
            spot.content = "empty";
            spot.row = i ;
            spot.colm = j ;
            row.spots.push(spot);
        }

        minefield.rows.push(row);
       // console.log("i: "+i);
    }

   //intreval = setInterval(lastSettingsBoard(minefield), 1);
    lastSettingsBoard(minefield);

    //placeManyRandomMines(minefield);
    //calculateAllNumbers(minefield);

    m_mineField = minefield ;

    addEventListener("keydown", function (e) {
       if([16].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
        keysDown[e.keyCode] = true;

    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);

//console.log("finsh");
    return minefield;
}
function lastSettingsBoard (minefield){
    //console.log("in");
    placeManyRandomMines(minefield);
    calculateAllNumbers(minefield);
    clearInterval(intreval);
}

function getSpot(minefield, row, column) {

  //console.log("row:" + row+" column:" + column);

    return  minefield.rows[row].spots[column];
}

function placeRandomMine(minefield) {
    var done = false;

    while (!done) {
        var row = Math.round(Math.random() * (numOfRows-1));
        var column = Math.round(Math.random() * (numOfColums-1));
        var spot = getSpot(minefield, row, column);
        if (spot=== undefined){
            continue ;
        }
        if (spot.content != "mine") {

            spot.content = "mine";
            done = true;
        }
    }
}

function placeManyRandomMines(minefield) {
    var numOfMineTMP =numOfmines ;
    var random  ;
    var calc ;
    for (var i =0 ; i < numOfRows ; i++){
        for (var j = 0 ;j< numOfColums ; j++){
            calc = numOfMineTMP /((numOfRows*numOfRows)- (i*j));
            random = Math.random() ;
            if (random <=calc){
                var spot = getSpot(minefield ,i ,j);
                if(spot=== undefined)
                    continue ;
                spot.content = "mine";
                numOfMineTMP-- ;
            }
        }
    }
    while (numOfMineTMP >0)
    {
        placeRandomMine(minefield);
        numOfMineTMP -- ;
    }
}


function calculateNumber(minefield, row, column) {


    var thisSpot = getSpot(minefield, row, column);

    // if this spot contains a mine then we can't place a number here
    if(thisSpot.content == "mine") {
        return;
    }

    var mineCount = 0;

    // check row above if this is not the first row
    if(row > 0) {
        // check column to the left if this is not the first column
        if(column > 0) {
            // get the spot above and to the left
            var spot = getSpot(minefield, row - 1, column - 1);
            if(spot.content == "mine") {
                mineCount++;
            }
        }

        // get the spot right above
        var spot = getSpot(minefield, row - 1, column);
        if(spot.content == "mine") {
            mineCount++;
        }

        // check column to the right if this is not the last column
        if(column < numOfColums-1) {
            // get the spot above and to the right
            var spot = getSpot(minefield, row - 1, column + 1);
            if(spot.content == "mine") {
                mineCount++;
            }
        }
    }

    // check column to the left if this is not the first column
    if(column > 0) {
        // get the spot to the left
        var spot = getSpot(minefield, row, column - 1);
        if(spot.content == "mine") {
            mineCount++;
        }
    }

    // check column to the right if this is not the last column
    if(column < numOfColums-1) {
        // get the spot to the right
        var spot = getSpot(minefield, row, column + 1);
        if(spot.content == "mine") {
            mineCount++;
        }
    }

    // check row below if this is not the last row
    if(row < numOfRows-1) {
        // check column to the left if this is not the first column
        if(column > 0) {
            // get the spot below and to the left
            var spot = getSpot(minefield, row + 1, column - 1);
            if(spot.content == "mine") {
                mineCount++;
            }
        }

        // get the spot right below
        var spot = getSpot(minefield, row + 1, column);
        if(spot.content == "mine") {
            mineCount++;
        }

        // check column to the right if this is not the last column
        if(column < numOfColums-1) {
            // get the spot below and to the right
            var spot = getSpot(minefield, row + 1, column + 1);
            if(spot.content == "mine") {
                mineCount++;
            }
        }
    }

    if(mineCount > 0) {
        thisSpot.content = mineCount;
    }
    else
    {
        prepareAllNearByGroups(minefield, row, column)
    }
}

function calculateAllNumbers(minefield) {
    groupOfEmptyCalls ={};
    index = 0;
    for(var i = 0; i < numOfRows; i++) {
        for(var j = 0; j < numOfColums; j++) {
            //console.log("row: "+ i+"   colm: "+j );
            calculateNumber(minefield, i,j);
        }
    }

   //console.log(mapOfEmptyCell);

}

function hasWon(minefield) {
    for(var y = 0; y < numOfRows; y++) {
        for(var x = 0; x < numOfColums; x++) {
            var spot = getSpot(minefield, y, x);
            if (spot.content != "mine" && spot.isCovered)
                return false ;

          /*  if((spot.isFlaged && spot.content != "mine")||(!spot.isFlaged && spot.content == "mine") ) {
                return false;
            }
            */
        }
    }
    return true;
}

function checkIput(){

    if (numOfRows>300 || numOfRows<0 ||!isNumber(numOfRows))
    {
        alertUser("sorry, number of rows invalid")
        return false;
    }
    if (numOfColums>300 || numOfColums<0 || !isNumber(numOfColums))
    {
        alertUser("sorry, number of Colums invalid")
        return false ;
    }
    if (numOfmines<0 || numOfmines> numOfRows*numOfColums ||!isNumber(numOfmines))
    {
        alertUser("sorry, number of mines invalid")
        return false ;
    }
    if (numOfColums*numOfRows >9999)
    {
       // popupIntreval = setInterval(alertUser("sorry, it might take a little bit of time..."), 1);

        alertUser("sorry, it might took a little bit of time...")
    }

    return true ;
}
function isNumber(checkNumber) {
    return (!isNaN(parseFloat(checkNumber)) && isFinite(checkNumber));
}


function alertUser ( message) {
    var modal = document.getElementById('myModal');
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    document.getElementById("PopUpAlert").innerHTML = message;
    modal.style.display = "block";
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function openAllNearByEmptFromDic(emptyNum , mineField)
{
    var row =0 ;
    var colum = 0;
    var tmp = emptyNum ;
    while(!(mapOfEmptyCell[tmp]===undefined)){
        for (var i =0 ; i <mapOfEmptyCell[tmp].length ; i++) {
            groupOfEmptyCalls[mapOfEmptyCell[tmp]] = connectTwoArray(groupOfEmptyCalls[mapOfEmptyCell[tmp]], groupOfEmptyCalls[tmp])
        }
        tmp = mapOfEmptyCell[tmp] ;
    }

    for (var i = 0 ; i <groupOfEmptyCalls[tmp].length ; i=i+2)
    {
         row = groupOfEmptyCalls[tmp][i];
        colum = groupOfEmptyCalls[tmp][i+1];
        //console.log("row: "+row+"  tmp: "+tmp+"  coulm: "+colum)
        //console.log("row: "+row+"  coulm: "+colum)
        getSpot(mineField, row, colum).isCovered= false ;
    }
}
function openAllNearByEmptFromDic2 (emptyNum , mineField)
{
    var row =0 ;
    var colum = 0;
    var stackOfGroupToOpen = [];
    stackOfGroupToOpen.push(emptyNum);

    for (var i = 0 ; i <groupOfEmptyCalls[emptyNum].length ; i=i+2)
    {
        row = groupOfEmptyCalls[emptyNum][i];
        colum = groupOfEmptyCalls[emptyNum][i+1];
        //console.log("row: "+row+"  tmp: "+tmp+"  coulm: "+colum)
        //console.log("row: "+row+"  coulm: "+colum)
        getSpot(mineField, row, colum).isCovered= false ;
    }

    for(var g =0 ; g < stackOfGroupToOpen.length ; g++) {
        for (var i = 0; !(listOfAdjecentGroups[stackOfGroupToOpen[g]] === undefined) && i < listOfAdjecentGroups[stackOfGroupToOpen[g]].length; i++) {
            for (var j = 0; j < groupOfEmptyCalls[listOfAdjecentGroups[stackOfGroupToOpen[g]][i]].length; j = j + 2) {
                if (stackOfGroupToOpen.indexOf(listOfAdjecentGroups[stackOfGroupToOpen[g]][i])==-1){
                    stackOfGroupToOpen.push(listOfAdjecentGroups[stackOfGroupToOpen[g]][i]);
                }
                row = groupOfEmptyCalls[listOfAdjecentGroups[stackOfGroupToOpen[g]][i]][j];
                colum = groupOfEmptyCalls[listOfAdjecentGroups[stackOfGroupToOpen[g]][i]][j + 1];
                getSpot(mineField, row, colum).isCovered = false;

            }
        }
    }
}
function connectTwoArray (A, B )
{
    var C =[];
    for (var i = 0 ; i<B.length; i++){
        A.push(B[i]);
    }
    return A ;
}

function prepareAllNearByGroups (mineField, row ,colum)
{
    var empty1 = -1 ;
    var empty2 = -1 ;
    var empty3 = -1 ;
    var empty4 = -1 ;

    var thisSpot = getSpot(mineField, row ,colum) ;
    var tmpSpot ;


    if (colum>0 && ((tmpSpot =getSpot(mineField, row ,colum-1)).content  == 'empty'))
    {
        var empty1 = tmpSpot.emptyNum;
    }
    if(colum>0 && row>0 && ((tmpSpot =getSpot(mineField, row-1 ,colum-1)).content  == 'empty'))
    {
        var empty2 = tmpSpot.emptyNum;
    }
    if( row>0 && ((tmpSpot =getSpot(mineField, row-1 ,colum)).content  == 'empty'))
    {
        var empty3 = tmpSpot.emptyNum;
    }
    if( row>0 && colum<numOfColums-1 && ((tmpSpot =getSpot(mineField, row-1 ,colum+1)).content  == 'empty'))
    {
        var empty4 = tmpSpot.emptyNum;
    }
    if ((empty1+empty2 +empty3+empty4)==-4)
    {
        thisSpot.emptyNum = index ;
        index ++ ;
        groupOfEmptyCalls[thisSpot.emptyNum]= [];
    }
    else if ((empty1 != -1)){  thisSpot.emptyNum = empty1 ;  }
    else if ((empty2 != -1)){  thisSpot.emptyNum = empty2 ;  }
    else if ((empty3 != -1)){  thisSpot.emptyNum = empty3 ;  }
    else if ((empty4 != -1)){  thisSpot.emptyNum = empty4 ;  }

    var tmp = [empty1 ,empty2 , empty3 , empty4];
    for (var i = 0 ; i <tmp.length ; i++){
        for (var j = i+1 ; j < tmp.length ; j++){
            if (tmp[i]!= -1 && tmp[j]!= -1 && tmp[i]!=tmp[j] )
            {
                if (listOfAdjecentGroups[tmp[i]] ===undefined)
                {
                    listOfAdjecentGroups[tmp[i]] = [] ;
                }
                if (listOfAdjecentGroups[tmp[j]]===undefined)
                {
                    listOfAdjecentGroups[tmp[j]] = [] ;
                }
                if (listOfAdjecentGroups[tmp[i]].indexOf(tmp[j])!=-1)
                {
                    continue ;
                }
                listOfAdjecentGroups[tmp[i]].push(tmp[j]) ;
                listOfAdjecentGroups[tmp[j]].push(tmp[i]) ;
            }
        }
    }
    pushAllRelventCells(row, colum , thisSpot.emptyNum);
}
