angular.module('member', ['ui.bootstrap'])
    .controller('memberCtrl', ['$scope', '$http', '$route', '$state', '$window', function ($scope, $http, $route, $state, $window) {
        $scope.all = {};
        $scope.fetchMemberData = function () {

            $http.post('/api/Gym/FetchMembersData')
            .success(function (data, status, headers, config) {
                $scope.all = data;
                $scope.tablegenerate();
            })
            .error(function (data, status, headers, config) {
                alert(data);
            });
        }
        $scope.tablegenerate = function () {
            function membershipDropDownEditor(container, options) {
                $('<input required name="' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDropDownList({
                        autoBind: true,
                        //dataTextField: "Membership_Name",
                       // dataValueField: "Membership_Name",
                        dataSource: {
                            data: $scope.allMembershipPlanData
                        }
                    });
            }
            function nonEditor(container, options) {
                container.text(options.model[options.field]);
            }
            $("#memberGrid").kendoGrid({
               // toolbar: [{  template: '<button class="k-button" id="joinMember" >Command</button>' }],
                dataSource: {
                    data: $scope.all,
                    pageSize: 20
                },
                height: 850,
                //groupable: true,
                sortable: true,
                editable:false,
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
                    field: "Membership_ID",
                    editor: nonEditor ,
                    filterable:false,
                    title: "ID",
                    width: 20
                }, {
                    field: "Member_Last_Name",
                    title: "Last Name",
                    width: 50
                }, {
                    field: "Member_First_Name",
                    title: "First Name",
                    width: 50
                },
                 {
                     field: "Member_Address",
                     title: "Address",
                     width: 75
                 },
                  {
                      field: "Member_City",
                      title: "City",
                      width: 30
                  }, {
                      field: "Member_State",
                      title: "State",
                      width: 30
                  }, {
                      field: "Member_Phone",
                      title: "Phone",
                      width: 50
                  }, {
                      field: "Membership_Name",
                      title: "Membership",
                      editor:membershipDropDownEditor,
                      width: 50
                  }, {
                      field: "Membership_StartDate",
                      title: "Start Date",
                      editor: nonEditor,
                      width: 50
                  }, {
                      field: "Membership_EndDate",
                      title: "End Date",
                      editor: nonEditor,
                      width: 50
                  }, { command: ["edit", "destroy"], title: "&nbsp;", width: "100px" }],
                editable: "inline",
                save: function (e) {
                    var memberID = e.model.Membership_ID;
                    var firstname = e.model.Member_First_Name;
                    var lastname = e.model.Member_Last_Name;
                    var address = e.model.Member_Address;
                    var city = e.model.Member_City;
                    var state = e.model.Member_State;
                    var phonenumber = e.model.Member_Phone;
                    var membershipplan = e.model.Membership_Name;
                    var starttime = e.model.Membership_StartDate;

                    if (firstname == "" || lastname == "" || address == "" || city == "" || state == "" || phonenumber == "" || membershipplan == "" || starttime == "") {

                        toastr.error('All Fields Required');

                    }
                    else {
                        var memberplanid = 1;
                        if (membershipplan == "Monthly")
                            memberplanid = 1;
                        if (membershipplan == "Quaterly")
                            memberplanid = 2;
                        if (membershipplan == "Half-Yearly")
                            memberplanid = 3;
                        if (membershipplan == "Annually")
                            memberplanid = 4;

                        var data = { memberID: memberID, firstname: firstname, lastname: lastname, address: address, city: city, state: state, phonenumber: phonenumber, memberplanid: memberplanid, starttime: starttime };
                        $scope.update(data);
                    }
                },
                remove: function (e) {
                    var memberID = e.model.Membership_ID;
                    var firstname = e.model.Member_First_Name;
                    var lastname = e.model.Member_Last_Name;
                    var address = e.model.Member_Address;
                    var city = e.model.Member_City;
                    var state = e.model.Member_State;
                    var phonenumber = e.model.Member_Phone;
                    var membershipplan = e.model.Membership_Name;
                    var starttime = e.model.Membership_StartDate;

                    if (firstname == "" || lastname == "" || address == "" || city == "" || state == "" || phonenumber == "" || membershipplan == "" || starttime == "") {

                        toastr.error('All Fields Required');

                    }
                    else {
                        var memberplanid = 1;
                        if (membershipplan == "Monthly")
                            memberplanid = 1;
                        if (membershipplan == "Quaterly")
                            memberplanid = 2;
                        if (membershipplan == "Half-Yearly")
                            memberplanid = 3;
                        if (membershipplan == "Annually")
                            memberplanid = 4;

                        var data = { memberID: memberID, firstname: firstname, lastname: lastname, address: address, city: city, state: state, phonenumber: phonenumber, memberplanid: memberplanid, starttime: starttime };
                        $scope.delete(data);
                    }
                }
            });
        }
     
       
        $scope.fetchMemberData();
        $scope.showAlert = false;
        $scope.showSuccess = false;

        $scope.allMembershipPlanData = {};

        $http.post('/api/Gym/FetchMembershipData')
            .success(function (data, status, headers, config) {
                $scope.allMembershipPlanData = data;
                $scope.selectedItem = $scope.allMembershipPlanData[0];
                // $scope.tablegenerate();
            })
            .error(function (data, status, headers, config) {
                alert(data);
            });

        $scope.dropboxitemselected = function (item) {

            $scope.selectedItem = item;
            //alert($scope.selectedItem);
        }
        $("#datetimepicker").kendoDateTimePicker({
            value: new Date()
        });

        $scope.registerMember = function () {
            var firstname = $("#first_name").val();
            var lastname = $("#last_name").val();
            var address = $("#address").val();
            var city = $("#city").val();
            var state = $("#state").val();
            var phonenumber = $("#phonenumber").val();
            var membershipplan = $scope.selectedItem;
            var datepicker = $("#datetimepicker").data("kendoDateTimePicker");
            var starttime = datepicker.value($("#value").val());

            if (firstname == "" || lastname == "" || address == "" || city == "" || state == "" || phonenumber == "" || membershipplan == "" || starttime == "") {



            }
            else {
                var memberplanid = 1;
                if (membershipplan == "Monthly")
                    memberplanid = 1;
                if (membershipplan == "Quaterly")
                    memberplanid = 2;
                if (membershipplan == "Half-Yearly")
                    memberplanid = 3;
                if (membershipplan == "Annually")
                    memberplanid = 4;

                var data = { firstname: firstname, lastname: lastname, address: address, city: city, state: state, phonenumber: phonenumber, memberplanid: memberplanid, starttime: starttime };


                $http.post('/api/Gym/RegisterMembershipData', data)
               .success(function (data, status, headers, config) {
                   if (data == 101) {
                       toastr.error('Already a Member');
                   }
                   else if (data == 1) {
                       toastr.error('Some Error in Insertion');
                   }
                   else if (data == 0) {
                       toastr.success('Member Registered');
                       var frm = document.getElementsByName('MemberRegForm')[0];
                       //frm.submit(); // Submit
                       frm.reset();  // Reset
                       return false; // Prevent page refresh
                   }

               })
               .error(function (data, status, headers, config) {
                   alert(data);
               });
            }



        }
        $scope.update = function (data)
        {

            $http.post('/api/Gym/UpdateMembersData', data)
              .success(function (data, status, headers, config) {
                  if (data == 101) {
                      toastr.error('Already a Member');
                  }
                  else if (data == 1) {
                      toastr.error('Some Error in Insertion');
                  }
                  else if (data == 0) {
                      toastr.success('Member Updated');
                      $scope.fetchMemberData();
                      //$state.reload();
                  }

              })
              .error(function (data, status, headers, config) {
                  alert(data);
              });
            
        }
        $scope.delete = function (data) {
            $http.post('api/Gym/DeleteMembersData', data)
             .success(function (data, status, headers, config) {
                 if (data == 101) {
                     toastr.error('Already a Member');
                 }
                 else if (data == 1) {
                     toastr.error('Some Error in Insertion');
                 }
                 else if (data == 0) {
                     toastr.success('Member Deleted');
                     //$window.location.reload();
                     $scope.fetchMemberData();
                     //$state.reload();
                 }

             })
             .error(function (data, status, headers, config) {
                 alert(data);
             });
        }
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-bottom-full-width",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        $('#close').on("click", function () {
            $scope.fetchMemberData();
        });
    }]);