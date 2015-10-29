<<<<<<< HEAD
(function(){
  angular.module('iplanApp')
  .controller('MainController', ['HttpService', 'DataService', '$location', '$window', 'store', MainController]);
=======
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
>>>>>>> 27dc421ca7f6042c7ae4db041014461617e692bb

    function MainController(HttpService, DataService, $location, $window, store){
      var self = this;
      // self.currentEvent = DataService.currentEvent;
      self.userId;

      var profile = store.get('profile');

<<<<<<< HEAD
      if(profile){
        HttpService.getUser(profile.identities[0].user_id)
        .then(function(response){
          self.userId = response.data.id;
          console.log(self.userId);
        })
        .catch(function(err){
          console.log('error in main controller ', err);
        });
      } else {
        console.log('Please Login!');
      }
=======
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
>>>>>>> 27dc421ca7f6042c7ae4db041014461617e692bb

    // self.getEvent = function(){
    //   console.log('fetching curr evt fr DataService: ', self.currentEvent);
    //   return self.currentEvent;
    // }
  }
<<<<<<< HEAD
})();
=======
}
>>>>>>> 27dc421ca7f6042c7ae4db041014461617e692bb
