/*---------------------------CLIENT SIDE SCRIPTS---------------------------*/
$(document).ready(function() {
    var contactTable = $('#contacts').DataTable( {
        "iDisplayLength": 1000,
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
        "bLengthChange": false,
        "dom": '<"contact-search"f>t',
        scrollY: '200',
        "language": {
            "info": "Showing _END_ of _TOTAL_ Contacts",
            "search": "",
            "zeroRecords": "Nothing found",
            "infoEmpty": "No contacts available"
        }
    } );
    $('.canvas').height($(window).innerHeight());
    $('#contacts_filter label input').attr("placeholder", "Search..");
    $('.dashboard').hide();
    $('#nextPage').hide();
    $('div.ui-loader.ui-corner-all.ui-body-a.ui-loader-default').hide();
} );

$('.btn-guest').click(function(){
    $('.login-canvas').hide();
    $('#nextPage').show();
    runChat("");
});

var counter = 0;
$('#nextPage').click(function(){
    if(counter === 0){
        goLeft();
    }
    else{
        goRight();
    }
});

if($('.login-canvas').is(":visible")){
    $(document).on('swipeleft', function(){
        if(counter === 0){
            goLeft();
        }
    });

    $(document).on('swiperight', function(){
        if(counter !== 0){
            goRight();
        }
    });
}

function goLeft(){
    $('#mainContainer').addClass("move-left");
    $('.dashboard').show();
    setTimeout("$('.ladangcurhat-navbar').toggleClass('show-navbar');", 250);
    setTimeout("$('#messagesOutput').hide();", 200);
    $('#nextPage').removeClass("arrow-to-right to-right");
    $('#nextPage').addClass("arrow-to-left to-left");
    counter++;
}

function goRight(){
    $('#mainContainer').removeClass("move-left");
    $('#messagesOutput').show();
    $('.ladangcurhat-navbar').toggleClass('show-navbar');
    setTimeout("$('.dashboard').hide();", 200);
    $('#nextPage').addClass("arrow-to-right to-right");
    $('#nextPage').removeClass("arrow-to-left to-left");
    counter--;
}

$(document).bind("mobileinit", function() {
    $.mobile.ajaxEnabled = false;
});

$(window).on('resize', function(){
    $('.canvas').height($(window).innerHeight());
});

$('#btnSignOut').click(function(){
    localStorage.clear();
    document.location.reload();
});

/*---------------------------CLIENT SIDE CHAT SYSTEM---------------------------*/
function runChat(){
    $(function () {
        var socket = io();
        var clientID;
        var currClient = "";
        var userName = ""; 

        socket.on('connected', function(response) {
            clientID = response.clientID;
            localStorage.setItem('serverPort', response.PORT);
            // if user is authenticated
            if(localStorage.getItem('authData') !== null) {
                // get auth data from local storage
                let userData = JSON.parse(localStorage.getItem('authData'));
                // and send it to server with auth flag = true
                socket.emit('authentication', {
                    authenticated: true,
                    username: userData.username
                });
                console.log(1);
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
                socket.emit('chat message', str);
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
            if(userName === ""){
                userName = result.name;
            }
            $('#messages').append($('<li class="sender-name text-center">').text('Welcome ' + result.name));
        });
    });
}