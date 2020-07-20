import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import './task.js';
import './body.html';
import { Tasks } from '../api/tasks.js';
import { Session } from 'meteor/session';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.body.onCreated(function bodyOnCreated() {
    let self = this;
    this.state = new ReactiveDict();

    Meteor.subscribe("Tasks", function () {

        self.autorun(() => {
            const distinctEntries = Tasks
            .find({}, { sort: { createdAt: -1 } })
            .map(function (x) {
                return x;
            });

            console.log("distinctEntries", distinctEntries);
            Session.set("Tasks", distinctEntries);
        });
    });
});

Template.body.helpers({
    tasks() {
        return Session.get('Tasks');
    },

    incompleteCount() {
        const count = Session.get('Tasks')
        if (count&&count.length) return count.length
    },

    hasTasks() {
       const tasks = Session.get('Tasks');
        if (tasks&&tasks.length) return true 
    },
});

Template.body.events({
    'submit .new-task'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        // const text = target.text.value;
        const value = $("#input-field").val()

        // Insert a task into the collection
        if (value.trim()) {
            Tasks.insert({
                text: value,
                checked: false,
                id: Date.now(),
                createdAt: Date.now(),
                owner: Meteor.userId(),
                username: Meteor.user().username,
            });
            // Clear form
            target.text.value = '';
        }

    },
    'change .hide-completed input'(event, instance) {
        instance.state.set('hideCompleted', event.target.checked);
    },
});