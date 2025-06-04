/**
 * ConfigModule.js
 * Enthält zentrale Konfigurationen (Sheet- und Ordnernamen etc.).
 */
const ConfigModule = (() => {
  const SHEET_CUSTOMERS = "Kunden";
  const SHEET_CHECKLISTS = "Checklisten";
  const SHEET_UNDERLAGEN = "Unterlagen";
  
  const ROOT_FOLDER_NAME = "Kunden";
  const FOLDER_CHECKLIST = "Checkliste";
  const FOLDER_OK = "i.O.";
  const FOLDER_ERR = "fehlerhaft";
  
  return {
    SHEET_CUSTOMERS,
    SHEET_CHECKLISTS,
    SHEET_UNDERLAGEN,
    ROOT_FOLDER_NAME,
    FOLDER_CHECKLIST,
    FOLDER_OK,
    FOLDER_ERR
  };
})();
