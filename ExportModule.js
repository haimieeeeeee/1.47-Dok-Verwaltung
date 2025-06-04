/**
 * ExportModule.js - Modul für den PDF-Export der Checkliste (angepasst)
 *
 * Neuerungen:
 *  - Kleinerer Schriftgrad (10pt)
 *  - Checklisten-Stil mit Kästchen "☐" vor jedem Dokument
 *  - Keine globale Überschrift, keine Filteranzeige
 *  - Gruppierung nach Code (sortiert), Überschrift = sektion
 *  - Reihenfolge wie in der Checklisten-Ansicht, kein Status "(fehlt)" usw.
 */
const ExportModule = (() => {
  const exportChecklistAsPdf = (checkId, filterFehlt, filterFehlerhaft, filterIo, filterHidden) => {
    try {
      // Gesamtdaten laden
      const all = SheetsModule.loadFullDataset();
      // Nur Dokumente dieser Checkliste
      const docs = all.docs.filter(d => d.checkId === checkId);

      // Funktion zur Statusbestimmung (für Filterung)
      const docStatus = d => {
        if (!d.okFileId && !d.errFileId) return "fehlt";
        if (d.okFileId) return "io";
        return "fehlerhaft";
      };

      // Ermitteln, welche Status gefiltert werden
      const filters = [];
      if (filterFehlt) filters.push("fehlt");
      if (filterFehlerhaft) filters.push("fehlerhaft");
      if (filterIo) filters.push("io");
      const useAll = (filters.length === 0);

      // Dokumente filtern
      const filtered = [];
      docs.forEach(d => {
        const st = docStatus(d);
        if (d.hiddenFlag) {
          if (filterHidden) filtered.push(d);
        } else {
          if (useAll || filters.indexOf(st) > -1) {
            filtered.push(d);
          }
        }
      });

      // Gruppierung nach d.code
      const grouped = {};
      filtered.forEach(d => {
        if (!grouped[d.code]) {
          grouped[d.code] = {
            code: d.code,
            sektion: d.sektion,
            docs: []
          };
        }
        grouped[d.code].docs.push(d);
      });

      // Codes sortieren (alphabetisch)
      const codes = Object.keys(grouped).sort();

      // HTML für das PDF erzeugen
      const htmlParts = [];
      htmlParts.push("<html><head><style>");
      // Schriftgröße, Zeilenhöhe, Checklisten-Optik
      htmlParts.push("body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.2; margin: 10px; }");
      htmlParts.push(".checkSection { margin-top: 12px; }");
      htmlParts.push(".checkSection h4 { font-size: 11pt; margin-bottom: 4px; }");
      htmlParts.push(".checkItem { margin-left: 20px; }");
      // Kästchen "☐" vor jedem Dokument
      htmlParts.push(".checkItem::before { content: '☐ '; color: #333; }");
      htmlParts.push("</style></head><body>");

      codes.forEach(code => {
        const group = grouped[code];
        // Überschrift = sektion
        const heading = group.sektion || "Unbekannt";
        htmlParts.push("<div class='checkSection'>");
        htmlParts.push("<h4>" + heading + "</h4>");

        // Jedes Dokument als eigener Absatz mit Kästchen
        group.docs.forEach(dd => {
          let line = dd.docText || "";
          if (dd.errComment) line += " [Fehlerkommentar: " + dd.errComment + "]";
          if (dd.notes) line += " [Notiz: " + dd.notes + "]";
          htmlParts.push("<div class='checkItem'>" + line + "</div>");
        });

        htmlParts.push("</div>");
      });

      htmlParts.push("</body></html>");
      const fullHtml = htmlParts.join("\n");

      // PDF erzeugen
      const blob = HtmlService.createHtmlOutput(fullHtml).getAs(MimeType.PDF);
      blob.setName("Checkliste_" + checkId + ".pdf");

      // Datei im Root-Folder erstellen
      const file = DriveApp.getRootFolder().createFile(blob);
      return {
        success: true,
        fileId: file.getId(),
        url: "https://drive.google.com/file/d/" + file.getId() + "/view"
      };
    } catch (e) {
      LoggerModule.logError(e);
      throw e;
    }
  };

  return {
    exportChecklistAsPdf
  };
})();
