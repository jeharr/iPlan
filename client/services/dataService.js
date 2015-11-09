(function(){
  angular.module('iplanApp')
  .factory('DataService', function(){
    var newEvent = {status: false};
    var currentEvent = {};
    var currentUser = {};
    var events = [];
    var users = [];
    var isHost = {status: false};

    var setCurrentEvent = function(eventData){
      for(var key in currentEvent){
        delete currentEvent[key];
      }

      for(var key in eventData){
        currentEvent[key] = eventData[key];
      }
      findHost();
      console.log(isHost.status);
      return currentEvent;
    };

    var toggleEventForm = function() {
      newEvent.status = !newEvent.status;
    }

    var clearCurrentEvent = function(){
      for(var key in currentEvent){
        delete currentEvent[key];
      }
      return currentEvent;
    }

    var getCurrentEvent = function(){
      return currentEvent;
    };

    var setCurrentUser = function(userData){
      for(var key in userData){
        currentUser[key] = userData[key];
      }
      return currentUser;
    };

    var clearData = function(){
      clearCurrentEvent();
      for(var key in self.currentUser){
        delete currentUser[key];
      }
      events.forEach(function(evt, index){
        delete events[index];
      });
      users.forEach(function(usr, index){
        delete users[index];
      });
    };

    var getCurrentUser = function(){
      return currentUser;
    };

    var setEvents = function(evts){
      for(var i = 0; i < events.length; i++){
        delete events[i];
      }
      evts.forEach(function(evt, index){
        events[index] = evt;
      });
      console.log('setEvents from DataService: ', events);
      return events;
    };

    var setUsers = function(evtUsers){
      console.log('evtUsers coming ing to DataService.setUsers: ', evtUsers);
      for(var i = 0; i < users.length; i++){
        delete users[i];
      }

      for(var j = 0; j < evtUsers.length; j++){
        users[j] = evtUsers[j].user;
      }
      console.log('setUsers from DataService: ', users);
      return users;
    };

    var findHost = function(){
      if (currentEvent.eventsUsers && currentUser.email === currentEvent.eventsUsers[0].email){
        isHost.status = true;
      } else {
        isHost.status = false;
      }
    };

    var getHost = function(){
      return isHost;
    };

    return {
      currentEvent: currentEvent,
      currentUser: currentUser,
      newEvent: newEvent,
      toggleEventForm: toggleEventForm,
      events: events,
      users: users,
      setEvents: setEvents,
      setCurrentEvent: setCurrentEvent,
      clearCurrentEvent: clearCurrentEvent,
      getCurrentEvent: getCurrentEvent,
      setCurrentUser: setCurrentUser,
      clearData: clearData,
      getCurrentUser: getCurrentUser,
      setUsers: setUsers,
      findHost: findHost,
      isHost: isHost,
      getHost: getHost
    };
  });
})();
