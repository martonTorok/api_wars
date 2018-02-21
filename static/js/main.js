$(function () {
    var pageCounter = 1;
    var $results = $('#results');
    var currentResults = '';
    loadResults(pageCounter);

    function loadResults(pageCounter) {
        console.log(pageCounter);
        $.ajax({
            type: 'GET',
            url: 'https://swapi.co/api/planets/?page=' + pageCounter,
            success: function (data) {
                currentResults = data;
                $.each(data.results, function (i, result) {
                    $results.append('<tr><td>' + result.name + '</td>' +
                        '<td>' + commalize(result.diameter) + ' km' + '</td>' +
                        '<td>' + result.climate + '</td>' +
                        '<td>' + result.terrain + '</td>' +
                        '<td>' + result.surface_water + '%' + '</td>' +
                        '<td>' + commalizePopulation(result.population) + '</td>' +
                        '<td>' + validateResident(i, result) + '</td></tr>')
                });
                if (data.next === null) {
                    $('#next').attr('disabled', true)
                } else {
                    $('#next').attr('disabled', false)
                }

                if (data.previous === null) {
                    $('#previous').attr('disabled', true)
                } else {
                    $('#previous').attr('disabled', false)
                }

            },
            complete: function () {
                $('#next', '#previous').attr('disabled', false);
                $('body').on('click', '[class*="resident"]', function () {
                    $('#residentResults').empty();
                    var planetId = $(this).data('id');
                    var residents = currentResults.results[planetId].residents;
                    var postURL = currentResults.results[planetId].residents;
                    console.log(planetId);
                    $.each(residents, function (i, resident) {
                        $.ajax({
                            type: 'GET',
                            url: resident,
                            success: function (result) {
                                $('#residentResults').append('<tr scope="row"><td>' + result.name + '</td>' +
                                    '<td>' + result.height + ' m' + '</td>' +
                                    '<td>' + result.mass + ' kg' + '</td>' +
                                    '<td>' + result.skin_color + '</td>' +
                                    '<td>' + result.hair_color + '</td>' +
                                    '<td>' + result.eye_color + '</td>' +
                                    '<td>' + result.birth_year + '</td>' +
                                    '<td>' + result.gender + '</td></tr>')
                            }
                        })
                    })

                });
            }
        });
    }


    $('#residentModal').on('show.bs.modal', function () {
        $(this).find('.modal-body').css({
            width: 'auto', //probably not needed
            height: 'auto', //probably not needed
            width: '100%'
        });
    });


    $('#next').click(function () {
        $('#next', '#previous').attr('disabled', true);
        pageCounter = pageCounter + 1;
        $('#results').empty();
        loadResults(pageCounter);
    });

    $('#previous').click(function () {
        $('#next', '#previous').attr('disabled', true);
        pageCounter = pageCounter - 1;
        $('#results').empty();
        loadResults(pageCounter)
    });


    $('#home').on('mouseover', function () {
        $('#home').css('cursor', 'pointer');
    });
    $('#home').on('click', function () {
        $(location).attr('href', '/')
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
                    $('#registrationModal .modal-body').html('Successful !');
                    $("#regSubmit").remove();
                } else {
                    $('#invalidRegistration').show();
                    setTimeout(function () {
                        $('#invalidRegistration').hide(1200);
                    }, 1400)
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

                    }, 800);
                    setTimeout(function () {
                        location.reload();
                    }, 2400)
                } else {
                    $('#invalidLogin').show();
                    setTimeout(function () {
                        $('#invalidLogin').hide(1200);
                    }, 1400)
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
    $('#navbarLogin').on('click', function () {
        $('#invalidLogin').hide();
    });
    $('#navbarRegistration').on('click', function () {
        $('#invalidRegistration').hide();
    })


    function validateResident(i, results) {
        if (results.residents.length === 0) {
            return "No known residents"
        }
        else {
            return '<button type="button" class="btn btn-warning resident' + results.name + '" id="resident"' +
                ' data-toggle="modal" data-target="#residentModal" data-id="' + i + '">' + results.residents.length + ' Resident(s)</button>'
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



