angular.module("app").controller "CardsCtrl",  ($scope, $state, $translate, $timeout) ->

  $scope.basic_colors = [
    '#F44336', '#9C27B0', '#3F51B5', '#009688', '#CDDC39',
    '#FF5722', '#795548', '#607D8B'

  ]
  $scope.completed = false
  # Some extra colors to make 5x5 cube
  # '#4CAF50', , '#E91E63',
  # '#FFC107', '#FF9800', '#607D8B', '#795548', '#FF5722'



  $scope.init = () ->
    $scope.completed = false
    $scope.colors = $scope.basic_colors
    $scope.colors = _.shuffle($scope.colors.concat($scope.colors))
    $scope.buffer = []
    $scope.cards = []
    for i,index in $scope.colors
      card =
        color: i
        done: false
        close: true
        id: index
      $scope.cards.push card

  $scope.item_state = (item) ->
    if item.close && !item.done
      return true
    else
      return false

  $scope.toggle = (item) ->

    # If we already found color couple
    if !item.done

      # If we already clicked that card and it is in the buffer
      is_selected = $scope.buffer.indexOf(item)

      if is_selected == -1

        switch $scope.buffer.length
          when 0
            item.close = false
            $scope.buffer.push item

          when 1
            item.close = false

            if $scope.buffer[0].color == item.color
              $scope.buffer[0].done = true
              item.done = true
              $scope.buffer = []

              left = _.where($scope.cards, {done: false})
              if left.length == 0
                $scope.completed = true
                console.log 'hello'
            else
              $scope.buffer.push item

          when 2
            $scope.buffer[0].close = true
            $scope.buffer[1].close = true
            $scope.buffer = []
            item.close = false
            $scope.buffer.push item


  $scope.init()
