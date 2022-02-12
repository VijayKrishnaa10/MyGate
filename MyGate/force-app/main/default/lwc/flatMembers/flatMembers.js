import { LightningElement, wire } from 'lwc';
import flatMembers from '@salesforce/apex/ownerDet.getFlatMemberDetails';
import searchFlatMembers from '@salesforce/apex/ownerDet.searchFilterFlatMembers';

const DELAY = 300;

export default class FlatMembers extends LightningElement {
    searchKey = '';
    flatMembers;

    @wire(flatMembers)
    wiredContacts({ error, data }) {
        if (data) {
            this.flatMembers = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.flatMembers = undefined;
        }
    }
    


    handleKeyChange(event) {
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
            this.handleSearchKeyChange();
        }, DELAY);
       

    }

    handleSearchKeyChange(){
        searchFlatMembers({ searchKey: this.searchKey })
        .then((result) => {
            this.flatMembers = result;
            this.error = undefined;
        })
        .catch((error) => {
            this.error = error;
            this.flatMembers = undefined;
        });
    }

}