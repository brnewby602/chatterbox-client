// YOUR CODE HERE:
// $(document).ready(function() {
var app = {
  server: 'https://api.parse.com/1/classes/messages',
  results: [],
  rooms: {'lobby': 'lobby'},
  currentRoom: 'lobby'

};
  
app.displayMessages = function(data) {

  var $chats = $('#chats');
  var context = this;

  data.forEach(function(element) { //WHY IS UNDERSCORE NOT WORKING?

    var username = element.username;
    var text = element.text;
    var createdAt = element.createdAt;
    var roomname = element.roomname;

    var safeText = context.escapeForHtml(text);
    var safeCreatedAt = context.escapeForHtml(createdAt);
    var safeUsername = context.escapeForHtml(username);
    var safeRoomname = context.escapeForHtml(roomname);

    var temp = '<div class="chat"> ' +
          '<div class="username">' + safeUsername + '</div>' +
          '<div>' + safeText + '</div>' + '\n' + 
          '<div>' + safeCreatedAt + '</div>' +
          '</div>';    

    $chats.append(temp);

    context.rooms[safeRoomname] = safeRoomname;
  });
  console.log(context.rooms);

  //FILTER RESULT BY ROOM

};

//TRY REGEX LATER
app.escapeForHtml = function(string) {

  var safeString = '';
  string = string || '';

  for (var i = 0; i < string.length; i++) {
    if (string[i] === '&') {
      safeString += '&amp;';
    } else if (string[i] === '<') {
      safeString += '&lt;';
    } else if (string[i] === '>') {
      safeString += '&gt;';
    } else if (string[i] === '"') {
      safeString += '&quot;';
    } else if (string[i] === '\'') {
      safeString += '&#x27;';
    } else if (string[i] === '/') {
      safeString += '&#x2F;';
    } else {
      safeString += string[i];
    }
  }

  return safeString;
};

app.init = function() {
  $('.clearButton').on('click', app.clearMessages);
  $('.addButton').on('click', app.addMessage);
  $('select[name="roomDropDown"]').on('change', function(event) {
    if ($(this).val() === 'addNewRoom') {
      $('.add-room-container').toggleClass('hidden');
    //if different room is selected
    } else {
      //display messages for that room
      //allow user to add message to that room
      //fetch for room
    }
  });
  $('.addRoomButton').on('click', app.addRoom);
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages/',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });



};


app.fetch = function() {

  var context = this;

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    data: '',
    contentType: 'application/json',
    success: function (data) {
      this.results = data.results;

     // $('#chats').append(JSON.stringify(data.results.createdAt));
      context.displayMessages(data.results);

      console.log('chatterbox: Message received');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message', data);
    }
  });

};

app.clearMessages = function() {
  // get the chat html element using jQuery
  console.log('in clearMessages function');
  var $chats = $('#chats');
  $chats.empty();
  // empty it

};

app.addMessage = function(message) {
  var text = app.escapeForHtml($('input[name="add"]').val());

  //create object from input, use JSON.stringify
  //send to server

// {"createdAt":"2016-03-15T02:23:13.246Z", *
// "objectId":"1WMVP1XR0i", *
// "roomname":"stuff",
// "text":"Hello @Rahim",
// "updatedAt":"2016-03-15T02:23:13.246Z", *
// "username":"therealdonald"}

  var queryString = window.location.search;  

  var userString = app.escapeForHtml(queryString.split('=')[1]);  // TODO - create more robust solution to find username
  var roomname = 'lobby';   // TODO create dropdown for room value;

  var message = {
    username: userString,
    roomname: roomname,
    text: text
  };

  console.log("message = " + message);

  app.send(message);

  app.clearMessages();

  app.fetch();

  console.log("Inside addMessage: " + text);

};

app.addRoom = function() {

  //get value from input field
  // protect user input from bad stuff being entered
  var roomname = app.escapeForHtml($('input[name="addRoom"]').val());
  //add to rooms object
  app.rooms[roomname] = roomname;
  console.log(roomname);
  //refresh dropdown with rooms object
  //delete old options
  $('select[name="roomDropDown"]').empty();

  $('select[name="roomDropDown"]').append($('<option/>', {
    text: 'Add New Room',
    value: 'addNewRoom' 
  }));
  

  $.each(app.rooms, function(index, value) {
    if (value === roomname) {
      //console.log("ROOMNAME == value");
      $('select').append($('<option/>', {
        text: value,
        value: value ,
        selected: 'selected'
      }));
    } else { 
      $('select').append($('<option/>', {
        text: value,
        value: value
      }));  
    }
  });
  //fetch messages for room

  //add to dropdown list
  // add new room value to rooms object in app
  // navigate to room, fetch for that room

  $('.add-room-container').toggleClass('hidden');
};


var message = {
  username: 'Mel Brooks',
  text: 'It\'s good to be the king',
  roomname: 'lobby'
};

$(document).ready( function() {

  app.init();

  app.fetch();
// app.send(message);
});
// });