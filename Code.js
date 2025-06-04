/***************************************************
 * Code.gs
 * Google Apps Script Entry Point (Optimized, with includes)
 ***************************************************/

function doGet(e) {
  // Lädt die Haupt-HTML-Datei namens 'Client' und setzt den Titel
  return HtmlService.createTemplateFromFile('Client')
    .evaluate()
    .setTitle('Dok-Verwaltung (Optimized)');
}

/**
 * Bietet eine Hilfsfunktion, um andere HTML-Dateien (z. B. UIModule.html)
 * in Client.html per <?!= include('Dateiname') ?> einzubinden.
 */
function include(filename) {
  // Mit createHtmlOutputFromFile wird der Inhalt als HTML geliefert.
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/* --- Optimierte Wrapper-Funktionen --- */
// Generische Wrapper-Funktion (inlined für bessere Kompatibilität)
function createWrappers(module, functionNames) {
  const wrappers = {};
  functionNames.forEach(funcName => {
    const wrapperName = funcName + 'Wrapper';
    wrappers[wrapperName] = function(...args) {
      try {
        return module[funcName](...args);
      } catch(e) {
        LoggerModule.logError(e);
        throw e;
      }
    };
  });
  return wrappers;
}

/* --- DOM Performance Utilities --- */
// DOMUtils direkt integriert für bessere Kompatibilität
const DOMUtils = (() => {
  const updateTableEfficiently = (tableId, rows, headers = null) => {
    const table = document.getElementById(tableId);
    if (!table) return;

    const fragment = document.createDocumentFragment();
    
    if (headers) {
      const thead = table.querySelector('thead') || table.createTHead();
      thead.innerHTML = '';
      const headerRow = thead.insertRow();
      headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });
    }

    const tbody = table.querySelector('tbody');
    if (tbody) {
      tbody.innerHTML = '';
      
      rows.forEach(rowData => {
        const tr = document.createElement('tr');
        if (rowData.className) tr.className = rowData.className;
        tr.innerHTML = rowData.innerHTML;
        fragment.appendChild(tr);
      });
      
      tbody.appendChild(fragment);
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const createVirtualizedList = (containerId, items, renderItem, itemHeight = 50) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const viewportHeight = container.offsetHeight;
    const visibleCount = Math.ceil(viewportHeight / itemHeight) + 2;
    let scrollTop = 0;

    const updateView = () => {
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(startIndex + visibleCount, items.length);
      
      container.innerHTML = '';
      const fragment = document.createDocumentFragment();

      if (startIndex > 0) {
        const topSpacer = document.createElement('div');
        topSpacer.style.height = `${startIndex * itemHeight}px`;
        fragment.appendChild(topSpacer);
      }

      for (let i = startIndex; i < endIndex; i++) {
        const itemElement = renderItem(items[i], i);
        itemElement.style.height = `${itemHeight}px`;
        fragment.appendChild(itemElement);
      }

      const remainingItems = items.length - endIndex;
      if (remainingItems > 0) {
        const bottomSpacer = document.createElement('div');
        bottomSpacer.style.height = `${remainingItems * itemHeight}px`;
        fragment.appendChild(bottomSpacer);
      }

      container.appendChild(fragment);
    };

    const debouncedUpdate = debounce(() => {
      scrollTop = container.scrollTop;
      updateView();
    }, 16);

    container.addEventListener('scroll', debouncedUpdate);
    updateView();
  };

  const batchClassUpdates = (updates) => {
    updates.forEach(({ elementId, addClass, removeClass }) => {
      const element = document.getElementById(elementId);
      if (!element) return;
      
      if (removeClass) {
        removeClass.forEach(cls => element.classList.remove(cls));
      }
      if (addClass) {
        addClass.forEach(cls => element.classList.add(cls));
      }
    });
  };

  return {
    updateTableEfficiently,
    debounce,
    createVirtualizedList,
    batchClassUpdates
  };
})();

// Automatische Generierung der SheetsModule Wrapper
const sheetsWrappers = createWrappers(SheetsModule, [
  'setupSheetsAndDemoData',
  'loadFullDataset', 
  'handleImportRohdaten',
  'addDocumentToChecklist',
  'updateDocumentInfo',
  'setErrComment',
  'setDocNotes',
  'toggleHiddenFlag',
  'checkChecklistCompleteness',
  'updateChecklistStatus',
  'applyLocalChanges'
]);

// ExportModule Wrapper
const exportWrappers = createWrappers(ExportModule, [
  'exportChecklistAsPdf'
]);

// DriveModule Wrapper  
const driveWrappers = createWrappers(DriveModule, [
  'uploadPdfToDrive'
]);

// Explizite globale Funktionen für Google Apps Script
// SheetsModule Wrappers
function setupSheetsAndDemoDataWrapper() { return sheetsWrappers.setupSheetsAndDemoDataWrapper.apply(this, arguments); }
function loadFullDatasetWrapper() { return sheetsWrappers.loadFullDatasetWrapper.apply(this, arguments); }
function handleImportRohdatenWrapper() { return sheetsWrappers.handleImportRohdatenWrapper.apply(this, arguments); }
function addDocumentToChecklistWrapper() { return sheetsWrappers.addDocumentToChecklistWrapper.apply(this, arguments); }
function updateDocumentInfoWrapper() { return sheetsWrappers.updateDocumentInfoWrapper.apply(this, arguments); }
function setErrCommentWrapper() { return sheetsWrappers.setErrCommentWrapper.apply(this, arguments); }
function setDocNotesWrapper() { return sheetsWrappers.setDocNotesWrapper.apply(this, arguments); }
function toggleHiddenFlagWrapper() { return sheetsWrappers.toggleHiddenFlagWrapper.apply(this, arguments); }
function checkChecklistCompletenessWrapper() { return sheetsWrappers.checkChecklistCompletenessWrapper.apply(this, arguments); }
function updateChecklistStatusWrapper() { return sheetsWrappers.updateChecklistStatusWrapper.apply(this, arguments); }
function applyLocalChangesWrapper() { return sheetsWrappers.applyLocalChangesWrapper.apply(this, arguments); }

// ExportModule Wrappers
function exportChecklistAsPdfWrapper() { return exportWrappers.exportChecklistAsPdfWrapper.apply(this, arguments); }

// DriveModule Wrappers
function uploadPdfToDriveWrapper() { return driveWrappers.uploadPdfToDriveWrapper.apply(this, arguments); }
