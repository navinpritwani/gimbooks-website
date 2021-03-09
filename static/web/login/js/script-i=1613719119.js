$(document).ready(function () {
    // Initially hide signup, forgot, verify forgot card
    $('#col_signup_form').hide();
    $('#col_forgot_password_form').hide();
    $('#col_otp_forgot_password').hide();
    // Initially hide OTP card
    $('#col_otp_form').hide();
    // Hide referral code input field
    $('#row_referral_code').hide();
    // Initially hide loader
    $('#loader').hide();

    $('#modal_restrict_mobile_retailer').modal();
});

/*** ************************* ***/
/*** Custom methods ***/
/*** ************************ ***/

/*** This is used to submit login form ***/
function loginSubmit(event) {
    event.preventDefault();
    // Get login data
    if(validateLogin()){
        $('#loader').show();
        // Disable Button after click
        document.getElementById("login_btn").disabled = true;
        var mobile = document.getElementById("mobile").value;
        var password = document.getElementById("password").value;
        var login_data = {};
        login_data["mobile"] = mobile;
        login_data["password"] = password;
        // Call AJAX for login
        $.ajax({
            method: "POST",
            url: "/login/",
            data: login_data,
            success: function (result) {
                if (result.success == true) {
                    localStorage.clear();
                    var today = new Date();
                    localStorage.setItem("access_token", result.access_token);
                    localStorage.setItem("modal_download_app", 0);
                    localStorage.setItem("last_popup_shown_day", today.getDay());
                    localStorage.setItem("last_popup_shown_month", today.getMonth());
                    localStorage.setItem("last_popup_shown_year", today.getYear());
                    window.location.href = '/web/home/';
                }
                else if(result.success == false && result.otp_flag == true){
                    document.getElementById('otp_mobile').value = mobile;
                    $('#col_login_form').hide();
                    $('#col_otp_form').show(500);
                }
                else if (result.success === false &&  result.flag_sector === false){
                    $('#modal_restrict_mobile_retailer').modal('open');
                    $('#alert-title').html(result.message);
                }else {
                    Materialize.toast(result.message, 3000, 'rounded','blue');
                }
            },
            complete: function () {
                document.getElementById("login_btn").disabled = false;
                $('#loader').hide().fadeOut(800);
            }
        });
    }
}

/*** This is used to show signup form ***/
function openSignUpForm() {
    $('#col_login_form').hide(500);
    $('#col_signup_form').show(500);
}
/*** This is used to show login form ***/
function openLoginForm() {
    $('#col_signup_form').hide(500);
    $('#col_login_form').show(500);
    $('#col_forgot_password_form').hide(500);
}

/*** This is used to show Forgot Password form ***/
function openForgotPasswordForm() {
    $('#col_login_form').hide(500);
    $('#col_forgot_password_form').show(500);
}

/*** This is used to show/hide referral field ***/
function referralShowHide() {
    var get_checked_value = document.getElementById('checkbox_referral').checked;
    if (get_checked_value){
        $('#row_referral_code').show(200);
    }
    else{
        $('#row_referral_code').hide(200);
    }
}

/*** This is used to submit signup form ***/
function signupSubmit() {
    if(validateSignUp()){
        $('#loader').show();
        // Disable Button after click
        document.getElementById("signup_btn").disabled = true;
        document.getElementById("signup_btn").value = "Please wait...";
        // Get login data
        var company_name = document.getElementById("reg_company_name").value;
        var mobile = document.getElementById("reg_mobile").value;
        var password = document.getElementById("reg_password").value;
        var referral_code = document.getElementById("referral_code").value;
        var signup_data = {};
        signup_data["mobile"] = mobile;
        signup_data["password"] = password;
        signup_data["company_name"] = company_name;
        signup_data["refer_code"] = referral_code;
        // Call AJAX for signup
        $.ajax({
            url: "/sign_up/",
            method: "POST",
            data: signup_data,
            success: function (result) {
                if (result.success == true) {
                    document.getElementById('otp_mobile').value = mobile;
                    $('#col_signup_form').hide();
                    $('#col_otp_form').show(500);
                }
                else {
                    Materialize.toast(result.message, 3000, 'rounded');
                }
            },
            complete: function () {
                document.getElementById("signup_btn").disabled = false;
                $('#loader').hide().fadeOut(800);
            }
        });
    }
}

// Validate Sign up form
function validateSignUp() {
    var get_company_name  = document.getElementById('reg_company_name').value;
    var get_mobile  = document.getElementById('reg_mobile').value;
    var password  = document.getElementById('reg_password').value;
    var cpassword  = document.getElementById('reg_cpassword').value;
    var flag_referral  = document.getElementById('checkbox_referral').checked;
    var get_referral  = document.getElementById('referral_code').checked;
    if (get_company_name == "" || get_company_name == null){
        $('#reg_company_name').focus();
        return false;
    }
    if (get_mobile == "" || get_mobile == null){
        $('#reg_mobile').focus();
        return false;
    }
    if (password == "" || password == null){
        $('#reg_password').focus();
        return false;
    }
    if (password != cpassword){
        Materialize.toast("Password and confirm password should be same.", 2000, 'rounded');
        $('#cpassword').focus();
        return false;
    }
    if (flag_referral){
        if(get_referral == null || get_referral == ""){
            $('#referral_code').focus();
            return false;
        }
    }
    return true;
}

// Validate Login Form
function validateLogin() {
    var get_mobile  = document.getElementById('mobile').value;
    var get_password  = document.getElementById('password').value;
    if (get_mobile == null || get_mobile == ""){
        $('#mobile').focus();
        return false;
    }
    if (get_password == null || get_password == ""){
        $('#password').focus();
        return false;
    }
    return true;
}


/*** This is used to submit OTP form ***/
function otpSubmit() {
    var get_mobile  = document.getElementById('otp_mobile').value;
    var get_otp  = document.getElementById('otp').value;
    if (get_otp == null || get_otp == ""){
        $('#otp').focus();
        return false;
    }
    document.getElementById("otp_verify_btn").disabled = true;
    // Call AJAX for Verify OTP
    $('#loader').show();
    $.ajax({
        url: "/verify_otp/",
        method: "POST",
        data: {'mobile':get_mobile, 'otp':get_otp},
        success: function (result) {
            if (result.success == true) {
                Materialize.toast(result.message, 3000, 'rounded');
                localStorage.setItem("access_token", result.access_token);
                window.location.href = '/web/home/';
            }
            else {
                Materialize.toast(result.message, 3000, 'rounded');
            }
        },
        complete: function () {
            document.getElementById("otp_verify_btn").disabled = false;
            $('#loader').hide().fadeOut(800);
        }
    });
}


/*** Forgot Password Proceed method ***/
function forgotPasswordProceed() {
    var get_mobile = document.getElementById('forgot_mobile').value;
    console.log(get_mobile);
    if (get_mobile == null || get_mobile == ""){
        $('#forgot_mobile').focus();
        return false;
    }
    else {
        document.getElementById("btn_forgot_password_proceed").disabled = true;
        $('#loader').show();
        $.ajax({
            url: "/forgot_password/",
            method: "GET",
            data: {'mobile': get_mobile},
            success: function (result) {
                if (result.success == true) {
                    Materialize.toast("OTP Sent to your mobile number.", 3000, 'rounded');
                    document.getElementById('forgot_otp_mobile').value = get_mobile;
                    $('#col_forgot_password_form').hide(500);
                    $('#col_otp_forgot_password').show(500);
                }
                else {
                    Materialize.toast(result.message, 3000, 'rounded');
                }
            },
            complete: function () {
                document.getElementById("btn_forgot_password_proceed").disabled = false;
                $('#loader').hide().fadeOut(800);
            }
        });
    }
}
/*** This is used to submit reset password OTP form ***/
function submitForgotPassword() {
    var get_mobile  = document.getElementById('forgot_otp_mobile').value;
    var get_otp  = document.getElementById('forgot_otp').value;
    var get_new_password  = document.getElementById('forgot_new_password').value;
    var get_new_cpassword  = document.getElementById('forgot_new_cpassword').value;
    if (get_otp == null || get_otp == ""){
        $('#forgot_otp').focus();
        return false;
    }
    else if (get_new_password == null || get_new_password == ""){
        $('#forgot_new_password').focus();
        return false;
    }
    else if (get_new_cpassword == null || get_new_cpassword == ""){
        $('#forgot_new_cpassword').focus();
        return false;
    }
    else if (get_new_password  != get_new_cpassword){
        Materialize.toast("Password and confirm password should be same.", 2000, 'rounded');
        $('#forgot_new_cpassword').focus();
        return false;
    }
    document.getElementById("btn_forgot_password_submit").disabled = true;
    // Call AJAX for Submit reset password
    $('#loader').show();
    $.ajax({
        url: "/forgot_password/",
        method: "POST",
        data: {'mobile':get_mobile, 'otp':get_otp, 'password':get_new_password},
        success: function (result) {
            if (result.success == true) {
                Materialize.toast(result.message, 3000, 'rounded');
                window.location.href = '/web/login/';
            }
            else {
                Materialize.toast(result.message, 3000, 'rounded');
            }
        },
        complete: function () {
            document.getElementById("btn_forgot_password_submit").disabled = false;
            $('#loader').hide().fadeOut(800);
        }
    });
}

