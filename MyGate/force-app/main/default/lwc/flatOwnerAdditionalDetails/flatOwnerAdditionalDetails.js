import { LightningElement, wire, track } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import RECORD_SELECTED_CHANNEL from '@salesforce/messageChannel/Record_Selected__c';
import additionalDetails from '@salesforce/apex/ownerAdditionalDet.ownerAdditionalDetails';
import ownerRentalDetails from '@salesforce/apex/ownerAdditionalDet.ownerRentalDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';



export default class FlatOwnerAdditionalDetails extends LightningElement {
    error;
    recordId;
    addtionalList;
    subscription = null;
    value = '';
    @track imageDisplay = true;

    @track showVehicleModal;
    showVehicleModal = false;

    
    get options() {
        return [
            { label: 'Flat for Rent (i.e: Only when Your flat is for rent)', value: 'option1' }
        ];
    }

    handleChange(e) {
        this.checkBoxValue = e.detail.value;
        if(this.checkBoxValue == 'option1'){
            this.checkBoxValueBool = true;
        }else{
            this.checkBoxValueBool = false;
        }
        console.log('checkBoxValue', this.checkBoxValueBool);
    }

    handlerental(){
        console.log('val', this.checkBoxValueBool);
        ownerRentalDetails({ recordId: this.recordId, rental: this.checkBoxValueBool });
        this.imageDisplay = false;
        const evt = new ShowToastEvent({
            title: "Details Updated",
            variant: "success"
        });
        this.dispatchEvent(evt);
    }

    get acceptedFormats() {
        return ['.pdf', '.png','.jpg','.jpeg'];
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        this.imageDisplay = true;
        const evt = new ShowToastEvent({
            title: "Images Added",
            message: "No. of files uploaded : " + uploadedFiles.length,
            variant: "success"
        });
        this.dispatchEvent(evt);
    }

    //vehicles


    // @wire(additionalDetails, { ownerId: '$userId' })
    // addtionalList;

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            RECORD_SELECTED_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    // handleApexRefresh(event){
    //     const message = event.detail;
    //     this.handleMessage(message);
    // }

    // Handler for message received by component
    handleMessage(message) {
        this.recordId = message.recordId;
        additionalDetails({ recordId: this.recordId })
            .then((result) => {
                this.addtionalList = result;
                console.log(this.addtionalList);
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.addtionalList = undefined;
            });
    }

    // Standard lifecycle hooks used to sub/unsub to message channel
    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    handleIntercom(){
        const modal = this.template.querySelector('c-intercom-create-modal');
        modal.show(); 
    }

    handleVechicles(){     
        this.showVehicleModal = true;   
        const modal = this.template.querySelector('c-vechicle-create-modal');
        modal.show();    
    }

    handleFamily(){
        const modal = this.template.querySelector('c-family-create-modal');
        modal.show(); 
    }

    handleStaff(){
        const modal = this.template.querySelector('c-household-staffs-create-modal');
        modal.show(); 
    }
}