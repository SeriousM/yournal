// this publication is used in config.js - FastRender config.
// it's necessary to send the current user together with the
// html to the users browser to speed up the load process and
// that the routing can react faster depending on
// the currentUser presence.
Meteor.publish('currentUser', function() {
  return Meteor.users.find({_id: this.userId});
});

Meteor.publish('postsOfCurrentUser', function() {
  return Posts.find({creator: this.userId});
});

// debug purposes
//Meteor.publish('allPosts', function() {
//  return Posts.find({});
//});