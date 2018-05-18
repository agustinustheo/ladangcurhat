$('#signup-btn').click(function(e) {
  e.preventDefault();
  var data = {};
  data.username = $('#username').val();
  data.password = $('#password').val();
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: 'http://localhost:3000/signup',						
    success: function(data) {
        console.log('success');
        console.log(JSON.stringify(data));
    }
  });
});