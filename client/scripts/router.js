Router.configure({
  layoutTemplate: 'mainLayout',
  templateNameConverter: 'upperCamelCase'
});

Router.map(function() {
  this.route('frontPage', {
    path: '/'
  });

  this.route('mapsPage', {
    path: '/map'
  });

  this.route('new', {
  	path:'/new'
  });

  this.route('thanks', {
    path:'/thanks'
  });

  this.route('confirmPage', {
    path:'/confirm'
  });

  this.route('statusPage', {
    path:'/status'
  });
});