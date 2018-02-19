$(function () {

    var $results = $('#results');
    $.ajax({
        type: 'GET',
        url: 'https://swapi.co/api/planets/?page=1',
        success: function (results) {
            $.each(results.results, function (i, result) {
                $results.append('<tr><td>' + result.name + '</td>' +
                                '<td>' + result.diameter + '</td>' +
                                '<td>' + result.climate + '</td>' +
                                '<td>' + result.terrain + '</td>' +
                                '<td>' + result.surface_water+ '</td>' +
                                '<td>' + result.population + '</td>' +
                                '<td>' + result.residents + '</td></tr>')
            })
        }
    })
});

