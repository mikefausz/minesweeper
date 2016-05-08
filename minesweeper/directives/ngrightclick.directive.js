// Got this directive from http://jsfiddle.net/bcaudan/vTZZ5/
angular
  .module('minesweeper')
  .directive('ngRightClick', ngRightClick);

  function ngRightClick($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
  }
