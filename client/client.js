Template.write.rendered = function() {
  $('#datetimepicker').datetimepicker({sideBySide: true});
  $('#datetimepicker').data("DateTimePicker").setDate(moment());
  $('#message').autosize();
  $('#mood').selectpicker();
};
Template.write.getColor = function(mood){
  switch (mood){
    case 'happy': return 'success';
    case 'ok': return 'info';
    case 'neutral': return 'primary';
    case 'dangerous': return 'warning';
    case 'angry': return 'danger';
    default: return 'primary';
  }
};
Template.write.getGlyphName = function(mood){
  switch (mood){
    case 'happy': return 'heart';
    case 'ok': return 'thumbs-up';
    case 'neutral': return 'user';
    case 'dangerous': return 'screenshot';
    case 'angry': return 'fire';
    default: return 'user';
  }
};
Template.write.getDateFormat = function(date){
  return moment(date).format('ddd, DD. MMMM YYYY, HH:mm');
};
Template.write.events = {
  'keyup #message, change #message': function(){
    if ($('#message').val().length){
      $('#createMessage').removeClass('disabled');
    }
    else{
      $('#createMessage').addClass('disabled');
    }
  },
  'click #logout': function(){
    Meteor.logout(function(){
      Router.go('home');
    });
  },
  'click #createMessage': function(){
    var message = $('#message').val(),
        timestamp = $('#datetimepicker').data("DateTimePicker").date.toDate(),
        mood = $('#mood').val(),
        post;
    
    post = {message: message, timestamp: timestamp, mood: mood, creator: Meteor.userId()};
    
    Meteor.call('createPost', post, function(error, result){
      if (error){
        alert(error);
      }
      else{
        $('#datetimepicker').data("DateTimePicker").setDate(moment());
        $('#mood').val('neutral').selectpicker('refresh');
        $('#createMessage').addClass('disabled');
        $('#message').autosize().trigger('autosize.resize');
        $('#message').val('').focus();
      }
    });
  }
};

// http://silviomoreto.github.io/bootstrap-select/
