import {Template} from 'meteor/templating'
import {Tasks} from '../api/tasks.js'
import './task.html'

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
      console.log("inst", inst);
      
      inst.state.set("isEditing", true)
      // Tasks.update(this._id, {
      //   $set: {text: event.target.value }
      // })
    }
});
Template.task.helpers({

  showInput() {
    const inst = Template.instance();
    return inst.state.get("isEditing")

  }

});

Template.task.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
});
