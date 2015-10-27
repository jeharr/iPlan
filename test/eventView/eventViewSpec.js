describe('Unit: EventViewController', function() {
  // Load the module with MainController
  beforeEach(module('ip'));

  var ctrl, scope;
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    // Create the controller
    ctrl = $controller('EventViewController', {
      $scope: scope
    });
  }));

  describe("EventView Controller Methods", function(){

    describe("Post Place", function() {
      var place = {id: false, votes: 0};
      it("should toggle place status from false to true and increment vote count", function(){
        scope.upVote(place);
        expect(place.id).toBeTruthy();
        expect(place.votes).toEqual(1);
    });
  })
})
