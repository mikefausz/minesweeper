angular
  .module('minesweeper', ['ngRoute', 'ngSanitize'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: "minesweeper/templates/home.html",
        controller: 'HomeController'
      });
  });
