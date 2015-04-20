// ****************************** SETTINGS PROTECTION ******************************
if(Meteor.isServer) {
  Meteor.startup(function(){
    if (!_.isObject(Meteor.settings) || _.isEmpty(Meteor.settings)){
      throw new Meteor.Error(500, 'This meteor instance was launched without settings!');
    }
    
    var requiredSettingKeys = ['kadiraAppId', 'kadiraAppSecret', 'public'],
        requiredPublicSettingKeys = ['ga'],
        existingSettingKeys = Object.keys(Meteor.settings),
        existingPublicSettingKeys = Object.keys(Meteor.settings.public),
        missingSettingKeys = [];
    
    _.each(requiredSettingKeys, function(key){
      if (!_.contains(existingSettingKeys, key)){
        missingSettingKeys.push(key);
      }
    });

    _.each(requiredPublicSettingKeys, function(key){
      if (!_.contains(existingPublicSettingKeys, key)){
        missingSettingKeys.push('public.'+key);
      }
    });

    if (missingSettingKeys.length){
      throw new Meteor.Error(500, 'This meteor settings are missing: ' + JSON.stringify(missingSettingKeys));
    }
  });
}

// ************************************ KADIRA *************************************
if(Meteor.isServer) {
  Meteor.startup(function () {
    Kadira.connect(Meteor.settings.kadiraAppId, Meteor.settings.kadiraAppSecret);
  });
}

// ************************************ IRON ROUTER ********************************

// https://github.com/TelescopeJS/Telescope/blob/master/lib/router.js

Router.configure({
  trackPageView: true // global google analytics tracking
  //layoutTemplate: 'layout',
  //loadingTemplate: 'loading',
  //notFoundTemplate: 'not_found'
});

var filters = Router._filters = {
  blockAnonymousUser: function() {
    if (!(Meteor.loggingIn() || Meteor.user())) {
      this.redirect('home');
    }
    else{
      this.next();
    }
  },

  redirectToUserAreaIfLoggedIn: function(){
    if (Meteor.user()) {
      this.redirect('write');
    }
    else{
      this.next();
    }
  }
};

if(Meteor.isClient){
  Router.onBeforeAction(filters.redirectToUserAreaIfLoggedIn, {except: ['write', 'export']});
  Router.onBeforeAction(filters.blockAnonymousUser, {only: ['write', 'export']});
}

Router.route('/', {
  name: 'home',
  template: 'home',
});
Router.route('/write', {
  name: 'write',
  template: 'write',
  waitOn: function () {
    return Meteor.subscribe('postsOfCurrentUser');
  },
  data: function () {
    return {posts: Posts.find({},{sort:{timestamp: -1}})};
  },
  fastRender: true
});
Router.route('/export', {
  name: 'export',
  template: 'export',
  waitOn: function () {
    return Meteor.subscribe('postsOfCurrentUser');
  },
  data: function () {
    return {posts: Posts.find({},{sort:{timestamp: -1}})};
  },
  fastRender: true
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
  FastRender.route('/export', function() {
    this.subscribe('postsOfCurrentUser');
  });
}

// ****************************** ACCOUNTS TEMPLATES *******************************

// https://github.com/splendido/accounts-templates-core/blob/master/lib/core.js

AccountsTemplates.configure({
  showLabels: false,
  
  homeRoutePath: '/',
  //signInRoutePath: '/',
  //signInRouteName: 'signin',
  //signInRouteTemplate: 'fullPageSigninForm',
  //!signUpRoutePath: '/signup',
  //!signUpRouteName: 'signup',
  //signUpRouteTemplate: 'fullPageSigninForm',
  //!postSignUpRoutePath: '/write',
  //!forgotPwdRoutePath: '/forgot-password',
  //!forgotPwdRouteName: 'forgotPassword',
  //forgotPwdRouteTemplate: 'fullPageSigninForm'
});

var emailField = AccountsTemplates.getField('email');
_.extend(emailField, {
  _id: 'username',
  displayName: 'Username',
  placeholder: 'Username',
  type: 'text',
  required: true,
  minLength: 6,
  re: /^[a-zA-Z0-9]+$/,
  func: function(email) {
    return !email || !email.length;
  }
});