$("#searchForm").submit(function(e) {
    $.ajax({
           type: "GET",
           url: $(this).attr('action'),
           data: $(this).serialize(), // serializes the form's elements.
           success: function(data)
           {
               $('#content').replaceWith(data); // show response from the php script.
           }
         });
    e.preventDefault(); // avoid to execute the actual submit of the form.
});