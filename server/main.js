import { Meteor } from 'meteor/meteor';
import {Tasks} from '../imports/api/tasks'
import '../imports/api/tasks.js'

Meteor.startup(() => {
  // code to run on server at startup
});

if (Meteor.isServer) {
  Meteor.publish("tasks", function () {
    console.log("tasks", Tasks.find());
    
      return Tasks.find();
  });
}

