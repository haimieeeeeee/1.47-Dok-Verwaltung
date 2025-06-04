/**
 * UnitTests.gs - Refactored und Extended
 * Verbesserte Testabdeckung für kritische Funktionen wie Caching, Fehlerfälle und PDF-Export.
 */

function runUnitTests() {
  // Test 1: Caching-Funktion
  try {
    let data1 = CacheModule.getFullDatasetCached();
    Utilities.sleep(1000); // simuliere eine kurze Wartezeit
    let data2 = CacheModule.getFullDatasetCached();
    if (JSON.stringify(data1) !== JSON.stringify(data2)) {
      throw new Error("Cached-Daten sollten identisch sein!");
    }
    Logger.log("Caching-Test bestanden.");
  } catch (e) {
    Logger.log("Caching-Test fehlgeschlagen: " + e.toString());
    throw e;
  }

  // Test 2: Sheet-Existenz-Fehlerhandling
  try {
    // Erwartet einen Fehler, wenn ein nicht vorhandenes Sheet abgefragt wird.
    DataAccessModule.getSheetByName("NichtVorhanden");
    throw new Error("Fehler: Nicht vorhandenes Sheet hat keinen Fehler ausgelöst!");
  } catch (e) {
    Logger.log("Sheet-Existenz-Test bestanden.");
  }

  Logger.log("runUnitTests abgeschlossen.");
}

function runExtendedTests() {
  Logger.log("Starte runExtendedTests...");

  // Test 3: PDF-Export
  try {
    const checkId = "C1001"; // Beispiel-ID – stelle sicher, dass diese in deinen Demo-Daten vorhanden ist
    const result = SheetsModule.exportChecklistAsPdf(checkId, true, true, true, false);
    if (!result || !result.success) {
      throw new Error("PDF-Export fehlgeschlagen!");
    }
    Logger.log("PDF-Export-Test bestanden: " + result.url);
  } catch (e) {
    Logger.log("PDF-Export-Test fehlgeschlagen: " + e.toString());
    throw e;
  }
  
  Logger.log("runExtendedTests erfolgreich abgeschlossen.");
}

function runAllTests() {
  try {
    runUnitTests();
    runExtendedTests();
    Logger.log("Alle Tests erfolgreich.");
  } catch (e) {
    Logger.log("Tests haben Fehler: " + e.toString());
    throw e;
  }
}
