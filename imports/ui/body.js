import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './task.js';
import './body.html';
import { Tasks } from '../api/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
});

Template.body.helpers({
    tasks() {

        const instance = Template.instance();
        if (instance.state.get('hideCompleted')) {
            // If hide completed is checked, filter tasks
            return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
        }
        // Otherwise, return all of the tasks
        return Tasks.find({}, { sort: { createdAt: -1 } })
    },
    incompleteCount() {
        return Tasks.find({ checked: { $ne: true } }).count();
    },
    hasTasks() {
        const tasks = Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } }).fetch();

        if (!tasks.length) {
            return true
        }
    }
});

Template.body.events({
    'submit .new-task'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const text = target.text.value;


        // Insert a task into the collection
        Tasks.insert({
            text,
            createdAt: new Date(), // current time
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });

        // Clear form
        target.text.value = '';
    },
    'change .hide-completed input'(event, instance) {
        instance.state.set('hideCompleted', event.target.checked);
    },
});