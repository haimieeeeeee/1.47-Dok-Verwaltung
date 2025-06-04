# 📋 Dok-Verwaltung v1.47 - CRM System

## 🏢 Überblick
Umfassendes Dokumentenmanagement-System für Bankdarlehen mit Google Apps Script als Backend, Google Sheets als Datenbank und Google Drive für Dateispeicherung. Erweitert zu einem vollständigen CRM-System.

## 🌟 Neue Features (v1.47)
- **🔬 Lokale Test-Umgebung**: Innovative Browser-basierte Diagnose-Umgebung für KI-gestützte Entwicklung
- **📊 Real-time EventBus Monitoring**: Live-Überwachung aller System-Events
- **🤖 KI-optimierte Fehlerberichte**: Strukturierte Diagnose-Daten für AI-Assistenten
- **🎯 Mock-APIs**: Vollständige Google Apps Script Simulation für lokale Tests

## 🗂️ Projektstruktur

### **Kern-Module:**
- `Code.js` - Haupt-Backend-Logik
- `Client.html` - Frontend-Interface
- `index.html` - Haupteinstiegspunkt

### **Funktionsmodule:**
- `SheetsModule.js` - Google Sheets Integration
- `DriveModule.js` - Google Drive Operationen
- `ChecklistModule.js` - Checklisten-Management
- `ExportModule.js` - Datenexport-Funktionen
- `ParserModule.html` - HTML-Datenparser

### **UI-Module:**
- `DarlehensModule.html` - Darlehens-Interface
- `DarlehensnehmerModule.html` - Darlehensnehmer-Verwaltung
- `ButtonModule.html` - Button-Komponenten
- `ModalManager.html` - Modal-Verwaltung
- `UIModule.html` - UI-Hilfsfunktionen

### **Support-Module:**
- `ErrorHandlingModule.js` - Fehlerbehandlung
- `LoggerModule.js` - Logging-System
- `DataAccessModule.js` - Datenzugriff
- `ConfigModule.js` - Konfigurationsverwaltung
- `StateStore.html` - Zustandsverwaltung

### **Test & Entwicklung:**
- `test-environment-fixed.html` - **🔬 Lokale Test-Umgebung**
- `UnitTests.js` - Unit-Tests
- `AI_HELPER.js` - KI-Entwicklungsunterstützung

## 🔗 Wichtige Links

### **Live-System:**
- 📊 **Google Sheets**: [Produktions-Tabelle](https://docs.google.com/spreadsheets/d/1Ne15zED12z2pGimpz7q6OEFNLSrYg1PTKo7n6qT-a60/edit?gid=0#gid=0)
- ⚙️ **Google Apps Script**: [Backend-Code](https://script.google.com/u/0/home/projects/1yHFiXkQZgUar47e81mOocAmp2Zo-MJ4kTvLiEBMBrY7pVkkQLVhxm1iH/edit)

### **Entwicklung:**
- 🔬 **Lokale Test-Umgebung**: `test-environment-fixed.html`
- 📋 **CLASP Konfiguration**: `.clasp.json`
- 🚀 **Deploy Scripts**: `deploy.ps1`, `deploy_final.ps1`
- 🔄 **GitHub Repository**: [1.47-Dok-Verwaltung](https://github.com/haimieeeeeee/1.47-Dok-Verwaltung)

## 🚀 Schnellstart

### **Repository Setup:**
```bash
# Repository klonen
git clone https://github.com/haimieeeeeee/1.47-Dok-Verwaltung.git
cd 1.47-Dok-Verwaltung

# CLASP installieren (falls nicht vorhanden)
npm install -g @google/clasp
```

### **Lokale Entwicklung:**
1. **Test-Umgebung öffnen**:
   ```
   Öffne test-environment-fixed.html im Browser
   ```

2. **CLASP für Deployment**:
   ```powershell
   clasp push    # Code zu Google Apps Script hochladen
   clasp open    # Google Apps Script Editor öffnen
   ```

### **Funktionstest:**
1. **System-Check**: Alle Komponenten prüfen
2. **EventBus-Test**: Event-System und Modals testen
3. **KI-Report**: Strukturierte Diagnose-Daten generieren

## 🔬 Test-Umgebung Features

### **Kernfunktionen:**
- **Mock google.script.run APIs** für Backend-Simulation
- **Real-time EventBus Monitoring** mit Live-Events
- **Comprehensive Logging** (Events, Errors, Function calls)
- **KI-optimierte Diagnose-Berichte** für systematisches Debugging

### **Diagnose-Bereiche:**
- 📊 **System Status** - Grundlegende Systemgesundheit
- 🔄 **EventBus Monitor** - Live Event-Tracking
- 🐛 **Fehler & Warnungen** - Fehlerprotokollierung
- 📞 **Function Calls** - Funktionsaufruf-Tracking
- 💾 **State Snapshots** - Zustandserfassung
- 🤖 **KI-Diagnose** - AI-optimierte Reports

## 🛠️ Entwicklungsworkflow

### **Mit Test-Umgebung:**
1. **Lokale Tests** in test-environment-fixed.html
2. **Diagnose-Daten sammeln** via KI-Reports
3. **Fehler beheben** mit strukturierten Logs
4. **CLASP Deployment** zu Google Apps Script

### **Git Workflow:**
```powershell
git add .
git commit -m "feat: neue CRM-Funktion XYZ"
git push origin main
clasp push
```

## 🎯 Roadmap

### **Phase 1: Stabilisierung (Aktuell)**
- ✅ Test-Umgebung implementiert
- ✅ Git/GitHub Integration
- 🔄 Vollständige Modul-Integration

### **Phase 2: CRM-Erweiterung**
- 📋 Kundenverwaltung erweitern
- 📊 Erweiterte Berichtsfunktionen
- 🔄 Workflow-Automatisierung

### **Phase 3: Optimierung**
- ⚡ Performance-Optimierungen
- 🔐 Enhanced Security Features
- 📱 Mobile-Optimierung

## 🤝 Beiträge
Dieses Projekt nutzt eine innovative KI-gestützte Entwicklungsumgebung. Alle Änderungen sollten über die Test-Umgebung validiert werden.

## 📄 Lizenz
Internes Projekt - Alle Rechte vorbehalten

---
**Erstellt mit ❤️ und innovativer KI-gestützter Entwicklung**
