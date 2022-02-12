import { LightningElement, wire } from 'lwc';
import Id from '@salesforce/user/Id';
import findOwner from '@salesforce/apex/ownerDet.getOwnerDetails';
import additionalDetails from '@salesforce/apex/ownerAdditionalDet.ownerAdditionalDetails';
import { publish, MessageContext } from 'lightning/messageService';
import RECORD_SELECTED_CHANNEL from '@salesforce/messageChannel/Record_Selected__c';

export default class FlatOwnerDetails extends LightningElement {
    userId = Id;
    selectedOwner
    
    @wire(findOwner, { ownerId: '$userId' })
    ownerList;

    

    @wire(MessageContext)
    messageContext;

    handleOwnerSelect(event){
        this.selectedOwner = event.target.owner;
        console.log(this.selectedOwner);
    }

    handleNext(){
        console.log(this.ownerList);
        console.log(this.userId);
        console.log('addtional', this.addtionalList);
    }

    handleAllDetail(){
        console.log(this.userId);
        const payload = { recordId: this.selectedOwner.Id };

        publish(this.messageContext, RECORD_SELECTED_CHANNEL, payload);
    }

}