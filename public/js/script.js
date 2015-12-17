var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.
        when('/:tliId', {
            controller: 'IndexCtrl',
            template: ''
        }).
        when('/:tliId/edit', {
            templateUrl: '/public/html/teacher_view.html',
            controller: 'TeacherCtrl'
        }).
        when('/:tliId/practice', {
            templateUrl: '/public/html/student_view.html',
            controller: 'StudentCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
});

app.controller('IndexCtrl', function($http, $location, $routeParams) {
    $http.get('/api/init').then(function(result) {
        if(result.data.userType === 'teacher') {
            $location.path('/' + $routeParams.tliId + '/edit');
        } else if(result.data.userType === 'student') {
            $location.path('/' + $routeParams.tliId + '/view');
        } else {
            console.err('Unknown userType');
        }
    });
});

app.controller('TeacherCtrl', function($scope, $http, $routeParams) {
    $scope.save = function() {
        $http.put('/api/app/' + $routeParams.tliId, $scope.data).then(function(result) {
            $scope.data = result.data;
        });
    };
});

app.controller('StudentCtrl', function($scope, $http, $routeParams) {
    $http.get('/api/app/' + $routeParams.tliId).then(function(result) {
        $scope.data = result.data;
    });
});
