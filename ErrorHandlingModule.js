/**
 * ErrorHandlingModule.js - Enhanced
 * Dieses Modul bietet eine zentrale Fehlerbehandlung:
 * - Es protokolliert Fehler mithilfe von LoggerModule.
 * - Zeigt benutzerfreundliche Nachrichten über UIModule.showToast an (falls vorhanden).
 * - Wirft den Fehler erneut, um die weitere Ausführung zu unterbrechen.
 */
const ErrorHandlingModule = (() => {
  /**
   * handleError: Loggt einen Fehler, zeigt eine Fehlermeldung an und wirft den Fehler erneut.
   * @param {Error|string} error - Der aufgetretene Fehler.
   * @param {string} context - Kontextinformationen, wo der Fehler aufgetreten ist.
   */
  const handleError = (error, context) => {
    const errorMessage = error instanceof Error ? error.message : error.toString();
    const contextInfo = context ? ` [Context: ${context}]` : "";
    LoggerModule.logError(errorMessage + contextInfo);
    
    // Zeige eine benutzerfreundliche Fehlermeldung an (Toast, falls vorhanden)
    if (typeof UIModule.showToast === "function") {
      UIModule.showToast("Error: " + errorMessage, "Fehler", 5);
    } else {
      // Fallback: Einfache alert()-Meldung
      alert("Error: " + errorMessage);
    }
    
    // Fehler erneut werfen, damit er ggf. in weiteren Try/Catch-Blöcken behandelt werden kann
    throw error;
  };

  return { handleError };
})();
