function action_when_sign_in() {
	$("#connexion_box").css("display", "none");
	$("#deconnexion_box").css("display", "block");

	//TODO: load the custom users attacks...
}

var current_user = null;

function user_create_account() {
	var email = $("#mail_input").val();
	var password = $("#pass_input").val();

	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
	    current_user = firebase.auth().currentUser;
	    toastr.info("You are now logged !!");
	    action_when_sign_in();
	}, function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		toastr.error(errorMessage, "Account Creation Error");
	});
}

function user_sign_in() {
	var email = $("#mail_input").val();
	var password = $("#pass_input").val();

	firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
	    current_user = firebase.auth().currentUser;
	    toastr.info("You are now logged !!");
	    action_when_sign_in();
	}, function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		toastr.error(errorMessage, "Sign In Error");
	});
}

function user_log_out() {
	firebase.auth().signOut().then(function() {
		current_user = null;

		toastr.info("You are now disconnected !!");

		$("#connexion_box").css("display", "block");
		$("#deconnexion_box").css("display", "none");
	}, function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;

		toastr.error(errorMessage, "SignOut Error");
	});
}

