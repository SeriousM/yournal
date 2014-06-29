Posts = new Meteor.Collection("posts");

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