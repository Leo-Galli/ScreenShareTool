# Istruzioni per Release GitHub + PR Winget

## Step 1: Crea la Release su GitHub

1. Vai su https://github.com/Leo-Galli/ScreenShareTool/releases/new
2. **Tag:** `v3.0.0`
3. **Title:** `v3.0.0 — Python Rewrite (Optimized)`
4. **Description:**

```markdown
## CharlieRP ScreenShareTool v3.0.0 — Python Rewrite

Riscrittura completa in Python dello strumento PowerShell di analisi forense anti-cheat.

### Novità
- **15 moduli separati** (era 1 script monolitico)
- **Meno falsi positivi**: regex precompilati + filtraggio contestuale
- **Zero dipendenze**: solo Python 3.8+ standard library
- **Dashboard HTML moderna**: 9 pagine interattive, dark theme, gradienti
- **Parallelismo**: ThreadPoolExecutor per ricerca nick su tutto il PC
- **26 client cheat** monitorati per autodistruzione
- **15+ launcher Minecraft** supportati (Modrinth, Prism, Lunar, CurseForge, etc.)

### Installazione
```powershell
# PowerShell come Admin:
python -m screenshare_tool --days 7
# oppure doppio-click su run.bat
```

### Requisiti
- Windows 10/11
- Python 3.8+ (già installato se usi Windows moderno)
- Privilegi Amministratore

### Struttura Output
```
C:\CharlieRP_SS\
├── 01_AccountFiles/    ├── 10_Replace/
├── 02_DeletedRenamed/  ├── 11_Regedit/
├── 03_JNativeHook/     ├── 12_Prefetch/
├── 04_PrefetchDel/     ├── 13_Macro/
├── 05_WMIC_Stream/     ├── 14_Minecraft/
├── 06_SolaLettura/     ├── 15_Misc/
├── 07_Cacls/           ├── 16_SystemInfo/
├── 08_ExtSpoofed/      ├── 17_Network/
├── 09_CestinoExe/      └── DASHBOARD_*.html
```

**Network:** mc.charlieroleplay.it | **Made by** LeoGalli
```

5. **Upload il file:** `CharlieRPScreenShareTool-v3.0.0.zip`
   (lo trovi nella cartella `release/` del progetto)
6. Clicca **"Publish release"**

---

## Step 2: Crea la PR su winget-pkgs

### Opzione A: Con wingetcreate (consigliata)

```powershell
# Installa wingetcreate se non ce l'hai
winget install wingetcreate

# Crea la PR automaticamente
wingetcreate update LeoGalli.CharlieRPScreenShareTool `
  --version 3.0.0 `
  --urls "https://github.com/Leo-Galli/ScreenShareTool/releases/download/v3.0.0/CharlieRPScreenShareTool-v3.0.0.zip" `
  --submit
```

### Opzione B: Manualmente con Git

```powershell
# 1. Forka il repo winget-pkgs su GitHub

# 2. Clone il tuo fork
git clone https://github.com/TUO-USERNAME/winget-pkgs.git
cd winget-pkgs

# 3. Crea il branch
git checkout -b update-charlierolescreensharetool-3.0.0

# 4. Copia i manifest (trovi nella cartella winget/ del progetto)
mkdir -p manifests/l/LeoGalli/CharlieRPScreenShareTool/3.0.0
cp ../winget/LeoGalli.CharlieRPScreenShareTool/3.0.0/*.yaml manifests/l/LeoGalli/CharlieRPScreenShareTool/3.0.0/

# 5. Verifica
winget validate --manifest manifests/l/LeoGalli/CharlieRPScreenShareTool/3.0.0

# 6. Commit e push
git add manifests/l/LeoGalli/CharlieRPScreenShareTool/3.0.0/
git commit -m "Update: LeoGalli.CharlieRPScreenShareTool to v3.0.0 (Python rewrite)"
git push origin update-charlierolescreensharetool-3.0.0

# 7. Crea la PR su GitHub
```

### Template PR Description

```markdown
## Update: LeoGalli.CharlieRPScreenShareTool version 3.0.0

Replaces the PowerShell v2.0.0 with a complete Python rewrite.

### Changes
- Rewritten in Python 3.8+ (zero external dependencies)
- Modular architecture: 15 separate modules instead of one monolithic script
- Reduced false positives with precompiled regex and contextual filtering
- Modern HTML dashboard with 9 interactive pages
- 26 known cheat clients monitored for self-destruction
- 15+ Minecraft launchers supported
- Parallel nick search with ThreadPoolExecutor

### Checklist
- [x] Signed CLA
- [x] Validated with `winget validate`
- [x] Tested with `winget install`
- [x] Manifests conform to 1.12 schema
- [x] Only modifies one package manifest
```

---

## File manifest creati

```
winget/LeoGalli.CharlieRPScreenShareTool/3.0.0/
├── LeoGalli.CharlieRPScreenShareTool.yaml           # Version manifest
├── LeoGalli.CharlieRPScreenShareTool.locale.en-US.yaml  # Locale/description
└── LeoGalli.CharlieRPScreenShareTool.installer.yaml    # Installer details
```

**SHA256 del zip:** `d79754246e9bfc7862a5e804fe615fc54fde0681d07371916a3e97838425c3c0`
