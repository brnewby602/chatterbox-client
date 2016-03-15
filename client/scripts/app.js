// YOUR CODE HERE:
$(document).ready(function() {
  var app = {
    server: 'https://api.parse.com/1/classes/messages',
    results: []

  };
    
  app.displayMessages = function(data) {

    var $chats = $('#chats');
    var context = this;

    data.forEach(function(element) { //WHY IS UNDERSCORE NOT WORKING?

      var username = element.username;
      var text = element.text;
      var createdAt = element.createdAt;

      var safeText = context.escapeForHtml(text);
      var safeCreatedAt = context.escapeForHtml(createdAt);
      var safeUsername = context.escapeForHtml(username);

      $chats.append('<div class="message"></div>')
        .append('<div>' + safeUsername + '</div>')
        .append('<div>' + safeText + '</div>')
        .append('<div>' + safeCreatedAt + '</div>');


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
    $('.clearButton').on('click', app.clearMessages);

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

  };



  var message = {
    username: 'Mel Brooks',
    text: 'It\'s good to be the king',
    roomname: 'lobby'
  };

  app.init();

  app.fetch();
  // app.send(message);

});