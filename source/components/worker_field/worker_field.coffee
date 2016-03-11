angular.module("app").directive "componentWorkerField", () ->
  {
    restrict: 'E',
    templateUrl: "worker_field/worker_field.html",
    require: 'ngModel',
    scope: {},
    link: (scope, elm, attrs, ngModel) ->
      ngModel.$render = () ->
        scope.last = scope.$parent.$last
        scope.index = scope.$parent.$index
        scope.item = ngModel.$viewValue

  }
