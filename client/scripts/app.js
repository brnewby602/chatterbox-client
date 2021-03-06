// YOUR CODE HERE:
var app = {
  server: 'https://api.parse.com/1/classes/messages',
  results: [],
  rooms: {},
  friends: {},
  currentRoom: 'lobby'
};
  
app.displayMessages = function(data) {

  var $chats = $('#chats');
  var context = this;

  $('#chats').empty();

  //for each message from server, display username, text, and time, append to chats div element
  data.forEach(function(element) { //WHY IS UNDERSCORE NOT WORKING?

    var username = element.username;
    var text = element.text;
    var createdAt = element.createdAt;
    var roomname = element.roomname;

    var safeText = context.escapeForHtml(text);
    var safeCreatedAt = context.escapeForHtml(createdAt);
    var safeUsername = context.escapeForHtml(username);
    var safeRoomname = context.escapeForHtml(roomname);

    // we need to get the value of the Rooms dropdown to check if "All Rooms" is chosen
    var allrooms = $('select[name="roomDropDown"]').val();

    //if the room is our current room OR if the dropdown is set to all rooms
    if (safeRoomname === context.currentRoom || allrooms === 'allRooms') {

      // var style = '';
      // if (context.friends[safeUsername]) {
      //   style = 'bold';
      // }

      var temp = '<div class="chat"> ' +
            '<div class="username">' + safeUsername + '</div>' +
            '<div>' + safeText + '</div>' + '\n' + 
            '<div>' + safeCreatedAt + '</div>' +
            '</div>';    

      $chats.append(temp);
    }


    context.rooms[safeRoomname] = safeRoomname;

  });
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

  var context = this;
  $('.clearButton').on('click', app.clearMessages);


  $('#send').submit(app.handleSubmit);

  // Selecting a room dropdown change handler
  $('select[name="roomDropDown"]').on('change', function(event) {
    if ($(this).val() === 'addNewRoom') {
      $('.add-room-container').toggleClass('hidden');
    //if different room is selected
    } else {
      //display messages for that room
      //allow user to add message to that room
      //fetch for room
      context.currentRoom = $(this).val();
      app.fetch();
    }
  });

  // Add Room Button click handler
  $('.addRoomButton').on('click', function() {
    var room = $('input[name="addRoom"]').val();
    app.addRoom(room);
  });

  // Clicking on a user name event handler
  $('#main').on('click', '.username', function() {
    var newFriend = $(this).text();
    console.log('newFriend: ' + newFriend);
    app.addFriend(newFriend);
  });
  setInterval(function() {
    app.fetch.call(app);
  }, 1000);

};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
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

  console.dir(this);

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    data: '',
    contentType: 'application/json',
    success: function (data) {
      context.results = data.results;
      context.displayMessages(data.results);
      var roomName = context.currentRoom || "Home";
      console.log("ROOM = " + roomName);
      context.initRoom(roomName);
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
  var $chats = $('#chats');
  $chats.empty();
};

app.addMessage = function(message) {
  //EXAMPLE
  // {"createdAt":"2016-03-15T02:23:13.246Z", *
  // "objectId":"1WMVP1XR0i", *
  // "roomname":"stuff",
  // "text":"Hello @Rahim",
  // "updatedAt":"2016-03-15T02:23:13.246Z", *
  // "username":"therealdonald"}

  //Grab message from input box
  var text = app.escapeForHtml($('input[name="add"]').val());

  //Get username
  var queryString = window.location.search;  
  var userString = app.escapeForHtml(queryString.split('=')[1]);  // TODO - create more robust solution to find username

  //Compile message
  var message = {
    username: userString,
    roomname: app.currentRoom,
    text: text
  };

  var newChat = $('#chats').prepend('<div class="chat"> ' +
            '<div class="username">' + userString + '</div>' +
            '<div>' + text + '</div>' + '\n' + 
            '<div>' + new Date() + '</div>' +
            '</div>');  
  
  app.send(message);
};

app.addRoom = function(room) {

  //get value from input field
  // protect user input from bad stuff being entered
  var roomname = app.escapeForHtml(room);
  //add to rooms object
  app.rooms[roomname] = roomname;
  app.currentRoom = roomname;

  //fetch messages for room
  app.fetch();

  $('.add-room-container').toggleClass('hidden');
};

app.initRoom = function(roomname) {
  $('select[name="roomDropDown"]').empty();

  $('select[name="roomDropDown"]').append($('<option/>', {
    text: 'Add New Room',
    value: 'addNewRoom' 
  }));

  $('select[name="roomDropDown"]').append($('<option/>', {
    text: 'All Rooms',
    value: 'allRooms' 
  }));
 
  app.currentRoom = roomname || 'Home';  //allRooms

  $.each(app.rooms, function(index, value) {
    if (value === roomname) {
      $('select').append($('<option/>', {
        text: value,
        value: value,
        selected: 'selected'
      }));
    } else { 
      $('select').append($('<option/>', {
        text: value,
        value: value
      }));  
    }
  });
};

app.addFriend = function(friend) {

  app.friends[friend] = friend;
  var elem = $('.chat:contains("' + friend + '")');
  elem.addClass('bold');
};

app.handleSubmit = function(evt) {
  evt.preventDefault();
  app.addMessage();
};

$(document).ready( function() {
  app.init();
  app.fetch();
});
