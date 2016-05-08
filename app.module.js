angular
  .module('minesweeper', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: "minesweeper/templates/home.html",
        controller: 'HomeController'
      });
  });
