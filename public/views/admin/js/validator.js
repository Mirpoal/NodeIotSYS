$(function () {
    $('#signInForm')
        .bootstrapValidator({
            live:'disabled',
            excluded: [':disabled'],
            submitButtons: '#signIn',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                email : {
                    validators: {
                        emailAddress: {
                            message: 'Not the correct email address'
                        },
                        stringLength: {
                            min: 6,
                            max: 30,
                            message: 'The username must be more than 6 and less than 30 characters long'
                        }
                    }
                }
            }
    });


    $('#extendinfo')
        .bootstrapValidator({
            live:'disabled',
            excluded: [':disabled'],
            submitButtons: '#extend',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                mac: {
                    validators:{
                        notEmpty: {
                            message: 'The mac address is required'
                        }
                    }
                },
                auth: {
                    validators: {
                        notEmpty: {
                            message: 'The auth pwd is required'
                        }
                    }
                },
                dataname: {
                    validators: {
                        notEmpty: {
                            message: 'The dataname is required'
                        }
                    }
                },
                unit: {
                    enable:false,
                    validators: {
                        notEmpty: {
                            message: 'The unit is required'
                        }
                    }
                }
            }
        });
});