
var numOfRows  = 10;
var numOfColums = 10 ;
var numOfmines  = 10;
var numOfFlags = numOfmines ;
var m_mineField ;
var superman= false ;
var keysDown ; // dictionary
var intreval ;

(function(angular) {
    'use strict';
    angular.module('scopeController', [])
        .controller('MinesweeperController', ['$scope', function($scope) {


            $scope.minefield = createMinefield();
            $scope.uncoverSpot = function(spot) {
               if ($scope.minefield.gameOver){
                   return
               }
                if (keysDown[16] && spot.isCovered){

                   spot.isFlaged =!spot.isFlaged;
                    if (spot.isFlaged) {
                        numOfFlags--;
                    }
                    else{
                        numOfFlags++ ;
                    }

                    $scope.widget4 = {nomOfFlags: numOfFlags};
                    if(hasWon($scope.minefield) )
                    {
                        $scope.minefield.gameOver=true ;
                        alert("you won !! ")
                    }
                }else {
                    manageGmae(spot, $scope.minefield);
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

        }]);
/*
    angular.module('app', [])
        .controller('MainCtrl', function($scope) {
            $scope.widget = {title: 'abc'};
            $scope.set = function(new_title) {
                this.widget.title = new_title;
            }
        });
*/

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
        openAllNearByEmptyDFS(spot.row,spot.colm);
    }
    if(spot.content == "mine") { // new
       console.log("you lost");
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

function createMinefield()
{
if(!checkIput())
{
    return ;
}
    var minefield = {};
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
    }

    intreval = setInterval(lastSettingsBoard(minefield), 1);

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
}

function calculateAllNumbers(minefield) {
    for(var i = 0; i < numOfRows; i++) {
        for(var j = 0; j < numOfColums; j++) {
            //console.log("row: "+ i+"   colm: "+j );
            calculateNumber(minefield, i,j);
        }
    }
}



function hasWon(minefield) {
    for(var y = 0; y < numOfRows; y++) {
        for(var x = 0; x < numOfColums; x++) {
            var spot = getSpot(minefield, y, x);
            if((spot.isFlaged && spot.content != "mine")||(!spot.isFlaged && spot.content == "mine") ) {
                return false;
            }
        }
    }
    return true;
}
function alertUser(message){
alert (message);
}
function checkIput()
{
    if (numOfRows>300 || numOfRows<0 ||!isNumber(numOfRows))
    {
        alertUser("number of rows invalid")
        return false;
    }
    if (numOfColums>300 || numOfColums<0 || !isNumber(numOfColums))
    {
        alertUser("number of Colums invalid")
        return false ;
    }
    if (numOfmines<0 || numOfmines> numOfRows*numOfColums ||!isNumber(numOfmines))
    {
        alertUser("number of mines invalid")
        return false ;
    }

    return true ;
}
function isNumber(checkNumber) {
    return (!isNaN(parseFloat(checkNumber)) && isFinite(checkNumber));
}


