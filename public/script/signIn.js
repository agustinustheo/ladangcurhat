$('#signin-btn').click(function(e) {
  e.preventDefault();
  var data = {};
  data.username = $('#username').val();
  data.password = $('#password').val();
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: 'http://localhost:3000/signin',						
    success: function(data) {
        console.log('success');
        localStorage.setItem('authData', JSON.stringify(data));
        var objectInStorage = JSON.parse(localStorage.getItem('authData'));
        console.log(objectInStorage);
    }
  });
});