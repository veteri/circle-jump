$(document).ready(function() {

    $("#formSignup").validate({
        rules: {
            name:  {
                required: true,
                minlength: 2,
                remote: "/account/validate-name"
            },
            email: {
                required: true,
                email: true,
                remote: "/account/validate-email"
            },
            password: {
                required: true,
                minlength: 6,
                validPassword: true
            }
        },
        messages: {
            name: {
                required: "Enter a username.",
                minlength: "Enter atleast 6 characters.",
                remote: "This name is already taken."
            },
            email: {
                required: "Enter an e-mail.",
                remote: "This e-mail is already taken."
            },
            password: {
                required: "Enter a password."
            }
        },
        errorElement: "div",
        errorPlacement: function(error, element) {
            error.insertAfter(element);
        }
    });

});