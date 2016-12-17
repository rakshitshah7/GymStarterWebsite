angular.module('join', [])
    .controller('joinCtrl', ['$scope', '$http', function ($scope, $http) {
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
      
        $scope.registerMember = function ()
        {
            var firstname=$("#first_name").val();
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
                   if (data == 101)
                   {
                       toastr.error('Already a Member');
                   }
                   else if (data == 1)
                   {
                       toastr.error('Some Error in Insertion');
                   }
                   else if (data == 0)
                   {
                       toastr.success('Member Registered');
                       var frm = document.getElementsByName('MemberRegForm')[0];
                       frm.submit(); // Submit
                       frm.reset();  // Reset
                       return false; // Prevent page refresh
                   }
                  
               })
               .error(function (data, status, headers, config) {
                   alert(data);
               });
            }



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
    }]);