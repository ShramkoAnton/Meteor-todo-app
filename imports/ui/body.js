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
    this.autorun(() => {
        console.log("distinctEntrfxdfxdfxdfdxfdxfdxies 111111111111111111111111111");

        self.subscribe("Tasks", function () {
            console.log("distinctEntrfxdfxdfxdfdxfdxfdxies");

            self.autorun(() => {
                const distinctEntries = Tasks
                    .find({ checked: { $ne: true } }, { sort: { createdAt: -1 } })
                // .map(function (x) {

                //   return x;
                // });
                console.log("distinctEntries", distinctEntries);

                //console.log("image distinct entries", distinctEntries);
                Session.set("Tasks", distinctEntries);

            });
        });
    });
});

Template.body.helpers({
    tasks() {

        // const instance = Template.instance();
        // if (instance.state.get('hideCompleted')) {
        //     // If hide completed is checked, filter tasks
        //     return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
        // }
        // // Otherwise, return all of the tasks
        // return Tasks.find({}, { sort: { createdAt: -1 } })
        return Session.get('Tasks');
    },
    incompleteCount() {
        return Tasks.find({ checked: { $ne: true } }).count();
    },
    hasTasks() {
        const tasks = Tasks.find({}, { sort: { createdAt: -1 } }).fetch();

        if (!tasks.length) {
            return true
        }
    },

});

Template.body.events({
    'submit .new-task'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const text = target.text.value;


        // Insert a task into the collection
        if (text.length) {
            Tasks.insert({
                text,
                createdAt: new Date(), // current time
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