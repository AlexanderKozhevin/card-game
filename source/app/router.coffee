angular.module('app').config ($stateProvider, $urlRouterProvider, $locationProvider) ->

  $locationProvider.html5Mode({enabled: true, requireBase: false})
  $urlRouterProvider.otherwise("/");

  $stateProvider.state 'main',
    url: '/'
    abstract: false,
    views:
      root: {templateUrl: 'cards.html', controller: 'CardsCtrl'}
