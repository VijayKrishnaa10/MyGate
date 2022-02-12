import { LightningElement,wire } from 'lwc';
import getSubmittedRecords from '@salesforce/apex/ApprovalProcessController.getSubmittedRecords';
import processRecords from '@salesforce/apex/ApprovalProcessController.processRecords';

import addOwnertoAssociation from '@salesforce/apex/addingMembersToAssociation.addOwnertoAssociation';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'Name', fieldName: 'recordId', type : 'url', typeAttributes : {label:{fieldName:'recordName'},target:'_blank'}},
    { label : 'Related to',fieldName : 'relatedTo', type : 'text'},
    { label : 'Submitted by', fieldName : 'submittedBy',type : 'text', sortable : true },
    { label : 'Submitted date', fieldName : 'submittedDate', type : 'date', typeAttributes : {year:"2-digit",month:"short",day:"2-digit"},
    sortable : true}
];

export default class ApproveRejectFlatMembers extends LightningElement {
    data = [];
    columns = columns;
    wiredAccountsResult;


    @wire(getSubmittedRecords)
    wiredAccounts(result){
        this.wiredAccountsResult = result;
        if(result.data){
            console.log('data', result.data);
            this.data = result.data;
        }else if(result.error){
            console.log('error', result.error);
        }
    }

    handleRejection(){
        this.processApproveOrRejct('Reject');
    }

    handleApproval(){
        this.processApproveOrRejct('Approve');
    }

    processApproveOrRejct(request){
        let el = this.template.querySelector('lightning-datatable');
        let selected =JSON.parse(JSON.stringify(el.getSelectedRows()));
        console.log('selected',selected);
        let workItemlist = selected.map(item => ({'workItemId':item.workItemId, 'recordId':item.recordId}))
        let workItemlistArray = [];
        for(let i = 0;i < workItemlist.length; i++){
            workItemlistArray.push(workItemlist[i].workItemId);
        }
        let respectedRecordIdlistArray = [];
        for(let i = 0;i < workItemlist.length; i++){
            respectedRecordIdlistArray.push(workItemlist[i].recordId);
        }
        console.log('respectedRecordIdlistArray',respectedRecordIdlistArray);
        console.log(workItemlist);
        console.log(workItemlistArray);
        processRecords({ lstWorkItemIds: workItemlistArray, processType: request})
        .then((result) => {
            console.log(result);
            if(request == 'Reject'){
                const evt = new ShowToastEvent({
                    title: "Request Rejection Successful",
                    message: "No. of files rejected : " + workItemlist.length,
                    variant: "success"
                });
                this.dispatchEvent(evt);
            }else  if(request == 'Approve'){
                addOwnertoAssociation({ recordIdList: respectedRecordIdlistArray})
                    .then((result) => {
                        console.log('approvedRecord', result);
                        const evt = new ShowToastEvent({
                            title: "Approval Successful",
                            message: "No. of files Approved : " + workItemlist.length,
                            variant: "success"
                        });
                        this.dispatchEvent(evt);
                    })
                    .catch((error) => {
                        console.log('error', error);

                        const evt = new ShowToastEvent({
                            title: "Approval Successful, But Members are not added to the association",
                            message: "This might happen when association or the member have some inappropriate details",
                            variant: "Warning"
                        });
                        this.dispatchEvent(evt);
                    });
                    // const evt = new ShowToastEvent({
                    //     title: "Approval Successful",
                    //     message: "No. of files Approved : " + workItemlist.length,
                    //     variant: "success"
                    // });
                    // this.dispatchEvent(evt);
            }
            return refreshApex(this.wiredAccountsResult);
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
}