angular.module('conFusion.controllers', ['ionic'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout , $localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo','{}');
  //$scope.favorites = $localStorage.getObject('favorites','{}');
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $localStorage.storeObject('userinfo',$scope.loginData);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

 $scope.reservation = {};

  $ionicModal.fromTemplateUrl('templates/reserve.html', {
   scope: $scope
 }).then(function(modal) {
   $scope.reserveform = modal;
 });

 // Triggered in the reserve modal to close it
 $scope.closeReserve = function() {
   $scope.reserveform.hide();
 };

 // Open the reserve modal
 $scope.reserve = function() {
   $scope.reserveform.show();
 };

 // Perform the reserve action when the user submits the reserve form
 $scope.doReserve = function() {
   console.log('Doing reservation', $scope.reservation);

   // Simulate a reservation delay. Remove this and replace with your reservation
   // code if using a server system
   $timeout(function() {
     $scope.closeReserve();
   }, 1000);
 };
})
.controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', 'dishes', function ($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate, dishes) {
            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";
            $scope.dishes =dishes;



            $scope.select = function(setTab) {
                $scope.tab = setTab;

                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.addFavorite = function (index) {
                console.log("index is " + index);
                favoriteFactory.addToFavorites(index);
                $ionicListDelegate.closeOptionButtons();
            }

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };

            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

            $scope.channels = channels;
            $scope.invalidChannelSelection = false;

        }])

        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {

            $scope.sendFeedback = function() {

                console.log($scope.feedback);

                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

.controller('DishDetailController', ['$scope', '$stateParams', 'dish',
                                    'menuFactory', 'favoriteFactory', 'baseURL',
                                    '$ionicPopover', '$ionicModal',
                                    function ($scope, $stateParams, dish,
                                    menuFactory, favoriteFactory, baseURL,
                                    $ionicPopover, $ionicModal) {

            $scope.baseURL = baseURL;
            $scope.dish = dish;
            $scope.showDish = false;
            $scope.message="Loading ...";



          //adding popover
              $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
              scope: $scope
                }).then(function(popover) {
              $scope.popover = popover;
              });

              $scope.openPopover = function($event) {
              $scope.popover.show($event);
              };
              $scope.closePopover = function() {
              $scope.popover.hide();
              };

              $scope.addToFavorite = function () {

                favoriteFactory.addToFavorites(parseInt($scope.dish.id));
                $scope.closePopover();
              };
            //Cleanup the popover when we're done with it!
              $scope.$on('$destroy', function() {
                $scope.popover.remove();
              });
            // Execute action on hide popover
              $scope.$on('popover.hidden', function() {
                // Execute action
              });
            // Execute action on remove popover
              $scope.$on('popover.removed', function() {
                // Execute action
              });

          $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
                  scope: $scope,
                  animation: 'slide-in-up'
                }).then(function(modal) {
                  $scope.modal = modal;
                });
                $scope.openModal = function() {
                  $scope.modal.show();
                  $scope.closePopover();
                };
                $scope.closeModal = function() {
                  $scope.modal.hide();
                };


        }])

        .controller('DishCommentController', ['$scope', 'menuFactory','$ionicModal', function($scope,menuFactory,$ionicModal) {

            $scope.mycomment = {rating:5, comment:"", author:"", date:""};


            $scope.submitComment = function () {

                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);

                $scope.dish.comments.push($scope.mycomment);
                menuFactory.update({id:$scope.dish.id},$scope.dish);

                $scope.commentForm.$setPristine();

                $scope.mycomment = {rating:5, comment:"", author:"", date:""};

            }

        }])






        // implement the IndexController and About Controller here

        .controller('IndexController', ['$scope','l', 'd', 'p', 'baseURL',
                                function ($scope, l, d, p, baseURL) {

                              $scope.baseURL = baseURL;
                              $scope.leader = l;
                              $scope.showDish = false;
                              $scope.message = "Loading ...";
                              $scope.dish = d;
                              $scope.promotion = p;

                        }])


      .controller('AboutController', ['$scope', 'baseURL','leaders', function($scope,baseURL,leaders) {
                                            $scope.baseURL = baseURL;
                                            $scope.leaders = leaders;
                                            
                                    }])

    .controller('FavoritesController', ['$scope', 'dishes', 'favorites',
                                        'favoriteFactory', 'baseURL',
                                        '$ionicListDelegate', '$ionicPopup', '$ionicLoading',
                                        '$timeout', '$localStorage', 'menuFactory',
                                        function ($scope, dishes, favorites,
                                                  favoriteFactory, baseURL, $ionicListDelegate,
                                                  $ionicPopup, $ionicLoading, $timeout, $localStorage, menuFactory) {

                          $scope.baseURL = baseURL;
                          $scope.shouldShowDelete = false;
                          $scope.favorites = favorites;
                          $scope.dishes = dishes;

                          console.log($scope.dishes, $scope.favorites);

                          $scope.toggleDelete = function () {
                              $scope.shouldShowDelete = !$scope.shouldShowDelete;
                              console.log($scope.shouldShowDelete);
                            };

                          $scope.deleteFavorite = function (index) {

                              var confirmPopup = $ionicPopup.confirm({
                              title: 'Confirm Delete',
                              template: 'Are you sure you want to delete this item?'
                              });

                                confirmPopup.then(function (res) {
                                    if (res) {
                                        console.log('Ok to delete');
                                        favoriteFactory.deleteFromFavorites(index);
                                    } else {
                                        console.log('Canceled delete');
                                    }
                                });
                            $scope.shouldShowDelete = false;


                        }

                  }])


          .filter('favoriteFilter', function () {
              console.log("in favorites filter");
              return function (dishes, favorites) {
                          var out = [];
                          for (var i = 0; i < favorites.length; i++) {
                              for (var j = 0; j < dishes.length; j++) {
                                  if (dishes[j].id === favorites[i].id)
                                      out.push(dishes[j]);
                              }
                          }
                          return out;
                      }
                    }
                  );
