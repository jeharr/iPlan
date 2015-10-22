angular.module('iplanApp')
.factory('DataService', ['HttpService', '$location', function(HttpService, $location){

  var currentEvent = {};
  var currentUser = {};

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
