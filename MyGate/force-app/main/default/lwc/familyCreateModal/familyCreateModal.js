import { LightningElement, wire, track, api } from 'lwc';
import TOTAL_MEMBERS from '@salesforce/schema/Family__c.Total_Members_In_Home__c';
import FAMILY_NAME from '@salesforce/schema/Family__c.Name';
import FAMILY_ID from '@salesforce/schema/Family__c.Flat_Owner__c';
import createFamilyDetails from '@salesforce/apex/addAdditionalDetails.createFamilyDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish, MessageContext } from 'lightning/messageService';
import RECORD_SELECTED_CHANNEL from '@salesforce/messageChannel/Record_Selected__c';

export default class FamilyCreateModal extends LightningElement {
    @api recid;

    message;
    error;
    showModal = false;

    @wire(MessageContext)
    messageContext;

    @track familyId = FAMILY_ID;
    @track familyName = FAMILY_NAME;
    @track totalMembers = TOTAL_MEMBERS;
    familyRec = {
        id: this.familyId,
        name : this.familyName,
        total_members_in_home__c : this.totalMembers
    }

    handleFamilyNameChange(event) {
        this.familyRec.name = event.target.value;
        console.log("name1", this.familyRec.name);
    }
    
    handleTotalNumberchange(event) {
        this.familyRec.total_members_in_home__c = event.target.value;
        console.log("Industry", this.familyRec.total_members_in_home__c);
    }
    

    handleCancelModal(){
        const closedialog = new CustomEvent('closedialog');
        this.dispatchEvent(closedialog);
        this.hide();
    }

    handleSaveClick() {
        this.familyRec.id = this.recid;
        createFamilyDetails({id:this.familyRec.id, name:this.familyRec.name,
            totalMembers:this.familyRec.total_members_in_home__c})
            .then(result => {
                this.message = result;
                this.error = undefined;
                if(this.message !== undefined) {
                    this.familyRec.name = '';
                    this.familyRec.total_members_in_home__c = '';
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Family Added',
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