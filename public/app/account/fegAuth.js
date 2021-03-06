angular.module('app').factory('fegAuth',['$http', 'fegIdentity', '$q', 'fegUser',function($http, fegIdentity, $q, fegUser) {
    return {
        authenticateUser: function(username, password) {
            var deferred = $q.defer();

            $http.post('/login', {username: username, password: password}).then(function(response){
                if(response.data.success) {
                    var user = new fegUser();
                    angular.extend(user, response.data.user);
                    fegIdentity.currentUser = user;
                    deferred.resolve(true);
                }else{
                    deferred.resolve(false);
                }
            });
            return deferred.promise;
        },

        createUser : function(newUserData) {
            var newUser = new fegUser(newUserData);
            var deferred = $q.defer();

            newUser.$save().then(function() {
                fegIdentity.currentUser = newUser;
                deferred.resolve();
            }, function(responce) {
                deferred.reject(responce.data.reason);
            });

            return deferred.promise;
        },
        logoutUser: function() {
            var deferred = $q.defer();
            $http.post('/logout', {logout:true}).then(function() {
                fegIdentity.currentUser = undefined;
                deferred.resolve();
            });
            return deferred.promise;
        },
        authorizeCurrentUserForRoute: function(role) {
            if(fegIdentity.isAuthorized(role)) {
                return true;
            }else {
                return $q.reject('not authorized');
            }
        }
    }
}]);