$(document).ready(function () {
    // Initially hide OTP card
    $('#col_otp_form').hide();
    // Initially hide loader
    $('#loader').hide();
    // Hide referral code input field
    $('#row_referral_code').hide();
});

/*** ************************* ***/
/*** Custom methods ***/
/*** ************************ ***/

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
                    document.getElementById('otp_mobile').value = parseInt(mobile);
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