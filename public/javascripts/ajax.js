//ajax da tabela
$('#searchForm').submit(function (e) {

    let search = {
        nome:$('#searchData').val(),
        tipo:$('#searchOption').val()
    }
    localStorage.setItem('searchParameters', JSON.stringify(search));

    $.ajax({
        type: 'GET',
        url: $(this).attr('action'),
        data: $(this).serialize(), // serializes the form's elements.
        success: function (data) {
            $('#content').replaceWith(data); // show response from the script.
        }
    });
    e.preventDefault(); // avoid to execute the actual submit of the form.
});

//ajax da curtida
$(document).on('click', '.favoritar', function () {

    let obj = this;
    let tableTipo = $(obj).closest('table').attr('id'); // table row ID
    let dataId = $(obj).closest('tr').attr('id'); // table row ID

    if (!$(obj).find('.fas').length) {
        $.ajax({
            type: 'POST',
            url: '/users/adicionaFavorito/' + tableTipo + '/' + dataId,
            data: {},
            success: function (data) {
                $(obj).closest('.btn').find('.far').toggleClass('far fas');
            },
            error: function (request, status, error) {
                if (request.status == 403)
                    $(obj).closest('.btn').find('.far').toggleClass('far fas');
            }
        });
    } else {
        $.ajax({
            type: 'POST',
            url: '/users/removeFavorito/' + tableTipo + '/' + dataId,
            data: {},
            success: function (data) {
                $(obj).closest('.btn').find('.fas').toggleClass('fas far');
            },
            error: function (request, status, error) {
                if (request.status == 403)
                    $(obj).closest('.btn').find('.fas').toggleClass('fas far');
            }
        });
    }

});

$('#favorites').click(function (e) {
    $.ajax({
        type: 'GET',
        url: '/users/consultaFavoritos/album/1',
        data: {},
        success: function (data) {
            $('#favorites').toggleClass('active', true);
            $('#home').toggleClass('active', false);
            $('#content').replaceWith(data); // show response from the script.
        }
    });
    e.preventDefault(); // avoid to execute the actual submit of the form.});
});

//ajax da paginação da curtida
$(document).on('click', '#navFav ul.pagination li a', function () {

    let obj = this;
    let page;

    if ($(obj).is($('#navFav ul.pagination li a:first')))
        page = $(obj).closest('li').nextAll('.active').prev().find('a').text();
    else if ($(obj).is($('#navFav ul.pagination li a:last')))
        page = $(obj).closest('li').prevAll('.active').next().find('a').text();
    else
        page = $(obj).text();

    $.ajax({
        type: 'GET',
        url: '/users/consultaFavoritos/album/' + page,
        data: {},
        success: function (data) {
            $('#content').replaceWith(data); // show response from the script.
        }
    });
});

//ajax da paginação da busca
$(document).on('click', '#navBusca ul.pagination li a', function () {

    let obj = this;
    let page;

    if ($(obj).is($('#navBusca ul.pagination li a:first')))
        page = $(obj).closest('li').nextAll('.active').prev().find('a').text();
    else if ($(obj).is($('#navBusca ul.pagination li a:last')))
        page = $(obj).closest('li').prevAll('.active').next().find('a').text();
    else
        page = $(obj).text();

    let search = localStorage.getItem('searchParameters');
    search = JSON.parse(search);
    search.offset = (page-1)*20;

    $.ajax({
        type: 'GET',
        url: '/search',
        data: $.param(search),
        success: function (data) {
            $('#content').replaceWith(data); // show response from the script.
        }
    });
});


$('#home').click((e) => {
    e.preventDefault(); // avoid to execute the actual submit of the form.});
    $('#home').toggleClass('active', true);
    $('#favorites').toggleClass('active', false);
    $('#content').html(''); // show response from the script.
});