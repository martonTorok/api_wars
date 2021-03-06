$(function () {
    var pageCounter = 1;
    var currentResults = '';


    loadResults(pageCounter);

    function loadResults(pageCounter) {
        var $results = $('#results');
        var loggedIn = isLoggedIn();
        $('.progress').show();
        $('#resultsTable').hide();
        $.ajax({
            type: 'GET',
            url: 'https://swapi.co/api/planets/?page=' + pageCounter,
            success: function (data) {
                currentResults = data;
                $.each(data.results, function (i, result) {
                    var planetURL = result.url
                    var planetId = planetURL.replace(/[^0-9]+/g, "");
                    $results.append('<tr><td>' + result.name + '</td>' +
                        '<td>' + validateAndFormatDiameter(result.diameter) + '</td>' +
                        '<td>' + result.climate + '</td>' +
                        '<td>' + result.terrain + '</td>' +
                        '<td>' + validateAndFormatWater(result.surface_water) + '</td>' +
                        '<td>' + validateAndFormatPopulation(result.population) + '</td>' +
                        '<td>' + validateResident(i, result) + '</td>' +
                        (loggedIn ?
                            '<td id="votecell"><button id="votebtn" class="btn btn-outline-warning vote' + i + '"' +
                            'data-planetid="' + planetId + '" data-name="' + result.name + '">Vote</button></td></tr>' :
                            ''))
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
                $('[class*="vote"]').on('click', function () {
                    var planetId = $(this).data('planetid');
                    var planetName = $(this).data('name');
                    var postData = {
                        'planet_id': planetId,
                        'planet_name': planetName
                    };
                    $.ajax({
                        type: 'POST',
                        url: '/planet/' + planetId + '/vote',
                        data: JSON.stringify(postData, null, '\t'),
                        contentType: 'application/json;charset=UTF-8',
                        success: function (response) {
                            if (response['success'] === true) {
                                $('[data-name="' + response.planetname + '"]').css('background', '#00cf08');
                                $('[data-name="' + response.planetname + '"]').css('border-color', '#00cf08');
                                $('[data-name="' + response.planetname + '"]').html('Done');
                                $('[data-name="' + response.planetname + '"]').attr('disabled', true);
                                setTimeout(function () {
                                    $('[data-name="' + response.planetname + '"]').css('background', '');
                                    $('[data-name="' + response.planetname + '"]').css('border-color', '');
                                    $('[data-name="' + response.planetname + '"]').html('Vote');
                                    $('[data-name="' + response.planetname + '"]').attr('disabled', false);
                                }, 2000)
                            }
                        }
                    })
                });

            },
            complete: function () {
                $('.progress').fadeOut('slow');
                $('#resultsTable').show();
                $('#next', '#previous').attr('disabled', false);
                $('[class*="resident"]').on('click', function () {
                    $('#residentProgress').show();
                    $('#residentsTable').hide();
                    $('#residentResults').empty();
                    var planetId = $(this).data('id');
                    var residents = currentResults.results[planetId].residents;
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
                            },
                            complete: function () {
                                $('#residentProgress').fadeOut('slow');
                                $('#residentsTable').show();
                            }
                        })
                    })

                });
            }
        });
    }

    $('#navbarVotes').on('click', function () {
        $('#votesResults').empty();
        $.ajax({
            type: 'GET',
            url: '/vote-statistics',
            success: function (results) {
                $.each(results, function (i, result) {
                    $('#votesResults').append('<tr><td>' + result.planet_name + '</td>' +
                        '<td>' + result.votescount + '</td></tr>')
                })
            }
        })
    });


    $('#next').click(function () {
        $('#next').attr('disabled', true);
        $('#previous').attr('disabled', true);
        pageCounter = pageCounter + 1;
        $('#results').empty();
        loadResults(pageCounter);
    });

    $('#previous').click(function () {
        $('#previous').attr('disabled', true);
        $('#next').attr('disabled', true);
        pageCounter = pageCounter - 1;
        $('#results').empty();
        loadResults(pageCounter)
    });

    $("a[href='#top']").click(function () {
        $("html, body").animate({scrollTop: 0}, "slow");
        return false;
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
    });


    function isLoggedIn() {
        var loggedIn = false;
        $.ajax({
            url: '/valLog',
            type: 'GET',
            async: false,
            success: function (response) {
                if (response.loggedin === true) {
                    loggedIn = true;
                    return true
                }
            }
        });
        return loggedIn
    }


    function validateResident(i, results) {
        if (results.residents.length === 0) {
            return "No known residents"
        }
        else {
            return '<button type="button" class="btn btn-outline-warning resident' + results.name + '" id="resident"' +
                ' data-toggle="modal" data-target="#residentModal" data-id="' + i + '">' + results.residents.length + ' Resident(s)</button>'
        }
    }

    function validateAndFormat(number) {
        var result;
        if (number != 'unknown') {
            result = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        else {
            result = number;
        }
        return result;
    }

    function validateAndFormatPopulation(number) {
        var result;
        if (number != 'unknown') {
            result = validateAndFormat(number) + ' people';
        }
        else {
            result = number;
        }
        return result;
    }

    function validateAndFormatWater(number) {
        var result;
        if (number != 'unknown') {
            result = validateAndFormat(number) + '%';
        }
        else {
            result = number;
        }
        return result;

    }

    function validateAndFormatDiameter(number) {
        var result;
        if (number != 'unknown') {
            result = validateAndFormat(number) + ' km';
        } else {
            result = number;
        }
        return result;
    }
});



