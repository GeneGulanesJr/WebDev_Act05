iisApp.controller('login', function ($scope, $http) {


	$scope.login_attempts = $('#loginAttempts').val();
	$scope.login_penalty = $('#loginPenalty').val();
	$scope.login_current_datetime = $('#currentDateTime').val();

	$scope.runTimer = function(time, format){
		let timerInterval
		Swal.fire({
			title: 'Reached the maximum attempt',
			html: 'You can login in <strong><span id="swal-minutes"></span></strong> minutes <strong><span id="swal-seconds"></span></strong> seconds.',
			type: 'info',
			timer: time,
  			allowOutsideClick: () => false,
			onOpen: () => {
				Swal.showLoading()
				timerInterval = setInterval(() => {
				    const content = Swal.getContent()
				    const $ = content.querySelector.bind(content)
				    Swal.getContent().querySelector('#swal-minutes').textContent = Math.floor(Swal.getTimerLeft() / 60000)
				    Swal.getContent().querySelector('#swal-seconds').textContent = ((Swal.getTimerLeft() % 60000) / 1000).toFixed(0)
				}, 500)
			},
			onClose: () => {
				clearInterval(timerInterval)
			}
		}).then((result) => {
			if (result.dismiss === Swal.DismissReason.timer) {
				$scope.login_attempts = 0;
				$scope.login_penalty = "";
				$scope.login_current_datetime = "";
			}
		});
	};

	$scope.checkPenalty = function(penalty,current,format){
		if (Date.parse(penalty)) {
			penalty = new Date(penalty);
			current = new Date(current);

			if(current < penalty){
				$scope.runTimer((penalty.getTime()-current.getTime()),format);
			}
			else{
				$scope.login_attempts = 0;
			}
		}
	};

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
								method: 'GET',
								url: url + '?fa=login.login_process',
								params: {
								    'username': record.username,
								    'password': record.password
								}
							})
							.then(function(response) {
								if(response.data.result_id > 0) {
									window.location.href = url + '?fa=home.index';
								}
								else {
									$scope.login_attempts = response.data.attempts;
									$scope.login_penalty = response.data.penalty;
									$scope.login_current_datetime = response.data.current;

									swal.insertQueueStep({
										type: 'error',
										title: 'Incorrect username or password!',
										confirmButtonText: 'Try Again',
										onClose: () => {
											if(Date.parse($scope.login_penalty)){
												$scope.checkPenalty($scope.login_penalty, $scope.login_current_datetime, 'queue');
											}
										}
									});
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

								window.location.href = 'Gulanes_ALUMNI_dashboard.html';
							});
				}
			}]);
		}
		else{
			$scope.checkPenalty($scope.login_penalty,$scope.login_current_datetime,'');
		}



	};


	$scope.checkPenalty($scope.login_penalty,$scope.login_current_datetime,'');


});
