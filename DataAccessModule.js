/**
 * DataAccessModule.js - Enhanced Modular Version
 * Kapselt alle Lese- und Schreiboperationen in den Google Sheets,
 * mit integrierter Fehlerbehandlung und Logging.
 */
const DataAccessModule = (() => {
  // Gibt das aktive Spreadsheet zurück.
  const getActiveSpreadsheet = () => {
    try {
      return SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {
      ErrorHandlingModule.handleError(e, "getActiveSpreadsheet");
    }
  };

  // Liefert ein Sheet anhand des Namens, oder wirft einen Fehler.
  const getSheetByName = (sheetName) => {
    try {
      const ss = getActiveSpreadsheet();
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) throw new Error(`Sheet '${sheetName}' nicht gefunden!`);
      return sheet;
    } catch (e) {
      ErrorHandlingModule.handleError(e, "getSheetByName");
    }
  };

  // Liest den gesamten Datenbereich eines Sheets.
  const getSheetData = (sheetName) => {
    try {
      const sheet = getSheetByName(sheetName);
      return sheet.getDataRange().getValues();
    } catch (e) {
      ErrorHandlingModule.handleError(e, "getSheetData");
    }
  };

  // Aktualisiert die Daten eines Sheets ab Zelle A1.
  const updateSheetData = (sheetName, data) => {
    try {
      const sheet = getSheetByName(sheetName);
      sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
    } catch (e) {
      ErrorHandlingModule.handleError(e, "updateSheetData");
    }
  };

  // Fügt eine Zeile am Ende eines Sheets an.
  const appendRowToSheet = (sheetName, row) => {
    try {
      const sheet = getSheetByName(sheetName);
      sheet.appendRow(row);
    } catch (e) {
      ErrorHandlingModule.handleError(e, "appendRowToSheet");
    }
  };

  return {
    getSheetByName,
    getSheetData,
    updateSheetData,
    appendRowToSheet
  };
})();
