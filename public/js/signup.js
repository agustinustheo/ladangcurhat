$('#signup-btn').click(function(e) {
  e.preventDefault();
  var data = {};
  data.email = $('#signup-email').val();
  data.password = $('#signup-password').val();
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: 'http://localhost:4500/signup',						
    success: function(data) {
        console.log('success');
        console.log(JSON.stringify(data));
    }
  });
});