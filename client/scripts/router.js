Router.configure({
  layoutTemplate: 'mainLayout',
  templateNameConverter: 'upperCamelCase'
});

Router.map(function() {
  this.route('frontpage', {
    path: '/'
  });

});