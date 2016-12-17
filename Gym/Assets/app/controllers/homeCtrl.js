angular.module('home', ['ui.bootstrap'])
    .controller('homeCtrl',['$scope','$http', function ($scope, $http) {
        $scope.alert = function () {
            alert("WOW");
        }


        $scope.slides = [];
        $scope.slides.push({ text: 'cats!', image: '../../Assets/img/GYM3.jpg' });
        $scope.slides.push({ text: 'cats!', image: '../../Assets/img/GYM1.jpg' });
        $scope.slides.push({ text: 'cats!', image: '../../Assets/img/GYM2.jpg' });

        $scope.setActive = function (idx) {
            $scope.slides[idx].active = true;
        }

    }]);