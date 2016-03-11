
###*
* @ngdoc directive
* @name rowWrapFill
* @element area
###
angular.module("app").directive "rowWrapFill", ($compile) ->
  {
    restrict: 'A',
    scope: {},
    link: (scope, elm, attrs) ->
      if (scope.$parent.$last)
        parent_width = elm[0].parentNode.clientWidth;
        child_width = elm[0].clientWidth;
        length = scope.$parent.$index + 1;

        if length > 0
          theStyle = window.getComputedStyle(elm[0], null);


          # If there is a border - recalculate chid width
          if (theStyle.boxSizing == 'border-box')
            border = theStyle.borderWidth;
            border = parseInt(border.replace('px', ''));
            child_width += border * 2;

          max_column = Math.floor(parent_width / child_width);


          # Calculate numder of elements to add
          temp = length % max_column

          if temp != 0
            to_add = Math.abs(max_column - temp);
            for i in [0..to_add]
              blank_node = '<div style="width: ' + child_width + 'px;box-sizing: border-box;"></div>';
              node = $compile(blank_node)(scope)
              elm.parent().append(node)
  }
