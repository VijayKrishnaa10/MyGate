public with sharing class fileimagePreview {
    @AuraEnabled(cacheable=true)
    public static Map<ID, String> getRelatedFilesByRecordId(String recordId) {
        // Get record file IDs        
        List<ContentDocumentLink> files = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId];
        List<ID> fileIDs = new List<ID>();
        for (ContentDocumentLink docLink : files) {
            fileIDs.add(docLink.ContentDocumentId);
        }
 
        List<ContentVersion> docs = [SELECT ContentDocumentId, FileExtension, Title 
            FROM ContentVersion WHERE ContentDocumentId IN : fileIDs];
        Map<ID, String> mapIdTitle = new Map<ID, String>();
        for (ContentVersion docLink : docs) {
            mapIdTitle.put(docLink.ContentDocumentId, docLink.Title);
        }
        return mapIdTitle;
    }

    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getImageFilesByRecordId(String recordId) {
        List<ContentDocumentLink> imageId = [SELECT Id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId  = :recordId];
        List<ID> fileIDs = new List<ID>();
        for (ContentDocumentLink docLink : imageId) {
            fileIDs.add(docLink.ContentDocumentId);
        }
        List<ContentVersion> docs = [SELECT id FROM ContentVersion WHERE ContentDocumentId IN : fileIDs];
        return docs;
    }
}