import { LightningElement } from 'lwc';
import FLAT_ASSOCIATION_OBJECT from '@salesforce/schema/Flat_Association__c';
import NAME_FIELD from '@salesforce/schema/Flat_Association__c.Name';
import APARTMENTS_FIELD from '@salesforce/schema/Flat_Association__c.Apartment_Name__c';
import CITIES_C from '@salesforce/schema/Flat_Association__c.City__c';
import Id from '@salesforce/user/Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FlatAssociationCreate extends LightningElement {
    userId = Id;
    flatAssociationObject = FLAT_ASSOCIATION_OBJECT;
    fields = [NAME_FIELD, APARTMENTS_FIELD,CITIES_C];
    associationObj = {};
    flatAssocication="";
    apartmentName="";
    associationDetails = true;
    currentRecordId='';

    handleSuccess(event){
        this.associationDetails = false;
        this.currentRecordId = event.detail.id;
        this.associationObj = {
            "name": this.apartmentName,
            "dataparamname":this.flatAssocication,
            "userId":this.userId,
            "recordid": this.recordid
        }
        
        const evt = new ShowToastEvent({
            title: "Flat Association created",
            message: "Record ID: " + event.detail.id,
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
        alert("No. of files uploaded : " + uploadedFiles.length);
    }

    handleSubmit(event) {
        console.log('submit');
        console.log(JSON.stringify(event.detail.fields));
        let savedFieleds = JSON.parse(JSON.stringify(event.detail.fields));
        let flatName = savedFieleds.Apartment_Name__c;
        this.apartmentName = savedFieleds.Apartment_Name__c;
        let apt = flatName.replaceAll("\\s", "");
        let flatCity = savedFieleds.City__c;
        this.flatAssocication = (apt+flatCity).toLowerCase();
        
    }

}