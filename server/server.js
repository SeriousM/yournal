Meteor.startup(function () {
  // code to run on server at startup
});

function isValidMood(value){
  switch (value){
    case 'happy':
    case 'ok':
    case 'neutral':
    case 'dangerous':
    case 'angry':
      return true;
    default:
      return false;
  }
}

Meteor.methods({
	createPost: function(post) {
    check(post, {
      creator: Match.Where(function sameAsUserId(value){return value === Meteor.userId();}),
      message: String,
      timestamp: Date,
      mood: Match.Where(isValidMood)
    });
    
    return Posts.insert(post);
	}
});