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
    alert('clicou');
    let tableTipo = $(this).closest('table').attr('id'); // table row ID
    let dataId = $(this).closest('tr').attr('id'); // table row ID
    $.ajax({
        type: 'POST',
        url: '/users/adicionaFavorito/' + tableTipo,
        data: {
            id: dataId
        },
        success: function (data) {
            console.log(data); // show response from the script.
        }
    });
});