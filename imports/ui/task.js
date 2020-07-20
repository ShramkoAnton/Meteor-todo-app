import {Template} from 'meteor/templating'
import {Tasks} from '../api/tasks.js'
import './task.html'
import { Session } from 'meteor/session';

Template.task.onCreated(function bodyOnCreated() {
  let self = this;
  this.state = new ReactiveDict();

  Meteor.subscribe("Tasks", function () {
    self.autorun(() => {
      const distinctEntries = Tasks
      .find({}, { sort: { createdAt: -1 } })
      .map(function (x) {
          return x;
      });
      Session.set("Tasks", distinctEntries);
    });
  });
});

Template.task.helpers({

  showInput() {
    const inst = Template.instance();
    return inst.state.get("isEditing")
  }

});

Template.task.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Tasks.update(this._id, {
      $set: { checked: ! this.checked },
    }); 
  }, 
  'click .delete'() {
    Tasks.remove(this._id);
  },

  'click .edit'(event, instance) {
    const inst = Template.instance();
    inst.state.set("isEditing", true)
  },
  
  'keyup .input-task'(event, instance) {
    if(event.keyCode === 13) {
      Tasks.update(this._id, {
        $set: {text: event.target.value }      
      })
      const inst = Template.instance();
      inst.state.set("isEditing", false)
    }
  }
});

