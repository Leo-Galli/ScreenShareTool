# CharlieRP ScreenShareTool v3.0 (Optimized)

[![Platform: Windows](https://img.shields.io/badge/Platform-Windows-blue.svg?style=flat-edge&logo=windows)](https://www.microsoft.com/windows)
[![Required: PowerShell 5.1+](https://img.shields.io/badge/PowerShell-5.1%2B-blue?style=flat-edge&logo=powershell)](https://github.com/PowerShell/PowerShell)
[![Permission: Administrator](https://img.shields.io/badge/Permission-Administrator-red?style=flat-edge)](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_user_profiles)

Uno strumento avanzato, ultrarapido e non invasivo per l'analisi forense e il controllo dei client (Screen Share) su sistemi Windows. Sviluppato specificamente per il network **mc.charlieroleplay.it**, il tool è progettato per rilevare multi-accounting, alterazioni del registro, eliminazioni sospette e l'uso di cheat/autodistruzioni in un intervallo di tempo personalizzabile.

---

## 🚀 Caratteristiche Principali & Ottimizzazioni

Rispetto alle versioni tradizionali di scansione PowerShell, la v3.0 introduce pesanti ottimizzazioni strutturali che riducono i tempi di esecuzione di oltre il **90%**:

*   **Scansione Multi-Thread (`RunspacePool`):** La ricerca dei nickname e delle stringhe di configurazione all'interno delle cartelle utente (`Desktop`, `Downloads`, `AppData`, ecc.) avviene in parallelo sfruttando fino a 8 core logici simultaneamente.
*   **Gestione della memoria via `StringBuilder`:** I report testuali vengono aggregati interamente in RAM e scritti su disco con un unico flush I/O, evitando colli di bottiglia derivanti dal comando `Add-Content` ripetuto.
*   **Lettura Singola del Journal NTFS:** Il Journal USN di ogni drive viene dumpato in memoria una sola volta e filtrato direttamente via codice, azzerando le letture ridondanti su disco.
*   **Caching Intelligente dei Log:** I file di log di Minecraft vengono analizzati e indicizzati all'avvio; i dati vengono poi riutilizzati istantaneamente per la generazione della Dashboard HTML e per il motore di ricerca dei Nickname.
*   **Dashboard HTML 5 Integrata:** Generazione automatica di un report grafico interattivo, scansionabile e moderno con grafici e metriche di vulnerabilità.

---

## 📂 Struttura dell'Output (`C:\CharlieRP_SS`)

Il tool genera una struttura organizzata di cartelle all'interno del disco locale, separando nettamente i vettori di analisi:

| ID | Modulo / Cartella | Descrizione |
| :--- | :--- | :--- |
| **01-02** | `AccountFiles` / `DeletedRenamed` | File account Minecraft e file `.exe`/`.jar`/`.pf` cancellati o rinominati di recente. |
| **03-05** | `JNativeHook` / `PrefetchDel` / `WMIC` | Tracce di macro/autoclicker avanzati e bypass tramite ADS (*Alternate Data Streams*). |
| **06-07** | `SolaLettura` / `Cacls` | Controlli su alterazioni dei permessi ACL o attributi di sola lettura sulla cartella Prefetch. |
| **08-10** | `ExtSpoofed` / `CestinoExe` / `Replace` | Rilevamento di caratteri Unicode nascosti (`?`) e pattern di sostituzione rapida Cheat $\rightarrow$ Legit. |
| **11** | `Regedit` | Analisi approfondita di `BAM`, `Compatibility Store`, `MuiCache`, `WinRAR History` e `USB Devices`. |
| **12** | `Prefetch` | Verifica dello stato di `EnablePrefetcher` e parsing temporale dei file `.pf`. |
| **13** | `Macro` | Scansione delle directory dei software di gioco noti (Razer, Logitech, Corsair, Bloody, ecc.). |
| **14** | `Minecraft` | Scansione completa di **15+ launcher diversi** (Prism, Modrinth, Lunar, Feather, CurseForge, ecc.) con analisi dei log di cambio account (*InGameAccountSwitcher*). |
| **15** | `Misc` | PowerShell history, analisi dei CrashDumps ed estrazione degli Event Log di Windows cruciali (ID 4616, 1102, 3079, 116/117). |
| **16-17** | `SystemInfo` / `Network` | Rilevamento Macchine Virtuali, VPN/Tunnel attivi, connessioni TCP stabilite e DNS Cache. |
| **18** | `CheatSelfDestruct` | **Modulo dedicato:** Identificazione di file ghost, script di cleanup (`.bat`/`.ps1`) e tracce residue di oltre 25 client cheat famosi. |

---

## 🛠️ Requisiti di Sistema

*   **Sistema Operativo:** Windows 10 / Windows 11 (consigliato per il modulo BAM) o Windows 7/8.
*   **Privilegi:** Il tool richiede tassativamente l'esecuzione con **privilegi di Amministratore** per poter accedere al Journal NTFS, alla cartella Prefetch e ai log di Sicurezza.
*   **PowerShell:** Versione 5.1 o superiore (integrata nativamente in Windows).

---

## 💻 Come Utilizzare il Tool

1.  Apri **PowerShell** come **Amministratore**.
2.  Scarica ed esegui lo script sul computer da analizzare.
3.  Inserisci il numero di giorni da analizzare a ritroso quando richiesto (es. `1` per le ultime 24 ore, `7` per l'ultima settimana).
4.  Attendi il completamento della barra di avanzamento a console.
5.  Apri il file `DASHBOARD_[Data]_[Ora].html` generato all'interno di `C:\CharlieRP_SS` per analizzare i risultati grafici.

---

## 👥 Credits

*   **Network:** [mc.charlieroleplay.it](https://charlieroleplay.it)
*   **Developer:** LeoGalli
*   **Versione Script:** 3.0 Optimized