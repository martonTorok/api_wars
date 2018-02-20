$(function () {

    var $results = $('#results');
    $.ajax({
        type: 'GET',
        url: 'https://swapi.co/api/planets/?page=1',
        success: function (results) {
            $.each(results.results, function (i, result) {
                $results.append('<tr><td>' + result.name + '</td>' +
                    '<td>' + commalize(result.diameter) + ' km' + '</td>' +
                    '<td>' + result.climate + '</td>' +
                    '<td>' + result.terrain + '</td>' +
                    '<td>' + result.surface_water + '%' + '</td>' +
                    '<td>' + commalizePopulation(result.population) + '</td>' +
                    '<td>' + isResident(result.residents) + '</td></tr>')
            })
        }
    });


    $("#registration").on("submit", function (event) {
        event.preventDefault();
        var postData = {
            'username': $('#username').val(),
            'password': $('#password').val()
        };
        var formURL = $(this).attr("action");
        $.ajax({
            url: formURL,
            type: "POST",
            data: postData,
            success: function (response) {
                console.log(response['success']);
                if (response['success'] === true) {
                    $('#registrationModal .modal-header .modal-title').html("Registration Status:");
                    $('#registrationModal .modal-body').html('Successful !.');
                    $("#regSubmit").remove();
                } else {
                    $('#registrationModal .modal-header .modal-title').html("Registration Status:");
                    $('#registrationModal .modal-body').html('Username already taken.');
                    $("#regSubmit").remove();
                }
            },
            error: function (jqXHR, status, error) {
                console.log(status + ": " + error);
            }
        })
    });
    $('#regSubmit').on('click', function () {
        $("#registration").submit();
    });


    $("#login").on("submit", function (event) {

        event.preventDefault();
        var loginModalClone = $('#loginModal').clone();
        var postData = {
            'loginUsername': $('#loginUsername').val(),
            'loginPassword': $('#loginPassword').val()
        };
        var formURL = $(this).attr("action");
        $.ajax({
            url: formURL,
            type: "POST",
            data: postData,
            success: function (response) {
                if (response['success'] === true) {
                    $('#loginModal .modal-header .modal-title').html("Login Successful!");
                    $("#loginSubmit").remove();
                    $('#loginModal .modal-body').html('Redirecting in 3...');
                    var i = 3;
                    var interval = setInterval(function () {
                        $('#loginModal .modal-body').html('Redirecting in ' + --i + '...');
                        if (i === 0)
                            clearInterval(interval);
                        location.reload();
                    }, 800);
                } else {

                    $('#loginModal .modal-header .modal-title').html("Access Denied!");
                    $('#loginModal .modal-body').html('Invalid Username or Password.');
                    $('#loginModal .modal-body').append('      <button id="loginTryAgain" class="btn btn-warning">Try Again</button>')
                    $('#loginTryAgain').on('click', function () {
                        $('#loginUsername').attr('value', '');
                        $('#loginPassword').attr('value', '');
                        $('#loginModal').replaceWith(loginModalClone.clone());
                    })

                }
            },
            error: function (jqXHR, status, error) {
                console.log(status + ": " + error);
            }
        })
    });
    $('#loginSubmit').on('click', function () {
        $("#login").submit();
    });


    function isResident(residents) {
        if (residents.length === 0) {
            return "No known residents"
        }
        else {
            return '<button type="button" class="btn btn-warning resident " id="resident" data-toggle="modal" data-target="#residentModal">' + residents.length + ' Resident(s)</button>'
        }
    }

    function commalize(number) {
        var result;
        if (number != 'unknown') {
            result = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        else {
            result = number;
        }
        return result;
    }

    function commalizePopulation(number) {
        var result;
        if (number != 'unknown') {
            result = commalize(number) + ' people';
        }
        else {
            result = number;
        }
        return result;
    }
});



