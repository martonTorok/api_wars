$(function () {

    var $results = $('#results');
    $.ajax({
        type: 'GET',
        url: 'https://swapi.co/api/planets/?page=1',
        success: function (results) {
            $.each(results.results, function (i, result) {
                $results.append('<tr><td>' + result.name + '</td>' +
                                '<td>' + commalize(result.diameter) + ' km' +  '</td>' +
                                '<td>' + result.climate + '</td>' +
                                '<td>' + result.terrain + '</td>' +
                                '<td>' + result.surface_water + '%' + '</td>' +
                                '<td>' + commalizePopulation(result.population) + '</td>' +
                                '<td>' + isResident(result.residents) + '</td></tr>')
            })
        }
    })
});


function isResident(residents) {
    if (residents.length === 0) {
        return "No known residents"
    }
    else {
        return '<button class="btn btn-warning">'+ residents.length + ' Resident(s)</button>'
    }
}

function commalize (number) {
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
