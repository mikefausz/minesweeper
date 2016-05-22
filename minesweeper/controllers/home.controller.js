angular
  .module('minesweeper')
  .controller('HomeController', function($scope) {
    // default game options
    $scope.difficulty = "EASY";
    $scope.height = 9;
    $scope.width = 9;
    $scope.mines = 10;
    var mineLocations = [];

    $scope.isWinMessageVisible = false;
    $scope.isLostMessageVisible = false;
    var gameOver = false;

    // return spot at given coordinates
    function getSpot(minefield, column, row) {
      return minefield.columns[column].spots[row];
    }

    // place mine at a random empty spot
    function placeRandomMine(minefield) {
      var minePlaced = false;
      do {
        var column = Math.round(Math.random() * ($scope.width - 1));
        var row = Math.round(Math.random() * ($scope.height - 1));
        var spot = getSpot(minefield, column, row);
        if (spot.content != "mine") {
          spot.content = "mine";
          mineLocations.push(spot);
          minePlaced = true;
          console.log("MINE placed at [ " + column + ", " + row + "]");
        }
        else {
          console.log("MINE already at [ " + column + ", " + row + "] Placing another");
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
    function getAdjacentSpots(minefield, column, row) {
      var thisSpot = getSpot(minefield, column, row);
      var adjacentSpots = [];

      // IF this is not the first row
      if(column > 0) {
        // IF this is not the first column
        if(row > 0) {
            // get the spot ABOVE LEFT
            adjacentSpots.push(getSpot(minefield, column - 1, row - 1));
        }

        // get the spot ABOVE
        adjacentSpots.push(getSpot(minefield, column - 1, row));

        // IF this is not the last column
        if(row < $scope.height - 1) {
            // get the spot ABOVE RIGHT
            adjacentSpots.push(getSpot(minefield, column - 1, row + 1));
        }
      }

      // IF this is not the first column
      if(row > 0) {
        // get the spot to the LEFT
        adjacentSpots.push(getSpot(minefield, column, row - 1));
      }

      // IF this is not the last column
      if(row < $scope.height - 1) {
        // get the spot to the RIGHT
        adjacentSpots.push(getSpot(minefield, column, row + 1));
      }

      // IF this is not the last row
      if(column < $scope.width - 1) {
        // IF this is not the first column
        if(row> 0) {
            // get the spot BELOW LEFT
            adjacentSpots.push(getSpot(minefield, column + 1, row - 1));
        }

        // get the spot BELOW
        adjacentSpots.push(getSpot(minefield, column + 1, row));

        // IF this is not the last column
        if(row < $scope.height - 1) {
            // get the spot BELOW RIGHT
            adjacentSpots.push(getSpot(minefield, column + 1, row + 1));
        }
      }
      return adjacentSpots;
    }

    // counts number of mines adjacent to given spot
    function calculateNumber(minefield, column, row) {
      var thisSpot = getSpot(minefield, column, row);
      var adjacentMines = 0;
      // if this spot contains a mine then exit
      if(thisSpot.content == "mine") {
        return;
      }
      else {
        var adjacentSpots = getAdjacentSpots(minefield, column, row);
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
      for(var column = 0; column < $scope.width; column++) {
        for(var row = 0; row < $scope.height; row++) {
          calculateNumber(minefield, column, row);
        }
      }
    }

    // instantiate minefield, add mines and numbers
    function createMinefield() {
      var minefield = {};
      minefield.columns = [];

      for(var i = 0; i < $scope.width; i++) {
        var column = {};
        column.spots = [];

        for(var j = 0; j < $scope.height; j++) {
            var spot = {};
            spot.column = i;
            spot.row = j;
            spot.isCovered = true;
            spot.mineWrong = false;
            spot.flagState = "unflagged";
            spot.content = "empty";
            column.spots.push(spot);
        }

        minefield.columns.push(column);
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

    $scope.getContent = function(spot) {
      if(spot.isCovered) {
        switch (spot.flagState) {
          case "flagged":
            return (gameOver && spot.content != "mine") ? "<i class='fa fa-flag' aria-hidden='true'></i>" : "<i class='fa fa-flag' aria-hidden='true'></i>";
          case "suspect":
            return "<i class='fa fa-question' aria-hidden='true'></i>";
          default:
            return "";
        }
      }
      else {
        switch (spot.content) {
          case "mine":
            if(spot.flagState === "flagged") {
              return "<i class='fa fa-flag' aria-hidden='true'></i>";
            }
            else {
              return spot.mineWrong ? "<i class='fa fa-bomb' aria-hidden='true'></i>" : "<i class='fa fa-bomb' aria-hidden='true'></i>";
            }
          case "empty":
            return "";
          default:
            return spot.content;
        }
      }
    };

    // return spot image based on state
    $scope.getClass = function(spot) {
      if(spot.isCovered) {
        switch (spot.flagState) {
          case "flagged":
            return (gameOver && spot.content != "mine") ? "spot flag-wrong" : "spot flag";
          case "suspect":
            return "spot suspect";
          default:
            return "spot covered";
        }
      }
      else {
        switch (spot.content) {
          case "mine":
            if(spot.flagState === "flagged") {
              return "spot flag";
            }
            else {
              return spot.mineWrong ? "spot mine-wrong" : "spot mine";
            }
          case 1:
            return "spot number";
          case 2:
            return "spot number";
          case 3:
            return "spot number";
          case 4:
            return "spot number";
          case 5:
            return "spot number";
          case 6:
            return "spot number";
          case 7:
            return "spot number";
          case 8:
            return "spot number";
          default:
            return "spot empty";
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
        var adjacentSpots = getAdjacentSpots(minefield, spot.column, spot.row);
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
            getSpot($scope.minefield, mine.column, mine.row).isCovered = false;
          });
          gameOver = true;
          $scope.isLostMessageVisible = true;
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
      if (spot.isCovered && !gameOver) {
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
    }
    };

    // reset defaults, re-instantiate minefield with given options
    $scope.newGame = function(difficulty) {
      switch (difficulty) {
        case "MEDIUM":
          $scope.difficulty = "MEDIUM";
          $scope.height = 16;
          $scope.width = 16;
          $scope.mines = 40;
          break;
        case "HARD":
          $scope.difficulty = "HARD";
          $scope.height = 16;
          $scope.width = 30;
          $scope.mines = 99;
          break;
        default:
          $scope.difficulty = "EASY";
          $scope.height = 9;
          $scope.width = 9;
          $scope.mines = 10;
          break;  
      }

      mineLocations = [];
      gameOver = false;
      $scope.isWinMessageVisible = false;
      $scope.isLostMessageVisible = false;

      $scope.minefield = createMinefield();
      window.minefield = $scope.minefield;
    };

    // instantiate minefield
    $scope.minefield = createMinefield();
    window.minefield = $scope.minefield;
  });
