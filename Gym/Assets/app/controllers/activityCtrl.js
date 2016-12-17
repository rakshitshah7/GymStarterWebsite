angular.module('activity', ['ui.bootstrap'])
    .controller('activityCtrl', ['$scope', '$http', '$route', '$state', '$window', function ($scope, $http, $route, $state, $window) {

        $scope.fetchActivityData = function () {

            $http.post('/api/Gym/FetchActivityData')
            .success(function (data, status, headers, config) {
                $scope.all = data;
                $scope.tablegenerate();
            })
            .error(function (data, status, headers, config) {
                alert(data);
            });
        }
        $scope.tablegenerate = function()
        {
            $("#activityGrid").kendoGrid({
                // toolbar: [{  template: '<button class="k-button" id="joinMember" >Command</button>' }],
                dataSource: {
                    data: $scope.all,
                    group: [{ field: "Club_Name",width:10 }, { field: "Schedule_Date" }],
                    pageSize: 20
                },
                height: 850,
                groupable: false,
                sortable: true,
                filterable: {
                    extra: false,
                    operators: {
                        string: {
                            startswith: "Starts with",
                            eq: "Is equal to",
                            neq: "Is not equal to"
                        }
                    }
                },
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [
                    {
                        field: "Club_Name",
                        groupHeaderTemplate: "#= value #", hidden: true, width:0
                    }, {
                        field: "Schedule_Date",
                        groupHeaderTemplate: "Date : #= value #", hidden: true, width: 0
                    },
            {
                field: "Activity_Name",
                title: "Activity Name",
                  width: 150
            }, {
                field: "Trainer_Name",
                title: "Trainer Name",
                width: 150
            }, {
                field: "Start_Time",
                title: "Start Time",
                width: 150
            }, {
                field: "End_Time",
                title: "End Time",
                width: 150
            } ]
            });

        }

        $scope.fetchActivityData();
    }]);