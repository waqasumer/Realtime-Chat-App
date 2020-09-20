$(document).ready(function () {
    $('#action_menu_btn').click(function () {
        $('.action_menu').toggle();
    });
});

let get_fb_name;
var hide = document.getElementById("hide");
var login_screen = document.getElementById("login-screen");
var chat_list = document.getElementById("chat_list");
var message_input = document.getElementById("message-input");

hide.setAttribute("id", "hide");

let facebook_login = () => {
    var provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function (result) {
        hide.removeAttribute("id");
        login_screen.setAttribute("id", "hide");

        var user = result.user;
        let name = user.displayName
        get_fb_name = name;

    }).catch(function (error) {
        console.log(error.message);
    });
}

let sendMessage = () => {
    let messages = {
        name: get_fb_name,
        message: message_input.value
    }
    firebase.database().ref("chats").push(messages);
}

firebase.database().ref("chats").on("child_added", (data) => {

    if ((data.val().name == get_fb_name)) {
            
        // main container in chat list
        var main_container_div = document.createElement("div");
        main_container_div.setAttribute("class", "d-flex justify-content-end mb-4");

        // msg send div
        let msg_cotainer_send = document.createElement("div");
        msg_cotainer_send.setAttribute("class", "msg_cotainer_send");
        let msg_cotainer_send_TextNode = document.createTextNode(data.val().message);
        msg_cotainer_send.appendChild(msg_cotainer_send_TextNode);

        main_container_div.appendChild(msg_cotainer_send);
        chat_list.appendChild(main_container_div);

    } else {

        // main container in chat list
        var main_container_div = document.createElement("div");
        main_container_div.setAttribute("class", "d-flex justify-content-start mb-4");

        // msg send div
        let msg_cotainer_send = document.createElement("div");
        msg_cotainer_send.setAttribute("class", "msg_cotainer");
        let msg_cotainer_send_TextNode = document.createTextNode(data.val().message);
        msg_cotainer_send.appendChild(msg_cotainer_send_TextNode);

        // name div
        var name_span = document.createElement("span");
        name_span.setAttribute("class", "name");
        var name_span_textNode = document.createTextNode(data.val().name + ": ");
        name_span.appendChild(name_span_textNode);

        main_container_div.appendChild(name_span);
        main_container_div.appendChild(msg_cotainer_send);

        chat_list.appendChild(main_container_div);

    }
    document.getElementById("message-input").value = "";

});

let deleteChat = () => {
    firebase.database().ref('chats').remove();
    chat_list.innerHTML = "";
}


let signOut = () => {
    firebase.auth().signOut().then(function() {
        console.log("done logout");
        window.location.href = "https://chat-app-8533b.web.app/";
      }).catch(function(error) {
        console.log(error.message);
      });
}