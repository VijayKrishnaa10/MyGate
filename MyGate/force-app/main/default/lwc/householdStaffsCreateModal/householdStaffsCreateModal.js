import { LightningElement, wire, track, api } from 'lwc';
import ENTRY_TIME from '@salesforce/schema/Household_staff__c.Entry_time__c';
import STAFF_NAME from '@salesforce/schema/Household_staff__c.Name';
import STAFF_ID from '@salesforce/schema/Household_staff__c.Flat_Owner__c';
import createStaffDetails from '@salesforce/apex/addAdditionalDetails.createStaffDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish, MessageContext } from 'lightning/messageService';
import RECORD_SELECTED_CHANNEL from '@salesforce/messageChannel/Record_Selected__c';

export default class HouseholdStaffsCreateModal extends LightningElement {
    @api recid;

    message;
    error;
    showModal = false;

    @track staffId = STAFF_ID;
    @track staffName = STAFF_NAME;
    @track entryTime = ENTRY_TIME;
    staffRec = {
        id: this.staffId,
        name : this.staffName,
        Entry_time__c : this.entryTime
    }

    @wire(MessageContext)
    messageContext;

    handleStaffNameChange(event) {
        this.staffRec.name = event.target.value;
        console.log("name1", this.staffRec.name);
    }
    
    handleStaffEntrychange(event) {
        this.staffRec.Entry_time__c = event.target.value;
        console.log("Industry", this.staffRec.Entry_time__c);
    }
    

    handleCancelModal(){
        const closedialog = new CustomEvent('closedialog');
        this.dispatchEvent(closedialog);
        this.hide();
    }

    handleSaveClick() {
        this.staffRec.id = this.recid;
        createStaffDetails({id:this.staffRec.id, name:this.staffRec.name,
            entryTime:this.staffRec.Entry_time__c})
            .then(result => {
                this.message = result;
                this.error = undefined;
                if(this.message !== undefined) {
                    this.staffRec.name = '';
                    this.staffRec.Entry_time__c = '';
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Staff Added',
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