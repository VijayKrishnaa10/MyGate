import { LightningElement, wire, track, api } from 'lwc';
import INTERCOM_NUMBER from '@salesforce/schema/Intercom__c.Intercom_Number__c';
import INTERCOM_NAME from '@salesforce/schema/Intercom__c.Name';
import ALTERNATE_PHONE from '@salesforce/schema/Intercom__c.Alternate_Phone__c';
import INTERCOM_ID from '@salesforce/schema/Intercom__c.Flat_Owner__c';
import createIntercom from '@salesforce/apex/addAdditionalDetails.createIntercomDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish, MessageContext } from 'lightning/messageService';
import RECORD_SELECTED_CHANNEL from '@salesforce/messageChannel/Record_Selected__c';

export default class IntercomCreateModal extends LightningElement {
    @api recid;

    message;
    error;
    showModal = false;

    @track intercomId = INTERCOM_ID;
    @track intercomName = INTERCOM_NAME;
    @track intercomNumber = INTERCOM_NUMBER;
    @track alternatePhone = ALTERNATE_PHONE;
    IntercomRec = {
        id: this.intercomId,
        name : this.intercomName,
        Intercom_Number__c : this.intercomNumber,
        Alternate_Phone__c : this.alternatePhone
    }

    @wire(MessageContext)
    messageContext;

    handleIntecomNameChange(event) {
        this.IntercomRec.name = event.target.value;
        console.log("name1", this.IntercomRec.name);
    }
    
    handleIntercomNumberchange(event) {
        this.IntercomRec.Intercom_Number__c = event.target.value;
        console.log("Industry", this.IntercomRec.Intercom_Number__c);
    }
    
    handleAlternateNumberChange(event) {
        this.IntercomRec.Alternate_Phone__c = event.target.value;
        console.log("Phone", this.IntercomRec.Alternate_Phone__c);
    }

    handleCancelModal(){
        const closedialog = new CustomEvent('closedialog');
        this.dispatchEvent(closedialog);
        this.hide();
    }

    handleSaveClick() {
        this.IntercomRec.id = this.recid;
        createIntercom({id:this.IntercomRec.id, name:this.IntercomRec.name,
            vehicleNumber:this.IntercomRec.Intercom_Number__c, color:this.IntercomRec.Alternate_Phone__c})
            .then(result => {
                this.message = result;
                this.error = undefined;
                if(this.message !== undefined) {
                    this.IntercomRec.name = '';
                    this.IntercomRec.Intercom_Number__c = '';
                    this.IntercomRec.alternate_phone__c = '';
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Intercom Added',
                            variant: 'success',
                        }),
                    );
                }
                console.log(JSON.stringify(result));
                console.log("result", this.message);
                this.hide();
                this.handleApexRefresh();
            })
            .catch(error => {
                this.message = undefined;
                this.error = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                console.log("error", JSON.stringify(this.error));
                this.hide();
            });
    }

    handleApexRefresh(){
        // let record = {
        //     recordId: this.recid
        // }
        // const selectEvent = new CustomEvent('refresh', {
        //     detail: record
        // });
        // this.dispatchEvent(selectEvent);
        // 3. 
        const payload = { recordId: this.recid };

        publish(this.messageContext, RECORD_SELECTED_CHANNEL, payload);
    }


    @api show() {
        this.showModal = true;
    }

    @api hide() {
        this.showModal = false;
    }

    handleDialogClose() {
        //Let parent know that dialog is closed (mainly by that cross button) so it can set proper variables if needed
        const closedialog = new CustomEvent('closedialog');
        this.dispatchEvent(closedialog);
        this.hide();
    }

    handleSlotTaglineChange() {
        // Only needed in "show" state. If hiding, we're removing from DOM anyway
        // Added to address Issue #344 where querySelector would intermittently return null element on hide
        if (this.showModal === false) {
            return;
        }
        const taglineEl = this.template.querySelector('p');
        taglineEl.classList.remove(CSS_CLASS);
    }

    handleSlotFooterChange() {
        // Only needed in "show" state. If hiding, we're removing from DOM anyway
        // Added to address Issue #344 where querySelector would intermittently return null element on hide
        if (this.showModal === false) {
            return;
        }
        const footerEl = this.template.querySelector('footer');
        footerEl.classList.remove(CSS_CLASS);
    }
}