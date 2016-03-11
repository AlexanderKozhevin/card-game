angular.module("app").directive "componentDataRing", ($timeout) ->
  {
    restrict: 'E',
    templateUrl: "data_ring/data_ring.html",
    require: 'ngModel',
    scope: {},
    link: (scope, elm, attrs, ngModel) ->
      ngModel.$render = () ->
        circle = angular.element(elm).find('div')
        scope.value = ngModel.$viewValue

        circle.removeClass('green');
        circle.removeClass('yellow');
        circle.removeClass('red');

        if scope.value<25
          circle.addClass('green');
        if (scope.value>=25) and (scope.value<=75)
          circle.addClass('yellow');

        if scope.value>75
          circle.addClass('red');


  }
