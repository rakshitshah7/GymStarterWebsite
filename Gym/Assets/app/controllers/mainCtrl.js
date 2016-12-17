angular.module('main', [])
    .controller('mainCtrl', ['$scope', '$http', function ($scope, $http) {
        $(".nav a").on("click", function () {
            $(".nav").find(".active").removeClass("active");
            $(this).parent().addClass("active");
        });
    }]);