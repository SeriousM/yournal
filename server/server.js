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
      message: String,
      timestamp: Date,
      mood: Match.Where(isValidMood)
    });
    
    // redefine the post structure
    post = {
      message: post.message,
      timestamp: post.timestamp,
      mood: post.mood,
      creator: Meteor.userId()
    }
    
    return Posts.insert(post);
	}
});