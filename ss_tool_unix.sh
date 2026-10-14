#!/usr/bin/env bash
# ==============================================================================
#  CharlieRP Screen Share Tool — UNIX Universal (macOS / Linux / FreeBSD)
#  Network: mc.charlieroleplay.it  |  Made by LeoGalli
#  Version: 3.1.0 — Complete rewrite with improved detection & dashboard
# ==============================================================================
set +e
set -u

VERSION="3.1.0"
NETWORK="mc.charlieroleplay.it"
TS="$(date '+%Y%m%d_%H%M%S')"

# ==============================================================================
#  OS & PACKAGE MANAGER DETECTION
# ==============================================================================
OS="unknown"
DISTRO=""
PKG_MGR=""

case "$(uname -s)" in
    Darwin)  OS="macos"; DISTRO="macos"
             command -v brew &>/dev/null && PKG_MGR="brew" ;;
    Linux)   OS="linux"
             [ -f /etc/os-release ] && . /etc/os-release && DISTRO="${ID:-unknown}"
             [ -f /etc/debian_version ] && DISTRO="debian"
             [ -f /etc/redhat-release ] && DISTRO="rhel"
             [ -f /etc/arch-release ]   && DISTRO="arch"
             for pm in apt-get dnf yum pacman zypper apk xbps-install emerge nix-env pkg; do
                 command -v "$pm" &>/dev/null && { PKG_MGR="${pm%-*}"; break; }
             done ;;
    FreeBSD) OS="freebsd"; DISTRO="freebsd"; command -v pkg &>/dev/null && PKG_MGR="pkg" ;;
    OpenBSD) OS="openbsd"; DISTRO="openbsd"; command -v pkg_add &>/dev/null && PKG_MGR="pkg_add" ;;
    *)       OS="unix-like"; DISTRO="generic" ;;
esac

# ==============================================================================
#  ROOT CHECK
# ==============================================================================
if [ "$(id -u)" -ne 0 ]; then
    echo ""
    echo "  [ERRORE] Esegui questo script come root: sudo $0"
    echo ""
    exit 1
fi

# ==============================================================================
#  DEPENDENCY AUTO-INSTALL
# ==============================================================================
install_pkg() {
    local pkg="$1"
    echo "  [DEP] Installazione: $pkg ..."
    case "$PKG_MGR" in
        apt)      apt-get update -qq && apt-get install -y -qq "$pkg" 2>/dev/null ;;
        dnf)      dnf install -y -q "$pkg" 2>/dev/null ;;
        yum)      yum install -y -q "$pkg" 2>/dev/null ;;
        pacman)   pacman -Sy --noconfirm --quiet "$pkg" 2>/dev/null ;;
        zypper)   zypper --non-interactive install -y -q "$pkg" 2>/dev/null ;;
        apk)      apk add --quiet "$pkg" 2>/dev/null ;;
        xbps)     xbps-install -y -q "$pkg" 2>/dev/null ;;
        emerge)   emerge --quiet --oneshot "$pkg" 2>/dev/null ;;
        nix)      nix-env -iA nixpkgs."$pkg" 2>/dev/null ;;
        pkg)      pkg install -y "$pkg" 2>/dev/null ;;
        pkg_add)  pkg_add -I "$pkg" 2>/dev/null ;;
        brew)     sudo -u "${SUDO_USER:-root}" brew install -q "$pkg" 2>/dev/null ;;
        *)        echo "  [AVVISO] Nessun package manager supportato. Installa manualmente: $pkg" ;;
    esac
}

command -v python3 &>/dev/null || install_pkg python3

HAS_SS=false; HAS_NETSTAT=false; HAS_LSOF=false
command -v ss &>/dev/null && HAS_SS=true
command -v netstat &>/dev/null && HAS_NETSTAT=true
command -v lsof &>/dev/null && HAS_LSOF=true

if ! $HAS_SS && ! $HAS_NETSTAT && ! $HAS_LSOF; then
    install_pkg iproute2 2>/dev/null; install_pkg lsof 2>/dev/null
    command -v ss &>/dev/null && HAS_SS=true
    command -v lsof &>/dev/null && HAS_LSOF=true
fi

clear

# ==============================================================================
#  BANNER
# ==============================================================================
echo ""
printf '\033[36m%s\033[0m\n' "      _____ _           _ _     _____     _         _           "
printf '\033[36m%s\033[0m\n' "     |     | |_ ___ ___| |_|___| __  |___| |___ ___| |___ _ _   "
printf '\033[36m%s\033[0m\n' "     |   --|   | .'|  _| | | -_|    -| . | | -_| . | | .'| | |  "
printf '\033[36m%s\033[0m\n' "     |_____|_|_|__,|_| |_|_|___|__|__|___|_|___|  _|_|__,|_  |  "
printf '\033[36m%s\033[0m\n' "                                               |_|       |___|  "
echo ""
printf '\033[34m%s\033[0m\n' "        NETWORK: $NETWORK  |  Made by LeoGalli"
printf '\033[34m%s\033[0m\n' "        PLATFORM: $OS ($DISTRO)  |  Script v${VERSION} Python-Optimized"
printf '\033[90m%s\033[0m\n' "  ___________________________________________________________________"
echo ""

# ==============================================================================
#  SYSTEM INFO
# ==============================================================================
SYS_NAME=""
SYS_BUILD=""
if [ "$OS" = "macos" ]; then
    SYS_NAME="$(sw_vers -productName 2>/dev/null || echo "macOS") $(sw_vers -productVersion 2>/dev/null || echo "?")"
    SYS_BUILD="$(sw_vers -buildVersion 2>/dev/null || echo "?")"
else
    SYS_NAME="${PRETTY_NAME:-$(uname -s) $(uname -r)}"
    SYS_BUILD="$(uname -r)"
fi

printf '  Sistema: \033[37m%s\033[0m (Build %s)\n' "$SYS_NAME" "$SYS_BUILD"
echo ""

# ==============================================================================
#  ANALYSIS INTERVAL
# ==============================================================================
printf '  \033[37mInserisci l'"'"'intervallo di analisi:\033[0m\n'
DAYS=0
while [ "$DAYS" -le 0 ] 2>/dev/null; do
    read -rp "  Quanti giorni indietro? (es. 1, 7, 30, 90): " INPUT_DAYS
    case "$INPUT_DAYS" in
        *[!0-9]*|"") DAYS=0; echo "  Inserisci un numero positivo." ;;
        *) DAYS=$((10#$INPUT_DAYS)) ;;
    esac
done

DATE_LIMIT_EPOCH=$(python3 -c "import time; print(int(time.time() - $DAYS * 86400))" 2>/dev/null)
DATE_LIMIT_STR=$(python3 -c "import time; print(time.strftime('%d/%m/%Y %H:%M:%S', time.localtime(time.time() - $DAYS * 86400)))" 2>/dev/null)

echo ""
printf '  Dal: \033[37m%s\033[0m  -->  Oggi  (%s giorni)\n' "$DATE_LIMIT_STR" "$DAYS"
echo ""

# ==============================================================================
#  PORTABLE FILE HELPERS
# ==============================================================================
file_epoch() {
    local f="$1"
    [ -e "$f" ] || { echo 0; return; }
    python3 -c "import os; print(int(os.path.getmtime('$f')))" 2>/dev/null && return
    stat -c '%Y' "$f" 2>/dev/null && return
    stat -f '%m' "$f" 2>/dev/null && return
    echo 0
}

file_in_range() {
    [ -e "$1" ] || return 1
    local mt; mt=$(file_epoch "$1")
    [ "$mt" -ge "$DATE_LIMIT_EPOCH" ]
}

file_mtime_str() {
    [ -e "$1" ] || { echo "N/A"; return; }
    python3 -c "import os,datetime; print(datetime.datetime.fromtimestamp(os.path.getmtime('$1')).strftime('%d/%m/%Y %H:%M:%S'))" 2>/dev/null && return
    echo "N/A"
}

show_step() {
    local mod="$1" detail="$2" color="${3:-cyan}"
    local cc='\033[36m'
    case "$color" in
        green)  cc='\033[32m' ;; yellow) cc='\033[33m' ;; red) cc='\033[31m' ;; gray) cc='\033[90m' ;;
    esac
    printf "  ${cc}[ >> ]\033[0m \033[37m%-18s\033[0m \033[90m%s\033[0m\n" "$mod" "$detail"
}

write_header() {
    local path="$1" title="$2" desc="$3"
    cat > "$path" <<HEADER
================================================================
  $title
  $desc

  Sistema  : $SYS_NAME (Build $SYS_BUILD)
  Generato : $(date '+%d/%m/%Y %H:%M:%S')
  Intervallo: Ultimi $DAYS giorni  (dal $DATE_LIMIT_STR)
================================================================

HEADER
}

# ==============================================================================
#  OUTPUT DIRECTORIES
# ==============================================================================
ROOT="/tmp/CharlieRP_SS"
DIRS=(
    "01_AccountFiles" "02_DeletedRenamed" "03_JNativeHook"
    "04_PrefetchDel" "05_FSEvents" "06_SolaLettura"
    "07_Perms" "08_ExtSpoofed" "09_TrashExe"
    "10_Replace" "11_SystemInfo" "12_Launchd"
    "13_Macro" "14_Minecraft" "15_Misc"
    "16_SystemInfo" "17_Network"
)
mkdir -p "$ROOT"
for d in "${DIRS[@]}"; do mkdir -p "$ROOT/$d"; done

# ==============================================================================
#  MOUNT POINTS & USER HOMES
# ==============================================================================
DRIVES=()
while IFS= read -r line; do
    [ -n "$line" ] && DRIVES+=("$line")
done < <(df 2>/dev/null | awk 'NR>1 && $1 ~ /^\/dev\// {print $NF}' | sort -u)
[ ${#DRIVES[@]} -eq 0 ] && DRIVES=("/")

show_step "SISTEMA" "Punti di mount: ${DRIVES[*]}" "green"
echo ""

USER_HOMES=("/root")
if [ "$OS" = "macos" ]; then
    while IFS= read -r u; do [ -d "$u" ] && USER_HOMES+=("$u"); done < <(find /Users -maxdepth 1 -mindepth 1 -type d 2>/dev/null)
else
    while IFS= read -r u; do [ -d "$u" ] && USER_HOMES+=("$u"); done < <(find /home -maxdepth 1 -mindepth 1 -type d 2>/dev/null)
fi

SEARCH_ROOTS=()
for uh in "${USER_HOMES[@]}"; do [ -d "$uh" ] && SEARCH_ROOTS+=("$uh"); done
[ -d "/tmp" ] && SEARCH_ROOTS+=("/tmp")
[ -d "/var/tmp" ] && SEARCH_ROOTS+=("/var/tmp")
if [ "$OS" = "macos" ]; then
    [ -d "/private/var/folders" ] && SEARCH_ROOTS+=("/private/var/folders")
    [ -d "/Volumes" ] && SEARCH_ROOTS+=("/Volumes")
else
    [ -d "/media" ] && SEARCH_ROOTS+=("/media")
    [ -d "/mnt" ] && SEARCH_ROOTS+=("/mnt")
fi

# Common exclusion patterns for find commands.
# NOTE: this must stay an array (not a plain string) - expanding a quoted
# string of find primaries unquoted re-splits on whitespace but does NOT
# strip the embedded double quotes, so "*/.git" would be passed to find as
# the literal 6-character token "*/.git" (quotes included) and never match
# anything, silently defeating the whole -prune clause. An array preserves
# each argument as its own word with no quote characters involved.
EXCLUDE_PRUNE=(
    "(" -path "*/.git" -o -path "*/node_modules" -o -path "*/.cache"
    -o -path "*/.cargo" -o -path "*/.npm" -o -path "*/.rustup" -o -path "*/.mozilla"
    -o -path "*/Library/Caches" -o -path "*/Library/Containers"
    -o -path "*/Library/Developer" -o -path "*/Library/Metadata" ")" -prune
)

TRASH_DIRS=()
if [ "$OS" = "macos" ]; then
    TRASH_DIRS+=("$HOME/.Trash")
    while IFS= read -r u; do [ -d "$u/.Trash" ] && TRASH_DIRS+=("$u/.Trash"); done < <(find /Users -maxdepth 1 -mindepth 1 -type d 2>/dev/null)
else
    TRASH_DIRS+=("$HOME/.local/share/Trash/files")
    while IFS= read -r u; do [ -d "$u/.local/share/Trash/files" ] && TRASH_DIRS+=("$u/.local/share/Trash/files"); done < <(find /home -maxdepth 1 -mindepth 1 -type d 2>/dev/null)
    [ -d "/root/.local/share/Trash/files" ] && TRASH_DIRS+=("/root/.local/share/Trash/files")
fi

# ==============================================================================
#  KNOWN CHEAT CLIENTS DATABASE
# ==============================================================================
KNOWN_CHEATS=(
    "doomsday:doomsday,dday,dd_,d00msday"
    "sigma:sigma,sigma5,sigma6,sigma_,sigmaclient"
    "wurst:wurst,wurst-,wurst_,wurstclient"
    "meteor:meteor-client,meteor_client,meteorclient,meteor-"
    "aristois:aristois,aristoi,hacked-1,hacked-fabric"
    "impact:impact-,impactclient,impact_"
    "xray:xray,xray-mod,xray_mod,xraymod"
    "inertia:inertia,inertia-"
    "future:future-,futureclient,future_client"
    "liquidbounce:liquidbounce,liquid-bounce,liquid_bounce"
    "vape:vape,vape-,vape_,vape_lite,vapelite"
    "ghost:ghost-,ghostclient,ghost_client"
    "entropy:entropy-,entropyclient,entropy_"
    "horion:horion,horion-"
    "ares:ares-client,aresclient,ares_"
    "novoline:novoline,novoline-,novo-"
    "remix:remix-,remixclient,remix_"
    "rise:rise-,riseclient,rise_client"
    "zeroday:zeroday,zero-day,0day-"
    "drip:dripx,drip-,drip_x,dripplus"
    "rusherhack:rusherhack,rusher-"
    "tenacity:tenacity-,tenacityclient"
    "bleachhack:bleachhack,bleach-hack,bleach_"
    "raven:raven-,ravenclient,raven_b,ravenb"
    "omega:omega-hack,omegahack,omega_hack"
    "phase:phase-,phaseclient,phase_b"
)

CHEAT_PAT=""
for ch in "${KNOWN_CHEATS[@]}"; do
    pats="${ch#*:}"
    IFS=',' read -ra P <<< "$pats"
    for p in "${P[@]}"; do
        CHEAT_PAT="${CHEAT_PAT:+$CHEAT_PAT|}$(printf '%s' "$p" | sed 's/[.+?^${}()|[\]\\]/\\&/g')"
    done
done

get_cheat_name() {
    local text="$1"
    for ch in "${KNOWN_CHEATS[@]}"; do
        local name="${ch%%:*}"
        IFS=',' read -ra P <<< "${ch#*:}"
        for p in "${P[@]}"; do
            echo "$text" | grep -qi "$p" && { echo "$name"; return; }
        done
    done
    echo "Sconosciuto"
}

# ==============================================================================
#  MODULE: FILE SYSTEM FORENSICS (01-09)
# ==============================================================================
run_fs_events() {
show_step "FS EVENTS" "Analisi file system e file eliminati..." "cyan"

# --- Account files ---
OUT="$ROOT/01_AccountFiles/AccountFiles_$TS.txt"
write_header "$OUT" "FS [01] - ACCOUNT FILES" "File MC/AccountSwitcher trovati o modificati"
MC_PATTERNS=("launcher_profiles.json" "launcher_accounts.json" "usercache.json"
             "usernamecache.json" "InGameAccountSwitcher" "ias.json")
{
    for drv in "${SEARCH_ROOTS[@]}"; do
        [ -d "$drv" ] || continue
        for pat in "${MC_PATTERNS[@]}"; do
            find "$drv" -maxdepth 8 "${EXCLUDE_PRUNE[@]}" -o \( -name "$pat" -print \) 2>/dev/null | while read -r f; do
                tag=$(file_in_range "$f" && echo "[!!!]" || echo "[ - ]")
                echo "  $tag $(file_mtime_str "$f")  |  $f"
            done
        done
    done
} >> "$OUT"

# --- Trash ---
OUT2="$ROOT/09_TrashExe/CestinoExe_$TS.txt"
write_header "$OUT2" "FS [09] - EXECUTABLES IN TRASH" "File .jar/.sh/.py eliminati nel cestino"
found_trash=false
for tdir in "${TRASH_DIRS[@]}"; do
    [ -d "$tdir" ] || continue
    # NOTE: must use process substitution (< <(...)), not a pipe into the
    # while loop - a pipe runs the loop body in a subshell, so found_trash=true
    # would be lost the moment the loop ends and the [OK] fallback below would
    # always fire even when matches were found.
    while read -r f; do
        file_in_range "$f" && { echo "  [!!!] $(file_mtime_str "$f")  |  $(basename "$f")  |  $f" >> "$OUT2"; found_trash=true; }
    done < <(find "$tdir" -type f \( -name "*.jar" -o -name "*.sh" -o -name "*.py" -o -name "*.exe" \) 2>/dev/null)
done
$found_trash || echo "  [OK] Nessun eseguibile trovato nel cestino nell'intervallo selezionato." >> "$OUT2"

# --- JNativeHook ---
OUT3="$ROOT/03_JNativeHook/JNativeHook_$TS.txt"
write_header "$OUT3" "FS [03] - JNATIVEHOOK" "Tracce di autoclicker (.jar in /tmp o nella home)"
found_jna=false
for drv in "${SEARCH_ROOTS[@]}"; do
    [ -d "$drv" ] || continue
    while read -r f; do
        echo "  [!!!] $(file_mtime_str "$f")  |  $f" >> "$OUT3"
        found_jna=true
    done < <(find "$drv" -maxdepth 8 "${EXCLUDE_PRUNE[@]}" -o \( \( -iname "*JNativeHook*" \) -print \) 2>/dev/null)
done
$found_jna || echo "  [--] Nessuna traccia di JNativeHook trovata." >> "$OUT3"

# --- FSEvents / Audit Logs ---
OUT4="$ROOT/05_FSEvents/FSEvents_$TS.txt"
write_header "$OUT4" "FS [05] - FSEVENTS / AUDIT LOG" "Tracce di esecuzione processi"
{
    if [ "$OS" = "macos" ]; then
        echo "  ---- Log unificato macOS ----"
        SINCE_LOG=$(date -v "-${DAYS}d" '+%Y-%m-%d %H:%M:%S' 2>/dev/null || echo "")
        if [ -n "$SINCE_LOG" ] && command -v log &>/dev/null; then
            log show --start "$SINCE_LOG" --predicate 'eventMessage CONTAINS "java" OR eventMessage CONTAINS ".jar" OR eventMessage CONTAINS "minecraft"' --style syslog 2>/dev/null | head -200
        fi
        echo ""
        echo "  ---- Spotlight: file .jar recenti ----"
        mdfind -onlyin / "kMDItemFSChangeDate >= \$time.now(-$((DAYS * 86400))) && kMDItemFSName == '*.jar'" 2>/dev/null | head -50 | while IFS= read -r f; do
            echo "  [JAR] $(file_mtime_str "$f")  |  $f"
        done
    else
        echo "  ---- Audit log / Journal (Linux) ----"
        if command -v ausearch &>/dev/null; then
            ausearch -m execve -ts "$(python3 -c "import time; print(time.strftime('%m/%d/%Y %H:%M:%S', time.localtime($DATE_LIMIT_EPOCH)))" 2>/dev/null)" 2>/dev/null | \
                grep -i '\.jar\|minecraft\|jnative' | head -100
        fi
        if command -v journalctl &>/dev/null; then
            journalctl --since "$(python3 -c "import time; print(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime($DATE_LIMIT_EPOCH)))" 2>/dev/null)" --no-pager -q 2>/dev/null | \
                grep -i 'java\|\.jar\|minecraft\|jnative' | head -200
        fi
        for logf in /var/log/syslog /var/log/messages /var/log/kern.log; do
            [ -f "$logf" ] || continue
            grep -i 'java\|\.jar\|minecraft' "$logf" 2>/dev/null | tail -100 | while IFS= read -r line; do echo "  [SYSLOG] $line"; done
        done
    fi
} >> "$OUT4"

# --- Immutable / read-only files ---
OUT5="$ROOT/06_SolaLettura/SolaLettura_$TS.txt"
write_header "$OUT5" "FS [06] - IMMUTABLE / READ-ONLY FILES" "Attributi di sola lettura o immutabili forzati"
{
    if [ "$OS" = "macos" ]; then
        echo "  ---- File con flag uchg/schg (macOS chflags) ----"
        for dir in "$HOME/Library/Application Support/minecraft" "$HOME/.minecraft"; do
            [ -d "$dir" ] || continue
            ls -lO "$dir" 2>/dev/null | grep -E 'uchg|schg|uimmutable|simmutable' | while IFS= read -r line; do echo "  [!!!] $line"; done
        done
    else
        echo "  ---- File immutabili (lsattr) ----"
        if command -v lsattr &>/dev/null; then
            for dir in "$HOME/.minecraft" "$HOME/.local/share"; do
                [ -d "$dir" ] || continue
                lsattr -R "$dir" 2>/dev/null | grep -v '^-' | grep -v '^lsattr' | while IFS= read -r line; do echo "  [!!!] $line"; done
            done
        else
            echo "  [--] lsattr non disponibile."
        fi
    fi
} >> "$OUT5"

# --- Anomalous permissions ---
OUT6="$ROOT/07_Perms/Perms_$TS.txt"
write_header "$OUT6" "FS [07] - ANOMALOUS PERMISSIONS" "File con permessi 000/777 nelle cartelle di cache"
{
    CACHE_DIRS=()
    if [ "$OS" = "macos" ]; then CACHE_DIRS+=("$HOME/Library/Caches" "/private/var/folders")
    else CACHE_DIRS+=("$HOME/.cache" "/tmp"); fi
    for cdir in "${CACHE_DIRS[@]}"; do
        [ -d "$cdir" ] || continue
        find "$cdir" -maxdepth 3 \( -perm 000 -o -perm 777 \) 2>/dev/null | while read -r f; do
            if [ "$OS" = "macos" ]; then echo "  [!!!] $(stat -f '%Sp %Su %Sg' "$f" 2>/dev/null)  |  $f"
            else echo "  [!!!] $(stat -c '%A %U %G' "$f" 2>/dev/null)  |  $f"; fi
        done
    done
} >> "$OUT6"

# --- Spoofed Unicode filenames ---
OUT7="$ROOT/08_ExtSpoofed/ExtSpoofed_$TS.txt"
write_header "$OUT7" "FS [08] - SPOOFED EXTENSIONS / NON-ASCII" "File con nomi Unicode anomali"
{
    for drv in "${SEARCH_ROOTS[@]}"; do
        [ -d "$drv" ] || continue
        find "$drv" -maxdepth 6 "${EXCLUDE_PRUNE[@]}" -o -print 2>/dev/null | \
            python3 -c '
import sys
for line in sys.stdin:
    l = line.strip()
    try: l.encode("ascii")
    except UnicodeEncodeError: print(l)
' 2>/dev/null | head -100 | while IFS= read -r f; do
            echo "  [!!!] $(file_mtime_str "$f")  |  $f"
        done
    done
} >> "$OUT7"

show_step "FS EVENTS" "Completato. Sezioni 01-09 scritte." "green"
}

# ==============================================================================
#  MODULE: SYSTEM INFO (11)
# ==============================================================================
run_sysinfo() {
show_step "SYSINFO" "Analisi informazioni di sistema..." "cyan"

OUT_BAM="$ROOT/11_SystemInfo/BAM_equiv_$TS.txt"
write_header "$OUT_BAM" "SYSINFO [11b] - RECENT EXECUTIONS (BAM equiv.)" "Cronologia login + cronologia shell"
{
    echo "  ---- Login recenti (last) ----"
    last -F 2>/dev/null | head -50 | while IFS= read -r line; do echo "  [LAST] $line"; done

    echo ""
    echo "  ---- Cronologia shell: parole chiave java/.jar/minecraft/cheat ----"
    HIST_FILES=()
    for u in "${USER_HOMES[@]}"; do
        for hf in "$u/.bash_history" "$u/.zsh_history" "$u/.ash_history" "$u/.sh_history" "$u/.history" "$u/.local/share/fish/fish_history"; do
            [ -f "$hf" ] && HIST_FILES+=("$hf")
        done
    done
    for hf in "${HIST_FILES[@]}"; do
        echo ""
        echo "  FILE: $hf"
        grep -iE 'java|\.jar|minecraft|cheat|hack|sigma|wurst|meteor|vape|liquidbounce|impact|doomsday' "$hf" 2>/dev/null | tail -100 | while IFS= read -r line; do echo "  [HIS] $line"; done
    done

    echo ""
    echo "  ---- Processi attivi (java/minecraft) ----"
    if [ "$OS" = "linux" ]; then
        for pid in /proc/[0-9]*/cmdline; do
            cmd=$(tr '\0' ' ' < "$pid" 2>/dev/null || true)
            echo "$cmd" | grep -qiE 'java|\.jar|minecraft' 2>/dev/null && echo "  [PROC] $cmd"
        done
    else
        ps aux 2>/dev/null | grep -iE 'java|\.jar|minecraft' | grep -v grep | while IFS= read -r line; do echo "  [PS] $line"; done
    fi
} >> "$OUT_BAM"

# --- Recent archives ---
OUT_ARC="$ROOT/11_SystemInfo/Archivi_recenti_$TS.txt"
write_header "$OUT_ARC" "SYSINFO [11c] - RECENT ARCHIVES" "Archivi zip/tar/rar/7z modificati nell'intervallo"
{
    for drv in "${SEARCH_ROOTS[@]}"; do
        [ -d "$drv" ] || continue
        find "$drv" -maxdepth 8 "${EXCLUDE_PRUNE[@]}" -o \( \( -name "*.zip" -o -name "*.tar.gz" -o -name "*.tgz" -o -name "*.rar" -o -name "*.7z" \) -print \) 2>/dev/null | while read -r f; do
            file_in_range "$f" && echo "  [!!!] $(file_mtime_str "$f")  |  $f"
        done
    done
} >> "$OUT_ARC"

# --- App cache (MuiCache equiv.) ---
OUT_MUI="$ROOT/11_SystemInfo/AppCache_$TS.txt"
write_header "$OUT_MUI" "SYSINFO [11d] - APP CACHE (MuiCache equiv.)" "Applicazioni lanciate di recente"
{
    if [ "$OS" = "macos" ]; then
        echo "  ---- App recenti (LaunchServices) ----"
        for appdir in /Applications "$HOME/Applications"; do
            [ -d "$appdir" ] || continue
            find "$appdir" -maxdepth 2 -name "*.app" 2>/dev/null | while read -r f; do
                file_in_range "$f" && echo "  [NEW] $(file_mtime_str "$f")  |  $f"
            done
        done
    else
        echo "  ---- File .desktop recenti ----"
        find /usr/share/applications ~/.local/share/applications /var/lib/snapd/desktop/applications -name "*.desktop" 2>/dev/null | while read -r f; do
            file_in_range "$f" && { echo "  [NEW] $(file_mtime_str "$f")  |  $f"; grep -iE '^Name=|^Exec=' "$f" 2>/dev/null | head -3 | while IFS= read -r l; do echo "        $l"; done; }
        done
        echo ""
        echo "  ---- Pacchetti Snap ----"
        command -v snap &>/dev/null && snap list 2>/dev/null | while IFS= read -r line; do echo "  [SNAP] $line"; done
        echo ""
        echo "  ---- Pacchetti Flatpak ----"
        command -v flatpak &>/dev/null && flatpak list 2>/dev/null | while IFS= read -r line; do echo "  [FLAT] $line"; done
    fi
} >> "$OUT_MUI"

# --- USB Devices ---
OUT_USB="$ROOT/11_SystemInfo/USB_$TS.txt"
write_header "$OUT_USB" "SYSINFO [11h] - USB DEVICES" "Periferiche USB collegate"
{
    if [ "$OS" = "macos" ]; then
        system_profiler SPUSBDataType 2>/dev/null | grep -E 'Product ID:|Vendor ID:|Manufacturer:|Name:' | while IFS= read -r line; do echo "  [USB] $line"; done
    else
        command -v lsusb &>/dev/null && lsusb 2>/dev/null | while IFS= read -r line; do echo "  [USB] $line"; done
        command -v journalctl &>/dev/null && journalctl --since "$(date -d "@$DATE_LIMIT_EPOCH" '+%Y-%m-%d' 2>/dev/null)" -k --no-pager -q 2>/dev/null | grep -i 'usb\|hid' | head -50 | while IFS= read -r line; do echo "  [UDEV] $line"; done
    fi
} >> "$OUT_USB"

# --- ShimCache / Dyld Cache equiv. ---
OUT_SHIM="$ROOT/11_SystemInfo/DyldCache_$TS.txt"
write_header "$OUT_SHIM" "SYSINFO [11i] - DYLD CACHE / SHIMCACHE equiv." "Cache delle librerie condivise"
{
    if [ "$OS" = "macos" ]; then
        ls -la /private/var/db/dyld/ 2>/dev/null | while IFS= read -r line; do echo "  [DYLD] $line"; done
    else
        echo "  ---- Cache ldconfig ----"
        command -v ldconfig &>/dev/null && ldconfig -p 2>/dev/null | head -50 | while IFS= read -r line; do echo "  [LDCONF] $line"; done
    fi
} >> "$OUT_SHIM"

show_step "SYSINFO" "Completato. Sezioni 11b-11i scritte." "green"
}

# ==============================================================================
#  MODULE: PREFETCH EQUIVALENT (12)
# ==============================================================================
run_prefetch() {
show_step "PREFETCH" "Cache di avvio ed eseguibili recenti..." "cyan"

OUT_PF="$ROOT/12_Launchd/Status_$TS.txt"
write_header "$OUT_PF" "PREFETCH equiv [12a] - STARTUP STATUS" "launchd (macOS) / systemd (Linux)"
{
    if [ "$OS" = "macos" ]; then
        launchctl list 2>/dev/null | head -100 | while IFS= read -r line; do echo "  $line"; done
    else
        echo "  ---- systemd analyze blame ----"
        command -v systemd-analyze &>/dev/null && systemd-analyze blame 2>/dev/null | head -30 | while IFS= read -r line; do echo "  [SYS] $line"; done
        echo ""
        echo "  ---- Servizi attivi ----"
        command -v systemctl &>/dev/null && systemctl list-units --type=service --state=running --no-pager 2>/dev/null | head -40
    fi
} >> "$OUT_PF"

OUT_PF2="$ROOT/12_Launchd/Lista_$TS.txt"
write_header "$OUT_PF2" "PREFETCH equiv [12c] - RECENT EXECUTABLES" "File .jar/.sh/.py modificati di recente"
{
    for drv in "${SEARCH_ROOTS[@]}"; do
        [ -d "$drv" ] || continue
        find "$drv" -maxdepth 8 "${EXCLUDE_PRUNE[@]}" -o \( \( -name "*.jar" -o -name "*.sh" -o -name "*.py" \) -not -path "*/proc/*" -not -path "*/sys/*" -print \) 2>/dev/null | while read -r f; do
            file_in_range "$f" && echo "  [>>>] $(file_mtime_str "$f")  |  $f"
        done
    done
} >> "$OUT_PF2"

show_step "PREFETCH" "Completato." "green"
}

# ==============================================================================
#  MODULE: MACRO SOFTWARE (13)
# ==============================================================================
run_macro() {
show_step "MACRO" "Scansione software macro/gaming..." "cyan"

OUT_MACRO="$ROOT/13_Macro/Macro_$TS.txt"
write_header "$OUT_MACRO" "MACRO [13] - SOFTWARE DETECTED" "Razer, Logitech, Corsair, Bloody, xdotool, AutoKey"
{
    MACRO_PATHS=()
    if [ "$OS" = "macos" ]; then
        MACRO_PATHS=(
            "/Library/Application Support/Razer|Razer Synapse"
            "$HOME/Library/Application Support/Razer|Razer Synapse (user)"
            "$HOME/Library/Application Support/Logitech G HUB|Logitech G HUB"
            "$HOME/Library/Application Support/Corsair|Corsair iCUE"
            "$HOME/Library/Application Support/SteelSeries GG|SteelSeries GG"
            "/Applications/Karabiner-Elements.app|Karabiner-Elements"
            "/Applications/BetterTouchTool.app|BetterTouchTool"
            "/Applications/Keyboard Maestro.app|Keyboard Maestro"
        )
    else
        MACRO_PATHS=(
            "$HOME/.config/razergenie|Razer (openrazer)"
            "$HOME/.config/piper|Piper (Logitech)"
            "$HOME/.config/autokey|AutoKey"
            "/usr/bin/xdotool|xdotool"
            "/usr/bin/xte|xte (xautomation)"
            "$HOME/.config/ckb-next|ckb-next (Corsair)"
        )
    fi
    for entry in "${MACRO_PATHS[@]}"; do
        mp="${entry%%|*}"; soft="${entry#*|}"
        if [ -e "$mp" ]; then
            tag=$(file_in_range "$mp" && echo "[!!!] MODIFICATO NELL'INTERVALLO" || echo "[ - ] trovato (fuori intervallo)")
            echo "  $tag"
            echo "        Software        : $soft"
            echo "        Percorso        : $mp"
            echo "        Ultima modifica : $(file_mtime_str "$mp")"
            echo ""
        else
            echo "  [   ] assente : $soft"
        fi
    done
} >> "$OUT_MACRO"

show_step "MACRO" "Completato." "green"
}

# ==============================================================================
#  MODULE: MINECRAFT FORENSICS (14)
# ==============================================================================
run_minecraft() {
show_step "MINECRAFT" "Profili, account, IGAS, log cambio account..." "cyan"

MC_BASE_DIRS=()
if [ "$OS" = "macos" ]; then
    MC_BASE_DIRS+=("$HOME/Library/Application Support/minecraft" "$HOME/.minecraft")
else
    MC_BASE_DIRS+=("$HOME/.minecraft")
fi

MC_LAUNCHER_DEFS=()
if [ "$OS" = "macos" ]; then
    MC_LAUNCHER_DEFS+=(
        "Mojang|$HOME/Library/Application Support/minecraft|launcher_profiles.json launcher_accounts.json|logs"
        "Mojang|$HOME/.minecraft|launcher_profiles.json launcher_accounts.json|logs"
        "Modrinth|$HOME/Library/Application Support/com.modrinth.theseus|metadata/credentials.json accounts.json users.json|logs metadata/logs"
        "Prism|$HOME/Library/Application Support/PrismLauncher|accounts.json|logs instances"
        "MultiMC|$HOME/Library/Application Support/MultiMC|accounts.json|logs instances"
        "TLauncher|$HOME/Library/Application Support/.tlauncher|accounts.json TLauncher.cfg|logs"
    )
else
    MC_LAUNCHER_DEFS+=(
        "Mojang|$HOME/.minecraft|launcher_profiles.json launcher_accounts.json|logs"
        "Modrinth|$HOME/.var/app/com.modrinth.ModrinthApp/data/com.modrinth.theseus|metadata/credentials.json accounts.json users.json|logs metadata/logs"
        "Modrinth|$HOME/.local/share/com.modrinth.ModrinthApp|metadata/credentials.json accounts.json users.json|logs metadata/logs"
        "Prism|$HOME/.local/share/PrismLauncher|accounts.json|logs instances"
        "Prism|$HOME/.var/app/org.prismlauncher.PrismLauncher/data/PrismLauncher|accounts.json|logs instances"
        "MultiMC|$HOME/.local/share/multimc|accounts.json|logs instances"
        "TLauncher|$HOME/.tlauncher|accounts.json TLauncher.cfg|logs"
        "ATLauncher|$HOME/.local/share/ATLauncher|configs/accounts.json accounts.json|logs"
        "GDLauncher|$HOME/.local/share/gdlauncher_carbon|data/accounts.json accounts.json|logs data/logs"
    )
fi
MC_LAUNCHER_DEFS+=("LunarClient|$HOME/.lunarclient|settings/accounts.json offline/accounts.json accounts.json|logs offline/multiver/logs")

IGAS_MOD_PATHS=()
for base in "${MC_BASE_DIRS[@]}"; do
    IGAS_MOD_PATHS+=("$base/config/ias.json" "$base/config/IAS/accounts.json" "$base/config/IAS/ias.json")
done
IGAS_STANDALONE_ROOTS=("$HOME/.local/share/InGameAccountSwitcher" "$HOME/.config/InGameAccountSwitcher" "$HOME/Library/Application Support/InGameAccountSwitcher")

# [14a] Launchers found
OUT_14A="$ROOT/14_Minecraft/14a_Launcher_Trovati_$TS.txt"
write_header "$OUT_14A" "MINECRAFT [14a] - LAUNCHERS FOUND" ""
FOUND_LAUNCHERS=()

{
    for entry in "${MC_LAUNCHER_DEFS[@]}"; do
        lname="${entry%%|*}"; rest="${entry#*|}"; lroot="${rest%%|*}"; rest="${rest#*|}"; acc_files="${rest%%|*}"; log_dirs="${rest#*|}"
        [ -d "$lroot" ] || { echo "  [   ] NON TROVATO  : $lname  ($lroot)"; continue; }
        tag=$(file_in_range "$lroot" && echo "[!!!]" || echo "[ - ]")
        echo ""; echo "  $tag TROVATO  : $lname"; echo "       Root            : $lroot"; echo "       Ultima modifica : $(file_mtime_str "$lroot")"
        FOUND_LAUNCHERS+=("$lname|$lroot|$acc_files|$log_dirs")
    done

    echo ""; echo "  ---- INGAME ACCOUNT SWITCHER (IGAS) ----"
    for ir in "${IGAS_STANDALONE_ROOTS[@]}"; do
        [ -d "$ir" ] && { tag=$(file_in_range "$ir" && echo "[!!!]" || echo "[ - ]"); echo "  $tag TROVATO  : IGAS standalone"; echo "       Percorso : $ir"; echo "       Data     : $(file_mtime_str "$ir")"; } || echo "  [   ] assente  : $ir"
    done
    echo ""; echo "  ---- IGAS MOD (ias.json in .minecraft/config) ----"
    for imp in "${IGAS_MOD_PATHS[@]}"; do
        [ -f "$imp" ] && { tag=$(file_in_range "$imp" && echo "[!!!]" || echo "[ - ]"); echo "  $tag TROVATO  : $imp  (data: $(file_mtime_str "$imp"))"; } || echo "  [   ] assente  : $imp"
    done
    for base in "${MC_BASE_DIRS[@]}"; do
        modsdir="$base/mods"; [ -d "$modsdir" ] || continue
        find "$modsdir" \( -iname "*nGameAccountSwitcher*" -o -iname "*ias-*" \) 2>/dev/null | while read -r f; do
            tag=$(file_in_range "$f" && echo "[!!!]" || echo "[ - ]")
            echo "  $tag IGAS MOD .jar : $(basename "$f")  (data: $(file_mtime_str "$f"))"
        done
    done
} >> "$OUT_14A"

# [14b] Account extraction (Python inline parser)
OUT_14B="$ROOT/14_Minecraft/14b_Account_Estratti_$TS.txt"
write_header "$OUT_14B" "MINECRAFT [14b] - EXTRACTED ACCOUNTS" ""
ALL_ACCOUNTS=(); SEEN_ACC_KEYS=()

PARSE_ACC='
import sys, json
def parse_accounts(path):
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f: data = json.load(f)
    except: return []
    results, seen = [], set()
    def add(n, u="", t="?", o="?"):
        if n and (n,u) not in seen: seen.add((n,u)); results.append({"name":n,"uuid":u,"type":t,"online":str(o)})
    if isinstance(data, dict) and "authenticationDatabase" in data:
        for uid, val in data["authenticationDatabase"].items():
            n = val.get("displayName") or val.get("username")
            if n: add(n, uid, "Mojang-old")
    if isinstance(data, dict) and isinstance(data.get("accounts"), list):
        for a in data["accounts"]:
            mp = a.get("minecraftProfile") or {}
            n = mp.get("name") or a.get("displayName") or a.get("name") or a.get("username")
            if n: add(n, mp.get("id") or a.get("uuid",""), a.get("type","?"))
    if isinstance(data, dict) and isinstance(data.get("accounts"), dict):
        for uid, val in data["accounts"].items():
            n = val.get("username") or val.get("name")
            if n: add(n, uid, "Modrinth", val.get("active","?"))
    arr = data if isinstance(data, list) else (data.get("accounts") if isinstance(data.get("accounts"), list) else None)
    if arr:
        for a in arr:
            if isinstance(a, dict): n = a.get("name") or a.get("username")
            else: continue
            if n: add(n, a.get("uuid",""), a.get("type","IAS"), a.get("online","?"))
    return results
for path in sys.argv[1:]:
    for a in parse_accounts(path): print(f"{a[\"name\"]}\t{a[\"uuid\"]}\t{a[\"type\"]}\t{a[\"online\"]}")
'

{
    for entry in "${FOUND_LAUNCHERS[@]:-}"; do
        lname="${entry%%|*}"; rest="${entry#*|}"; lroot="${rest%%|*}"; acc_files="${rest#*|}"
        launcher_accs=()
        for af in $acc_files; do
            fp="$lroot/$af"; [ -f "$fp" ] || continue
            while IFS=$'\t' read -r name uuid atype online; do
                local_key="${name}|${uuid}"
                already=false
                for k in "${SEEN_ACC_KEYS[@]:-}"; do [ "$k" = "$local_key" ] && already=true && break; done
                if ! $already; then SEEN_ACC_KEYS+=("$local_key"); ALL_ACCOUNTS+=("${name}|${uuid}|${atype}|${online}|${lname}"); launcher_accs+=("${name}|${uuid}|${atype}|${online}"); fi
            done < <(python3 -c "$PARSE_ACC" "$fp" 2>/dev/null)
        done
        if [ ${#launcher_accs[@]} -gt 0 ]; then
            echo ""; echo "  ----------------------------------------------------------------"; echo "  LAUNCHER : $lname   ($lroot)"; echo "  ----------------------------------------------------------------"
            for acc in "${launcher_accs[@]}"; do
                n="${acc%%|*}"; rest="${acc#*|}"; u="${rest%%|*}"; rest="${rest#*|}"; t="${rest%%|*}"; ol="${rest#*|}"
                printf '  [ACC] %-24s  UUID: %-36s  Type: %-12s  Online: %s\n' "$n" "$u" "$t" "$ol"
            done
        fi
    done

    echo ""; echo "  ----------------------------------------------------------------"; echo "  IGAS STANDALONE + MOD"; echo "  ----------------------------------------------------------------"
    igas_found=false; igas_jsons=()
    for ir in "${IGAS_STANDALONE_ROOTS[@]}"; do
        [ -d "$ir" ] || continue
        while IFS= read -r f; do [ -f "$f" ] && igas_jsons+=("$f"); done < <(find "$ir" \( -name "accounts.json" -o -name "users.json" -o -name "ias.json" \) 2>/dev/null)
    done
    for imp in "${IGAS_MOD_PATHS[@]}"; do [ -f "$imp" ] && igas_jsons+=("$imp"); done
    for f in "${igas_jsons[@]:-}"; do
        while IFS=$'\t' read -r name uuid atype online; do
            printf '  [IAS] %-24s  UUID: %s  Online: %s  (from: %s)\n' "$name" "$uuid" "$online" "$f"
            igas_found=true
        done < <(python3 -c "$PARSE_ACC" "$f" 2>/dev/null)
    done
    $igas_found || echo "  [--] Nessun account IGAS trovato."

    echo ""; echo "  ================================================================"
    ACC_COUNT=${#ALL_ACCOUNTS[@]}
    echo "  TOTALE ACCOUNT UNIVOCI TROVATI: $ACC_COUNT"
    if [ "$ACC_COUNT" -gt 1 ]; then
        echo "  [!!!] PIU' DI 1 ACCOUNT - VERIFICARE MULTIACCOUNTING"
        echo ""; echo "  Riepilogo account:"
        for acc in "${ALL_ACCOUNTS[@]}"; do n="${acc%%|*}"; rest="${acc#*|}"; rest="${rest#*|}"; rest="${rest#*|}"; rest="${rest#*|}"; lname="${rest}"; printf '    -> %-24s  [%s]\n' "$n" "$lname"; done
    fi
    echo "  ================================================================"
} >> "$OUT_14B"

# [14d] Log analysis
OUT_14D="$ROOT/14_Minecraft/14d_Log_CambioAccount_$TS.txt"
write_header "$OUT_14D" "MINECRAFT [14d] - ACCOUNT SWITCH LOG" ""
IAS_LOG_ENTRIES=()

PARSE_LOG='
import sys, re, gzip
def scan_log(path, label):
    try:
        f = gzip.open(path,"rt",encoding="utf-8",errors="ignore") if path.endswith(".gz") else open(path,"r",encoding="utf-8",errors="ignore")
    except: return
    in_block=False; blk_time=blk_name=blk_uuid=blk_online=""; blk_raw=[]
    re_req = re.compile(r"IAS:.*Received login request.*name=\x27([^\x27]+)\x27.*uuid=([\w\-]+).*online=(true|false)", re.I)
    re_time = re.compile(r"^\[(\d{2}:\d{2}:\d{2})\]")
    for line in f:
        ls = line.strip()
        m = re_req.search(ls)
        if m:
            in_block=True; mt=re_time.match(ls)
            blk_time=mt.group(1) if mt else "?"; blk_name=m.group(1); blk_uuid=m.group(2); blk_online=m.group(3); blk_raw=[ls]; continue
        if in_block:
            if "IAS:" in ls: blk_raw.append(ls)
            if "Flushed user" in ls:
                print(f"BLOCK\t{blk_time}\t{blk_name}\t{blk_uuid}\t{blk_online}\t{label}\t{path}")
                for r in blk_raw: print(f"RAW\t{r}")
                print("ENDBLOCK"); in_block=False; blk_raw=[]
        if any(w in ls for w in ["Setting user","Logging in with","Authenticated as","Username:","Refreshing token"]): print(f"AUTH\t{ls}")
        if any(w in ls for w in ["sessionserver.mojang.com","api.minecraftservices.com","minecraft.net/authenticate","auth.mojang.com","modrinth.com/auth"]): print(f"NET\t{ls}")
    f.close()
if __name__=="__main__": scan_log(sys.argv[1], sys.argv[2])
'

scan_log_wrapper() {
    local f="$1" lname="$2"
    while IFS=$'\t' read -r type a1 a2 a3 a4 a5 a6; do
        case "$type" in
            BLOCK) IAS_LOG_ENTRIES+=("$a1|$a2|$a3|$a4|$a5|$a6")
                { echo ""; echo "  +----------------------------------------------------------+"; echo "  | [IAS] CAMBIO ACCOUNT"; echo "  |  Orario  : $a1"; echo "  |  Nome    : $a2"; echo "  |  UUID    : $a3"; echo "  |  Online  : $a4$([ "$a4" = "false" ] && echo " <- OFFLINE/CRACKED" || true)"; echo "  |  Launcher: $a5"; echo "  |  Log     : $a6"; echo "  +----------------------------------------------------------+"; } >> "$OUT_14D" ;;
            RAW) echo "  |  $a1" >> "$OUT_14D" ;;
            ENDBLOCK) echo "  +----------------------------------------------------------+" >> "$OUT_14D" ;;
            AUTH) echo "  [AUTH] $a1" >> "$OUT_14D" ;;
            NET)  echo "  [NET]  $a1" >> "$OUT_14D" ;;
        esac
    done < <(python3 -c "$PARSE_LOG" "$f" "$lname" 2>/dev/null)
}

{
    echo "  ---- Scansione dei log di tutti i launcher trovati ----"; echo ""
} >> "$OUT_14D"

for entry in "${FOUND_LAUNCHERS[@]:-}"; do
    lname="${entry%%|*}"; rest="${entry#*|}"; lroot="${rest%%|*}"; log_dirs="${rest#*|}"
    for ld in $log_dirs; do
        logdir="$lroot/$ld"; [ -d "$logdir" ] || continue
        # Process substitution (not a pipe): scan_log_wrapper appends to the
        # global IAS_LOG_ENTRIES array, and a pipe would run this loop body in
        # a subshell, silently discarding every switch found in launcher logs
        # (only the plain .minecraft/logs/latest.log loop below would count).
        while read -r f; do
            file_in_range "$f" || [ "$(basename "$f")" = "latest.log" ] && scan_log_wrapper "$f" "$lname"
        done < <(find "$logdir" -type f \( -name "*.log" -o -name "*.log.gz" \) 2>/dev/null)
    done
done

for base in "${MC_BASE_DIRS[@]}"; do
    lf="$base/logs/latest.log"
    [ -f "$lf" ] && { scan_log_wrapper "$lf" "Mojang (.minecraft)"; cp "$lf" "$ROOT/14_Minecraft/latest_log_copy_$TS.txt" 2>/dev/null; }
done

{
    echo ""; echo "  ================================================================"; echo "  RIEPILOGO LOG"; echo "  Cambi account IAS totali: ${#IAS_LOG_ENTRIES[@]}"
    [ ${#IAS_LOG_ENTRIES[@]} -gt 1 ] && echo "  [!!!] ${#IAS_LOG_ENTRIES[@]} cambi account rilevati - MULTIACCOUNTING"
    echo "  ================================================================"
} >> "$OUT_14D"

# [14e] Usercache
OUT_14E="$ROOT/14_Minecraft/14e_Usercache_$TS.txt"
write_header "$OUT_14E" "MINECRAFT [14e] - USERCACHE" ""
{
    SEEN_UC=()
    for entry in "${FOUND_LAUNCHERS[@]:-}"; do
        lroot="${entry#*|}"; lroot="${lroot%%|*}"
        ucf="$lroot/usercache.json"; [ -f "$ucf" ] || continue
        already=false; for s in "${SEEN_UC[@]:-}"; do [ "$s" = "$ucf" ] && already=true && break; done; $already && continue; SEEN_UC+=("$ucf")
        echo ""; echo "  ---- $ucf ----"; echo "  Data modifica: $(file_mtime_str "$ucf")"
        python3 - "$ucf" <<'PYEOF'
import sys, json
try:
    with open(sys.argv[1], encoding="utf-8", errors="ignore") as f: data = json.load(f)
    print(f"  Voci totali: {len(data)}")
    if len(data) > 1: print("  [NB] Piu' username = piu' account o giocatori visti sui server")
    print()
    for e in data: print(f"  [USR] {e.get('name','?'):<24}  UUID: {e.get('uuid','?')}  Scadenza: {e.get('expiresOn','N/A')}")
except Exception as ex: print(f"  [ERR] Errore di parsing: {ex}")
PYEOF
    done
    for base in "${MC_BASE_DIRS[@]}"; do
        ucf="$base/usercache.json"; [ -f "$ucf" ] || continue
        already=false; for s in "${SEEN_UC[@]:-}"; do [ "$s" = "$ucf" ] && already=true && break; done; $already && continue; SEEN_UC+=("$ucf")
        echo ""; echo "  ---- $ucf ----"
        python3 - "$ucf" <<'PYEOF'
import sys, json
try:
    with open(sys.argv[1], encoding="utf-8", errors="ignore") as f: data = json.load(f)
    for e in data: print(f"  [USR] {e.get('name','?'):<24}  UUID: {e.get('uuid','?')}  Scadenza: {e.get('expiresOn','N/A')}")
except Exception as ex: print(f"  [ERR] {ex}")
PYEOF
    done
} >> "$OUT_14E"

# [14f] Crash reports + mods
OUT_14F="$ROOT/14_Minecraft/14f_Crash_Mods_$TS.txt"
write_header "$OUT_14F" "MINECRAFT [14f] - CRASH REPORTS + MODS" ""
{
    echo "  ---- CRASH REPORT ----"
    for entry in "${FOUND_LAUNCHERS[@]:-}"; do
        lroot="${entry#*|}"; lroot="${lroot%%|*}"; cdir="$lroot/crash-reports"; [ -d "$cdir" ] || continue
        find "$cdir" -name "*.txt" 2>/dev/null | while read -r f; do
            file_in_range "$f" && { echo "  [CRS] $(file_mtime_str "$f")  |  $(basename "$f")"; grep -m1 '^Description:' "$f" 2>/dev/null || true; }
        done
    done
    echo ""; echo "  ---- MOD INSTALLATI ----"
    for entry in "${FOUND_LAUNCHERS[@]:-}"; do
        lname="${entry%%|*}"; rest="${entry#*|}"; lroot="${rest%%|*}"
        modsdir="$lroot/mods"; [ -d "$modsdir" ] || continue
        echo ""; echo "  LAUNCHER: $lname  ($modsdir)"
        find "$modsdir" -name "*.jar" 2>/dev/null | sort | while read -r f; do
            tag=$(file_in_range "$f" && echo "[NEW]" || echo "[ - ]")
            echo "  $tag  $(basename "$f")  ($(file_mtime_str "$f"))"
        done
    done
} >> "$OUT_14F"

# [14g] Server history
OUT_14G="$ROOT/14_Minecraft/14g_ServerHistory_$TS.txt"
write_header "$OUT_14G" "MINECRAFT [14g] - SERVER HISTORY (servers.dat)" ""
{
    for entry in "${FOUND_LAUNCHERS[@]:-}"; do
        lname="${entry%%|*}"; rest="${entry#*|}"; lroot="${rest%%|*}"; sdat="$lroot/servers.dat"; [ -f "$sdat" ] || continue
        echo "  LAUNCHER: $lname  ($sdat)"
        python3 - "$sdat" <<'PYEOF'
import sys, re
try:
    with open(sys.argv[1], "rb") as f: text = f.read().decode("utf-8", errors="ignore")
    for ip in set(re.findall(r'(?i)[a-z0-9.-]+\.[a-z]{2,}(?::[0-9]+)?', text)):
        if not any(w in ip.lower() for w in ['lwjgl','minecraft','mojang','oracle','microsoft','sun','java']):
            print(f"    -> IP / Server: {ip}")
except: print("    [ERR] Errore di parsing di servers.dat")
PYEOF
    done
} >> "$OUT_14G"

# [14h] Chat keywords
OUT_14H="$ROOT/14_Minecraft/14h_ChatKeywords_$TS.txt"
write_header "$OUT_14H" "MINECRAFT [14h] - SUSPICIOUS CHAT / LOG LINES" ""
{
    kw="cheat|hack|autoclicker|doomsday|vape|reach|velocity|killaura|alt|multiacc|ban|screenshare|bypass"
    for entry in "${FOUND_LAUNCHERS[@]:-}"; do
        lname="${entry%%|*}"; rest="${entry#*|}"; lroot="${rest%%|*}"
        logdir="$lroot/logs"; [ -d "$logdir" ] || continue
        echo "  LAUNCHER: $lname  ($logdir)"
        find "$logdir" -name "*.log" -type f 2>/dev/null | while read -r lf; do
            file_in_range "$lf" || continue
            grep -im100 "$kw" "$lf" 2>/dev/null | while IFS= read -r line; do echo "  [$(basename "$lf")] $line"; done
        done
    done
} >> "$OUT_14H"

# [14i] Hidden mods
OUT_14I="$ROOT/14_Minecraft/14i_HiddenMods_$TS.txt"
write_header "$OUT_14I" "MINECRAFT [14i] - HIDDEN MOD JARS" ""
{
    hidden_count=0
    for entry in "${FOUND_LAUNCHERS[@]:-}"; do
        lname="${entry%%|*}"; rest="${entry#*|}"; lroot="${rest%%|*}"
        modsdir="$lroot/mods"; [ -d "$modsdir" ] || continue
        # Process substitution (not a pipe) so hidden_count survives the loop.
        while read -r f; do
            echo "  [!!!] File nascosto: $(basename "$f")  |  Modifica: $(file_mtime_str "$f")  |  Percorso: $f"
            hidden_count=$((hidden_count+1))
        done < <(find "$modsdir" -name ".*.jar" -type f 2>/dev/null)
    done
    [ "${hidden_count:-0}" -eq 0 ] && echo "  [OK] Nessun file .jar nascosto trovato nelle cartelle mods."
} >> "$OUT_14I"

# [14j] AnyDesk
OUT_14J="$ROOT/15_Misc/AnyDeskLogs_$TS.txt"
write_header "$OUT_14J" "MISC [14j] - ANYDESK SESSION / FILE TRANSFER" ""
{
    ad_hits=0
    ad_paths=()
    if [ "$OS" = "macos" ]; then ad_paths+=("$HOME/.anydesk/anydesk.trace" "/var/log/anydesk.trace")
    else ad_paths+=("$HOME/.anydesk/anydesk.trace" "/var/log/anydesk.trace"); fi
    for u in "${USER_HOMES[@]:-}"; do [ -d "$u/.anydesk" ] && ad_paths+=("$u/.anydesk/anydesk.trace"); done
    for ap in "${ad_paths[@]}"; do
        [ -f "$ap" ] || continue
        echo "  FILE LOG: $ap"
        # Process substitution (not a pipe) so ad_hits survives the loop.
        while IFS= read -r line; do echo "  [!!!] $line"; ad_hits=$((ad_hits+1)); done < <(grep -iE 'file_transfer|file transfer|app.prepare_transfer|incoming|connected from|files received' "$ap" 2>/dev/null)
    done
    [ "${ad_hits:-0}" -eq 0 ] && echo "  [OK] Nessuna traccia di trasferimento file o connessione sospetta nei log AnyDesk."
} >> "$OUT_14J"

show_step "MINECRAFT" "Completato. File: 14a-14j." "green"
}

# ==============================================================================
#  MODULE: MISC (15)
# ==============================================================================
run_misc() {
show_step "MISC" "Core dump, cronologia shell, utenti, log eventi..." "cyan"

OUT_CRASH="$ROOT/15_Misc/CrashDumps_$TS.txt"
write_header "$OUT_CRASH" "MISC [15a] - CRASH DUMPS" "/cores, /var/crash, core dumps"
{
    CORE_DIRS=()
    [ "$OS" = "macos" ] && CORE_DIRS+=("/cores") || CORE_DIRS+=("/var/crash" "/var/log/crash" "/tmp")
    for cd in "${CORE_DIRS[@]}"; do
        [ -d "$cd" ] || continue
        find "$cd" \( -name "core*" -o -name "*.crash" -o -name "*.dmp" \) 2>/dev/null | while read -r f; do
            file_in_range "$f" && echo "  [DMP] $(file_mtime_str "$f")  |  $(basename "$f")"
        done
    done
    [ "$OS" = "linux" ] && command -v coredumpctl &>/dev/null && coredumpctl list 2>/dev/null | tail -20 | while IFS= read -r line; do echo "  [CORE] $line"; done
} >> "$OUT_CRASH"

OUT_HIST="$ROOT/15_Misc/ShellHistory_$TS.txt"
write_header "$OUT_HIST" "MISC [15b] - SHELL HISTORY" "bash/zsh/fish history"
{
    for u in "${USER_HOMES[@]:-}"; do
        [ -d "$u" ] || continue
        for hf in "$u/.bash_history" "$u/.zsh_history" "$u/.ash_history" "$u/.sh_history" "$u/.history" "$u/.local/share/fish/fish_history"; do
            [ -f "$hf" ] || continue
            echo "  ---- $hf ----"
            echo "  === RIGHE SOSPETTE ==="
            grep -iE 'creationtime|lastwritetime|chattr|chmod.*777|fsutil|usn|icacls|cacls|attrib|rm -rf|shred|wipe|cleanup' "$hf" 2>/dev/null | while IFS= read -r line; do echo "  [!!!] $line"; done
        done
    done
} >> "$OUT_HIST"

OUT_USR="$ROOT/15_Misc/Utenti_$TS.txt"
write_header "$OUT_USR" "MISC [15c] - SYSTEM USERS" "passwd / dscacheutil"
{
    if [ "$OS" = "macos" ]; then
        dscacheutil -q user 2>/dev/null | grep -E 'name:|uid:|gid:|home:' | while IFS= read -r line; do echo "  [USR] $line"; done
    else
        while IFS=: read -r name _ uid gid _ home shell; do
            [ "$uid" -ge 1000 ] 2>/dev/null || [ "$uid" -eq 0 ] 2>/dev/null || continue
            printf '  [USR] %-20s | UID: %-6s | GID: %-6s | Home: %s\n' "$name" "$uid" "$gid" "$home"
        done < /etc/passwd
    fi
} >> "$OUT_USR"

OUT_EVLOG="$ROOT/15_Misc/EventLog_$TS.txt"
write_header "$OUT_EVLOG" "MISC [15d-15g] - EVENT LOG EQUIVALENTS" "auth.log / secure / journald"
{
    if [ "$OS" = "macos" ]; then
        echo "  ---- Log unificato macOS - eventi di autenticazione ----"
        SINCE_LOG2=$(date -v "-${DAYS}d" '+%Y-%m-%d %H:%M:%S' 2>/dev/null || echo "")
        [ -n "$SINCE_LOG2" ] && log show --start "$SINCE_LOG2" --predicate 'category == "authentication"' --style syslog --no-pager 2>/dev/null | head -100
    else
        echo "  ---- Eventi di autenticazione journald ----"
        command -v journalctl &>/dev/null && journalctl --since "$(date -d "@$DATE_LIMIT_EPOCH" '+%Y-%m-%d %H:%M:%S' 2>/dev/null)" -u sshd -u sudo --no-pager -q 2>/dev/null | head -100
        for logf in /var/log/auth.log /var/log/secure; do
            [ -f "$logf" ] || continue; echo ""; echo "  ---- $logf ----"; tail -100 "$logf"
        done
    fi
} >> "$OUT_EVLOG"

show_step "MISC" "Completato." "green"
}

# ==============================================================================
#  MODULE: SYSTEM INFO (16)
# ==============================================================================
run_system_info() {
show_step "SYSTEM INFO" "Rilevamento VM, VPN, hardware..." "cyan"

OUT_SYS="$ROOT/16_SystemInfo/System_$TS.txt"
write_header "$OUT_SYS" "SYSTEM INFO [16] - VM / VPN / HARDWARE" ""

IS_VM=false; VM_INFO=""
{
    echo "  ---- MACCHINA VIRTUALE ----"
    if [ "$OS" = "macos" ]; then
        hw_model=$(sysctl -n hw.model 2>/dev/null || echo "?")
        if echo "$hw_model" | grep -qiE 'VMware|VirtualBox|Parallels|QEMU|HVM'; then IS_VM=true; VM_INFO="$hw_model"; echo "  [!!!] AMBIENTE VIRTUALE RILEVATO: $hw_model"
        else echo "  [OK]  Hardware fisico: $hw_model"; fi
    else
        if command -v systemd-detect-virt &>/dev/null; then
            virt=$(systemd-detect-virt 2>/dev/null || echo "none")
            if [ "$virt" != "none" ] && [ -n "$virt" ]; then IS_VM=true; VM_INFO="$virt"; echo "  [!!!] AMBIENTE VIRTUALE RILEVATO: $virt"
            else echo "  [OK]  Hardware fisico (systemd-detect-virt: none)"; fi
        fi
        if ! $IS_VM && [ -f /proc/cpuinfo ] && grep -qiE 'hypervisor|VMware|VirtualBox|QEMU|Xen|KVM' /proc/cpuinfo 2>/dev/null; then
            IS_VM=true; VM_INFO=$(grep -iE 'hypervisor|VMware|VirtualBox|QEMU|Xen|KVM' /proc/cpuinfo | head -1)
            echo "  [!!!] AMBIENTE VIRTUALE (/proc/cpuinfo): $VM_INFO"
        fi
        $IS_VM || echo "  [OK]  Hardware fisico."
    fi

    echo ""; echo "  ---- VPN ATTIVA ----"
    VPN_FOUND=false
    # Process substitution (not a pipe) so VPN_FOUND survives the loop.
    if [ "$OS" = "macos" ]; then
        while IFS= read -r line; do echo "  [!!!] VPN/TUNNEL: $line"; VPN_FOUND=true; done < <(ifconfig 2>/dev/null | grep -E '^utun|^ppp|^tap|^tun')
    else
        while IFS= read -r line; do echo "  [!!!] VPN/TUNNEL: $line"; VPN_FOUND=true; done < <(ip link show 2>/dev/null | grep -E 'tun[0-9]|tap[0-9]|wg[0-9]|ppp[0-9]|vpn|proton|nord')
    fi
    $VPN_FOUND || echo "  [OK]  Nessuna interfaccia VPN rilevata."

    echo ""; echo "  ---- HARDWARE ----"
    if [ "$OS" = "macos" ]; then
        echo "  CPU   : $(sysctl -n machdep.cpu.brand_string 2>/dev/null)"
        echo "  RAM   : $(($(sysctl -n hw.memsize 2>/dev/null || echo 0) / 1024 / 1024 / 1024)) GB"
        echo "  GPU   : $(system_profiler SPDisplaysDataType 2>/dev/null | grep 'Chipset Model:' | head -1 | awk -F': ' '{print $2}')"
        echo "  Modello: $(sysctl -n hw.model 2>/dev/null)"
    else
        echo "  CPU   : $(grep 'model name' /proc/cpuinfo 2>/dev/null | head -1 | awk -F': ' '{print $2}' | xargs)"
        RAM_GB=$(python3 -c "
try:
    with open('/proc/meminfo') as f:
        for line in f:
            if 'MemTotal' in line: print(int(line.split()[1]) // 1024 // 1024); break
except: print('?')
" 2>/dev/null || echo "?")
        echo "  RAM   : $RAM_GB GB"
        command -v lspci &>/dev/null && echo "  GPU   : $(lspci 2>/dev/null | grep -iE 'VGA|3D|Display' | head -1)"
    fi
    echo "  OS    : $SYS_NAME (Build $SYS_BUILD)"
} >> "$OUT_SYS"

echo "IS_VM=\"$IS_VM\"" > "$ROOT/sysinfo_vars.txt"
echo "VM_INFO=\"$VM_INFO\"" >> "$ROOT/sysinfo_vars.txt"
echo "VPN_ACTIVE=\"$VPN_FOUND\"" >> "$ROOT/sysinfo_vars.txt"

show_step "SYSTEM INFO" "Completato." "green"
}

# ==============================================================================
#  MODULE: NETWORK (17)
# ==============================================================================
run_network() {
show_step "NETWORK" "Connessioni TCP, file hosts, cache DNS..." "cyan"

OUT_NET="$ROOT/17_Network/Network_$TS.txt"
write_header "$OUT_NET" "NETWORK [17] - CONNECTIONS AND DNS" ""
{
    echo "  ---- CONNESSIONI TCP ATTIVE ----"
    if $HAS_SS; then ss -tnp 2>/dev/null | tail -n +2 | while IFS= read -r line; do echo "  [TCP] $line"; done
    elif $HAS_NETSTAT; then netstat -tnp 2>/dev/null | grep ESTABLISHED | while IFS= read -r line; do echo "  [TCP] $line"; done
    elif $HAS_LSOF; then lsof -i TCP -n -P 2>/dev/null | grep ESTABLISHED | while IFS= read -r line; do echo "  [TCP] $line"; done
    fi

    echo ""; echo "  ---- FILE HOSTS ----"
    grep -v '^#' /etc/hosts 2>/dev/null | grep -v '^[[:space:]]*$' | while IFS= read -r line; do echo "  [HST] $line"; done

    echo ""; echo "  ---- CACHE DNS ----"
    if [ "$OS" = "macos" ]; then
        dscacheutil -cachedump -entries all 2>/dev/null | head -100 | while IFS= read -r line; do echo "  [DNS] $line"; done
    else
        command -v resolvectl &>/dev/null && resolvectl statistics 2>/dev/null | while IFS= read -r line; do echo "  [DNS] $line"; done
    fi

    echo ""; echo "  ---- INTERFACCE DI RETE ----"
    if [ "$OS" = "macos" ]; then ifconfig 2>/dev/null | grep -E '^[a-z]|inet ' | while IFS= read -r line; do echo "  $line"; done
    else command -v ip &>/dev/null && ip addr show 2>/dev/null | while IFS= read -r line; do echo "  $line"; done; fi
} >> "$OUT_NET"

show_step "NETWORK" "Completato." "green"
}

# ==============================================================================
#  MODULE: CHEAT SELF-DESTRUCT (18)
# ==============================================================================
run_cheat_selfdestr() {
show_step "CHEAT SELFDESTR" "Rilevamento tracce client cheat..." "cyan"

OUT_CHEAT="$ROOT/15_Misc/CheatSelfDestruct_$TS.txt"
write_header "$OUT_CHEAT" "MODULE 18 - CHEAT SELF-DESTRUCT DETECTION" "Tracce di client cheat auto-eliminati"
CHEAT_ALERT_COUNT=0
> "$ROOT/cheat_alerts_tmp.txt"

{
    echo "================================================================"
    echo "  [18a] FILE .jar CHEAT - Scansione file system"
    echo "================================================================"
    found=0
    for drv in "${SEARCH_ROOTS[@]}"; do
        [ -d "$drv" ] || continue
        find "$drv" -maxdepth 10 "${EXCLUDE_PRUNE[@]}" -o \( -name "*.jar" -print \) 2>/dev/null | grep -iE "$CHEAT_PAT" | while read -r f; do
            cname=$(get_cheat_name "$(basename "$f")")
            tag=$(file_in_range "$f" && echo "[!!!] NELL'INTERVALLO" || echo "[ - ] fuori intervallo")
            echo "  $tag  [$cname]  $f  ($(file_mtime_str "$f"))"
            echo "File .jar|$cname|$f" >> "$ROOT/cheat_alerts_tmp.txt"
        done
    done

    echo ""; echo "================================================================"
    echo "  [18b] CARTELLE / FILE CHEAT nei percorsi Minecraft"
    echo "================================================================"
    SEARCH_DIRS=("$HOME" "/tmp" "/var/tmp")
    for base in "${MC_BASE_DIRS[@]}"; do SEARCH_DIRS+=("$base/mods" "$base/config" "$base"); done
    for sd in "${SEARCH_DIRS[@]}"; do
        [ -d "$sd" ] || continue
        find "$sd" -maxdepth 4 "${EXCLUDE_PRUNE[@]}" -o -print 2>/dev/null | grep -iE "$CHEAT_PAT" | while read -r f; do
            cname=$(get_cheat_name "$(basename "$f")")
            is_empty=false; [ -d "$f" ] && [ -z "$(ls -A "$f" 2>/dev/null)" ] && is_empty=true
            empty_tag=$($is_empty && echo " [VUOTA - probabile autodistruzione]" || true)
            echo "  [!!!] [$cname]  $f  |  $(file_mtime_str "$f")$empty_tag"
            tipo="File/Cartella Cheat"; $is_empty && tipo="Cartella Fantasma"
            echo "$tipo|$cname|$f" >> "$ROOT/cheat_alerts_tmp.txt"
        done
    done

    echo ""; echo "================================================================"
    echo "  [18c] SCRIPT DI CLEANUP / AUTODISTRUZIONE"
    echo "================================================================"
    SCRIPT_DIRS=("/tmp" "/var/tmp" "$HOME" "$HOME/Desktop" "$HOME/Downloads")
    for sd in "${SCRIPT_DIRS[@]}"; do
        [ -d "$sd" ] || continue
        find "$sd" -maxdepth 3 "${EXCLUDE_PRUNE[@]}" -o \( -type f \( -name "*.sh" -o -name "*.py" -o -name "*.bash" \) -print \) 2>/dev/null | while read -r f; do
            file_in_range "$f" || continue
            content=$(cat "$f" 2>/dev/null || true)
            has_cheat=false; has_cleanup=false
            echo "$content" | grep -qiE "$CHEAT_PAT" && has_cheat=true
            echo "$content" | grep -qiE 'rm -rf|shred|wipe|cleanup|self.?destruct|srm' && has_cleanup=true
            ($has_cheat || $has_cleanup) || continue
            cname=$($has_cheat && get_cheat_name "$content" || echo "Script Cleanup")
            echo "  [!!!] Script sospetto [$cname]: $f  |  $(file_mtime_str "$f")"
            echo "Script Cleanup|$cname|$f" >> "$ROOT/cheat_alerts_tmp.txt"
        done
    done

    echo ""; echo "================================================================"
    echo "  [18d] TRACCE IN CRONOLOGIA - Comandi cheat"
    echo "================================================================"
    for u in "${USER_HOMES[@]:-}"; do
        [ -d "$u" ] || continue
        for hf in "$u/.bash_history" "$u/.zsh_history"; do
            [ -f "$hf" ] || continue
            grep -niE "$CHEAT_PAT" "$hf" 2>/dev/null | while IFS= read -r line; do
                cname=$(get_cheat_name "$line")
                echo "  [!!!] [$cname] $hf: $line"
                echo "Cronologia|$cname|$hf: $line" >> "$ROOT/cheat_alerts_tmp.txt"
            done
        done
    done

    echo ""; echo "================================================================"
    echo "  [18e] PROCESSI ATTIVI - Tracce cheat"
    echo "================================================================"
    if [ "$OS" = "linux" ]; then
        for pid in /proc/[0-9]*/cmdline; do
            cmd=$(tr '\0' ' ' < "$pid" 2>/dev/null || true)
            echo "$cmd" | grep -qiE "$CHEAT_PAT" && { cname=$(get_cheat_name "$cmd"); echo "  [!!!] PROCESSO ATTIVO [$cname]: $cmd"; echo "Processo|$cname|$cmd" >> "$ROOT/cheat_alerts_tmp.txt"; }
        done
    else
        ps aux 2>/dev/null | grep -iE "$CHEAT_PAT" | grep -v grep | while IFS= read -r line; do
            cname=$(get_cheat_name "$line"); echo "  [!!!] PROCESSO ATTIVO [$cname]: $line"
            echo "Processo|$cname|$line" >> "$ROOT/cheat_alerts_tmp.txt"
        done
    fi

    echo ""; echo "================================================================"
    echo "  [18f] ARGOMENTI JVM - javaagent/noverify sospetti"
    echo "================================================================"
    if [ "$OS" = "linux" ]; then
        for pid in /proc/[0-9]*/cmdline; do
            cmd=$(tr '\0' ' ' < "$pid" 2>/dev/null || true)
            echo "$cmd" | grep -qiE '-javaagent|-noverify|-XX:-UseSplitVerifier|-Xbootclasspath|org.lwjgl.librarypath' && {
                echo "  [!!!] ARGOMENTI JVM SOSPETTI: $cmd"
                echo "Argomenti JVM|Sconosciuto|$cmd" >> "$ROOT/cheat_alerts_tmp.txt"
            }
        done
    else
        ps aux 2>/dev/null | grep -iE '-javaagent|-noverify|-XX:-UseSplitVerifier|-Xbootclasspath|org.lwjgl.librarypath' | grep -v grep | while IFS= read -r line; do
            echo "  [!!!] ARGOMENTI JVM SOSPETTI: $line"
            echo "Argomenti JVM|Sconosciuto|$line" >> "$ROOT/cheat_alerts_tmp.txt"
        done
    fi

    echo ""; echo "================================================================"
    echo "  [18g] LIBRERIE NATIVE in Temp (.so / .dylib)"
    echo "================================================================"
    while IFS= read -r f; do
        [ -f "$f" ] || continue
        file_in_range "$f" && { echo "  [!!!] Libreria nativa recente in temp: $f  |  Modifica: $(file_mtime_str "$f")"; echo "DLL Temp|Possibile Injector / JNI|$f" >> "$ROOT/cheat_alerts_tmp.txt"; }
    done < <(find /tmp /var/tmp "$HOME/.cache" -type f \( -name "*.so" -o -name "*.dylib" \) 2>/dev/null)

    echo ""; echo "================================================================"
    echo "  [18h] CACHE DNS - Domini dei server cheat"
    echo "================================================================"
    DNS_DATA=""
    if [ "$OS" = "macos" ]; then DNS_DATA=$(dscacheutil -cachedump -entries all 2>/dev/null)
    else command -v resolvectl &>/dev/null && DNS_DATA=$(resolvectl statistics 2>/dev/null); fi
    if [ -n "$DNS_DATA" ]; then
        echo "$DNS_DATA" | grep -iE 'doomsdayclient.me|vape.gg|drip.gg|entropy.club|astolfo.lgbt|intent.store|riseclient.com|novoline.lol|cheat.gq|speas.cc' | while IFS= read -r line; do
            cname=$(get_cheat_name "$line")
            echo "  [!!!] Traccia cheat nella cache DNS: $line"
            echo "Cache DNS|$cname|$line" >> "$ROOT/cheat_alerts_tmp.txt"
        done
    fi

    echo ""; echo "================================================================"
    echo "  [18i] CRONOLOGIA BROWSER - Tracce di download cheat"
    echo "================================================================"
    while IFS=$'\t' read -r cname path; do
        [ -n "$cname" ] || continue
        echo "  [!!!] Cronologia browser ($cname): $path"
        echo "Cronologia Browser|$cname|$path" >> "$ROOT/cheat_alerts_tmp.txt"
    done < <(python3 - "$CHEAT_PAT" << 'EOF'
import sys, os, re, shutil, tempfile
re_cheat = re.compile(sys.argv[1], re.I)
home = os.path.expanduser("~")
bdirs = []
if sys.platform == "darwin":
    bdirs = [os.path.join(home,"Library/Application Support/Google/Chrome"),os.path.join(home,"Library/Application Support/BraveSoftware/Brave-Browser"),os.path.join(home,"Library/Application Support/Mozilla/Firefox/Profiles"),os.path.join(home,"Library/Application Support/Opera Software")]
else:
    bdirs = [os.path.join(home,".config/google-chrome"),os.path.join(home,".config/BraveSoftware/Brave-Browser"),os.path.join(home,".mozilla/firefox"),os.path.join(home,".config/opera")]
cheat_names = {"Doomsday":["doomsday","dday"],"Sigma":["sigma","sigma5"],"Wurst":["wurst"],"Meteor":["meteor-client","meteorclient"],"Vape":["vape"],"Ghost":["ghost-","ghostclient"],"LiquidBounce":["liquidbounce"],"Impact":["impact-"],"XRay":["xray"],"Inertia":["inertia"],"Future":["future-"]}
def get_name(text):
    for n,ps in cheat_names.items():
        for p in ps:
            if re.search(re.escape(p),text,re.I): return n
    return "Sconosciuto"
for bd in bdirs:
    if not os.path.exists(bd): continue
    for root, dirs, files in os.walk(bd):
        for fname in files:
            if fname in ("History","History.db","places.sqlite"):
                fp = os.path.join(root,fname)
                try:
                    fd,tp = tempfile.mkstemp(); os.close(fd); shutil.copy2(fp,tp)
                    with open(tp,"rb") as f: raw = f.read()
                    text = raw.decode("utf-8",errors="ignore")
                    if text and re_cheat.search(text): print(f"{get_name(text)}\t{fp}")
                except: pass
                finally:
                    try: os.remove(tp)
                    except: pass
EOF
)

    CHEAT_ALERT_COUNT=$(wc -l < "$ROOT/cheat_alerts_tmp.txt" | xargs)
    echo ""
    echo "================================================================"
    echo "  ALERT DI AUTODISTRUZIONE TOTALI: $CHEAT_ALERT_COUNT"
    echo "================================================================"
} >> "$OUT_CHEAT"

show_step "CHEAT SELFDESTR" "Completato. $CHEAT_ALERT_COUNT alert." "$([ "$CHEAT_ALERT_COUNT" -gt 0 ] && echo yellow || echo green)"
}

# ==============================================================================
#  MODULE: NICK SEARCH
# ==============================================================================
run_nick_search() {
show_step "NICK SEARCH" "Ricerca nickname nel file system..." "cyan"

GLOBAL_NICKS=()
SCAN_DIRS=("$HOME" "/tmp" "/var/tmp")

while IFS= read -r line; do
    [ -n "$line" ] && GLOBAL_NICKS+=("$line")
done < <(python3 - "${SCAN_DIRS[@]}" << 'EOF'
import sys, os, re, json, datetime
RE_VALID = re.compile(r"^[A-Za-z0-9_]{2,16}$")
RE_IN_FILE = re.compile(r'"(?:name|username|displayName|player)"\s*:\s*"([A-Za-z0-9_]{3,16})"')
results = []; seen = set()
def add(nick, fonte, path, data="", note=""):
    if not nick or not RE_VALID.match(nick): return
    k = (nick.lower(), fonte)
    if k not in seen: seen.add(k); results.append({"nick":nick,"fonte":fonte,"path":path,"data":data,"note":note})
for scan_dir in sys.argv[1:]:
    if not os.path.isdir(scan_dir): continue
    for root_dir, dirs, files in os.walk(scan_dir):
        dirs[:] = [d for d in dirs if d not in ("proc","sys","dev","run","boot","snap","flatpak","node_modules",".git",".cache",".cargo",".npm",".rustup",".gradle","Caches","Containers","Developer")]
        if len(root_dir) - len(scan_dir) > 60: dirs[:] = []; continue
        for fname in files:
            ext = os.path.splitext(fname)[1].lower()
            if ext not in (".json",".txt",".cfg",".properties",".yaml",".yml",".log"): continue
            fpath = os.path.join(root_dir, fname)
            try:
                sz = os.path.getsize(fpath)
                if sz > 512*1024: continue
                with open(fpath, "r", encoding="utf-8", errors="ignore") as f: content = f.read()
                mtime = datetime.datetime.fromtimestamp(os.path.getmtime(fpath)).strftime("%d/%m/%Y %H:%M:%S")
                for m in RE_IN_FILE.findall(content): add(m, f"File ({ext})", fpath, mtime)
            except: pass
for r in results: print(f"{r['nick']}\t{r['fonte']}\t{r['path']}\t{r['data']}\t{r['note']}")
EOF
)

# Append accounts already found
for acc in "${ALL_ACCOUNTS[@]:-}"; do
    n="${acc%%|*}"; rest="${acc#*|}"; u="${rest%%|*}"; rest="${rest#*|}"; t="${rest%%|*}"; rest="${rest#*|}"; ol="${rest%%|*}"; rest="${rest#*|}"; lname="${rest}"
    GLOBAL_NICKS+=("$n	Account JSON	$u	-	Launcher: $lname | UUID: $u | Online: $ol")
done

# Append IAS log entries
for entry in "${IAS_LOG_ENTRIES[@]:-}"; do
    t="${entry%%|*}"; rest="${entry#*|}"; n="${rest%%|*}"; rest="${rest#*|}"; u="${rest%%|*}"; rest="${rest#*|}"; ol="${rest%%|*}"; rest="${rest#*|}"; lname="${rest%%|*}"; rest="${rest#*|}"; lpath="${rest}"
    GLOBAL_NICKS+=("$n	Log IAS	$lpath	$t	UUID: $u | Online: $ol")
done

printf '%s\n' "${GLOBAL_NICKS[@]:-}" | sort -u > "$ROOT/nick_search_tmp.txt"
NICK_COUNT=$(wc -l < "$ROOT/nick_search_tmp.txt" | xargs)
show_step "NICK SEARCH" "Trovati $NICK_COUNT nickname univoci." "green"
}

# ==============================================================================
#  MAIN EXECUTION
# ==============================================================================
run_minecraft

NUM_CORES=$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || grep -c ^processor /proc/cpuinfo 2>/dev/null || echo 1)

if [ "$NUM_CORES" -gt 1 ]; then
    show_step "SISTEMA" "Modalita multi-core: $NUM_CORES core. Esecuzione moduli in parallelo..." "green"
    echo ""

    run_fs_events > "$ROOT/log_fs.txt" 2>&1 & PID_FS=$!
    run_sysinfo > "$ROOT/log_sysinfo.txt" 2>&1 & PID_SI=$!
    run_prefetch > "$ROOT/log_pf.txt" 2>&1 & PID_PF=$!
    run_macro > "$ROOT/log_macro.txt" 2>&1 & PID_MAC=$!
    run_misc > "$ROOT/log_misc.txt" 2>&1 & PID_MISC=$!
    run_system_info > "$ROOT/log_si.txt" 2>&1 & PID_SYS=$!
    run_network > "$ROOT/log_net.txt" 2>&1 & PID_NET=$!
    run_cheat_selfdestr > "$ROOT/log_cheat.txt" 2>&1 & PID_CHEAT=$!
    run_nick_search > "$ROOT/log_nick.txt" 2>&1 & PID_NICK=$!

    PIDS=($PID_FS $PID_SI $PID_PF $PID_MAC $PID_MISC $PID_SYS $PID_NET $PID_CHEAT $PID_NICK)
    NAMES=("FS EVENTS" "SYSINFO" "PREFETCH" "MACRO" "MISC" "SYSTEM INFO" "NETWORK" "CHEAT SELFDESTR" "NICK SEARCH")
    STATUS=(); for i in "${!PIDS[@]}"; do STATUS+=("RUNNING"); done
    COLORS=(); for i in "${!PIDS[@]}"; do COLORS+=("36"); done

    for i in "${!PIDS[@]}"; do printf "    \033[%sm[%-11s]\033[0m %s\n" "${COLORS[$i]}" "${STATUS[$i]}" "${NAMES[$i]}"; done

    while true; do
        all_done=true
        for i in "${!PIDS[@]}"; do
            if kill -0 "${PIDS[$i]}" 2>/dev/null; then all_done=false
            elif [ "${STATUS[$i]}" = "RUNNING" ]; then
                wait "${PIDS[$i]}" 2>/dev/null
                [ $? -eq 0 ] && { STATUS[$i]="DONE"; COLORS[$i]="32"; } || { STATUS[$i]="ERROR"; COLORS[$i]="31"; }
            fi
        done
        $all_done && break
        [ -t 1 ] && { printf "\033[%dA" "${#PIDS[@]}"; for i in "${!PIDS[@]}"; do printf "    \033[%sm[%-11s]\033[0m %s\033[K\n" "${COLORS[$i]}" "${STATUS[$i]}" "${NAMES[$i]}"; done; }
        sleep 0.3
    done

    [ -t 1 ] && { printf "\033[%dA" "${#PIDS[@]}"; for i in "${!PIDS[@]}"; do printf "    \033[%sm[%-11s]\033[0m %s\033[K\n" "${COLORS[$i]}" "${STATUS[$i]}" "${NAMES[$i]}"; done; }
    echo ""
    show_step "SISTEMA" "Tutti i moduli paralleli completati." "green"
else
    show_step "SISTEMA" "Modalita single-core. Esecuzione sequenziale..." "yellow"
    run_fs_events; run_sysinfo; run_prefetch; run_macro; run_misc; run_system_info; run_network; run_cheat_selfdestr; run_nick_search
fi

# Restore variables
[ -f "$ROOT/sysinfo_vars.txt" ] && . "$ROOT/sysinfo_vars.txt" && rm -f "$ROOT/sysinfo_vars.txt"
GLOBAL_NICKS=()
[ -f "$ROOT/nick_search_tmp.txt" ] && while IFS= read -r line; do [ -n "$line" ] && GLOBAL_NICKS+=("$line"); done < "$ROOT/nick_search_tmp.txt"
NICK_COUNT=${#GLOBAL_NICKS[@]}
CHEAT_ALERT_COUNT=$(wc -l < "$ROOT/cheat_alerts_tmp.txt" 2>/dev/null | xargs || echo 0)

# ==============================================================================
#  DASHBOARD GENERATION
# ==============================================================================
show_step "DASHBOARD" "Generazione HTML..." "cyan"
DASH_PATH="$ROOT/DASHBOARD_$TS.html"

# Dump the in-memory arrays to plain delimited temp files and let the Python
# side parse them directly (str.split with maxsplit, see below). Earlier this
# hand-built JSON strings in bash, escaping only double quotes - any backslash,
# stray quote-adjacent character, or control byte coming from real scan data
# (a command line, a script's contents, a browser history entry...) could
# produce invalid JSON and make json.loads() blow up, silently killing the
# whole dashboard generation. Plain delimited text + str.split is robust to
# all of that and needs no escaping at all on the bash side.
ACCOUNTS_TMP="$ROOT/accounts_tmp.txt"; : > "$ACCOUNTS_TMP"
for acc in "${ALL_ACCOUNTS[@]:-}"; do [ -n "$acc" ] && echo "$acc" >> "$ACCOUNTS_TMP"; done

IAS_TMP="$ROOT/ias_tmp.txt"; : > "$IAS_TMP"
for entry in "${IAS_LOG_ENTRIES[@]:-}"; do [ -n "$entry" ] && echo "$entry" >> "$IAS_TMP"; done

NICK_TMP="$ROOT/nick_search_tmp.txt"
CHEAT_TMP="$ROOT/cheat_alerts_tmp.txt"

export OS_NAME="$OS" DISTRO HOSTNAME="$(hostname 2>/dev/null || echo '?')" SYS_NAME SYS_BUILD DAYS \
       DATE_LIMIT_STR TS ROOT NICK_COUNT CHEAT_ALERT_COUNT DASH_PATH \
       ACCOUNTS_TMP IAS_TMP NICK_TMP CHEAT_TMP \
       IS_VM="${IS_VM:-false}" VM_INFO="${VM_INFO:-}" VPN_ACTIVE="${VPN_ACTIVE:-false}"

python3 << 'PYEOF'
import html as h, os
from collections import Counter
from itertools import groupby as gby

def he(s): return h.escape(str(s) if s else "")

def read_delim(path, sep, n_fields):
    """Read a delimited temp file, one record per line, splitting with
    maxsplit so the last field keeps any extra separator characters that
    happen to appear in free-text content (file paths, command lines, log
    lines...). Returns [] if the file is missing or empty."""
    rows = []
    if not path or not os.path.isfile(path):
        return rows
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        for line in f:
            line = line.rstrip("\n")
            if not line:
                continue
            parts = line.split(sep, n_fields - 1)
            if len(parts) < n_fields:
                parts += [""] * (n_fields - len(parts))
            rows.append(parts)
    return rows

accounts = [dict(zip(("name", "uuid", "type", "online", "launcher"), r))
            for r in read_delim(os.environ.get("ACCOUNTS_TMP"), "|", 5)]
ias = [dict(zip(("time", "name", "uuid", "online", "launcher", "logpath"), r))
       for r in read_delim(os.environ.get("IAS_TMP"), "|", 6)]
nicks = [dict(zip(("nick", "fonte", "path", "data", "note"), r))
         for r in read_delim(os.environ.get("NICK_TMP"), "\t", 5)]
cheat_alerts = [dict(zip(("tipo", "cheat", "dettaglio"), r))
                for r in read_delim(os.environ.get("CHEAT_TMP"), "|", 3)]

os_name = os.environ.get("OS_NAME", "unknown")
distro = os.environ.get("DISTRO", "")
sys_name = os.environ.get("SYS_NAME", "")
sys_build = os.environ.get("SYS_BUILD", "")
days = int(os.environ.get("DAYS", "0") or "0")
date_limit = os.environ.get("DATE_LIMIT_STR", "")
ts = os.environ.get("TS", "")
root_dir = os.environ.get("ROOT", "/tmp")
nick_count = int(os.environ.get("NICK_COUNT", "0") or "0")
cheat_count = int(os.environ.get("CHEAT_ALERT_COUNT", "0") or "0")
hostname = os.environ.get("HOSTNAME", "?")
is_vm = os.environ.get("IS_VM", "false") == "true"
vm_info = os.environ.get("VM_INFO", "")
vpn_active = os.environ.get("VPN_ACTIVE", "false") == "true"

multi_acc = len(set(a["name"] for a in accounts)) > 1
alert_count = ((1 if multi_acc else 0) + (1 if len(ias) > 1 else 0) +
               (1 if cheat_count > 0 else 0) + (1 if is_vm else 0) + (1 if vpn_active else 0))

def make_table(rows, cols, empty="Nessun dato."):
    if not rows: return f"<p class='empty'>{he(empty)}</p>"
    s = "<div class='table-wrap'><table><thead><tr>" + "".join(f"<th>{he(c)}</th>" for c in cols) + "</tr></thead><tbody>"
    for r in rows: s += "<tr>" + "".join(f"<td>{he(r.get(c,''))}</td>" for c in cols) + "</tr>"
    return s + "</tbody></table></div>"

def bar_chart(items, color="var(--accent)", width=640, bar_h=22, gap=10):
    """Small inline-SVG horizontal bar chart: one series, direct-labeled,
    4px rounded data-ends anchored to the baseline. items: [(label, count), ...]"""
    items = [(l, c) for l, c in items if c > 0]
    if not items: return ""
    maxv = max(c for _, c in items)
    row_h = bar_h + gap
    h_total = row_h * len(items)
    label_w = 160
    track_w = width - label_w - 46
    svg = [f"<svg viewBox='0 0 {width} {h_total}' width='100%' height='{h_total}' role='img' "
           f"aria-label='Grafico a barre' xmlns='http://www.w3.org/2000/svg'>"]
    for i, (label, count) in enumerate(items):
        y = i * row_h
        bw = max(4, round((count / maxv) * track_w))
        svg.append(f"<text x='{label_w - 10}' y='{y + bar_h*0.68}' text-anchor='end' "
                    f"class='chart-label'>{he(label)}</text>")
        svg.append(f"<rect x='{label_w}' y='{y}' width='{track_w}' height='{bar_h}' rx='4' class='chart-track'/>")
        svg.append(f"<rect x='{label_w}' y='{y}' width='{bw}' height='{bar_h}' rx='4' fill='{color}'/>")
        svg.append(f"<text x='{label_w + bw + 8}' y='{y + bar_h*0.68}' class='chart-value'>{count}</text>")
    svg.append("</svg>")
    return "<div class='chart-wrap'>" + "".join(svg) + "</div>"

def donut_chart(segments, size=132, stroke=18):
    """segments: [(label, count, color), ...]. Stacked stroke-dasharray arcs
    on a single circle, center total label, legend row below (>=2 series)."""
    total = sum(c for _, c, _ in segments)
    r = (size - stroke) / 2
    cx = cy = size / 2
    circumference = 2 * 3.14159265 * r
    parts = [f"<svg viewBox='0 0 {size} {size}' width='{size}' height='{size}' role='img' "
             f"aria-label='Grafico a ciambella' xmlns='http://www.w3.org/2000/svg'>",
             f"<circle cx='{cx}' cy='{cy}' r='{r}' fill='none' stroke='var(--border2)' stroke-width='{stroke}'/>"]
    if total > 0:
        offset = 0.0
        for label, count, color in segments:
            if count <= 0: continue
            frac = count / total
            dash = frac * circumference
            gap_len = circumference - dash
            # 2px surface gap between adjacent segments
            dash_adj = max(0, dash - 2)
            parts.append(
                f"<circle cx='{cx}' cy='{cy}' r='{r}' fill='none' stroke='{color}' stroke-width='{stroke}' "
                f"stroke-dasharray='{dash_adj:.2f} {circumference - dash_adj:.2f}' "
                f"stroke-dashoffset='{-offset:.2f}' transform='rotate(-90 {cx} {cy})'/>"
            )
            offset += dash
    parts.append(f"<text x='{cx}' y='{cy - 3}' text-anchor='middle' class='donut-total'>{total}</text>")
    parts.append(f"<text x='{cx}' y='{cy + 14}' text-anchor='middle' class='donut-sub'>totale</text>")
    parts.append("</svg>")
    legend = "<div class='chart-legend'>" + "".join(
        f"<span class='legend-item'><span class='legend-dot' style='background:{color}'></span>{he(label)} ({count})</span>"
        for label, count, color in segments if count > 0
    ) + "</div>"
    return "<div class='chart-wrap chart-donut'>" + "".join(parts) + legend + "</div>"

CSS = """
:root{--bg:#f4f5f8;--bg2:#ffffff;--bg3:#eceef3;--bg4:#e3e6ee;--border:#dcdfe8;--border2:#cbd0dd;
--accent:#4f5fe0;--accent2:#4f5fe0;--accent3:#3f4fcf;--green:#0f9d64;--green2:#0b7d50;
--red:#d6364a;--red2:#b8283a;--orange:#c2650a;--orange2:#9c5208;
--text:#1b1e2b;--text2:#555d75;--text3:#7b8299;
--radius:12px;--radius-sm:8px;--shadow-sm:0 1px 3px rgba(20,24,40,.08);
--tint-red-bg:rgba(214,54,74,.07);--tint-red-bd:rgba(214,54,74,.35);
--tint-green-bg:rgba(15,157,100,.08);--tint-green-bd:rgba(15,157,100,.32);
--tint-orange-bg:rgba(194,101,10,.08);--tint-orange-bd:rgba(194,101,10,.32);
--tint-accent-bg:rgba(79,95,224,.08);--tint-accent-bd:rgba(79,95,224,.28)}
:root[data-theme="dark"]{--bg:#0a0d16;--bg2:#10141f;--bg3:#161b29;--bg4:#1c2131;--border:#232a3d;--border2:#2b3347;
--accent:#6b76f5;--accent2:#8891f7;--accent3:#aab1fa;--green:#1fb57c;--green2:#3fcf96;
--red:#ef4444;--red2:#f87171;--orange:#f0924a;--orange2:#f6ad6b;
--text:#e7e9f3;--text2:#949ebd;--text3:#5c6480;--shadow-sm:0 2px 12px rgba(0,0,0,.4);
--tint-red-bg:rgba(239,68,68,.10);--tint-red-bd:rgba(239,68,68,.4);
--tint-green-bg:rgba(31,181,124,.10);--tint-green-bd:rgba(31,181,124,.35);
--tint-orange-bg:rgba(240,146,74,.10);--tint-orange-bd:rgba(240,146,74,.35);
--tint-accent-bg:rgba(107,118,245,.12);--tint-accent-bd:rgba(107,118,245,.32)}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#0a0d16;--bg2:#10141f;--bg3:#161b29;--bg4:#1c2131;--border:#232a3d;--border2:#2b3347;
--accent:#6b76f5;--accent2:#8891f7;--accent3:#aab1fa;--green:#1fb57c;--green2:#3fcf96;
--red:#ef4444;--red2:#f87171;--orange:#f0924a;--orange2:#f6ad6b;
--text:#e7e9f3;--text2:#949ebd;--text3:#5c6480;--shadow-sm:0 2px 12px rgba(0,0,0,.4);
--tint-red-bg:rgba(239,68,68,.10);--tint-red-bd:rgba(239,68,68,.4);
--tint-green-bg:rgba(31,181,124,.10);--tint-green-bd:rgba(31,181,124,.35);
--tint-orange-bg:rgba(240,146,74,.10);--tint-orange-bd:rgba(240,146,74,.35);
--tint-accent-bg:rgba(107,118,245,.12);--tint-accent-bd:rgba(107,118,245,.32)}}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6}
.mono{font-family:ui-monospace,SFMono-Regular,"SF Mono",Consolas,"Liberation Mono",Menlo,monospace}
.site-header{background:var(--bg2);border-bottom:1px solid var(--border);padding:16px 28px}
.header-inner{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.header-brand{display:flex;align-items:center;gap:12px}
.header-mark{width:38px;height:38px;border-radius:9px;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;flex-shrink:0}
.header-title{font-size:17px;font-weight:700}
.header-sub{font-size:12px;color:var(--text2)}
.theme-toggle{background:var(--bg3);border:1px solid var(--border2);color:var(--text2);border-radius:7px;padding:6px 11px;font-size:12px;cursor:pointer;font-family:inherit}
.theme-toggle:hover{color:var(--text);border-color:var(--accent)}
nav{position:sticky;top:0;z-index:100;background:var(--bg2);border-bottom:1px solid var(--border);display:flex;gap:2px;padding:0 20px;height:46px;overflow-x:auto}
nav button{background:none;border:none;color:var(--text2);padding:5px 13px;border-radius:6px;white-space:nowrap;font-size:12.5px;font-weight:500;cursor:pointer;font-family:inherit;align-self:center}
nav button:hover{background:var(--bg4);color:var(--text)}
nav button.active{background:var(--bg4);color:var(--text);font-weight:700}
.page{display:none;padding:24px 28px;max-width:1440px;margin:0 auto}
.page.active{display:block}
section{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px 22px;margin-bottom:16px;box-shadow:var(--shadow-sm)}
section h2{font-size:13px;font-weight:700;color:var(--text);margin-bottom:14px;text-transform:uppercase;letter-spacing:.03em}
section h3{font-size:12.5px;font-weight:700;color:var(--accent3);margin:14px 0 8px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:16px}
@media(max-width:1000px){.grid-4{grid-template-columns:1fr 1fr}}
@media(max-width:700px){.grid-2,.grid-4{grid-template-columns:1fr}}
.stat{background:var(--bg3);border:1px solid var(--border2);border-radius:var(--radius);padding:16px 18px;display:flex;flex-direction:column;gap:4px}
.stat .label{font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);font-weight:600}
.stat .value{font-size:26px;font-weight:800;line-height:1.1}
.stat .sub{font-size:11.5px;color:var(--text2)}
.stat.alert{border-color:var(--red);background:var(--tint-red-bg)}
.stat.alert .value{color:var(--red2)}
.stat.warn{border-color:var(--orange);background:var(--tint-orange-bg)}
.stat.warn .value{color:var(--orange2)}
.stat.ok{border-color:var(--green);background:var(--tint-green-bg)}
.stat.ok .value{color:var(--green2)}
.stat.info{border-color:var(--accent);background:var(--tint-accent-bg)}
.stat.info .value{color:var(--accent3)}
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
.badge.red{background:var(--tint-red-bg);color:var(--red2);border:1px solid var(--tint-red-bd)}
.badge.green{background:var(--tint-green-bg);color:var(--green2);border:1px solid var(--tint-green-bd)}
.badge.orange{background:var(--tint-orange-bg);color:var(--orange2);border:1px solid var(--tint-orange-bd)}
.badge.purple{background:var(--tint-accent-bg);color:var(--accent3);border:1px solid var(--tint-accent-bd)}
.table-wrap{overflow-x:auto;border-radius:var(--radius-sm);border:1px solid var(--border)}
table{width:100%;border-collapse:collapse;font-size:12.5px}
thead tr{background:var(--bg3)}
th{padding:9px 14px;text-align:left;font-weight:600;color:var(--text2);font-size:10.5px;text-transform:uppercase;border-bottom:1px solid var(--border2);white-space:nowrap}
td{padding:9px 14px;border-bottom:1px solid var(--border);vertical-align:top}
tr:last-child td{border-bottom:none}
tr:hover td{background:var(--bg3)}
.nick-grid{display:flex;flex-wrap:wrap;gap:10px}
.nick-card{background:var(--bg3);border:1px solid var(--border2);border-radius:var(--radius-sm);padding:10px 14px;min-width:150px}
.nick-card .nick-name{font-size:14.5px;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:6px}
.nick-card .nick-src{font-size:11px;color:var(--text3)}
.dot{display:inline-block;width:7px;height:7px;border-radius:50%;flex-shrink:0}
.ias-block{background:var(--bg3);border:1px solid var(--border2);border-left:3px solid var(--orange);border-radius:0 var(--radius-sm) var(--radius-sm) 0;padding:14px 18px;margin-bottom:10px}
.ias-block .ias-title{font-weight:700;color:var(--text);margin-bottom:10px;font-size:13px}
.ias-block .ias-row{display:flex;gap:10px;margin-bottom:4px;font-size:13px}
.ias-block .ias-key{color:var(--text3);min-width:68px;font-size:11px;text-transform:uppercase}
.ias-block .ias-val{font-weight:600}
.alert-box{border-radius:var(--radius-sm);padding:12px 16px;margin-bottom:10px;border-left:3px solid var(--border2)}
.alert-box.critical{background:var(--tint-red-bg);border-left-color:var(--red)}
.alert-box.warning{background:var(--tint-orange-bg);border-left-color:var(--orange)}
.alert-box.info2{background:var(--tint-accent-bg);border-left-color:var(--accent)}
.alert-box .a-title{font-weight:700;font-size:13px}
.alert-box .a-body{font-size:12px;color:var(--text2);margin-top:2px}
.alert-box.critical .a-title{color:var(--red2)}
.alert-box.warning .a-title{color:var(--orange2)}
.overview-hero{border:1px solid var(--border);border-radius:var(--radius);padding:22px 26px;margin-bottom:20px;background:var(--bg2)}
.overview-title{font-size:21px;font-weight:800;margin-bottom:6px}
.overview-meta{font-size:12.5px;color:var(--text2);display:flex;gap:14px;flex-wrap:wrap}
.empty{color:var(--text3);font-style:italic;font-size:13px;padding:10px 0}
hr.sh{border:none;border-top:1px solid var(--border);margin:16px 0}
.chart-wrap{margin:4px 0 2px}
.chart-wrap svg{display:block;max-width:100%;height:auto}
.chart-label{font-size:11px;fill:var(--text2)}
.chart-value{font-size:11.5px;font-weight:700;fill:var(--text)}
.chart-track{fill:var(--bg4)}
.chart-donut{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.donut-total{font-size:24px;font-weight:800;fill:var(--text)}
.donut-sub{font-size:9px;fill:var(--text3);text-transform:uppercase;letter-spacing:.05em}
.chart-legend{display:flex;flex-direction:column;gap:6px;font-size:12.5px;color:var(--text2)}
.legend-item{display:flex;align-items:center;gap:7px}
.legend-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
::-webkit-scrollbar{width:7px;height:7px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:4px}
"""

cheat_badge = f'<span class="badge red">{cheat_count} cheat</span>' if cheat_count > 0 else '<span class="badge green">Nessun cheat</span>'
multi_badge = f'<span class="badge orange">{len(accounts)} account</span>' if multi_acc else '<span class="badge green">1 account</span>'

NAV = [("overview", "Riepilogo"), ("nicks", "Nickname"), ("accounts", "Account"),
       ("ias", "Log IAS"), ("cheats", "Cheat"), ("network", "Rete"), ("files", "File")]

# ---- Overview ----------------------------------------------------------
overview = f"""<div class='page active' id='page-overview'>
<div class='overview-hero'><div class='overview-title'>Analisi Screen Share</div>
<div class='overview-meta'><span>{he(sys_name)} Build {he(sys_build)}</span><span>Analisi: ultimi {days} giorni</span><span>{he(date_limit)} &rarr; adesso</span><span>OS: {he(os_name)} {he(distro)}</span></div></div>"""
if alert_count > 0:
    overview += "<section><h2>Alert critici</h2>"
    if multi_acc: overview += f"<div class='alert-box warning'><div class='a-title'>Trovati piu' account ({len(accounts)})</div></div>"
    if len(ias) > 1: overview += f"<div class='alert-box warning'><div class='a-title'>Cambi account IAS: {len(ias)}</div></div>"
    if cheat_count > 0: overview += f"<div class='alert-box critical'><div class='a-title'>Tracce client cheat: {cheat_count}</div></div>"
    if is_vm: overview += f"<div class='alert-box warning'><div class='a-title'>Macchina virtuale rilevata</div><div class='a-body'>{he(vm_info)}</div></div>"
    if vpn_active: overview += "<div class='alert-box warning'><div class='a-title'>Interfaccia VPN attiva</div></div>"
    overview += "</section>"

c1 = "warn" if multi_acc else "ok"
c2 = "warn" if ias else "ok"
c4 = "alert" if cheat_count > 0 else "ok"
overview += f"""<div class='grid-4'>
<div class='stat {c1}'><div class='label'>Account</div><div class='value'>{len(accounts)}</div><div class='sub'>{multi_badge}</div></div>
<div class='stat {c2}'><div class='label'>Cambi IAS</div><div class='value'>{len(ias)}</div><div class='sub'>nei log analizzati</div></div>
<div class='stat ok'><div class='label'>Sistema operativo</div><div class='value' style='font-size:18px'>{he(os_name)}</div><div class='sub'><span class="badge purple">{he(distro)}</span></div></div>
<div class='stat {c4}'><div class='label'>Tracce cheat</div><div class='value'>{cheat_count}</div><div class='sub'>{cheat_badge}</div></div>
</div>
<div class='stat info' style='margin-bottom:16px'><div class='label'>Nickname univoci</div><div class='value'>{nick_count}</div></div>
<div class='grid-2'>
<section><h2>Nickname principali</h2><div class='nick-grid'>"""
seen_n = set()
for n in nicks[:12]:
    if n["nick"] in seen_n:
        continue
    seen_n.add(n["nick"])
    ias_m = next((e for e in ias if e["name"] == n["nick"]), None)
    dot = "#22c55e" if (ias_m and ias_m["online"] == "true") else ("#f97316" if (ias_m and ias_m["online"] == "false") else "#64748b")
    overview += f"<div class='nick-card'><div class='nick-name'><span class='dot' style='background:{dot}'></span>{he(n['nick'])}</div><div class='nick-src'>{he(n['fonte'])}</div></div>"
if not nicks: overview += "<p class='empty'>Nessun nickname trovato.</p>"
overview += "</div></section>"
overview += "<section><h2>Sistema</h2>"
overview += f"""<div class='grid-2'>
<div class='stat {"warn" if is_vm else "ok"}'><div class='label'>Macchina virtuale</div><div class='value' style='font-size:18px'>{"Rilevata" if is_vm else "Non rilevata"}</div><div class='sub'>{he(vm_info) if is_vm else "Hardware fisico"}</div></div>
<div class='stat {"warn" if vpn_active else "ok"}'><div class='label'>VPN</div><div class='value' style='font-size:18px'>{"Attiva" if vpn_active else "Non attiva"}</div><div class='sub'>Interfacce di rete</div></div>
</div></section></div></div>"""

# ---- Nicknames ----------------------------------------------------------
nicks_page = f"""<div class='page' id='page-nicks'>
<section><h2>Tutti i nickname trovati <span class='badge purple'>{nick_count} univoci</span></h2>
<div class='nick-grid' style='margin-bottom:18px'>"""
seen_n = set()
for n in sorted(nicks, key=lambda x: x["nick"].lower()):
    if n["nick"] in seen_n:
        continue
    seen_n.add(n["nick"])
    ias_m = next((e for e in ias if e["name"] == n["nick"]), None)
    dot = "#22c55e" if (ias_m and ias_m["online"] == "true") else ("#f97316" if (ias_m and ias_m["online"] == "false") else "#64748b")
    nicks_page += f"<div class='nick-card'><div class='nick-name'><span class='dot' style='background:{dot}'></span>{he(n['nick'])}</div><div class='nick-src'>{he(n['fonte'])}</div></div>"
nicks_page += "</div><hr class='sh'>"
nick_rows = [{"Nick": n["nick"], "Fonte": n["fonte"], "Data": n["data"], "Nota": n["note"]} for n in nicks]
nicks_page += make_table(nick_rows, ["Nick", "Fonte", "Data", "Nota"], "Nessun nickname trovato.") + "</section></div>"

# ---- Accounts -------------------------------------------------------------
acc_page = f"""<div class='page' id='page-accounts'>
<section><h2>Account estratti <span class='badge {"orange" if multi_acc else "green"}'>{len(accounts)} account</span></h2>"""
launcher_counts = Counter(a["launcher"] for a in accounts)
if len(launcher_counts) > 1:
    acc_page += bar_chart(sorted(launcher_counts.items(), key=lambda x: -x[1]))
for ln, grp in gby(sorted(accounts, key=lambda x: x["launcher"]), key=lambda x: x["launcher"]):
    grp = list(grp)
    acc_page += f"<h3>{he(ln)}</h3>"
    acc_page += make_table([{"Nick": a["name"], "UUID": a["uuid"], "Tipo": a["type"], "Online": a["online"]} for a in grp],
                            ["Nick", "UUID", "Tipo", "Online"])
if not accounts: acc_page += "<p class='empty'>Nessun account estratto.</p>"
acc_page += "</section></div>"

# ---- IAS log ----------------------------------------------------------
ias_page = """<div class='page' id='page-ias'>
<section><h2>InGame Account Switcher - Log cambio account</h2>"""
if not ias:
    ias_page += "<p class='empty'>Nessun cambio account IAS trovato nei log analizzati.</p>"
else:
    online_n = sum(1 for e in ias if e["online"] == "true")
    offline_n = sum(1 for e in ias if e["online"] == "false")
    unknown_n = len(ias) - online_n - offline_n
    if len(ias) > 1:
        ias_page += f"<div class='alert-box warning' style='margin-bottom:14px'><div class='a-title'>{len(ias)} cambi account rilevati</div></div>"
    ias_page += "<div class='grid-2' style='align-items:start'><div>"
    ias_page += donut_chart([("Online", online_n, "#22c55e"), ("Offline/cracked", offline_n, "#f97316"), ("Sconosciuto", unknown_n, "#64748b")])
    ias_page += "</div><div>"
    for i, blk in enumerate(ias[:6]):
        dot = "#22c55e" if blk["online"] == "true" else ("#f97316" if blk["online"] == "false" else "#94a3b8")
        lbl = "OFFLINE / CRACKED" if blk["online"] == "false" else ("Online (premium)" if blk["online"] == "true" else "Sconosciuto")
        ias_page += f"""<div class='ias-block'><div class='ias-title'>Cambio #{i+1} &mdash; {he(blk['name'])}</div>
<div class='ias-row'><span class='ias-key'>Orario</span><span class='ias-val'>{he(blk['time'])}</span></div>
<div class='ias-row'><span class='ias-key'>Online</span><span class='ias-val' style='color:{dot}'>{lbl}</span></div>
<div class='ias-row'><span class='ias-key'>Launcher</span><span class='ias-val'>{he(blk['launcher'])}</span></div></div>"""
    ias_page += "</div></div>"
ias_page += "<hr class='sh'>" + make_table(
    [{"Orario": e["time"], "Nome": e["name"], "UUID": e["uuid"], "Online": e["online"], "Launcher": e["launcher"]} for e in ias],
    ["Orario", "Nome", "UUID", "Online", "Launcher"], "Nessun evento IAS.") + "</section></div>"

# ---- Cheat self-destruction ------------------------------------------------
cheats_page = "<div class='page' id='page-cheats'>"
if cheat_count > 0:
    cheats_page += f"<div class='alert-box critical' style='margin-bottom:18px'><div class='a-title'>{cheat_count} TRACCE CHEAT RILEVATE</div><div class='a-body'>Autodistruzioni, residui o jar cheat trovati sul file system.</div></div>"
else:
    cheats_page += "<div class='alert-box info2' style='margin-bottom:18px'><div class='a-title'>Nessuna traccia cheat rilevata</div></div>"
cheats_page += f"<section><h2>Report completo: {he(root_dir)}/15_Misc/CheatSelfDestruct_{he(ts)}.txt</h2>"
tipo_counts = Counter(a["tipo"] for a in cheat_alerts)
if tipo_counts:
    cheats_page += bar_chart(sorted(tipo_counts.items(), key=lambda x: -x[1]), color="var(--red)")
cheats_rows = [{"Tipo": a["tipo"], "Cheat": a["cheat"], "Dettaglio": a["dettaglio"]} for a in cheat_alerts]
cheats_page += make_table(cheats_rows, ["Tipo", "Cheat", "Dettaglio"], "Nessun alert generato.")

cheat_names = ["Doomsday", "Sigma", "Wurst", "Meteor", "Aristois", "Impact", "XRay", "Inertia", "Future",
               "LiquidBounce", "Vape", "Ghost", "Entropy", "Horion", "Ares", "Novoline", "Remix", "Rise",
               "Zeroday", "Drip", "Rusherhack", "Tenacity", "BleachHack", "Raven", "Omega", "Phase"]
cheats_page += "<section style='margin-top:16px'><h2>Client cheat monitorati</h2><div class='nick-grid'>"
for cn in cheat_names:
    hit = any(a["cheat"] == cn for a in cheat_alerts)
    dot = "var(--red)" if hit else "var(--text3)"
    label = "TRACCIA TROVATA" if hit else "Non trovato"
    cheats_page += f"<div class='nick-card' style='border-color:{dot}'><div class='nick-name'>{he(cn)}</div><div class='nick-src'><span class='dot' style='background:{dot}'></span>{label}</div></div>"
cheats_page += "</div></section></div>"

# ---- Network / Files --------------------------------------------------
net_page = f"""<div class='page' id='page-network'>
<section><h2>Informazioni di rete</h2>
<p style='color:var(--text2);font-size:12px'>Output: <code class='mono' style='background:var(--bg3);padding:2px 6px;border-radius:4px'>{he(root_dir)}/17_Network/</code></p></section></div>"""

files_page = f"""<div class='page' id='page-files'>
<section><h2>File generati</h2>
<p style='color:var(--text2);font-size:12px'>Cartella principale: <code class='mono' style='background:var(--bg3);padding:2px 6px;border-radius:4px'>{he(root_dir)}</code></p>
<p style='color:var(--text2);font-size:12px;margin-top:8px'>I report completi sono scritti nelle sottocartelle sopra indicate. Aprili per l'analisi dettagliata.</p></section></div>"""

nav_html = "".join(
    f"<button type='button' class='{'active' if i == 0 else ''}' onclick=\"sp('{key}',this)\">{he(label)}</button>"
    for i, (key, label) in enumerate(NAV)
)

html = f"""<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CharlieRP Screen Share - Dashboard</title><style>{CSS}</style></head><body>
<div class="site-header"><div class="header-inner"><div class="header-brand"><div class="header-mark">SS</div><div><div class="header-title">CharlieRP Screen Share</div><div class="header-sub">Analisi forense anti-cheat &mdash; {he(hostname)} &mdash; {he(os_name)}</div></div></div>
<button type="button" class="theme-toggle" onclick="toggleTheme()" id="theme-btn">Tema</button></div></div>
<nav>{nav_html}</nav>
{overview}{nicks_page}{acc_page}{ias_page}{cheats_page}{net_page}{files_page}
<script>
function sp(id,el){{
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(a=>a.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  el.classList.add('active');
  window.scrollTo(0,0);
}}
function toggleTheme(){{
  var root=document.documentElement;
  var cur=root.getAttribute('data-theme');
  var next=cur==='dark' ? 'light' : (cur==='light' ? null : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark'));
  if(next){{root.setAttribute('data-theme',next); try{{localStorage.setItem('ss-theme',next)}}catch(e){{}}}}
  else{{root.removeAttribute('data-theme'); try{{localStorage.removeItem('ss-theme')}}catch(e){{}}}}
}}
(function(){{
  try{{
    var saved=localStorage.getItem('ss-theme');
    if(saved) document.documentElement.setAttribute('data-theme', saved);
  }}catch(e){{}}
}})();
document.querySelectorAll('td').forEach(function(td){{
  var t=td.textContent.trim();
  if(['true','Online (premium)'].indexOf(t)>-1){{td.style.color='var(--green2)';td.style.fontWeight='600'}}
  if(t==='false' || t==='OFFLINE / CRACKED' || t.indexOf('TRACCIA TROVATA')===0){{td.style.color='var(--red2)';td.style.fontWeight='700'}}
}});
</script></body></html>"""

dash_path = os.environ.get("DASH_PATH", "/tmp/DASHBOARD.html")
with open(dash_path, "w", encoding="utf-8") as f:
    f.write(html)
print(f"  [OK] Dashboard scritta: {dash_path}")
PYEOF

# Clean up the plain-text temp files now that the dashboard has read them.
rm -f "$ACCOUNTS_TMP" "$IAS_TMP" "$NICK_TMP" "$CHEAT_TMP"

show_step "DASHBOARD" "Completato." "green"

# ==============================================================================
#  FINAL SUMMARY
# ==============================================================================
echo ""
printf '\033[90m%s\033[0m\n' "  ___________________________________________________________________"
echo ""
printf '  \033[36m[\033[0m \033[32mCOMPLETATO\033[0m \033[36m]\033[0m Tutti i moduli eseguiti con successo.\n'
echo ""
printf '  Sistema   : %s\n' "$SYS_NAME"
printf '  Intervallo: Ultimi %s giorni\n' "$DAYS"
printf '  Output    : %s\n' "$ROOT"
printf '  Dashboard : \033[36m%s\033[0m\n' "$DASH_PATH"
echo ""

# Open dashboard
command -v xdg-open &>/dev/null && xdg-open "$DASH_PATH" 2>/dev/null &
command -v open &>/dev/null && open "$DASH_PATH" 2>/dev/null &
