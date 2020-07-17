import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';



export const Tasks = new Mongo.Collection('tasks');
