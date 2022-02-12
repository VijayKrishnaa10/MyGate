import { LightningElement, wire, track, api } from 'lwc';
import VEHICLE_NUMBER from '@salesforce/schema/Vehicle__c.Vehicle_Number__c';
import VEHICLE_NAME from '@salesforce/schema/Vehicle__c.Name';
import VEHICLE_COLOR from '@salesforce/schema/Vehicle__c.Color__c';
import VEHICLE_ID from '@salesforce/schema/Vehicle__c.Flat_Owner__c';
import createVehicle from '@salesforce/apex/addAdditionalDetails.createVehicleDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish, MessageContext } from 'lightning/messageService';
import RECORD_SELECTED_CHANNEL from '@salesforce/messageChannel/Record_Selected__c';

export default class VechicleCreateModal extends LightningElement {
    @api recid;

    message;
    error;
    showModal = false;

    @track vehicleId = VEHICLE_ID;
    @track vehicleName = VEHICLE_NAME;
    @track vechicleNumber = VEHICLE_NUMBER;
    @track vechicleColor = VEHICLE_COLOR;
    VehicleRec = {
        id: this.vehicleId,
        name : this.vehicleName,
        vehicle_number__c : this.vechicleNumber,
        color__c : this.vechicleColor
    }

    @wire(MessageContext)
    messageContext;

    handleVehicleNameChange(event) {
        this.VehicleRec.name = event.target.value;
        console.log("name1", this.VehicleRec.name);
    }
    
    handleVehicleNumberchange(event) {
        this.VehicleRec.vehicle_number__c = event.target.value;
        console.log("Industry", this.VehicleRec.vehicle_number__c);
    }
    
    handleVehicleColorChange(event) {
        this.VehicleRec.color__c = event.target.value;
        console.log("Phone", this.VehicleRec.color__c);
    }

    handleCancelModal(){
        const closedialog = new CustomEvent('closedialog');
        this.dispatchEvent(closedialog);
        this.hide();
    }

    handleSaveClick() {
        this.VehicleRec.id = this.recid;
        createVehicle({id:this.VehicleRec.id, name:this.VehicleRec.name,
            vehicleNumber:this.VehicleRec.vehicle_number__c, color:this.VehicleRec.color__c})
            .then(result => {
                this.message = result;
                this.error = undefined;
                if(this.message !== undefined) {
                    this.VehicleRec.name = '';
                    this.VehicleRec.vehicle_number__c = '';
                    this.VehicleRec.color__c = '';
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Vehicle Added',
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