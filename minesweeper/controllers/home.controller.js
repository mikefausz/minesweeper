angular
  .module('minesweeper')
  .controller('HomeController', function($scope) {
    $scope.height = 9;
    $scope.width = 9;
    $scope.n = 10;

    function getSpot(minefield, row, column) {
      return minefield.rows[row].spots[column];
    }

    function placeRandomMine(minefield) {
      var minePlaced = false;
      do {
        var row = Math.round(Math.random() * ($scope.height - 1));
        var column = Math.round(Math.random() * ($scope.width - 1));
        var spot = getSpot(minefield, row, column);
        if (spot.content != "mine") {
          spot.content = "mine";
          minePlaced = true;
          console.log("MINE placed at [ " + row + ", " + column + "]");
        }
        else {
          console.log("MINE already at [ " + row + ", " + column + "] Placing another");
        }
      } while (!minePlaced);
    }

    function placeNMines(minefield) {
      for(var i = 0; i < $scope.n; i++) {
        placeRandomMine(minefield);
      }
    }

    function getAdjacentSpots(minefield, row, column) {
      var thisSpot = getSpot(minefield, row, column);
      var adjacentSpots = [];

      // check row above if this is not the first row
      if(row > 0) {
        // check column to the left if this is not the first column
        if(column > 0) {
            // get the spot above and to the left
            adjacentSpots.push(getSpot(minefield, row - 1, column - 1));
        }

        // get the spot right above
        adjacentSpots.push(getSpot(minefield, row - 1, column));

        // check column to the right if this is not the last column
        if(column < $scope.width - 1) {
            // get the spot above and to the right
            adjacentSpots.push(getSpot(minefield, row - 1, column + 1));
        }
      }

      // check column to the left if this is not the first column
      if(column > 0) {
        // get the spot to the left
        adjacentSpots.push(getSpot(minefield, row, column - 1));
      }

      // check column to the right if this is not the last column
      if(column < $scope.width - 1) {
        // get the spot to the right
        adjacentSpots.push(getSpot(minefield, row, column + 1));
      }

      // check row below if this is not the last row
      if(row < $scope.height - 1) {
        // check column to the left if this is not the first column
        if(column > 0) {
            // get the spot below and to the left
            adjacentSpots.push(getSpot(minefield, row + 1, column - 1));
        }

        // get the spot right below
        adjacentSpots.push(getSpot(minefield, row + 1, column));

        // check column to the right if this is not the last column
        if(column < $scope.width - 1) {
            // get the spot below and to the right
            adjacentSpots.push(getSpot(minefield, row + 1, column + 1));
        }
      }
      return adjacentSpots;
    }

    function calculateNumber(minefield, row, column) {
      var thisSpot = getSpot(minefield, row, column);
      var adjacentMines = 0;
      // if this spot contains a mine then we can't place a number here
      if(thisSpot.content == "mine") {
        return;
      }
      else {
        var adjacentSpots = getAdjacentSpots(minefield, row, column);
        angular.forEach(adjacentSpots, function(spot) {
          if(spot.content == "mine") {
            adjacentMines++;
          }
        });
        if(adjacentMines > 0) {
          thisSpot.content = adjacentMines;
        }
      }
    }

    function calculateAllNumbers(minefield) {
      for(var y = 0; y < $scope.height; y++) {
        for(var x = 0; x < $scope.width; x++) {
          calculateNumber(minefield, x, y);
        }
      }
    }

    function createMinefield() {
      var minefield = {};
      minefield.rows = [];

      for(var i = 0; i < $scope.height; i++) {
        var row = {};
        row.spots = [];

        for(var j = 0; j < $scope.width; j++) {
            var spot = {};
            spot.row = i;
            spot.column = j;
            spot.isCovered = true;
            spot.isFlagged = false;
            spot.content = "empty";
            row.spots.push(spot);
        }

        minefield.rows.push(row);
      }

      placeNMines(minefield);
      calculateAllNumbers(minefield);
      return minefield;
    }

    function hasWon(minefield) {
      for(var y = 0; y < $scope.height; y++) {
        for(var x = 0; x < $scope.width; x++) {
          var spot = getSpot(minefield, y, x);
          if(spot.isCovered && spot.content != "mine") {
            return false;
          }
        }
      }
      return true;
    }

    function uncoverSpots(spot) {
      if (spot.content !== "empty") {
        spot.isCovered = false;
        return;
      }
      if (spot.content === "empty" && spot.isCovered === true){
        spot.isCovered = false;
        var adjacentSpots = getAdjacentSpots(minefield, spot.row, spot.column);
        angular.forEach(adjacentSpots, function(spot) {
          uncoverSpots(spot);
        });
      }
    }

    $scope.uncoverSpot = function(spot) {
      if(spot.content === "mine") {
        spot.isCovered = false;
        $scope.isLostMessageVisible = true;
      }
      else {
        uncoverSpots(spot);
      }
      if(hasWon($scope.minefield)) {
        $scope.isWinMessageVisible = true;
      }
    };

    $scope.flagSpot = function(spot) {
      spot.isFlagged = spot.isFlagged ? false : true;
    };

    $scope.minefield = createMinefield();
    window.minefield = $scope.minefield;

  });
