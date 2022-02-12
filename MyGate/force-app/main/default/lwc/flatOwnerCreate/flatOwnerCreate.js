import { LightningElement } from 'lwc';
import FLAT_OWNER_OBJECT from '@salesforce/schema/Flat_Owner__c';
import NAME_FIELD from '@salesforce/schema/Flat_Owner__c.Name';
import IMAGE_FIELD from '@salesforce/schema/Flat_Owner__c.Image__c';
import APARTMENTS_FIELD from '@salesforce/schema/Flat_Owner__c.Apartments__c';
import FLAT_NUMBER from '@salesforce/schema/Flat_Owner__c.Flat_Number__c';
import PHONE_NUMBER from '@salesforce/schema/Flat_Owner__c.Phone_Number__c';
import RESIDING_FROM from '@salesforce/schema/Flat_Owner__c.Residing_From__c';
import EMAIL_C from '@salesforce/schema/Flat_Owner__c.Email__c';
import CITIES_C from '@salesforce/schema/  .Cities__c';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

import submitApproval from '@salesforce/apex/ApprovalProcessController.submitForApproval';
// import {getAssociation} from 'data/sessionService'

export default class FlatOwnerCreate extends NavigationMixin(LightningElement) {

    progress = "1";
    ownerDetails = true;
    flatOwnerObject = FLAT_OWNER_OBJECT;
    fields = [NAME_FIELD, IMAGE_FIELD, CITIES_C, APARTMENTS_FIELD,FLAT_NUMBER,PHONE_NUMBER,RESIDING_FROM, EMAIL_C];
    flats = [];
    dummy = [];
    currentRecordId = '';
    value = '';
    checkBoxValue='';

    get options() {
        return [
            { label: 'Owner of the flat', value: 'owner' },
            { label: 'Renting tentant', value: 'Renting' },
            { label: 'Sharing with other tentents', value: 'Sharing' },
        ];
    }

    get checkBoxoptions() {
        return [
            { label: 'Send approval request to your respective flat Assosiation', value: 'option1' }
        ];
    }

    connectedCallback() {
        const calloutURI = 'https://my-json-server.typicode.com/VijayKrishnaa10/flats-api/data';
        fetch(calloutURI, // End point URL
            {
                // Request type
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            })
            .then((response) => {
                return response.json(); // returning the response in the form of JSON
            })
            .then((jsonResponse) => {
                console.log('jsonResponse ===> ' + JSON.stringify(jsonResponse));
                this.flats = JSON.stringify(jsonResponse);
            })
            .catch(error => {
                console.log('callout error ===> ' + JSON.stringify(error));
            })
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

    handleApproval(){
        if(this.checkBoxValueBool === true){
            console.log('submit for approval');
            submitApproval({recordId : this.currentRecordId , userId : this.filteredValue.userId});
        }
    }

    handleSubmit(event) {
        console.log(JSON.stringify(event.detail.fields));
        let flatArray = JSON.parse(this.flats);
        let savedFieleds = JSON.parse(JSON.stringify(event.detail.fields))
        let flatName = savedFieleds.Apartments__c;
        let apt = flatName.replaceAll("\\s", "");
        let flatCity = savedFieleds.Cities__c;
        let flatLocation = (apt+flatCity).toLowerCase();
        
        flatArray.forEach(element => {
            if (element.dataparamname === flatLocation) {
                console.log(element)
                this.filteredValue = element;
            }
        });
        //submitApproval({recordId : this.filteredValue.recordid});
        // let flatasso = this.flats.filter(function (e) {
        //     return e.dataparamname === flatLocation;
        // });
    }

    handleSuccess(event) {        
        this.ownerDetails = false;
        this.progress = "2";
        this.currentRecordId = event.detail.id;
        const evt = new ShowToastEvent({
            title: "Flat Owner created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(evt);
        // this[NavigationMixin.Navigate]({
        //     type: 'standard__navItemPage',
        //     attributes: {
        //         apiName: 'Owner_Details'
        //     }
        // });



    }
}