public with sharing class ownerDet {
    @AuraEnabled(cacheable=true)
     public static List<Flat_Owner__c> getOwnerDetails(String ownerId) {
        List<Flat_Owner__c> accs = [SELECT Id, Name, Flat_Number__c,Phone_Number__c,
            OwnerId,Owner.name from Flat_Owner__c where OwnerId =: ownerId ];
        system.debug(accs);
        return [
            SELECT Id, Name, Flat_Number__c,Image__c,Email__c,Phone_Number__c,
             OwnerId,Owner.name from Flat_Owner__c where OwnerId =: ownerId 
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Flat_Owner__c> getFlatMemberDetails() {
        return [
            SELECT Id, Name, Flat_Number__c,Image__c,Email__c,Phone_Number__c,
             OwnerId,Owner.name from Flat_Owner__c
        ];
    }

    @AuraEnabled
    public static List<List<sObject>> searchFlatMembers(string searchKey) {
        List<List<sObject>> searchList = [FIND :searchKey IN ALL FIELDS RETURNING Flat_Owner__c(Name,Flat_Number__c)];
        return searchList;
    }

    
    @AuraEnabled
    public static List<Flat_Owner__c> searchFilterFlatMembers(string searchKey) {

        String key = '%' + searchKey + '%';
        return [
            select Id, Name, Flat_Number__c,Image__c,Email__c,Phone_Number__c,
             OwnerId,Owner.name from Flat_Owner__c
            WHERE Name LIKE :key
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Flat_Owner__c> flatRental() {
        return [
            select id,name,Flat_Number__c,Phone_Number__c,For_Rent__c  from flat_owner__c  where For_Rent__c = true
        ];
    }
}