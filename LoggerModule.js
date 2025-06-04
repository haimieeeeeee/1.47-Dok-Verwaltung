/***************************************************
 * LoggerModule - Enhanced Logging
 * Zentralisierte Protokollierung mit Zeitstempel und Level-Unterstützung.
 ***************************************************/
const LoggerModule = (() => {
  // Basiskomponente: Protokolliert eine Nachricht mit Zeitstempel und Logging-Level.
  const log = (level, message) => {
    const timestamp = new Date().toISOString();
    // Logger.log ist die Apps Script Methode zum Loggen.
    Logger.log(`[${timestamp}] [${level}] ${message}`);
  };

  // Protokolliert Fehler. Falls ein Error-Objekt übergeben wird, wird dessen message genutzt.
  const logError = (error) => {
    const errorMessage = error instanceof Error ? error.message : error.toString();
    log("ERROR", errorMessage);
  };

  // Protokolliert Informationsmeldungen.
  const logInfo = (message) => {
    log("INFO", message);
  };

  // Protokolliert Debug-Meldungen.
  const logDebug = (message) => {
    log("DEBUG", message);
  };

  return {
    logError,
    logInfo,
    logDebug
  };
})();
