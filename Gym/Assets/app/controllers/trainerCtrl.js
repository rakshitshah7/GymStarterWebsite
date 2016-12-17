angular.module('trainer', [])
    .controller('trainerCtrl', ['$scope', '$http', function ($scope, $http) {
        var wnd, detailsTemplate;
        var wnd1, detailsTemplate1;
        $scope.fetchTrainerData = function () {
            
            $http.post('/api/Gym/FetchTrainerData')
            .success(function (data, status, headers, config) {
                $scope.all = data;
                $scope.tablegenerate();
            })
            .error(function (data, status, headers, config) {
                alert(data);
            });
        }
        $scope.tablegenerate = function () {
            $("#trainerGrid").kendoGrid({
                // toolbar: [{  template: '<button class="k-button" id="joinMember" >Command</button>' }],
                dataSource: {
                    data: $scope.all,
                    group: [{ field: "Employee_Type" }],
                    pageSize: 20
                },
                height: 850,
                groupable: false,
                sortable: true,
                dataBound: dataBound,
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
                    field: "Trainer_Name",
                    title: "Trainer Name",
                    width: 150
                }, {
                    field: "Employee_Type",
                    title: "Speciality",
                    width: 150
                }
                ,
                { command: { text: "Details", click: showDetails }, title: " ", width: "50px" },
                { command: { text: "Train", click: showTrainDetails }, title: " ", width: "50px" }
                ]
            });

            function dataBound(e) {
                var grid = this;

                grid.tbody.find("tr[role='row']").each(function () {
                    var model = grid.dataItem(this);

                    if (model.Employee_Type != "Personal Trainer") {
                        $(this).find(".k-grid-Train").addClass("k-state-disabled");
                    }
                });
            }
            wnd = $("#details")
                        .kendoWindow({
                            title: "Trainer Details",
                            modal: true,
                            visible: false,
                            resizable: false,
                            width: 300
                        }).data("kendoWindow");
            detailsTemplate = kendo.template($("#template").html());

            wnd1 = $("#train")
                        .kendoWindow({
                            title: "Booking Details",
                            modal: true,
                            visible: false,
                            resizable: false,
                            width: 300
                        }).data("kendoWindow");
            detailsTemplate1 = kendo.template($("#template1").html());
        }
        function showDetails(e) {
            e.preventDefault();

            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            wnd.content(detailsTemplate(dataItem));
            wnd.center().open();
        }
        function showTrainDetails(e) {

            e.preventDefault();

            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            $scope.dataItem = dataItem;
            wnd1.content(detailsTemplate1(dataItem));
            $("#datetimepickertrainer").kendoDateTimePicker({
                value: new Date()
            });
            $(".close-button").click(function () {
                // call 'close' method on nearest kendoWindow
                
                var empID = $scope.dataItem.Employee_ID
                var membershipID = $("#membershipID").val();
                var ClubName = $("#ClubName").val();
                var TrainingName = $("#TrainingName").val();
                var Duration = $("#Duration").val();
                var datepicker = $("#datetimepickertrainer").data("kendoDateTimePicker");
                var starttime = datepicker.value($("#value").val());

                
                if (membershipID == "" || ClubName == "" || TrainingName == "" || Duration == "" ||  starttime == "") {
                    toastr.error('Please Enter All the details');
                }
                else {
                    var data = { empID:empID,membershipID: membershipID, ClubName: ClubName, TrainingName: TrainingName, Duration: Duration, starttime: starttime };
                    $scope.booktrainer(data);
                }
                // the above is equivalent to:
                //$(this).closest(".k-window-content").data("kendoWindow").close();
            });
            wnd1.center().open();
        }
      
        $scope.booktrainer = function (data)
        {
            $http.post('/api/Gym/RegisterPersonalTrainingData', data)
             .success(function (data, status, headers, config) {
                 if (data == 101) {
                     toastr.error('Member ID does not exists');
                 }
                 else if (data == 102) {
                     toastr.error('Trainer Busy with other member. Try other date');
                 }
                 else if (data == 0) {
                     toastr.success('Personal Training Registered! Be there on time :P');
                     //var frm = document.getElementsByName('MemberRegForm')[0];
                     ////frm.submit(); // Submit
                     //frm.reset();  // Reset
                     //return false; // Prevent page refresh
                 }
             });
        }
      
        $scope.fetchTrainerData();

    }]);