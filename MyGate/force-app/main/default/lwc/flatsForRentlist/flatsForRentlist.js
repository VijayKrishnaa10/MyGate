import { LightningElement, wire } from 'lwc';
import flatRental from '@salesforce/apex/ownerDet.flatRental';
import RECORD_RENTAL_CHANNEL from '@salesforce/messageChannel/Record_Rental__c';
import getImageFiles from '@salesforce/apex/fileimagePreview.getImageFilesByRecordId';
import { publish, MessageContext } from 'lightning/messageService';

export default class FlatsForRentlist extends LightningElement {

    flatRental = [];
    recordId;
    picture1;
    filesList = [];
    filesListObj;
    imageDisplay = false;

    @wire(flatRental)
    wiredRental(result) {
        if (result.data) {  
            console.log('result',result.data);
            this.flatRental = result.data;
        } else if (result.error) {
            console.log('error',result.error);
        }
    }

    @wire(MessageContext)
    messageContext;

    // @wire(getImageFiles, { recordId: '$recordId' })
    // wiredImages(result) {
    //     if (result.data) {
    //         if (result.data.length != 0) {
    //             this.imageDisplay = true;
    //             console.log('data', result.data);
    //             var base_url = window.location.origin;
    //             console.log('baseUrl', base_url);
    //             for (let i = 0; i < result.data.length; i++) {
    //                 this.filesListObj = {
    //                     "label": result.data[i].Id,
    //                     "url": `/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=${result.data[i].Id}`
    //                 }
    //                 this.filesList.push(this.filesListObj);
    //             }
    //             this.picture1 = base_url + this.filesList[0].url;
    //         }else if(result.data.length === 0){
    //             this.imageDisplay = false;
    //         }

    //     } else if (result.error) {
    //         console.log('error', result.error);
    //     }
    // }


    handleImagePreview(event){
        this.recordId = event.target.dataset.recId;
        console.log(this.recordId);
        const payload = { recordId: this.recordId };
        publish(this.messageContext, RECORD_RENTAL_CHANNEL, payload);
    }
   

    
}