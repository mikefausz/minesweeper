angular
  .module('minesweeper')
  .controller('HomeController', function($scope) {
    // default game options
    $scope.height = 9;
    $scope.width = 9;
    $scope.mines = 10;
    var mineLocations = [];

    $scope.isWinMessageVisible = false;
    $scope.isLostMessageVisible = false;
    var gameOver = false;

    // return spot at given coordinates
    function getSpot(minefield, row, column) {
      return minefield.rows[row].spots[column];
    }

    // place mine at a random empty spot
    function placeRandomMine(minefield) {
      var minePlaced = false;
      do {
        var row = Math.round(Math.random() * ($scope.height - 1));
        var column = Math.round(Math.random() * ($scope.width - 1));
        var spot = getSpot(minefield, row, column);
        if (spot.content != "mine") {
          spot.content = "mine";
          mineLocations.push(spot);
          minePlaced = true;
          console.log("MINE placed at [ " + row + ", " + column + "]");
        }
        else {
          console.log("MINE already at [ " + row + ", " + column + "] Placing another");
        }
      } while (!minePlaced);
    }

    // place given number of mines
    function placeNMines(minefield) {
      for(var i = 0; i < $scope.mines; i++) {
        placeRandomMine(minefield);
      }
    }

    // returns an array of all adjacent spots on minefield
    function getAdjacentSpots(minefield, row, column) {
      var thisSpot = getSpot(minefield, row, column);
      var adjacentSpots = [];

      // IF this is not the first row
      if(row > 0) {
        // IF this is not the first column
        if(column > 0) {
            // get the spot ABOVE LEFT
            adjacentSpots.push(getSpot(minefield, row - 1, column - 1));
        }

        // get the spot ABOVE
        adjacentSpots.push(getSpot(minefield, row - 1, column));

        // IF this is not the last column
        if(column < $scope.width - 1) {
            // get the spot ABOVE RIGHT
            adjacentSpots.push(getSpot(minefield, row - 1, column + 1));
        }
      }

      // IF this is not the first column
      if(column > 0) {
        // get the spot to the LEFT
        adjacentSpots.push(getSpot(minefield, row, column - 1));
      }

      // IF this is not the last column
      if(column < $scope.width - 1) {
        // get the spot to the RIGHT
        adjacentSpots.push(getSpot(minefield, row, column + 1));
      }

      // IF this is not the last row
      if(row < $scope.height - 1) {
        // IF this is not the first column
        if(column > 0) {
            // get the spot BELOW LEFT
            adjacentSpots.push(getSpot(minefield, row + 1, column - 1));
        }

        // get the spot BELOW
        adjacentSpots.push(getSpot(minefield, row + 1, column));

        // IF this is not the last column
        if(column < $scope.width - 1) {
            // get the spot BELOW RIGHT
            adjacentSpots.push(getSpot(minefield, row + 1, column + 1));
        }
      }
      return adjacentSpots;
    }

    // counts number of mines adjacent to given spot
    function calculateNumber(minefield, row, column) {
      var thisSpot = getSpot(minefield, row, column);
      var adjacentMines = 0;
      // if this spot contains a mine then exit
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

    // calculate adjacent mines for every spot on board
    function calculateAllNumbers(minefield) {
      for(var row = 0; row < $scope.height; row++) {
        for(var column = 0; column < $scope.width; column++) {
          calculateNumber(minefield, row, column);
        }
      }
    }

    // instantiate minefield, add mines and numbers
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
            spot.mineWrong = false;
            spot.flagState = "unflagged";
            spot.content = "empty";
            row.spots.push(spot);
        }

        minefield.rows.push(row);
      }

      placeNMines(minefield);
      calculateAllNumbers(minefield);
      return minefield;
    }

    // check to see if player has
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

    // return spot image based on state
    $scope.getImg = function(spot) {
      if(spot.isCovered) {
        switch (spot.flagState) {
          case "flagged":
            return (gameOver && spot.content != "mine") ? "minesweeper/images/flag-mine-wrong.png" : "minesweeper/images/flag-mine.png";
          case "suspect":
            return "minesweeper/images/flag-suspect.png";
          default:
            return "minesweeper/images/covered.png";
        }
      }
      else {
        switch (spot.content) {
          case "mine":
            if(spot.flagState === "flagged") {
              return "minesweeper/images/flag-mine.png";
            }
            else {
              return spot.mineWrong ? "minesweeper/images/mine-wrong.png" : "minesweeper/images/mine.png";
            }
          case 1:
            return "minesweeper/images/number-1.png";
          case 2:
            return "minesweeper/images/number-2.png";
          case 3:
            return "minesweeper/images/number-3.png";
          case 4:
            return "minesweeper/images/number-4.png";
          case 5:
            return "minesweeper/images/number-5.png";
          case 6:
            return "minesweeper/images/number-6.png";
          case 7:
            return "minesweeper/images/number-7.png";
          case 8:
            return "minesweeper/images/number-8.png";
          default:
            return "minesweeper/images/empty.png";
        }
      }
    };

    // return spot image based on state
    $scope.getClass = function(spot) {
      if(spot.isCovered) {
        switch (spot.flagState) {
          case "flagged":
            return (gameOver && spot.content != "mine") ? "minesweeper/images/flag-mine-wrong.png" : "minesweeper/images/flag-mine.png";
          case "suspect":
            return "minesweeper/images/flag-suspect.png";
          default:
            return "covered";
        }
      }
      else {
        switch (spot.content) {
          case "mine":
            if(spot.flagState === "flagged") {
              return "minesweeper/images/flag-mine.png";
            }
            else {
              return spot.mineWrong ? "minesweeper/images/mine-wrong.png" : "minesweeper/images/mine.png";
            }
          case 1:
            return "number";
          case 2:
            return "number";
          case 3:
            return "number";
          case 4:
            return "number";
          case 5:
            return "number";
          case 6:
            return "number";
          case 7:
            return "number";
          case 8:
            return "number";
          default:
            return "empty";
        }
      }
    };

    // recursively determine outcome of clicking on safe spot
    function uncoverSpots(spot) {
      // BASE CASE number clicked
      if (spot.content !== "empty") {
        spot.isCovered = false;
        return;
      }
      // IF empty spot clicked, uncover all adjacent, repeat
      if (spot.content === "empty" && spot.isCovered === true){
        spot.isCovered = false;
        var adjacentSpots = getAdjacentSpots(minefield, spot.row, spot.column);
        angular.forEach(adjacentSpots, function(spot) {
          uncoverSpots(spot);
        });
      }
    }

    // determine outcome from clicking on given spot
    $scope.uncoverSpot = function(spot) {
      // disable click function if game is over
      if(!gameOver) {
        if(spot.content === "mine") {
          spot.isCovered = false;
          spot.mineWrong = true;
          angular.forEach(mineLocations, function(mine) {
            getSpot($scope.minefield, mine.row, mine.column).isCovered = false;
          });
          $scope.isLostMessageVisible = true;
          gameOver = true;
        }
        else {
          uncoverSpots(spot);
        }
        if(hasWon($scope.minefield)) {
          $scope.isWinMessageVisible = true;
          gameOver = true;
        }
      }
    };

    // toggle spot between flag states, update mines left count
    $scope.flagSpot = function(spot) {
      switch (spot.flagState) {
        case "unflagged":
          spot.flagState = "flagged";
          $scope.mines -= 1;
          break;
        case "flagged":
          spot.flagState = "suspect";
          $scope.mines += 1;
          break;
        case "suspect":
          spot.flagState = "unflagged";
          break;
        default:
          console.log("FLAG STATE ERROR");
      }
    };

    // reset defaults, re-instantiate minefield with given options
    $scope.newGame = function(height, width, mines) {
      $scope.height = height;
      $scope.width = width;
      $scope.mines = mines;
      mineLocations = [];

      $scope.isWinMessageVisible = false;
      $scope.isLostMessageVisible = false;
      gameOver = false;

      $scope.minefield = createMinefield();
      window.minefield = $scope.minefield;
    };

    // instantiate minefield
    $scope.minefield = createMinefield();
    window.minefield = $scope.minefield;
  });
