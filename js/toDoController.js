import { Template } from './toDoTemplate';
import { DB } from './toDoDB';

export const Controller = {
    start(){
        document.addEventListener('click', (event) => {

            if(event.target.classList.contains('mdl-button-ripple-container') || event.target.classList.contains('material-icons')){
                var button = event.target.parentElement;

                switch(button.dataset['action']){
                    case 'open': this.Modal.item.open(button.dataset['item']); break;
                    case 'close': this.Modal.item.close(); break;
                    case 'check': this.Modal.item.check(button.dataset['item']); break;
                    case 'save': this.Modal.item.save(); break;
                    case 'startCamera': this.Modal.camera.open(); break;
                    case 'shoot': this.Modal.camera.shoot(); break;
                    case 'changeSource': this.Modal.camera.changeSource(); break;
                }
            }else if(event.target.classList.contains('mdl-navigation__link')){
                var button = event.target;
                
                switch(button.dataset['action']){
                    case 'newItem': this.Modal.Menu.newItem(); break;
                    case 'checkAll': this.Modal.Menu.checkAll(); break;
                    case 'uncheckAll': this.Modal.Menu.uncheckAll(); break;
                    case 'clearAll': this.Modal.Menu.clearAll(); break;
                }
            }

        })
    },
    Modal: {
        item:{
            modal: document.querySelector('#item-dialog'),
            selectedItemId: null,
            open(itemId){
                var dialog = this.modal;
                dialog.querySelector('.close').addEventListener('click', this.close);
                dialog.showModal();
                this.setItem(itemId);
                selectedItemId = itemId;
            },
            close(){
                var that = Controller.Modal.item;
                var dialog = that.modal;
                dialog.querySelector('.close').removeEventListener('click', that.close);
                dialog.hasAttribute('open') && dialog.close();
            },
            setItem(itemId){
                var form = this.getElements();
                if(!itemId){
                    form.img.src = '';
                    form.title.value = '';
                    form.description = '';
                }else{
                    DB.find(itemId).then(item => {
                        form.img = item.image || '';
                        form.title.value = item.title.value;
                        form.description = item.description;
                    })
                }
            },
            check(itemId){
                this.selectedItemId = itemId;
                DB.find(itemId).then(item => {
                    item.isChecked = !item.isChecked;
                    this.save(item);
                })
            },
            save(item){
                var itemValues = item || this.getItemValues();
                (item.selectedItemId ? DB.update(itemValues) : DB.insert(itemValues)).then(
                    itemList =>{
                        Template.toDoList(itemList);
                        this.close();
                    }
                );
            },
            getElements(){
                var dialog = this.modal;
                var img = dialog.querySelector('#item-dialog-picture'),
                    title = dialog.querySelector('title'),
                    description = dialog.querySelector('description');
                return { img, title, description };
            },
            getItemValues(){
                var form = this.getElements();
                return { title: form.title.value, description: form.description.value, image: form.img.getAttribute('src') };
            }
        },
        camera:{
            modal: document.querySelector('#camera-dialog'),
            open(){

            },
            close(){

            },
            shoot(){
                
            },
            changeSource(){
                
            }
        },
        Menu: {
            newItem(){
                Controller.Modal.item.open();
                this.closeMenu();
            },
            checkAll(){
                DB.checkAll(true).then(itemList => {
                    Template.toDoList(itemList);
                })
            },
            uncheckAll(){
                DB.checkAll(false).then(itemList => {
                    Template.toDoList(itemList);
                })                
            },
            clearAll(){                
                DB.clearAll().then(itemList => {
                    Template.toDoList(itemList);
                })
                this.closeMenu();
            },
            closeMenu(){
                document.querySelector('.mdl-layout-obfuscator');
            }
        }
    }
}