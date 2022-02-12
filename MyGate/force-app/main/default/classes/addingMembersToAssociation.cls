public with sharing class addingMembersToAssociation {
    @AuraEnabled
    public static List<flat_owner__c> addOwnertoAssociation(List<Id> recordIdList) {

        List<flat_owner__c> flatList = new List<flat_owner__c>();
        flat_association__c acct = [select id from flat_association__c  where owner.id =: UserInfo.getUserId() limit 1];
        string flatAssoId = acct.Id;
       	system.debug('flatAssociation'+ acct);
        system.debug('flatAssociationId'+ flatAssoId);
        system.debug('recordId'+ recordIdList);
         for(String recordId : recordIdList){
             flat_owner__c flat = new flat_owner__c();
             flat.Id = recordId;
             flat.Flat_Association__c = flatAssoId;
             flatList.add(flat);
        }
        if(flatList != null && flatList.size() > 0){
            update flatList;
        }
        return flatList;
    }

}