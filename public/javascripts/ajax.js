//ajax da tabela
$('#searchForm').submit(function (e) {
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