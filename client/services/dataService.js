<<<<<<< HEAD
(function(){
  angular.module('iplanApp')
  .factory('DataService', function(){
=======
angular.module('iplanApp')
.factory('DataService', ['HttpService', '$location', function(HttpService, $location){
>>>>>>> 27dc421ca7f6042c7ae4db041014461617e692bb

    var currentEvent = {};
    var currentUser = {};
    var currentGuest = [];

<<<<<<< HEAD
    var setCurrentEvent = function(eventData){
      for(var key in eventData){
        currentEvent[key] = eventData[key];
      }
      console.log("this is the current event ", currentEvent);
    };
    var getCurrentEvent = function(){
      return currentEvent;
    };
    var setCurrentUser = function(userData){
      for(var key in userData){
        currentUser[key] = userData[key];
      }
      console.log('DataService setCurrentUser: ', currentUser);
    };
    var getCurrentUser = function(){
      return currentUser;
    };

    var setCurrentGuest = function(guestData){
        currentGuest.push(guestData);
    };

    var getCurrentGuest = function(){
      return currentGuest;
    };

    return {
      currentEvent: currentEvent,
      currentUser: currentUser,
      currentGuest: currentGuest,
      setCurrentEvent: setCurrentEvent,
      getCurrentEvent: getCurrentEvent,
      setCurrentUser: setCurrentUser,
      getCurrentUser: getCurrentUser,
      setCurrentGuest: setCurrentGuest,
      getCurrentGuest: getCurrentGuest
    };
  });
})();
=======
  var setCurrentEvent = function(eventData){
    for(var key in eventData){
      currentEvent[key] = eventData[key];
    }
    console.log("this is the current event ", currentEvent);
  };
  var getCurrentEvent = function(){
    return currentEvent;
  };
  var setCurrentUser = function(userData){
    currentUser = userData;
  };
  var getCurrentUser = function(userId){
    return currentUser;
  };
  var setEvent = function(){
    var evtId = $location.$$path.replace('/events/', '');
    HttpService.getEvent(evtId)
    .then(function(response){
      setCurrentEvent(response.data);
      return response.data;
    })
    .catch(function(err){
      console.log('err in evtCtrl setEvent: ', err);
    });
  }

  return {
    currentEvent: currentEvent,
    setCurrentEvent: setCurrentEvent,
    getCurrentEvent: getCurrentEvent,
    setCurrentUser: setCurrentUser,
    getCurrentUser: getCurrentUser,
    setEvent: setEvent
  };

}]);
>>>>>>> 27dc421ca7f6042c7ae4db041014461617e692bb
