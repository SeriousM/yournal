Posts = new Meteor.Collection("posts");

// todo: since the server can manipulate whatever it likes
// we don't need to have these allow-checks
Posts.allow({
  insert: function(){
    return Meteor.isServer;
  },
  update: function(){
    return Meteor.isServer;
  },
  remove: function(){
    return Meteor.isServer;
  }
});