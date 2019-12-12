iisApp.controller('login', function ($scope, $http) {

	$scope.Login = function(record){
		if($scope.login_attempts < 5){
			var dsp_attempts = $scope.login_attempts;
			swal.queue([{
				title: 'Authenticating...',
				text: (++dsp_attempts) + '/5 login attempt(s)',
				confirmButtonText: 'Confirm',
				showLoaderOnConfirm: true,
				onOpen: function(){
					Swal.clickConfirm()
				},
	  			allowOutsideClick: () => !swal.isLoading(),
				preConfirm: () => {
					return $http({
							})
							.then(function(response) {
								if(a=b) {
								}
							})
							.catch(function(response) {
								swal.insertQueueStep({
									type: 'success',
									title: 'Login Successful'

								})
								console.log(response);
							})
							.finally(function(){

								window.location.href = 'dashboard.html';
							});
				}
			}]);
		}



	};



	window.history.pushState(null, "", window.location.href);        
    window.onpopstate = function() {
        window.history.pushState(null, "", window.location.href);
    };

});
