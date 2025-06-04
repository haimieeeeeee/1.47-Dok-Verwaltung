/**
 * DriveModule.js - Improved Modular Version
 * Verbesserte Struktur, konsistente Fehlerbehandlung und Erweiterbarkeit.
 */
const DriveModule = (() => {
  // Hilfsfunktion: Sucht oder erstellt einen Ordner unter einem übergebenen Parent-Ordner.
  function getOrCreateFolder(parent, name) {
    try {
      const it = parent.getFoldersByName(name);
      if (it.hasNext()) return it.next();
      return parent.createFolder(name);
    } catch (e) {
      ErrorHandlingModule.handleError(e, "getOrCreateFolder");
    }
  }
  
  // Säubert einen Dateinamen, indem unerlaubte Zeichen ersetzt werden.
  function sanitizeFilename(str) {
    try {
      return str.replace(/[^\wäöüÄÖÜß .()\-,]/g, "_").trim();
    } catch (e) {
      ErrorHandlingModule.handleError(e, "sanitizeFilename");
    }
  }
  
  // Formatiert einen Kundennamen ins Format "Nachname, Vorname".
  function formatKundeName(name) {
    try {
      if (!name) return "Unbekannt";
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        const vorname = parts.slice(0, parts.length - 1).join(" ");
        const nachname = parts[parts.length - 1];
        return nachname + ", " + vorname;
      }
      return name;
    } catch (e) {
      ErrorHandlingModule.handleError(e, "formatKundeName");
    }
  }
  
  // Verschiebt eine Datei in den Zielordner, indem sie aus allen anderen Eltern entfernt wird.
  function moveFileToFolder(file, destinationFolder) {
    try {
      destinationFolder.addFile(file);
      const parents = file.getParents();
      while (parents.hasNext()) {
        const parent = parents.next();
        if (parent.getId() !== destinationFolder.getId()) {
          parent.removeFile(file);
        }
      }
    } catch (e) {
      ErrorHandlingModule.handleError(e, "moveFileToFolder");
    }
  }
  
  // Lädt eine PDF-Datei in den richtigen Ordner basierend auf Kunden- und Statusinformationen.
  function uploadPdfToDrive(checkId, docId, status, base64Data) {
    try {
      const contentType = "application/pdf";
      const decoded = Utilities.base64Decode(base64Data);
      const blob = Utilities.newBlob(decoded, contentType);
      
      // Zugriff auf das "Unterlagen"-Sheet.
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sh = ss.getSheetByName("Unterlagen");
      if (!sh) throw new Error("No 'Unterlagen' sheet!");
      
      const data = sh.getDataRange().getValues();
      const hdr = data[0];
      const idxDocID = hdr.indexOf("DocID");
      const idxCode = hdr.indexOf("Code");
      const idxBesch = hdr.indexOf("Beschreibung");
      const idxRunNo = hdr.indexOf("DocRunningNo");
      const idxOk = hdr.indexOf("OkFileId");
      const idxErr = hdr.indexOf("ErrFileId");
      const idxComm = hdr.indexOf("ErrComment");
      
      // Finde die Zeile für das zugehörige Dokument.
      let rowIndex = -1;
      let docObj = null;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idxDocID]) === String(docId)) {
          rowIndex = i;
          docObj = {
            code: data[i][idxCode],
            besch: data[i][idxBesch],
            docRunNo: data[i][idxRunNo] || ""
          };
          break;
        }
      }
      if (rowIndex < 0) throw new Error("Dokument " + docId + " nicht gefunden!");
      
      // Bestimme Dateinamen anhand der Dokumenteninformationen.
      const runNo = docObj.docRunNo || (docObj.code + "_1");
      const fileName = runNo + " " + sanitizeFilename(docObj.besch || "") + ".pdf";
      blob.setName(fileName);
      
      // Hole Checkliste und Kundendaten über ChecklistModule.
      const checklist = ChecklistModule.findChecklistById(checkId);
      if (!checklist) throw new Error("Checkliste nicht gefunden!");
      const kunde = ChecklistModule.findKundeById(checklist.kundeId);
      const kundeName = kunde ? formatKundeName(kunde.kname) : "Unbekannt";
      
      // Erzeuge die Ordnerstruktur: Kunden -> "Nachname, Vorname" -> MHB -> ("i.O." oder "fehlerhaft")
      const root = DriveApp.getRootFolder();
      const folderKunden = getOrCreateFolder(root, "Kunden");
      const folderKunde = getOrCreateFolder(folderKunden, kundeName);
      const folderMHB = getOrCreateFolder(folderKunde, "MHB");
      const subFolderName = (status === "ok") ? "i.O." : "fehlerhaft";
      const folderStatus = getOrCreateFolder(folderMHB, subFolderName);
      
      // Erzeuge die neue Datei im Zielordner.
      const newFile = folderStatus.createFile(blob);
      const fileId = newFile.getId();
      
      // Alte Datei verschieben, falls vorhanden.
      if (status === "ok") {
        const currentOkFileId = sh.getRange(rowIndex + 1, idxOk + 1).getValue();
        if (currentOkFileId && currentOkFileId.toString().trim() !== "") {
          try {
            const oldFile = DriveApp.getFileById(currentOkFileId);
            moveFileToFolder(oldFile, folderStatus);
          } catch(e) { /* Fehler ignorieren */ }
        }
        sh.getRange(rowIndex + 1, idxOk + 1).setValue(fileId);
        sh.getRange(rowIndex + 1, idxErr + 1).setValue("");
        sh.getRange(rowIndex + 1, idxComm + 1).setValue("");
      } else {
        const currentErrFileId = sh.getRange(rowIndex + 1, idxErr + 1).getValue();
        if (currentErrFileId && currentErrFileId.toString().trim() !== "") {
          try {
            const oldFile = DriveApp.getFileById(currentErrFileId);
            moveFileToFolder(oldFile, folderStatus);
          } catch(e) { /* Fehler ignorieren */ }
        }
        sh.getRange(rowIndex + 1, idxErr + 1).setValue(fileId);
      }
      
      const fileUrl = "https://drive.google.com/file/d/" + fileId + "/view";
      LoggerModule.logInfo("PDF erfolgreich hochgeladen: " + fileUrl);
      return { success: true, fileId: fileId, url: fileUrl };
    } catch (e) {
      ErrorHandlingModule.handleError(e, "uploadPdfToDrive");
    }
  }
  
  return {
    getOrCreateFolder,
    sanitizeFilename,
    formatKundeName,
    moveFileToFolder,
    uploadPdfToDrive
  };
})();
