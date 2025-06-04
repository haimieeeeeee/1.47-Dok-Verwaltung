/**
 * ChecklistModule.js - Enhanced
 * Dieses Modul liest die Checkliste und den Kunden aus den entsprechenden Sheets.
 * Es behält den bisherigen Funktionsumfang bei, nutzt jedoch nun ErrorHandlingModule.handleError
 * zur zentralen Fehlerbehandlung.
 */
const ChecklistModule = (() => {
  
  function findChecklistById(checkId) {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sh = ss.getSheetByName("Checklisten");
      if (!sh) throw new Error("Checklisten-Sheet nicht gefunden!");
      const data = sh.getDataRange().getValues();
      const hdr = data[0];
      const idxCheckId = hdr.indexOf("CheckID");
      const idxKundeId = hdr.indexOf("KundeID");
      const idxBankName = hdr.indexOf("BankName");
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idxCheckId]) === String(checkId)) {
          return {
            checkId: data[i][idxCheckId],
            kundeId: data[i][idxKundeId],
            bankName: data[i][idxBankName]
          };
        }
      }
      throw new Error("Checkliste " + checkId + " nicht gefunden!");
    } catch (e) {
      ErrorHandlingModule.handleError(e, "findChecklistById");
    }
  }
  
  function findKundeById(kundeId) {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sh = ss.getSheetByName("Kunden");
      if (!sh) throw new Error("Kunden-Sheet nicht gefunden!");
      const data = sh.getDataRange().getValues();
      const hdr = data[0];
      const idxKundeId = hdr.indexOf("KundeID");
      const idxKName = hdr.indexOf("KName");
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idxKundeId]) === String(kundeId)) {
          return {
            kundeId: data[i][idxKundeId],
            kname: data[i][idxKName]
          };
        }
      }
      throw new Error("Kunde " + kundeId + " nicht gefunden!");
    } catch (e) {
      ErrorHandlingModule.handleError(e, "findKundeById");
    }
  }
  
  return {
    findChecklistById,
    findKundeById
  };
})();
