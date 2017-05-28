
var numOfRows  = 10;
var numOfColums = 10 ;
var numOfmines  = 10;
var numOfFlags = numOfmines ;

(function(angular) {
    'use strict';
    angular.module('scopeController', [])
        .controller('MinesweeperController', ['$scope', function($scope) {
            $scope.minefield = createMinefield();

        }]);
})(window.angular);

function createMinefield() {
    var minefield = {};
    minefield.rows = [];

    for(var i = 0; i < 9; i++) {
        var row = {};
        row.spots = [];

        for(var j = 0; j < 9; j++) {
            var spot = {};
            spot.isCovered = true;
            spot.content = "empty";
            row.spots.push(spot);
        }

        minefield.rows.push(row);
    }

    placeRandomMine(minefield);

    return minefield;
}

function getSpot(minefield, row, column) {
    return minefield.rows[row].spots[column];
}

function placeRandomMine(minefield) {
    var row = Math.round(Math.random() * 8);
    var column = Math.round(Math.random() * 8);
    var spot = getSpot(minefield, row, column);
    spot.content = "bomb";
}

function MinesweeperController($scope) {
    $scope.minefield = createMinefield();
}