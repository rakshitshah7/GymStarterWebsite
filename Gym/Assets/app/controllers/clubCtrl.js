angular.module('club', [])
    .controller('clubCtrl',['$scope','$http', function ($scope, $http) {
        $scope.all = {};
        $scope.register = function ()
        {
          
            $http.post('/api/Gym/FetchEquipmentData')
            .success(function (data, status, headers, config) {
                $scope.all = data;
                $scope.tablegenerate();
            })
            .error(function (data, status, headers, config) {
                alert(data);
            });
        }
        $scope.tablegenerate = function ()
        {
            $("#grid").kendoGrid({
                dataSource: {
                    data:$scope.all,
                    pageSize: 20
                },
                height: 550,
                //groupable: true,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [{
                    field: "Equipment_Name",
                    title: "Equipment Name",
                    width: 100
                }, {
                    field: "Equipments",
                    title: "Quantity",
                    width: 50
                }]
            });
        }
        


        $scope.register();
        $scope.showAlert = false;
        $scope.showSuccess = false;
    }]);