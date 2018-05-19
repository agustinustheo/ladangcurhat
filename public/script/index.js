/*---------------------------CLIENT SIDE SCRIPTS---------------------------*/
$(document).ready(function() {
    $('#contacts').DataTable( {
        "initComplete": function () {
            var api = this.api();
            api.$('td').click( function () {
                api.search( this.innerHTML ).draw();
            } );
        },
        "fnDrawCallback": function ( oSettings ) {
            $(oSettings.nTHead).hide();
            $(oSettings.nTFoot).hide();
        },
        "iDisplayLength": 15,
        "bLengthChange": false,
        "dom": '<"contact-search"f>t<"contact-page"p><"contact-info"i>',
        "language": {
            "info": "Showing _END_ of _TOTAL_ Contacts",
            "search": "",
            "zeroRecords": "Nothing found",
            "infoEmpty": "No contacts available"
        }
    } );
    $('#contacts_filter label input').attr("placeholder", "Search..");
    $('.dashboard').hide();
    $('#nextPage').hide();
} );

$('#continueAsGuest').click(function(){
    $('#loginCanvas').hide();
    $('#nextPage').show();
});

var counter = 0;
$('#nextPage').click(function(){
    if(counter === 0){
    $('#mainContainer').addClass("move-left");
    $('#nextPage').removeClass("arrow-to-right to-right");
    $('#nextPage').addClass("arrow-to-left to-left");
    $('.dashboard').show();
    setTimeout("$('.ladangcurhat-navbar').toggleClass('show-navbar');", 250);
    setTimeout("$('#messagesOutput').hide();", 200);
    counter++;
    }
    else{
    $('#mainContainer').removeClass("move-left");
    $('#nextPage').addClass("arrow-to-right to-right");
    $('#nextPage').removeClass("arrow-to-left to-left");
    $('#messagesOutput').show();
    $('.ladangcurhat-navbar').toggleClass('show-navbar');
    setTimeout("$('.dashboard').hide();", 200);
    counter--;
    }
});


/*---------------------------CLIENT SIDE CHAT SYSTEM---------------------------*/
$(function () {
    var socket = io();
    var clientID;
    var currClient = ""; 
    var userName = "";

    socket.on('connected', function(response) {
        clientID = response.clientID;
        console.log(clientID);
        
        // if user is authenticated
        if(localStorage.getItem('authData') !== null) {
            // get auth data from local storage
            let userData = JSON.parse(localStorage.getItem('authData'));
            // and send it to server with auth flag = true
            socket.emit('authentication', {
                authenticated: true,
                username: userData.username
            });
        } else {
            // send auth flag = false
            socket.emit('authentication', {
                authenticated: false,
            });
        }
    });

    $('form').submit(function(){
        var str = $('#m').val();
        if (!(str.replace(/\s/g, '').length == 0)) {
        socket.emit('chat message', $('#m').val());
        }
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(data) {
        var msg = data.message;
        var clientName = data.clientName;
        if(userName == clientName){
        if(currClient != clientName){
            $('#messages').append('<li><span class="sender-name">' + clientName + '</span><br><span class="speech-bubble">' + msg + '</span></li>');
            currClient = clientName;
        }
        else{
            $('#messages').append('<li><span class="speech-bubble">' + msg + '</span></li>');
        } 
        }
        else{
        if(currClient != clientName){
            $('#messages').append('<li class="overflow-auto"><div class="overflow-auto float-right"><span class="sender-name float-right">' + clientName + '</span><br><span class="speech-bubble">' + msg + '</span></div></li>');
            currClient = clientName;
        }
        else{
            $('#messages').append('<li style="overflow: auto;"><div class="float-right"><span class="speech-bubble">' + msg + '</span></div></li>');
        }
        }
    });
    socket.on('nameResult', function(result) {
        if(userName == ""){
        userName = result.name;
        }
        $('#messages').append($('<li class="sender-name text-center">').text('Welcome ' + result.name));
    });
});