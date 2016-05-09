angular
  .module('minesweeper')
  .controller('HomeController', function($scope) {
    var w = 9;
    var h = 9;
    var n = 10;

    function getSpot(minefield, row, column) {
      return minefield.rows[row].spots[column];
    }

    function placeRandomMine(height, width, minefield) {
      var minePlaced = false;
      do {
        var row = Math.round(Math.random() * (height - 1));
        var column = Math.round(Math.random() * (width - 1));
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

    function placeNMines(n, height, width, minefield) {
      for(var i = 0; i < n; i++) {
        placeRandomMine(height, width, minefield);
      }
    }

    function getAdjacentSpots(minefield, height, width, row, column) {
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
        if(column < width - 1) {
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
    if(column < width - 1) {
        // get the spot to the right
        adjacentSpots.push(getSpot(minefield, row, column + 1));
    }

    // check row below if this is not the last row
    if(row < height - 1) {
        // check column to the left if this is not the first column
        if(column > 0) {
            // get the spot below and to the left
            adjacentSpots.push(getSpot(minefield, row + 1, column - 1));
        }

        // get the spot right below
        adjacentSpots.push(getSpot(minefield, row + 1, column));

        // check column to the right if this is not the last column
        if(column < width - 1) {
            // get the spot below and to the right
            adjacentSpots.push(getSpot(minefield, row + 1, column + 1));
        }
    }
    return adjacentSpots;
}
//     function calculateNumber(minefield, height, width, row, column) {
//       var thisSpot = getSpot(minefield, row, column);
//
//       // if this spot contains a mine then we can't place a number here
//       if(thisSpot.content == "mine") {
//         return;
//       }
//
//       var mineCount = 0;
//
//       // check row above if this is not the first row
//       if(row > 0) {
//         // check column to the left if this is not the first column
//         if(column > 0) {
//             // get the spot above and to the left
//             var spot = getSpot(minefield, row - 1, column - 1);
//             if(spot.content == "mine") {
//                 mineCount++;
//             }
//         }
//
//         // get the spot right above
//         var spot = getSpot(minefield, row - 1, column);
//         if(spot.content == "mine") {
//             mineCount++;
//         }
//
//         // check column to the right if this is not the last column
//         if(column < width - 1) {
//             // get the spot above and to the right
//             var spot = getSpot(minefield, row - 1, column + 1);
//             if(spot.content == "mine") {
//                 mineCount++;
//             }
//         }
//     }
//
//     // check column to the left if this is not the first column
//     if(column > 0) {
//         // get the spot to the left
//         var spot = getSpot(minefield, row, column - 1);
//         if(spot.content == "mine") {
//             mineCount++;
//         }
//     }
//
//     // check column to the right if this is not the last column
//     if(column < width - 1) {
//         // get the spot to the right
//         var spot = getSpot(minefield, row, column + 1);
//         if(spot.content == "mine") {
//             mineCount++;
//         }
//     }
//
//     // check row below if this is not the last row
//     if(row < height - 1) {
//         // check column to the left if this is not the first column
//         if(column > 0) {
//             // get the spot below and to the left
//             var spot = getSpot(minefield, row + 1, column - 1);
//             if(spot.content == "mine") {
//                 mineCount++;
//             }
//         }
//
//         // get the spot right below
//         var spot = getSpot(minefield, row + 1, column);
//         if(spot.content == "mine") {
//             mineCount++;
//         }
//
//         // check column to the right if this is not the last column
//         if(column < width - 1) {
//             // get the spot below and to the right
//             var spot = getSpot(minefield, row + 1, column + 1);
//             if(spot.content == "mine") {
//                 mineCount++;
//             }
//         }
//     }
//
//     if(mineCount > 0) {
//         thisSpot.content = mineCount;
//     }
// }

    function calculateNumber(minefield, height, width, row, column) {
      var thisSpot = getSpot(minefield, row, column);
      var adjacentMines = 0;
      // if this spot contains a mine then we can't place a number here
      if(thisSpot.content == "mine") {
        return;
      }
      else {
        var adjacentSpots = getAdjacentSpots(minefield, height, width, row, column);
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

    function calculateAllNumbers(height, width, minefield) {
      for(var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
          calculateNumber(minefield, height, width, x, y);
        }
      }
    }

    function createMinefield(n, height, width) {
      var minefield = {};
      minefield.rows = [];

      for(var i = 0; i < height; i++) {
        var row = {};
        row.spots = [];

        for(var j = 0; j < width; j++) {
            var spot = {};
            spot.isCovered = true;
            spot.isFlagged = false;
            spot.content = "empty";
            row.spots.push(spot);
        }

        minefield.rows.push(row);
      }

      placeNMines(n, height, width, minefield);
      calculateAllNumbers(height, width, minefield);
      return minefield;
    }

    function hasWon(height, width, minefield) {
      for(var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
          var spot = getSpot(minefield, y, x);
          if(spot.isCovered && spot.content != "mine") {
            return false;
          }
        }
      }
      return true;
    }

    // TODO check adjacent spots if empty uncovered
    $scope.uncoverSpot = function(spot) {
      spot.isCovered = false;
      
      if(spot.content == "mine") {
        $scope.isLostMessageVisible = true;
      }
      else if(hasWon(h, w, $scope.minefield)) {
        $scope.isWinMessageVisible = true;
      }
    };

    $scope.flagSpot = function(spot) {
      spot.isFlagged = spot.isFlagged ? false : true;
    };

    $scope.minefield = createMinefield(n, h, w);
    window.minefield = $scope.minefield;

  });
