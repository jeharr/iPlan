(function(){
  angular.module('iplanApp')
  .controller('EventViewController', ['HttpService', 'DataService', '$location', '$route', '$routeParams', '$window', '$filter', '$interval', EventViewController])
  .directive('eventViewDir', eventViewDir)
  .directive('eventList', eventList);

  function EventViewController(HttpService, DataService, $location, $route, $routeParams, $window, $filter, $interval){ // inject http service, EventService factory
    var self = this;
    self.toggle = {};
    self.placeName;   // tied to input box in eventView.html
    self.choices = []; //
    self.events = DataService.events;
    self.guests = DataService.users;
    self.currentUser = DataService.currentUser;
    self.currentEvent = DataService.currentEvent;
    self.eventCode = $location.path().replace('/events/', '');
    self.hidePlace = false;
    self.getTimer = false;
    self.timerInfo = false;
    self.isThereTime = false;
    self.cutVoting = true;
    self.showEditing = true;
    self.showEditingLocation = true;
    self.showDate = true;
    self.showTime = true;
    self.toggleCutOff = true;

    self.showPlace = function(place) {
      if(self.lastChosen === place) {
        if(!self.hidePlace) {
          self.hidePlace = true;
        } else {
          self.hidePlace = false;
        }
      } else {
        self.hidePlace = true;
      }

      self.selectedAddress = place.address;
      self.selectedRating = place.rating_img;
      self.lastChosen = place;
    }

    self.setEvent = function(){
      if(self.eventCode.length === 10){ // checking if we have a code
        HttpService.getEvent(self.eventCode)
        .then(function(response){
          DataService.setCurrentEvent(response.data);
          angular.forEach(response.data.places, function(val, key){
            self.toggle[val.id] = self.toggle[val.id] || false;
          });
          self.setUsersEvent();
          self.setEventsUser();
          return response.data;
        })
        .catch(function(err){
          console.log('err in evtCtrl setEvent: ', err);
        });
      }
    };

    self.refresh = function(evtCode){
      self.eventCode = evtCode;
      self.setEvent();
      self.setUsersEvent();
      self.setEventsUser();
    };

    self.clearEvent = function(){
      DataService.clearCurrentEvent();
      $location.path('/');
    }

    self.deleteEvent = function(id){
      HttpService.deleteEvent(id)
      .then(function(response){
        console.log('deleteEvent success: ', self.eventCode);
      })
      .catch(function(err){
        console.log('error in deleting event: ', err);
      });

      HttpService.deleteEventsUsers(id)
      .then(function(response){
        self.clearEvent();
        $window.location.reload();
        console.log('deleteEventsUsers success: ', self.eventCode);
      })
      .catch(function(err){
        console.log('error in deleting eventsusers: ', err);
      });

    }

    self.setUsersEvent = function(){
      if(self.eventCode.length === 10){
        HttpService.getUsers(self.eventCode)
        .then(function(users){
          DataService.setUsers(users.data);
        });
      }
    };

    self.setEventsUser = function(){
      HttpService.getEvents(self.currentUser.email)
      .then(function(evt){
        if(evt.data.length){
          DataService.setEvents(evt.data);
        }
      });
    };

    self.searchYelp = function(placeName){
      if(self.placeName.length > 2) {
        var term = self.placeName.split(' ').join('+');
        var location = self.currentEvent.location.split(' ').join('+');
        var limit = 5;
        HttpService.callYelp({
          term: term,
          location: location,
          limit: limit
        })
        .then(function(response){
          response.data.forEach(function(choice){
            self.choices.push(choice);
          });
        })
        .catch(function(err){console.log(err)});
      } else {
        self.choices = [];
      }
        self.placeName = '';
    };

    self.postPlace = function(choice){
      HttpService.postPlace({
        name: choice.name,
        address: choice.location.display_address[0] + ", " + choice.location.display_address[1],
        rating_img: choice.rating_img_url,
        url: choice.url,
        category: choice.categories[0][0],
        snippet: choice.snippet_text,
        location: choice.location.coordinate.latitude +','+ choice.location.coordinate.longitude,
        event_id: self.currentEvent.id
      })
      .then(function(response){
        self.refresh(self.currentEvent.code);
      })
      .catch(function(err){
        console.log('error in posting place: ', err);
      });
      self.placeName = '';
      self.choices = [];
    };

    self.deletePlace = function(id){
      HttpService.deletePlace(id)
      .then(function(response){
        self.refresh(self.currentEvent.code);
        console.log('self.eventCode in deletePlace success: ', self.eventCode);
      })
      .catch(function(err){
        console.log('error in deleting place: ', err);
      });
    }

    self.upVote = function(place) {
      if(!self.toggle[place.id]) {
        self.toggle[place.id] = true;
        place.votes++;
        HttpService.postPlace(place);
        return;
      } else if (self.toggle[place.id]){
        self.toggle[place.id] = false;
        place.votes--;
        HttpService.postPlace(place);
        return;
      }
      self.setEvent();
    };

    self.sendMail = function(){
      var newMail = {
        name: '',
        to: self.to,
        subject: 'iPlan: ' + self.currentUser.name + ' invited you to ' + self.currentEvent.name + '!',
        message: self.message + '\n' + 'link to ' + self.currentEvent.name + ':\n' + $location.absUrl()
      };

      var temp = self.to.replace(/ /g, '').split(',');

      temp.forEach(function(val, index){
        var found = false;
        var newUser = {
          email: val
        };

        HttpService.sendMail(newMail);

        HttpService.getUser(newUser.email)
        .then(function(response){
          if(!response.data){
            return HttpService.postUser(newUser);
          } 
          else {
            return response;
          }
        })
        .then(function(response){
          console.log('im in the post eventuser!', response.data);
          HttpService.postEventUser({
            event_id: self.currentEvent.id,
            event_code: self.currentEvent.code,
            user_id: response.data.id,
            email: response.data.email,
            user_role: 'guest'
          })
          .then(function(evtUser){
            self.refresh(self.currentEvent.code);
          })
          .catch(function(err){
            console.log('err in posting eventUser', err);
          });
        })
        .catch(function(err){
          console.log('err in postUser as guest: ', err);
        });
      });
    self.message = '';
    self.to = '';
    };

    self.createTimer = function(eventTimeCut) {
      HttpService.putEvent({
        cutoff: self.timerInfo,
        code: self.currentEvent.code
      })
      .then(function(response){
        self.refresh(response.data.code)
        self.isThereTime = true;
        self.timerInfo = ''
      })
      $window.location.reload()
    }

    self.checkDateTime = function() {
      //compare against js date format//
      //sat oct
      var date = new Date();
      var stringDate = date.toString();
      var dateMonth = stringDate.slice(4,7)
      var dateDay = stringDate.slice(8,10);
      var dateYear = stringDate.slice(11,15);
      var dateHour = stringDate.slice(16,18);
      var dateMinute = stringDate.slice(19,21);

      //cut off variables//
      var filteredDate = $filter('date')(self.currentEvent.cutoff, 'MMM dd yyyy HH:mm:ss')
      var filteredMonth = $filter('date')(self.currentEvent.cutoff, 'MMM')
      var filteredDay = $filter('date')(self.currentEvent.cutoff, 'dd')
      var filteredYear = $filter('date')(self.currentEvent.cutoff, 'yyyy')
      var filteredHour = $filter('date')(self.currentEvent.cutoff, 'HH')
      var filteredMinute = $filter('date')(self.currentEvent.cutoff, 'mm')

      //checking to see if the month, day, year matches to begin checking further down
      if(dateMonth === filteredMonth && dateDay === filteredDay && dateYear === filteredYear) {
        //dates match! //check against time
        if(dateHour == filteredHour) {
          //hour matches //check the minutes more precisely or if it has surpassed
          if(dateMinute == filteredMinute) {
            if(!self.cutVoting) {
              $window.location.reload()
            }
            self.cutVoting = false;
          } else if (dateMinute > filteredMinute) {
            if(!self.cutVoting) {
              $window.location.reload()
            }
            self.cutVoting = false;
          }
        } else if (dateHour > filteredHour) {
          if(!self.cutVoting) {
              $window.location.reload()
          }
          self.cutVoting = false;
        }
      }
    }

    self.startCheckingTime = function() {
      time = $interval(self.checkDateTime(), 3000)
    }

    self.toggleNameChange = function() {
      if(!self.showEditing) {
        self.showEditing = true;
      } else {
        self.showEditing = false;
      }
    }

    self.changeEventName = function(inputText) {
      HttpService.putEvent({
        name: inputText,
        code: self.currentEvent.code
      })
      self.changeName = '';
      self.showEditing = true;
      $window.location.reload();
    }

    self.toggleLocationChange = function() {
      if(!self.showEditingLocation) {
        self.showEditingLocation = true;
      } else {
        self.showEditingLocation = false;
      }
    }

    self.changeEventLocation = function(inputText) {
      HttpService.putEvent({
        location: inputText,
        code: self.currentEvent.code
      })
      self.changeLocation = '';
      self.showEditingLocation = true;
      $window.location.reload();
    }

    self.toggleDateChange = function() {
      if(!self.showDate) {
        self.showDate = true;
      } else {
        self.showDate = false;
      }
    }

    self.changeEventDate = function(inputText) {
      HttpService.putEvent({
        date: inputText,
        code: self.currentEvent.code
      })
      self.showDate = true;
      self.dateChange = '';
      $window.location.reload();
    }

    self.toggleTimeChange = function() {
      if(!self.showTime) {
        self.showTime = true;
      } else {
        self.showTime = false;
      }
    }

    self.changeEventTime = function(inputText) {
      HttpService.putEvent({
        time: inputText,
        code:self.currentEvent.code
      })
      self.showTime = true;
      self.timeChange = '';
      $window.location.reload();
    }

    self.toggleCutOffChange = function() {
      if(!self.toggleCutOff) {
        self.toggleCutOff = true;
      } else {
        self.toggleCutOff = false;
      }
    }

    self.changeCutOff = function(inputText) {
      HttpService.putEvent({
        cutoff: inputText,
        code:self.currentEvent.code
      })
      self.toggleCutOff = true;
      self.cutOffChange = '';
      $window.location.reload();
    }

    self.refresh(self.eventCode);
  };

  function eventViewDir(){
    return {
      restrict: 'E',
      // scope: {},
      templateUrl: '/eventView/eventView.html',
      replace: true,
      controller: 'EventViewController',
      controllerAs: 'evtCtrl',
      bindToController: true
    }
  }
  function eventList(){
    return {
      restrict: 'E',
      // scope: {},
      templateUrl: '/eventView/eventList.html',
      replace: true,
      controller: 'EventViewController',
      controllerAs: 'evtCtrl',
      bindToController: true
    }
  }
})();
