
var numOfRows  = 10;
var numOfColums = 10 ;
var numOfmines  = 20;
var numOfFlags = numOfmines ;
var m_mineField ;
var superman= false ;


(function(angular) {
    'use strict';
    angular.module('scopeController', [])
        .controller('MinesweeperController', ['$scope', function($scope) {
            $scope.minefield = createMinefield();
            $scope.uncoverSpot = function(spot) {

                manageGmae(spot);
            };
        }]);

})(window.angular);

function manageGmae (spot)
{
    spot.isCovered = false;
    if (spot.content=="empty")
    {
        openAllNearByEmpty(spot.row,spot.colm);
    }
    if(spot.content == "mine") { // new
        alert ("you lost");
    } else { // new
        if(hasWon($scope.minefield)) { // original code
            alert("you won");
        }
    } // new
}
function openAllNearByEmpty(row,colm)
{
    getSpot(m_mineField ,row,colm).isCovered= false ;
    if (getSpot(m_mineField ,row,colm).content=="empty")
    {
        //up and left
        if (row>0 && colm>0 && getSpot(m_mineField ,row-1,colm-1).isCovered)
        {
            openAllNearByEmpty(row-1,colm-1)
        }
        //up
        if (row>0 && getSpot(m_mineField ,row-1,colm).isCovered)
        {
            openAllNearByEmpty(row-1,colm)
        }
        // up and right
        if (row>0 && colm < numOfColums-1 && getSpot(m_mineField ,row-1,colm+1).isCovered )
        {
            openAllNearByEmpty(row-1,colm+1)
        }
        //left
        if (colm>0 &&  getSpot(m_mineField ,row,colm-1).isCovered )
        {
            openAllNearByEmpty(row,colm-1)
        }
        // right
        if (colm<numOfColums-1 && getSpot(m_mineField ,row,colm+1).isCovered)
        {
            openAllNearByEmpty(row,colm+1)
        }
        // down and left
        if (row<numOfRows-1&&colm>0 && getSpot(m_mineField ,row+1,colm-1).isCovered)
        {
            openAllNearByEmpty(row+1,colm-1)
        }
        // down
        if (row<numOfRows-1 && getSpot(m_mineField ,row+1,colm).isCovered)
        {
            openAllNearByEmpty(row+1,colm)
        }
        // down and right
        if (row<numOfRows-1&&numOfColums-1  && getSpot(m_mineField ,row+1,colm+1).isCovered)
        {
            openAllNearByEmpty(row+1,colm+1)
        }
    }







}


function createMinefield() {
    var minefield = {};
    minefield.rows = [];

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

    placeManyRandomMines(minefield);
    calculateAllNumbers(minefield);

    m_mineField = minefield ;
    return minefield;
}

function getSpot(minefield, row, column) {

   console.log("row:" + row+" column:" + column);

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
    for(var y = 0; y < numOfRows; y++) {
        for(var x = 0; x < numOfColums; x++) {
            calculateNumber(minefield, x, y);
        }
    }
}


function supermanBox()
{
    if (superman == false)
    {
        superman = true;
    }
    else
    {
        superman = false;
    }
    for (var i =0 ; i < numOfRows ; i++){
        for (var j = 0 ;j< numOfColums ; j++) {
            var spot =getSpot(m_mineField,i,j);
            spot.superman = superman ;
        }
    }
}
function hasWon(minefield) {
    for(var y = 0; y < 9; y++) {
        for(var x = 0; x < 9; x++) {
            var spot = getSpot(minefield, y, x);
            if(spot.isCovered && spot.content != "mine") {
                return false;
            }
        }
    }

    return true;
}