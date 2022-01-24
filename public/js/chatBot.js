//crear clase
//start(idCampaña, datos de usuario)

/*questionFirst = $('[data-question]:first').attr('data-question');
$('#chatList ul').append('<li class="admin-message"> '+questionFirst+'</li>');
$('[data-question]:first').appendTo('.message-box');

$("#send").click(function(event){
    questionVal = $('.message-box [data-question]').val();
    $("#chatList ul").append('<li class="client-message"> '+questionVal+'</li>');
    dataName = $('.admin-client-message-wrap [data-name]').attr('data-question');
    
    if( $('.message-box [name]').attr('name')== "name" ){
        nameVal = $('.message-box [name]').val();
        $('.admin-client-message-wrap [data-name]').attr('data-question', "Hola "+nameVal+ ",</br>"+dataName );
    }

    $('.message-box [data-question]').appendTo('.submit_info');

    if($('.admin-client-message-wrap').children().length != 0 ){
        console.log( "**********", $('.admin-client-message-wrap').children());
        questionFirst = $('[data-question]:first').attr('data-question');
        $('#chatList ul').append('<li class="admin-message">'+questionFirst+'</li>');
        $('[data-question]:first').appendTo('.message-box');

        $('#send').css({ "pointer-events": "none" });
        $('.message-box [data-question]').bind('click change keyup', function(event){
            if($(this).val() == "" ){
                $('#send').css({ "pointer-events": "none" });
            } else{
                $('#send').css({ "pointer-events": "auto" });
            }
        });
    }
    
    $('#chatList').animate({scrollTop:5000})
});
*/
$('.message-box [data-question]').bind('click change keyup', function (event) {
    if ($(this).val() == "" || (/^\s+$/.test( $(this).val() )) ) {
        $('#send').css({ "pointer-events": "none" });
    } else {
        $('#send').css({ "pointer-events": "auto" });
        //$('#send').click( sendMessageClient( $(this).val()) );
    }
});

/*
$("#confirm").click(function(event) {
    //$('#submit').trigger('click');
    $("#chatList ul").append('<li class="client-message">Sí</li>');
    $('#chatList').animate({scrollTop:5000});
    $('.message-box').empty();
    $('<input type="text" name="msg-normal" data-question="normal message">').appendTo('.message-box');

    $('.message-box [name]').bind('click change keyup', function(event){
        console.log('ok', $(this).val() )
        if($(this).val() == "" ){
            $('#send').css({ "pointer-events": "none" });
        } else{
            $('#send').css({ "pointer-events": "auto" });
        }
    
    });
});

$("#notconfirm").click(function(event) {
    //location.reload();
    $("#chatList ul").append('<li class="client-message">No</li>');
    $('#chatList').animate({scrollTop:5000});
});
*/

$('.chat_icon').click(function (event) {
    $('.chatbot-box').toggleClass('active');
})

function showMessageClient(msg){
    $('#chatList ul').append('<li class="client-message">' + msg + '</li>');
    $('#chatList').animate({scrollTop:5000});
    $('.message-box [data-question]').val('');
}

function sendMessage(event, msg){

    $.ajax({
        url:"https://nip-new-msc.herokuapp.com/api/messages/send?messageType=UPDATE&&replayTo=INBOX&&idToSend=+51959046402",
        method:"POST",
        dataType: "json",
        data: {
            "text": msg,
            "isQuickReplay": false,
            "emisor": {
                "type": "AGENT",
                "name": "Roger Padilla",
                "emisor_id": "61ad2c2a9d5bc45e090578a4"
            },
            "message_provider": {
                "provider_type": "WHATSAPP",
                "provider_user_id": "+51959046402"
            }, "attention": "61ad2c2a9d5bc45e090578a3", 
            "timestamp": 1642521034157
        },
        success: function(data){
            $(data).each(function(i, eachData){
                console.log('eachData', eachData);
            })
        }
    })
}

function sendMessageClient(event){
    var text = $('.message-box [data-question]').val();
    if (text !== "" && !(/^\s+$/.test(text)) ) {
        showMessageClient(text);

        //send to firebase
        sendMessage(event, text);
    }
}
    

$(document).ready(function () {
    console.log('ok');
    
    $('#send').bind("click",function(event){
        sendMessageClient(event);
    });
    
    $('.message-box [data-question]').keyup(function(event) {
        if (event.which === 13) {
            console.log('time stamp', event.timeStamp);
            sendMessageClient(event);
            
        }
    });

    //sendMessage(event, msg);

  
    firebase.database()
        .ref('attentions/61ad2c2a9d5bc45e090578a3')
        .on('value', async snapshot => {
            let msgs = snapshot.val().messagesByAttention;
            let properties = Object.keys(msgs);
            properties.forEach(
                prop => {
                    var text = msgs[prop].text;
                    var user = msgs[prop].emisor;
                    if (user.type == 'AGENT') {
                        $('#chatList ul').append('<li class="admin-message">' + text + '</li>');
                    }
                    else {
                        showMessageClient(text);
                    }
                }
            );

        });
})