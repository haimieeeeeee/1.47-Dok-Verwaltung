/***************************************************
 * SheetsModule - Enhanced Modular Version (v1.22 Enhanced)
 * Alle sheetbezogenen Funktionen inkl. Fehlerbehandlung
 * und klarer Trennung der Verantwortlichkeiten.
 ***************************************************/
const SheetsModule = (() => {

  // Hilfsfunktion: Liefert das aktive Spreadsheet.
  const getActiveSpreadsheet = () => {
    return SpreadsheetApp.getActiveSpreadsheet();
  };

  // Hilfsfunktion: Liest den gesamten Datenbereich eines Sheets.
  const readSheetData = (sheetName) => {
    const ss = getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Sheet '${sheetName}' nicht gefunden!`);
    }
    return sheet.getDataRange().getValues();
  };

  // Kunden aus dem "Kunden"-Sheet laden.
  const loadCustomers = () => {
    const data = readSheetData("Kunden");
    let customers = [];
    for (let i = 1; i < data.length; i++) {
      if (!data[i][0]) continue;
      customers.push({
        kundeId: data[i][0],
        kname: data[i][1] || ""
      });
    }
    return customers;
  };

  // Checklisten aus dem "Checklisten"-Sheet laden.
  const loadChecklists = () => {
    const data = readSheetData("Checklisten");
    let checklists = [];
    for (let i = 1; i < data.length; i++) {
      if (!data[i][0]) continue;
      checklists.push({
        checkId: data[i][0],
        kundeId: data[i][1],
        bankName: data[i][2],
        status: data[i][3]
      });
    }
    return checklists;
  };

  // Dokumente aus dem "Unterlagen"-Sheet laden.
  const loadDocs = () => {
    const data = readSheetData("Unterlagen");
    const header = data[0];
    const idxDocID = header.indexOf("DocID");
    const idxCheck = header.indexOf("CheckID");
    const idxCode = header.indexOf("Code");
    const idxSect = header.indexOf("Sektion");
    const idxBesch = header.indexOf("Beschreibung");
    const idxOk = header.indexOf("OkFileId");
    const idxErr = header.indexOf("ErrFileId");
    const idxHid = header.indexOf("HiddenFlag");
    const idxComm = header.indexOf("ErrComment");
    const idxRun = header.indexOf("DocRunningNo");
    const idxNotes = header.indexOf("Notes");
    let docs = [];
    for (let i = 1; i < data.length; i++) {
      let row = data[i];
      if (!row[idxDocID]) continue;
      docs.push({
        docId: row[idxDocID],
        checkId: row[idxCheck],
        code: row[idxCode],
        sektion: row[idxSect],
        docText: row[idxBesch] || "",
        okFileId: row[idxOk] || "",
        errFileId: row[idxErr] || "",
        hiddenFlag: (row[idxHid] || "").toString().toLowerCase() === "true",
        errComment: row[idxComm] || "",
        docRunNo: row[idxRun] || "",
        notes: row[idxNotes] || ""
      });
    }
    return docs;
  };

  // Lädt das vollständige Datenset (Kunden, Checklisten, Dokumente).
  const loadFullDataset = () => {
    try {
      return {
        customers: loadCustomers(),
        checklists: loadChecklists(),
        docs: loadDocs()
      };
    } catch (e) {
      LoggerModule.logError(e);
      throw e;
    }
  };

  // Erstellt bzw. findet alle nötigen Sheets und Demo-Daten.
  const setupSheetsAndDemoData = () => {
    try {
      const ss = getActiveSpreadsheet();
      let shK = ss.getSheetByName("Kunden");
      if (!shK) {
        shK = ss.insertSheet("Kunden");
        shK.appendRow(["KundeID", "KName"]);
      }
      let shC = ss.getSheetByName("Checklisten");
      if (!shC) {
        shC = ss.insertSheet("Checklisten");
        shC.appendRow(["CheckID", "KundeID", "BankName", "Status"]);
      }
      let shU = ss.getSheetByName("Unterlagen");
      if (!shU) {
        shU = ss.insertSheet("Unterlagen");
        shU.appendRow([
          "DocID", "CheckID", "Code", "Sektion", "Beschreibung",
          "OkFileId", "ErrFileId", "HiddenFlag", "ErrComment", "DocRunningNo", "Notes"
        ]);
      } else {
        const hdr = shU.getRange(1, 1, 1, shU.getLastColumn()).getValues()[0];
        ["OkFileId", "ErrFileId", "HiddenFlag", "ErrComment", "DocRunningNo", "Notes"].forEach(cName => {
          if (hdr.indexOf(cName) === -1) {
            shU.getRange(1, hdr.length + 1).setValue(cName);
            hdr.push(cName);
          }
        });
      }
      if (shK.getLastRow() < 2) {
        shK.appendRow(["K1001", "Max Mustermann"]);
        shC.appendRow(["C1001", "K1001", "Demo-Bank", "unvollständig"]);
        shU.appendRow(["D1001_1", "C1001", "01_01", "Persönliche Unterlagen (Demo)", "Personalausweis", "", "", "", "", "", ""]);
      }
      return "Tabellenblätter angelegt/gefunden (v1.22 Enhanced).";
    } catch (e) {
      LoggerModule.logError(e);
      throw e;
    }
  };

  // Importiert Rohdaten und fügt sie per Bulk-Insert in das "Unterlagen"-Sheet ein.
  const handleImportRohdaten = (parsedData) => {
    try {
      const ss = getActiveSpreadsheet();
      const shK = ss.getSheetByName("Kunden");
      const shC = ss.getSheetByName("Checklisten");
      const shU = ss.getSheetByName("Unterlagen");
      if (!shK || !shC || !shU) return "Fehlende Tabellen!";
      const kundeId = "K" + new Date().getTime();
      let kName = parsedData.person1 || "Unbekannt";
      if (parsedData.person2) {
        kName += ", " + parsedData.person2;
      }
      shK.appendRow([kundeId, kName]);
      const checkId = "C" + new Date().getTime();
      const bank = parsedData.bankName || "Unbekannte Bank";
      shC.appendRow([checkId, kundeId, bank, "unvollständig"]);
      const lastRow = shU.getLastRow();
      let docCounter = 1;
      const rowsToInsert = [];
      parsedData.documents.forEach(doc => {
        const docId = "D" + checkId + "_" + (docCounter++);
        rowsToInsert.push([
          docId,
          checkId,
          doc.code,
          doc.section,
          doc.text,
          "", "", "", "",
          doc.code + "_" + (docCounter),
          ""
        ]);
      });
      if (rowsToInsert.length > 0) {
        shU.getRange(lastRow + 1, 1, rowsToInsert.length, rowsToInsert[0].length)
           .setValues(rowsToInsert);
      }
      return "Import OK (v1.22 Enhanced)! Neuer Kunde: " + kName + ", Bank: " + bank;
    } catch (e) {
      LoggerModule.logError(e);
      throw e;
    }
  };

  // Fügt ein neues Dokument in die Checkliste ein.
  const addDocumentToChecklist = (checkId, code, sektion, docText) => {
    try {
      const ss = getActiveSpreadsheet();
      const sh = ss.getSheetByName("Unterlagen");
      if (!sh) throw new Error("No 'Unterlagen' sheet!");
      const runNo = determineNextDocRunNo(checkId, code);
      const newDocId = "D" + checkId + "_" + new Date().getTime();
      sh.appendRow([newDocId, checkId, code, sektion, docText, "", "", "", "", runNo, ""]);
      return "Neue Unterlage '" + docText + "' unter Code " + code + " angelegt.";
    } catch (e) {
      LoggerModule.logError(e);
      throw e;
    }
  };

  // Bestimmt die nächste Dokument-Laufnummer.
  const determineNextDocRunNo = (checkId, code) => {
    try {
      const ss = getActiveSpreadsheet();
      const sh = ss.getSheetByName("Unterlagen");
      const data = sh.getDataRange().getValues();
      const hdr = data[0];
      const idxC = hdr.indexOf("CheckID");
      const idxCd = hdr.indexOf("Code");
      let count = 0;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idxC]) === String(checkId) && String(data[i][idxCd]) === String(code)) {
          count++;
        }
      }
      return code + "_" + (count + 1);
    } catch (e) {
      LoggerModule.logError(e);
      throw e;
    }
  };

  // Aktualisiert die Sektion eines Dokuments.
  const updateDocumentInfo = (docId, newSection, oldSect) => {
    try {
      const ss = getActiveSpreadsheet();
      const sh = ss.getSheetByName("Unterlagen");
      if (!sh) throw new Error("No 'Unterlagen' sheet!");
      const data = sh.getDataRange().getValues();
      const hdr = data[0];
      const idxDocID = hdr.indexOf("DocID");
      const idxSect = hdr.indexOf("Sektion");
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idxDocID]) === String(docId)) {
          sh.getRange(i + 1, idxSect + 1).setValue(newSection);
          return "Dokument " + docId + " verschoben! Neue Sektion: " + newSection;
        }
      }
      return "Dokument nicht gefunden!";
    } catch (e) {
      LoggerModule.logError(e);
      throw e;
    }
  };

  // Setzt einen Fehlerkommentar für ein Dokument.
  const setErrComment = (docId, comment) => {
    try {
      const ss = getActiveSpreadsheet();
      const sh = ss.getSheetByName("Unterlagen");
      if (!sh) throw new Error("No 'Unterlagen' sheet!");
      const data = sh.getDataRange().getValues();
      const hdr = data[0];
      const idxDocID = hdr.indexOf("DocID");
      const idxComm = hdr.indexOf("ErrComment");
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idxDocID]) === String(docId)) {
          sh.getRange(i + 1, idxComm + 1).setValue(comment || "");
          return "Kommentar gesetzt";
        }
      }
      return "Dokument nicht gefunden!";
    } catch (e) {
      LoggerModule.logError(e);
      throw e;
    }
  };

  // Setzt Notizen zu einem Dokument.
  const setDocNotes = (docId, notes) => {
    try {
      const ss = getActiveSpreadsheet();
      const sh = ss.getSheetByName("Unterlagen");
      if (!sh) throw new Error("No 'Unterlagen' sheet!");
      const data = sh.getDataRange().getValues();
      const hdr = data[0];
      const idxDocID = hdr.indexOf("DocID");
      const idxNotes = hdr.indexOf("Notes");
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idxDocID]) === String(docId)) {
          sh.getRange(i + 1, idxNotes + 1).setValue(notes || "");
          return "Notiz gesetzt";
        }
      }
      return "Dokument nicht gefunden!";
    } catch (e) {
      LoggerModule.logError(e);
      throw e;
    }
  };

  // Schaltet das Hidden-Flag eines Dokuments um.
  const toggleHiddenFlag = (docId, newVal) => {
    try {
      const ss = getActiveSpreadsheet();
      const sh = ss.getSheetByName("Unterlagen");
      if (!sh) throw new Error("No 'Unterlagen' sheet!");
      const data = sh.getDataRange().getValues();
      const hdr = data[0];
      const idxDocID = hdr.indexOf("DocID");
      const idxHid = hdr.indexOf("HiddenFlag");
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idxDocID]) === String(docId)) {
          sh.getRange(i + 1, idxHid + 1).setValue(newVal ? "TRUE" : "");
          return "Ok => Hidden=" + newVal;
        }
      }
      return "Dokument nicht gefunden!";
    } catch (e) {
      LoggerModule.logError(e);
      throw e;
    }
  };

  // Prüft, ob eine Checkliste vollständig ist.
  const checkChecklistCompleteness = (checkId) => {
    try {
      const all = loadFullDataset();
      const docs = all.docs.filter(d => d.checkId === checkId && !d.hiddenFlag);
      for (let d of docs) {
        if (!d.okFileId && !d.errFileId) return "unvollständig";
        if (d.errFileId) return "unvollständig";
      }
      return "vollständig";
    } catch (e) {
      LoggerModule.logError(e);
      throw e;
    }
  };

  // Aktualisiert den Status einer Checkliste.
  const updateChecklistStatus = (checkId, newStatus) => {
    try {
      const ss = getActiveSpreadsheet();
      const shC = ss.getSheetByName("Checklisten");
      if (!shC) return;
      const data = shC.getDataRange().getValues();
      const hdr = data[0];
      const idxCheck = hdr.indexOf("CheckID");
      const idxStat = hdr.indexOf("Status");
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idxCheck]) === String(checkId)) {
          shC.getRange(i + 1, idxStat + 1).setValue(newStatus);
          return;
        }
      }
    } catch (e) {
      LoggerModule.logError(e);
      throw e;
    }
  };

  // Wendet lokale Änderungen an den Dokumenten an.
  const applyLocalChanges = (data) => {
    try {
      const ss = getActiveSpreadsheet();
      const sh = ss.getSheetByName("Unterlagen");
      if (!sh) throw new Error("No 'Unterlagen' sheet!");
      let sheetData = sh.getDataRange().getValues();
      const header = sheetData[0];
      const idxDocID = header.indexOf("DocID");
      const idxSect = header.indexOf("Sektion");
      const idxBesch = header.indexOf("Beschreibung");
      const idxComm = header.indexOf("ErrComment");
      const idxHid = header.indexOf("HiddenFlag");
      const idxNotes = header.indexOf("Notes");

      const rowMap = {};
      for (let i = 1; i < sheetData.length; i++) {
        rowMap[sheetData[i][idxDocID]] = i;
      }

      const messages = [];

      if (data.additions && data.additions.length) {
        data.additions.forEach(item => {
          const runNo = item.code + "_1";
          const newRow = [
            "D" + data.checkId + "_" + new Date().getTime(),
            data.checkId,
            item.code,
            item.sektion,
            item.docText,
            "", "", "", "",
            runNo,
            ""
          ];
          sheetData.push(newRow);
          messages.push("Add: " + newRow[4] + " unter Code " + item.code + " angelegt.");
        });
      }

      if (data.moves) {
        for (const docId in data.moves) {
          if (rowMap[docId] !== undefined) {
            const rowIndex = rowMap[docId];
            // Hier können bei Bedarf Sektion/Code aktualisiert werden.
          }
        }
      }

      if (data.hiddenFlags) {
        for (const docId in data.hiddenFlags) {
          if (rowMap[docId] !== undefined) {
            const rowIndex = rowMap[docId];
            sheetData[rowIndex][idxHid] = data.hiddenFlags[docId] ? "TRUE" : "";
            messages.push("Hidden: " + docId + " => " + data.hiddenFlags[docId]);
          }
        }
      }

      if (data.comments) {
        for (const docId in data.comments) {
          if (rowMap[docId] !== undefined) {
            const rowIndex = rowMap[docId];
            sheetData[rowIndex][idxComm] = data.comments[docId] || "";
            messages.push("Comment: " + docId + " => " + data.comments[docId]);
          }
        }
      }

      if (data.notes) {
        for (const docId in data.notes) {
          if (rowMap[docId] !== undefined) {
            const rowIndex = rowMap[docId];
            sheetData[rowIndex][idxNotes] = data.notes[docId] || "";
            messages.push("Note: " + docId + " => " + data.notes[docId]);
          }
        }
      }

      sh.getRange(1, 1, sheetData.length, header.length).setValues(sheetData);

      const completeness = checkChecklistCompleteness(data.checkId);
      updateChecklistStatus(data.checkId, completeness);
      messages.push("Status => " + completeness);

      return "Lokale Änderungen gespeichert (v1.22 Enhanced):\n" + messages.join("\n");
    } catch (e) {
      LoggerModule.logError(e);
      throw e;
    }
  };

  return {
    setupSheetsAndDemoData,
    loadFullDataset,
    handleImportRohdaten,
    addDocumentToChecklist,
    determineNextDocRunNo,
    updateDocumentInfo,
    setErrComment,
    setDocNotes,
    toggleHiddenFlag,
    checkChecklistCompleteness,
    updateChecklistStatus,
    applyLocalChanges
  };
})();
