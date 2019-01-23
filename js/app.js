import { DB } from './toDoDB';
import { Template } from './toDoNotification';
import { Controller } from './toDoController';

DB.start().then(db => {
    db.findAll().then( itemList => Template.toDoList(itemList));
})

Controller.start();