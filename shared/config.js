// ****************************** SETTINGS PROTECTION ******************************
Meteor.startup(function(){
  if (!_.isObject(Meteor.settings) || _.isEmpty(Meteor.settings)){
    throw new Meteor.Error(500, 'This meteor instance was launched without settings!');
  }
  
  var requiredSettingKeys = ['kadiraAppId', 'kadiraAppSecret'],
      existingSettingKeys = Object.keys(Meteor.settings),
      missingSettingKeys = [];
  
  _.each(requiredSettingKeys, function(key){
    if (!_.contains(existingSettingKeys, key)){
      missingSettingKeys.push(key);
    }
  });
  
  if (missingSettingKeys.length){
    throw new Meteor.Error(500, 'This meteor settings are missing: ' + JSON.stringify(missingSettingKeys));
  }
});

// ************************************ KADIRA *************************************
if(Meteor.isServer) {
  Meteor.startup(function () {
    Kadira.connect(Meteor.settings.kadiraAppId, Meteor.settings.kadiraAppSecret);
  });
}

// ************************************ IRON ROUTER ********************************

// https://github.com/TelescopeJS/Telescope/blob/master/lib/router.js

Router.configure({
  //layoutTemplate: 'layout',
  //loadingTemplate: 'loading',
  //notFoundTemplate: 'not_found'
});

var filters = Router._filters = {
  blockAnonymousUser: function(pause) {
    if (!(Meteor.loggingIn() || Meteor.user())) {
      pause();
      this.redirect('home');
    }
  },

  redirectToUserAreaIfLoggedIn: function(pause){
    if (Meteor.user()) {
      pause();
      this.redirect('write');
    }
  }
};

if(Meteor.isClient){
  Router.onBeforeAction(filters.redirectToUserAreaIfLoggedIn, {except: ['write']});
  Router.onBeforeAction(filters.blockAnonymousUser, {only: ['write']});
}

Router.map(function() {
  this.route('home', {
    template: 'home',
    path: '/'
  });
  this.route('write', {
    template: 'write',
    path: '/write',
    waitOn: function () {
      return Meteor.subscribe('postsOfCurrentUser');
    },
    data: function () {
      return {posts: Posts.find({},{sort:{timestamp: 1}})};
    },
    fastRender: true
  });
});

// ********************************** FAST RENDER **********************************

// http://meteorhacks.com/fast-render/api/

if(Meteor.isServer) {
  FastRender.onAllRoutes(function() {
    this.subscribe('currentUser');
  });
  FastRender.route('/write', function() {
    this.subscribe('postsOfCurrentUser');
  });
}

// ****************************** ACCOUNTS TEMPLATES *******************************

// https://github.com/splendido/accounts-templates-core/

AccountsTemplates.configure({
  displayFormLabels: false,
  
  homeRoutePath: 'home',
  //signInRoutePath: '/',
  //signInRouteName: 'signin',
  //signInRouteTemplate: 'fullPageSigninForm',
  signUpRoutePath: '/signup',
  signUpRouteName: 'signup',
  //signUpRouteTemplate: 'fullPageSigninForm',
  postSignUpRoutePath: '/write',
  forgotPwdRoutePath: '/forgot-password',
  forgotPwdRouteName: 'forgotPassword',
  //forgotPwdRouteTemplate: 'fullPageSigninForm'
});

AccountsTemplates.removeField('login');
AccountsTemplates.removeField('password');
AccountsTemplates.addField({
    name: 'login',
    placeholder: 'Username',
    type: 'text',
    required: true,
    minLength: 6,
    re: /^[a-zA-Z0-9]+$/,
});
AccountsTemplates.addField({
  minLength: 6,
  name: "password",
  required: true,
  type: "password"
})

AccountsTemplates.init();
