$(document).ready(function() {

    $("#formPasswordReset").validate({
        rules: {
            password: {
                required: true,
                minlength: 6,
                validPassword: true
            },
            password_confirmation: {
                required: true,
                equalTo: "#password"
            }
        },
        messages: {
            password: {
                required: "Enter a password."
            },
            password_confirmation: {
                equalTo: "Enter the same password"
            }
        },
        errorElement: "div",
        errorPlacement: function(error, element) {
            error.insertAfter(element);
        }
    });

});