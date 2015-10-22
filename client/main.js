angular.module('iplanApp', ['ngRoute'])
.config(function($routeProvider, $httpProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'index.html'
  })
  .when('/events/:event_id', {
    templateUrl: './eventView/eventView.html',
    controller: 'EventViewController'
  })
  .otherwise({
    redirectTo: '/'
  });
})
.run();

angular.module('iplanApp')
.controller('MainController', ['HttpService', 'DataService', '$location', MainController]);

function MainController(HttpService, DataService, $location){
  var self = this; // bound to input box
  self.currentEvent = DataService.currentEvent;

  self.postEvent = function(){
    HttpService.postEvent({name: self.eventName})
    .then(function(response){
      //DataService.setCurrentEvent(response.data);
      $location.path('/events/' + response.data.id);
      DataService.setEvent();
      console.log('success response: ', response.data);
    })
    .catch(function(err){
      console.log('error in posting event: ', err);
    });
    self.eventName = '';
  };

  self.getEvent = function(){
    console.log('fetching curr evt fr DataService: ', self.currentEvent);
    return self.currentEvent;
  }
}
