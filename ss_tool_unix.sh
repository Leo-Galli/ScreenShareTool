#!/usr/bin/env bash
# ==============================================================================
#  CharlieRP Screen Share Tool — UNIX Universal (macOS / Linux / FreeBSD)
#  Network: mc.charlieroleplay.it  |  Made by LeoGalli
#  Version: 3.0.0 — Complete rewrite with improved detection & dashboard
# ==============================================================================
set +e
set -u

VERSION="3.0.0"
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
    echo "  [ERROR] Run this script as root: sudo $0"
    echo ""
    exit 1
fi

# ==============================================================================
#  DEPENDENCY AUTO-INSTALL
# ==============================================================================
install_pkg() {
    local pkg="$1"
    echo "  [DEP] Installing: $pkg ..."
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
        *)        echo "  [WARN] No supported package manager. Install manually: $pkg" ;;
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

printf '  System: \033[37m%s\033[0m (Build %s)\n' "$SYS_NAME" "$SYS_BUILD"
echo ""

# ==============================================================================
#  ANALYSIS INTERVAL
# ==============================================================================
printf '  \033[37mEnter analysis interval:\033[0m\n'
DAYS=0
while [ "$DAYS" -le 0 ] 2>/dev/null; do
    read -rp "  How many days back? (e.g. 1, 7, 30, 90): " INPUT_DAYS
    case "$INPUT_DAYS" in
        *[!0-9]*|"") DAYS=0;;
        *) DAYS="$INPUT_DAYS";;
    esac
done

DATE_LIMIT_EPOCH=$(python3 -c "import time; print(int(time.time() - $DAYS * 86400))" 2>/dev/null)
DATE_LIMIT_STR=$(python3 -c "import time; print(time.strftime('%d/%m/%Y %H:%M:%S', time.localtime(time.time() - $DAYS * 86400)))" 2>/dev/null)

echo ""
printf '  From: \033[37m%s\033[0m  -->  Today  (%s days)\n' "$DATE_LIMIT_STR" "$DAYS"
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
    printf "  ${cc}[ >> ]${cc} \033[37m%-18s\033[0m \033[90m%s\033[0m\n" "$mod" "$detail"
}

write_header() {
    local path="$1" title="$2" desc="$3"
    cat > "$path" <<HEADER
================================================================
  $title
  $desc

  System  : $SYS_NAME (Build $SYS_BUILD)
  Generated : $(date '+%d/%m/%Y %H:%M:%S')
  Interval: Last $DAYS days  (from $DATE_LIMIT_STR)
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

show_step "SISTEMA" "Mount points: ${DRIVES[*]}" "green"
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

# Common exclusion patterns for find commands
EXCLUDE_PRUNE='( -path "*/.git" -o -path "*/node_modules" -o -path "*/.cache" -o -path "*/.cargo" -o -path "*/.npm" -o -path "*/.rustup" -o -path "*/.mozilla" -o -path "*/Library/Caches" -o -path "*/Library/Containers" -o -path "*/Library/Developer" -o -path "*/Library/Metadata" ) -prune'

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
    echo "Unknown"
}

# ==============================================================================
#  MODULE: FILE SYSTEM FORENSICS (01-09)
# ==============================================================================
run_fs_events() {
show_step "FS EVENTS" "File system analysis and deleted files..." "cyan"

# --- Account files ---
OUT="$ROOT/01_AccountFiles/AccountFiles_$TS.txt"
write_header "$OUT" "FS [01] - ACCOUNT FILES" "MC/AccountSwitcher files found or modified"
MC_PATTERNS=("launcher_profiles.json" "launcher_accounts.json" "usercache.json"
             "usernamecache.json" "InGameAccountSwitcher" "ias.json")
{
    for drv in "${SEARCH_ROOTS[@]}"; do
        [ -d "$drv" ] || continue
        for pat in "${MC_PATTERNS[@]}"; do
            find "$drv" -maxdepth 8 $EXCLUDE_PRUNE -o \( -name "$pat" -print \) 2>/dev/null | while read -r f; do
                tag=$(file_in_range "$f" && echo "[!!!]" || echo "[ - ]")
                echo "  $tag $(file_mtime_str "$f")  |  $f"
            done
        done
    done
} >> "$OUT"

# --- Trash ---
OUT2="$ROOT/09_TrashExe/CestinoExe_$TS.txt"
write_header "$OUT2" "FS [09] - EXECUTABLES IN TRASH" "Deleted .jar/.sh/.py in recycle bin"
found_trash=false
for tdir in "${TRASH_DIRS[@]}"; do
    [ -d "$tdir" ] || continue
    find "$tdir" -type f \( -name "*.jar" -o -name "*.sh" -o -name "*.py" -o -name "*.exe" \) 2>/dev/null | while read -r f; do
        file_in_range "$f" && { echo "  [!!!] $(file_mtime_str "$f")  |  $(basename "$f")  |  $f" >> "$OUT2"; found_trash=true; }
    done
done
$found_trash || echo "  [OK] No executables found in trash within the interval." >> "$OUT2"

# --- JNativeHook ---
OUT3="$ROOT/03_JNativeHook/JNativeHook_$TS.txt"
write_header "$OUT3" "FS [03] - JNATIVEHOOK" "Autoclicker traces (.jar in /tmp or home)"
found_jna=false
for drv in "${SEARCH_ROOTS[@]}"; do
    [ -d "$drv" ] || continue
    find "$drv" -maxdepth 8 $EXCLUDE_PRUNE -o \( \( -iname "*JNativeHook*" \) -print \) 2>/dev/null | while read -r f; do
        echo "  [!!!] $(file_mtime_str "$f")  |  $f" >> "$OUT3"
        found_jna=true
    done
done
$found_jna || echo "  [--] No JNativeHook traces found." >> "$OUT3"

# --- FSEvents / Audit Logs ---
OUT4="$ROOT/05_FSEvents/FSEvents_$TS.txt"
write_header "$OUT4" "FS [05] - FSEVENTS / AUDIT LOG" "Process execution traces"
{
    if [ "$OS" = "macos" ]; then
        echo "  ---- macOS Unified Log ----"
        SINCE_LOG=$(date -v "-${DAYS}d" '+%Y-%m-%d %H:%M:%S' 2>/dev/null || echo "")
        if [ -n "$SINCE_LOG" ] && command -v log &>/dev/null; then
            log show --start "$SINCE_LOG" --predicate 'eventMessage CONTAINS "java" OR eventMessage CONTAINS ".jar" OR eventMessage CONTAINS "minecraft"' --style syslog 2>/dev/null | head -200
        fi
        echo ""
        echo "  ---- Spotlight: Recent .jar files ----"
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
write_header "$OUT5" "FS [06] - IMMUTABLE / READ-ONLY FILES" "Forced read-only or immutable attributes"
{
    if [ "$OS" = "macos" ]; then
        echo "  ---- Files with uchg/schg flags (macOS chflags) ----"
        for dir in "$HOME/Library/Application Support/minecraft" "$HOME/.minecraft"; do
            [ -d "$dir" ] || continue
            ls -lO "$dir" 2>/dev/null | grep -E 'uchg|schg|uimmutable|simmutable' | while IFS= read -r line; do echo "  [!!!] $line"; done
        done
    else
        echo "  ---- Immutable files (lsattr) ----"
        if command -v lsattr &>/dev/null; then
            for dir in "$HOME/.minecraft" "$HOME/.local/share"; do
                [ -d "$dir" ] || continue
                lsattr -R "$dir" 2>/dev/null | grep -v '^-' | grep -v '^lsattr' | while IFS= read -r line; do echo "  [!!!] $line"; done
            done
        else
            echo "  [--] lsattr not available."
        fi
    fi
} >> "$OUT5"

# --- Anomalous permissions ---
OUT6="$ROOT/07_Perms/Perms_$TS.txt"
write_header "$OUT6" "FS [07] - ANOMALOUS PERMISSIONS" "World-writable or empty-permission files in cache"
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
write_header "$OUT7" "FS [08] - SPOOFED EXTENSIONS / NON-ASCII" "Files with Unicode anomalous names"
{
    for drv in "${SEARCH_ROOTS[@]}"; do
        [ -d "$drv" ] || continue
        find "$drv" -maxdepth 6 $EXCLUDE_PRUNE -o -print 2>/dev/null | \
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

show_step "FS EVENTS" "Completed. Sections 01-09 written." "green"
}

# ==============================================================================
#  MODULE: SYSTEM INFO (11)
# ==============================================================================
run_sysinfo() {
show_step "SYSINFO" "System information analysis..." "cyan"

OUT_BAM="$ROOT/11_SystemInfo/BAM_equiv_$TS.txt"
write_header "$OUT_BAM" "SYSINFO [11b] - RECENT EXECUTIONS (BAM equiv.)" "Login history + shell history"
{
    echo "  ---- Recent logins (last) ----"
    last -F 2>/dev/null | head -50 | while IFS= read -r line; do echo "  [LAST] $line"; done

    echo ""
    echo "  ---- Shell history: java/.jar/minecraft/cheat keywords ----"
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
    echo "  ---- Active processes (java/minecraft) ----"
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
write_header "$OUT_ARC" "SYSINFO [11c] - RECENT ARCHIVES" "zip/tar/rar/7z modified in interval"
{
    for drv in "${SEARCH_ROOTS[@]}"; do
        [ -d "$drv" ] || continue
        find "$drv" -maxdepth 8 $EXCLUDE_PRUNE -o \( \( -name "*.zip" -o -name "*.tar.gz" -o -name "*.tgz" -o -name "*.rar" -o -name "*.7z" \) -print \) 2>/dev/null | while read -r f; do
            file_in_range "$f" && echo "  [!!!] $(file_mtime_str "$f")  |  $f"
        done
    done
} >> "$OUT_ARC"

# --- App cache (MuiCache equiv.) ---
OUT_MUI="$ROOT/11_SystemInfo/AppCache_$TS.txt"
write_header "$OUT_MUI" "SYSINFO [11d] - APP CACHE (MuiCache equiv.)" "Recently launched applications"
{
    if [ "$OS" = "macos" ]; then
        echo "  ---- LaunchServices recent apps ----"
        for appdir in /Applications "$HOME/Applications"; do
            [ -d "$appdir" ] || continue
            find "$appdir" -maxdepth 2 -name "*.app" 2>/dev/null | while read -r f; do
                file_in_range "$f" && echo "  [NEW] $(file_mtime_str "$f")  |  $f"
            done
        done
    else
        echo "  ---- Recent .desktop files ----"
        find /usr/share/applications ~/.local/share/applications /var/lib/snapd/desktop/applications -name "*.desktop" 2>/dev/null | while read -r f; do
            file_in_range "$f" && { echo "  [NEW] $(file_mtime_str "$f")  |  $f"; grep -iE '^Name=|^Exec=' "$f" 2>/dev/null | head -3 | while IFS= read -r l; do echo "        $l"; done; }
        done
        echo ""
        echo "  ---- Snap packages ----"
        command -v snap &>/dev/null && snap list 2>/dev/null | while IFS= read -r line; do echo "  [SNAP] $line"; done
        echo ""
        echo "  ---- Flatpak packages ----"
        command -v flatpak &>/dev/null && flatpak list 2>/dev/null | while IFS= read -r line; do echo "  [FLAT] $line"; done
    fi
} >> "$OUT_MUI"

# --- USB Devices ---
OUT_USB="$ROOT/11_SystemInfo/USB_$TS.txt"
write_header "$OUT_USB" "SYSINFO [11h] - USB DEVICES" "Connected USB peripherals"
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
write_header "$OUT_SHIM" "SYSINFO [11i] - DYLD CACHE / SHIMCACHE equiv." "Shared library cache"
{
    if [ "$OS" = "macos" ]; then
        ls -la /private/var/db/dyld/ 2>/dev/null | while IFS= read -r line; do echo "  [DYLD] $line"; done
    else
        echo "  ---- ldconfig cache ----"
        command -v ldconfig &>/dev/null && ldconfig -p 2>/dev/null | head -50 | while IFS= read -r line; do echo "  [LDCONF] $line"; done
    fi
} >> "$OUT_SHIM"

show_step "SYSINFO" "Completed. Sections 11b-11i written." "green"
}

# ==============================================================================
#  MODULE: PREFETCH EQUIVALENT (12)
# ==============================================================================
run_prefetch() {
show_step "PREFETCH" "Startup cache and recent executables..." "cyan"

OUT_PF="$ROOT/12_Launchd/Status_$TS.txt"
write_header "$OUT_PF" "PREFETCH equiv [12a] - STARTUP STATUS" "launchd (macOS) / systemd (Linux)"
{
    if [ "$OS" = "macos" ]; then
        launchctl list 2>/dev/null | head -100 | while IFS= read -r line; do echo "  $line"; done
    else
        echo "  ---- systemd analyze blame ----"
        command -v systemd-analyze &>/dev/null && systemd-analyze blame 2>/dev/null | head -30 | while IFS= read -r line; do echo "  [SYS] $line"; done
        echo ""
        echo "  ---- Active services ----"
        command -v systemctl &>/dev/null && systemctl list-units --type=service --state=running --no-pager 2>/dev/null | head -40
    fi
} >> "$OUT_PF"

OUT_PF2="$ROOT/12_Launchd/Lista_$TS.txt"
write_header "$OUT_PF2" "PREFETCH equiv [12c] - RECENT EXECUTABLES" ".jar/.sh/.py modified recently"
{
    for drv in "${SEARCH_ROOTS[@]}"; do
        [ -d "$drv" ] || continue
        find "$drv" -maxdepth 8 $EXCLUDE_PRUNE -o \( \( -name "*.jar" -o -name "*.sh" -o -name "*.py" \) -not -path "*/proc/*" -not -path "*/sys/*" -print \) 2>/dev/null | while read -r f; do
            file_in_range "$f" && echo "  [>>>] $(file_mtime_str "$f")  |  $f"
        done
    done
} >> "$OUT_PF2"

show_step "PREFETCH" "Completed." "green"
}

# ==============================================================================
#  MODULE: MACRO SOFTWARE (13)
# ==============================================================================
run_macro() {
show_step "MACRO" "Scanning for macro/gaming software..." "cyan"

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
            tag=$(file_in_range "$mp" && echo "[!!!] MODIFIED IN INTERVAL" || echo "[ - ] found (outside interval)")
            echo "  $tag"
            echo "        Software        : $soft"
            echo "        Path            : $mp"
            echo "        Last modified   : $(file_mtime_str "$mp")"
            echo ""
        else
            echo "  [   ] absent : $soft"
        fi
    done
} >> "$OUT_MACRO"

show_step "MACRO" "Completed." "green"
}

# ==============================================================================
#  MODULE: MINECRAFT FORENSICS (14)
# ==============================================================================
run_minecraft() {
show_step "MINECRAFT" "Profiles, accounts, IGAS, account-switch logs..." "cyan"

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
        [ -d "$lroot" ] || { echo "  [   ] NOT FOUND  : $lname  ($lroot)"; continue; }
        tag=$(file_in_range "$lroot" && echo "[!!!]" || echo "[ - ]")
        echo ""; echo "  $tag FOUND  : $lname"; echo "       Root            : $lroot"; echo "       Last modified   : $(file_mtime_str "$lroot")"
        FOUND_LAUNCHERS+=("$lname|$lroot|$acc_files|$log_dirs")
    done

    echo ""; echo "  ---- INGAME ACCOUNT SWITCHER (IGAS) ----"
    for ir in "${IGAS_STANDALONE_ROOTS[@]}"; do
        [ -d "$ir" ] && { tag=$(file_in_range "$ir" && echo "[!!!]" || echo "[ - ]"); echo "  $tag FOUND  : IGAS standalone"; echo "       Path : $ir"; echo "       Date : $(file_mtime_str "$ir")"; } || echo "  [   ] absent  : $ir"
    done
    echo ""; echo "  ---- IGAS MOD (ias.json in .minecraft/config) ----"
    for imp in "${IGAS_MOD_PATHS[@]}"; do
        [ -f "$imp" ] && { tag=$(file_in_range "$imp" && echo "[!!!]" || echo "[ - ]"); echo "  $tag FOUND  : $imp  (date: $(file_mtime_str "$imp"))"; } || echo "  [   ] absent  : $imp"
    done
    for base in "${MC_BASE_DIRS[@]}"; do
        modsdir="$base/mods"; [ -d "$modsdir" ] || continue
        find "$modsdir" \( -iname "*nGameAccountSwitcher*" -o -iname "*ias-*" \) 2>/dev/null | while read -r f; do
            tag=$(file_in_range "$f" && echo "[!!!]" || echo "[ - ]")
            echo "  $tag IGAS MOD JAR : $(basename "$f")  (date: $(file_mtime_str "$f"))"
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
    $igas_found || echo "  [--] No IGAS accounts found."

    echo ""; echo "  ================================================================"
    ACC_COUNT=${#ALL_ACCOUNTS[@]}
    echo "  TOTAL UNIQUE ACCOUNTS FOUND: $ACC_COUNT"
    if [ "$ACC_COUNT" -gt 1 ]; then
        echo "  [!!!] MORE THAN 1 ACCOUNT - CHECK FOR MULTIACCOUNTING"
        echo ""; echo "  Account summary:"
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
                { echo ""; echo "  +----------------------------------------------------------+"; echo "  | [IAS] ACCOUNT SWITCH"; echo "  |  Time    : $a1"; echo "  |  Name    : $a2"; echo "  |  UUID    : $a3"; echo "  |  Online  : $a4$([ "$a4" = "false" ] && echo " <- OFFLINE/CRACKED" || true)"; echo "  |  Launcher: $a5"; echo "  |  Log     : $a6"; echo "  +----------------------------------------------------------+"; } >> "$OUT_14D" ;;
            RAW) echo "  |  $a1" >> "$OUT_14D" ;;
            ENDBLOCK) echo "  +----------------------------------------------------------+" >> "$OUT_14D" ;;
            AUTH) echo "  [AUTH] $a1" >> "$OUT_14D" ;;
            NET)  echo "  [NET]  $a1" >> "$OUT_14D" ;;
        esac
    done < <(python3 -c "$PARSE_LOG" "$f" "$lname" 2>/dev/null)
}

{
    echo "  ---- Scanning logs from all found launchers ----"; echo ""
} >> "$OUT_14D"

for entry in "${FOUND_LAUNCHERS[@]:-}"; do
    lname="${entry%%|*}"; rest="${entry#*|}"; lroot="${rest%%|*}"; log_dirs="${rest#*|}"
    for ld in $log_dirs; do
        logdir="$lroot/$ld"; [ -d "$logdir" ] || continue
        find "$logdir" -type f \( -name "*.log" -o -name "*.log.gz" \) 2>/dev/null | while read -r f; do
            file_in_range "$f" || [ "$(basename "$f")" = "latest.log" ] && scan_log_wrapper "$f" "$lname"
        done
    done
done

for base in "${MC_BASE_DIRS[@]}"; do
    lf="$base/logs/latest.log"
    [ -f "$lf" ] && { scan_log_wrapper "$lf" "Mojang (.minecraft)"; cp "$lf" "$ROOT/14_Minecraft/latest_log_copy_$TS.txt" 2>/dev/null; }
done

{
    echo ""; echo "  ================================================================"; echo "  LOG SUMMARY"; echo "  Total IAS account switches: ${#IAS_LOG_ENTRIES[@]}"
    [ ${#IAS_LOG_ENTRIES[@]} -gt 1 ] && echo "  [!!!] ${#IAS_LOG_ENTRIES[@]} account switches detected - MULTIACCOUNTING"
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
        echo ""; echo "  ---- $ucf ----"; echo "  Last modified: $(file_mtime_str "$ucf")"
        python3 - "$ucf" <<'PYEOF'
import sys, json
try:
    with open(sys.argv[1], encoding="utf-8", errors="ignore") as f: data = json.load(f)
    print(f"  Total entries: {len(data)}")
    if len(data) > 1: print("  [NB] Multiple usernames = multiple accounts or players seen on servers")
    print()
    for e in data: print(f"  [USR] {e.get('name','?'):<24}  UUID: {e.get('uuid','?')}  Expires: {e.get('expiresOn','N/A')}")
except Exception as ex: print(f"  [ERR] Parse error: {ex}")
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
    for e in data: print(f"  [USR] {e.get('name','?'):<24}  UUID: {e.get('uuid','?')}  Expires: {e.get('expiresOn','N/A')}")
except Exception as ex: print(f"  [ERR] {ex}")
PYEOF
    done
} >> "$OUT_14E"

# [14f] Crash reports + mods
OUT_14F="$ROOT/14_Minecraft/14f_Crash_Mods_$TS.txt"
write_header "$OUT_14F" "MINECRAFT [14f] - CRASH REPORTS + MODS" ""
{
    echo "  ---- CRASH REPORTS ----"
    for entry in "${FOUND_LAUNCHERS[@]:-}"; do
        lroot="${entry#*|}"; lroot="${lroot%%|*}"; cdir="$lroot/crash-reports"; [ -d "$cdir" ] || continue
        find "$cdir" -name "*.txt" 2>/dev/null | while read -r f; do
            file_in_range "$f" && { echo "  [CRS] $(file_mtime_str "$f")  |  $(basename "$f")"; grep -m1 '^Description:' "$f" 2>/dev/null || true; }
        done
    done
    echo ""; echo "  ---- INSTALLED MODS ----"
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
except: print("    [ERR] Error parsing servers.dat")
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
        find "$modsdir" -name ".*.jar" -type f 2>/dev/null | while read -r f; do
            echo "  [!!!] Hidden file: $(basename "$f")  |  Modified: $(file_mtime_str "$f")  |  Path: $f"
            hidden_count=$((hidden_count+1))
        done
    done
    [ "${hidden_count:-0}" -eq 0 ] && echo "  [OK] No hidden .jar files found in mods directories."
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
        echo "  LOG FILE: $ap"
        grep -iE 'file_transfer|file transfer|app.prepare_transfer|incoming|connected from|files received' "$ap" 2>/dev/null | while IFS= read -r line; do echo "  [!!!] $line"; ad_hits=$((ad_hits+1)); done
    done
    [ "${ad_hits:-0}" -eq 0 ] && echo "  [OK] No file transfer or suspicious connection traces in AnyDesk logs."
} >> "$OUT_14J"

show_step "MINECRAFT" "Completed. Files: 14a-14j." "green"
}

# ==============================================================================
#  MODULE: MISC (15)
# ==============================================================================
run_misc() {
show_step "MISC" "Core dumps, shell history, users, event logs..." "cyan"

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
            echo "  === SUSPICIOUS LINES ==="
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
        echo "  ---- macOS Unified Log - auth events ----"
        SINCE_LOG2=$(date -v "-${DAYS}d" '+%Y-%m-%d %H:%M:%S' 2>/dev/null || echo "")
        [ -n "$SINCE_LOG2" ] && log show --start "$SINCE_LOG2" --predicate 'category == "authentication"' --style syslog --no-pager 2>/dev/null | head -100
    else
        echo "  ---- journald auth events ----"
        command -v journalctl &>/dev/null && journalctl --since "$(date -d "@$DATE_LIMIT_EPOCH" '+%Y-%m-%d %H:%M:%S' 2>/dev/null)" -u sshd -u sudo --no-pager -q 2>/dev/null | head -100
        for logf in /var/log/auth.log /var/log/secure; do
            [ -f "$logf" ] || continue; echo ""; echo "  ---- $logf ----"; tail -100 "$logf"
        done
    fi
} >> "$OUT_EVLOG"

show_step "MISC" "Completed." "green"
}

# ==============================================================================
#  MODULE: SYSTEM INFO (16)
# ==============================================================================
run_system_info() {
show_step "SYSTEM INFO" "VM detection, VPN, hardware..." "cyan"

OUT_SYS="$ROOT/16_SystemInfo/System_$TS.txt"
write_header "$OUT_SYS" "SYSTEM INFO [16] - VM / VPN / HARDWARE" ""

IS_VM=false; VM_INFO=""
{
    echo "  ---- VIRTUAL MACHINE ----"
    if [ "$OS" = "macos" ]; then
        hw_model=$(sysctl -n hw.model 2>/dev/null || echo "?")
        if echo "$hw_model" | grep -qiE 'VMware|VirtualBox|Parallels|QEMU|HVM'; then IS_VM=true; VM_INFO="$hw_model"; echo "  [!!!] VIRTUAL ENVIRONMENT DETECTED: $hw_model"
        else echo "  [OK]  Physical hardware: $hw_model"; fi
    else
        if command -v systemd-detect-virt &>/dev/null; then
            virt=$(systemd-detect-virt 2>/dev/null || echo "none")
            if [ "$virt" != "none" ] && [ -n "$virt" ]; then IS_VM=true; VM_INFO="$virt"; echo "  [!!!] VIRTUAL ENVIRONMENT DETECTED: $virt"
            else echo "  [OK]  Physical hardware (systemd-detect-virt: none)"; fi
        fi
        if ! $IS_VM && [ -f /proc/cpuinfo ] && grep -qiE 'hypervisor|VMware|VirtualBox|QEMU|Xen|KVM' /proc/cpuinfo 2>/dev/null; then
            IS_VM=true; VM_INFO=$(grep -iE 'hypervisor|VMware|VirtualBox|QEMU|Xen|KVM' /proc/cpuinfo | head -1)
            echo "  [!!!] VIRTUAL ENVIRONMENT (/proc/cpuinfo): $VM_INFO"
        fi
        $IS_VM || echo "  [OK]  Physical hardware."
    fi

    echo ""; echo "  ---- ACTIVE VPN ----"
    VPN_FOUND=false
    if [ "$OS" = "macos" ]; then
        ifconfig 2>/dev/null | grep -E '^utun|^ppp|^tap|^tun' | while IFS= read -r line; do echo "  [!!!] VPN/TUNNEL: $line"; VPN_FOUND=true; done
    else
        ip link show 2>/dev/null | grep -E 'tun[0-9]|tap[0-9]|wg[0-9]|ppp[0-9]|vpn|proton|nord' | while IFS= read -r line; do echo "  [!!!] VPN/TUNNEL: $line"; VPN_FOUND=true; done
    fi
    $VPN_FOUND || echo "  [OK]  No VPN interface detected."

    echo ""; echo "  ---- HARDWARE ----"
    if [ "$OS" = "macos" ]; then
        echo "  CPU  : $(sysctl -n machdep.cpu.brand_string 2>/dev/null)"
        echo "  RAM  : $(($(sysctl -n hw.memsize 2>/dev/null || echo 0) / 1024 / 1024 / 1024)) GB"
        echo "  GPU  : $(system_profiler SPDisplaysDataType 2>/dev/null | grep 'Chipset Model:' | head -1 | awk -F': ' '{print $2}')"
        echo "  Model: $(sysctl -n hw.model 2>/dev/null)"
    else
        echo "  CPU  : $(grep 'model name' /proc/cpuinfo 2>/dev/null | head -1 | awk -F': ' '{print $2}' | xargs)"
        RAM_GB=$(python3 -c "
try:
    with open('/proc/meminfo') as f:
        for line in f:
            if 'MemTotal' in line: print(int(line.split()[1]) // 1024 // 1024); break
except: print('?')
" 2>/dev/null || echo "?")
        echo "  RAM  : $RAM_GB GB"
        command -v lspci &>/dev/null && echo "  GPU  : $(lspci 2>/dev/null | grep -iE 'VGA|3D|Display' | head -1)"
    fi
    echo "  OS   : $SYS_NAME (Build $SYS_BUILD)"
} >> "$OUT_SYS"

echo "IS_VM=\"$IS_VM\"" > "$ROOT/sysinfo_vars.txt"
echo "VM_INFO=\"$VM_INFO\"" >> "$ROOT/sysinfo_vars.txt"
echo "VPN_ACTIVE=\"$VPN_FOUND\"" >> "$ROOT/sysinfo_vars.txt"

show_step "SYSTEM INFO" "Completed." "green"
}

# ==============================================================================
#  MODULE: NETWORK (17)
# ==============================================================================
run_network() {
show_step "NETWORK" "TCP connections, hosts file, DNS cache..." "cyan"

OUT_NET="$ROOT/17_Network/Network_$TS.txt"
write_header "$OUT_NET" "NETWORK [17] - CONNECTIONS AND DNS" ""
{
    echo "  ---- ACTIVE TCP CONNECTIONS ----"
    if $HAS_SS; then ss -tnp 2>/dev/null | tail -n +2 | while IFS= read -r line; do echo "  [TCP] $line"; done
    elif $HAS_NETSTAT; then netstat -tnp 2>/dev/null | grep ESTABLISHED | while IFS= read -r line; do echo "  [TCP] $line"; done
    elif $HAS_LSOF; then lsof -i TCP -n -P 2>/dev/null | grep ESTABLISHED | while IFS= read -r line; do echo "  [TCP] $line"; done
    fi

    echo ""; echo "  ---- HOSTS FILE ----"
    grep -v '^#' /etc/hosts 2>/dev/null | grep -v '^[[:space:]]*$' | while IFS= read -r line; do echo "  [HST] $line"; done

    echo ""; echo "  ---- DNS CACHE ----"
    if [ "$OS" = "macos" ]; then
        dscacheutil -cachedump -entries all 2>/dev/null | head -100 | while IFS= read -r line; do echo "  [DNS] $line"; done
    else
        command -v resolvectl &>/dev/null && resolvectl statistics 2>/dev/null | while IFS= read -r line; do echo "  [DNS] $line"; done
    fi

    echo ""; echo "  ---- NETWORK INTERFACES ----"
    if [ "$OS" = "macos" ]; then ifconfig 2>/dev/null | grep -E '^[a-z]|inet ' | while IFS= read -r line; do echo "  $line"; done
    else command -v ip &>/dev/null && ip addr show 2>/dev/null | while IFS= read -r line; do echo "  $line"; done; fi
} >> "$OUT_NET"

show_step "NETWORK" "Completed." "green"
}

# ==============================================================================
#  MODULE: CHEAT SELF-DESTRUCT (18)
# ==============================================================================
run_cheat_selfdestr() {
show_step "CHEAT SELFDESTR" "Cheat client trace detection..." "cyan"

OUT_CHEAT="$ROOT/15_Misc/CheatSelfDestruct_$TS.txt"
write_header "$OUT_CHEAT" "MODULE 18 - CHEAT SELF-DESTRUCT DETECTION" "Traces of self-deleting cheat clients"
CHEAT_ALERT_COUNT=0
> "$ROOT/cheat_alerts_tmp.txt"

{
    echo "================================================================"
    echo "  [18a] CHEAT .jar FILES - Filesystem scan"
    echo "================================================================"
    found=0
    for drv in "${SEARCH_ROOTS[@]}"; do
        [ -d "$drv" ] || continue
        find "$drv" -maxdepth 10 $EXCLUDE_PRUNE -o \( -name "*.jar" -print \) 2>/dev/null | grep -iE "$CHEAT_PAT" | while read -r f; do
            cname=$(get_cheat_name "$(basename "$f")")
            tag=$(file_in_range "$f" && echo "[!!!] IN INTERVAL" || echo "[ - ] outside interval")
            echo "  $tag  [$cname]  $f  ($(file_mtime_str "$f"))"
            echo "File .jar|$cname|$f|-" >> "$ROOT/cheat_alerts_tmp.txt"
        done
    done

    echo ""; echo "================================================================"
    echo "  [18b] CHEAT FOLDERS / FILES in Minecraft paths"
    echo "================================================================"
    SEARCH_DIRS=("$HOME" "/tmp" "/var/tmp")
    for base in "${MC_BASE_DIRS[@]}"; do SEARCH_DIRS+=("$base/mods" "$base/config" "$base"); done
    for sd in "${SEARCH_DIRS[@]}"; do
        [ -d "$sd" ] || continue
        find "$sd" -maxdepth 4 $EXCLUDE_PRUNE -o -print 2>/dev/null | grep -iE "$CHEAT_PAT" | while read -r f; do
            cname=$(get_cheat_name "$(basename "$f")")
            is_empty=false; [ -d "$f" ] && [ -z "$(ls -A "$f" 2>/dev/null)" ] && is_empty=true
            empty_tag=$($is_empty && echo " [EMPTY - probable self-destruction]" || true)
            echo "  [!!!] [$cname]  $f  |  $(file_mtime_str "$f")$empty_tag"
            tipo="File/Folder Cheat"; $is_empty && tipo="Ghost Folder"
            echo "$tipo|$cname|$f|-" >> "$ROOT/cheat_alerts_tmp.txt"
        done
    done

    echo ""; echo "================================================================"
    echo "  [18c] CLEANUP / SELF-DESTRUCT SCRIPTS"
    echo "================================================================"
    SCRIPT_DIRS=("/tmp" "/var/tmp" "$HOME" "$HOME/Desktop" "$HOME/Downloads")
    for sd in "${SCRIPT_DIRS[@]}"; do
        [ -d "$sd" ] || continue
        find "$sd" -maxdepth 3 $EXCLUDE_PRUNE -o \( -type f \( -name "*.sh" -o -name "*.py" -o -name "*.bash" \) -print \) 2>/dev/null | while read -r f; do
            file_in_range "$f" || continue
            content=$(cat "$f" 2>/dev/null || true)
            has_cheat=false; has_cleanup=false
            echo "$content" | grep -qiE "$CHEAT_PAT" && has_cheat=true
            echo "$content" | grep -qiE 'rm -rf|shred|wipe|cleanup|self.?destruct|srm' && has_cleanup=true
            ($has_cheat || $has_cleanup) || continue
            cname=$($has_cheat && get_cheat_name "$content" || echo "Script Cleanup")
            echo "  [!!!] Suspicious script [$cname]: $f  |  $(file_mtime_str "$f")"
            echo "Script Cleanup|$cname|$f|-" >> "$ROOT/cheat_alerts_tmp.txt"
        done
    done

    echo ""; echo "================================================================"
    echo "  [18d] HISTORY TRACES - Cheat commands"
    echo "================================================================"
    for u in "${USER_HOMES[@]:-}"; do
        [ -d "$u" ] || continue
        for hf in "$u/.bash_history" "$u/.zsh_history"; do
            [ -f "$hf" ] || continue
            grep -niE "$CHEAT_PAT" "$hf" 2>/dev/null | while IFS= read -r line; do
                cname=$(get_cheat_name "$line")
                echo "  [!!!] [$cname] $hf: $line"
                echo "History|$cname|$hf: $line|-" >> "$ROOT/cheat_alerts_tmp.txt"
            done
        done
    done

    echo ""; echo "================================================================"
    echo "  [18e] ACTIVE PROCESSES - Cheat traces"
    echo "================================================================"
    if [ "$OS" = "linux" ]; then
        for pid in /proc/[0-9]*/cmdline; do
            cmd=$(tr '\0' ' ' < "$pid" 2>/dev/null || true)
            echo "$cmd" | grep -qiE "$CHEAT_PAT" && { cname=$(get_cheat_name "$cmd"); echo "  [!!!] ACTIVE PROCESS [$cname]: $cmd"; echo "Process|$cname|$cmd|-" >> "$ROOT/cheat_alerts_tmp.txt"; }
        done
    else
        ps aux 2>/dev/null | grep -iE "$CHEAT_PAT" | grep -v grep | while IFS= read -r line; do
            cname=$(get_cheat_name "$line"); echo "  [!!!] ACTIVE PROCESS [$cname]: $line"
            echo "Process|$cname|$line|-" >> "$ROOT/cheat_alerts_tmp.txt"
        done
    fi

    echo ""; echo "================================================================"
    echo "  [18f] JVM ARGS - Suspicious javaagent/noverify"
    echo "================================================================"
    if [ "$OS" = "linux" ]; then
        for pid in /proc/[0-9]*/cmdline; do
            cmd=$(tr '\0' ' ' < "$pid" 2>/dev/null || true)
            echo "$cmd" | grep -qiE '-javaagent|-noverify|-XX:-UseSplitVerifier|-Xbootclasspath|org.lwjgl.librarypath' && {
                echo "  [!!!] SUSPICIOUS JVM ARGS: $cmd"
                echo "JVM Args|Unknown|$cmd|-" >> "$ROOT/cheat_alerts_tmp.txt"
            }
        done
    else
        ps aux 2>/dev/null | grep -iE '-javaagent|-noverify|-XX:-UseSplitVerifier|-Xbootclasspath|org.lwjgl.librarypath' | grep -v grep | while IFS= read -r line; do
            echo "  [!!!] SUSPICIOUS JVM ARGS: $line"
            echo "JVM Args|Unknown|$line|-" >> "$ROOT/cheat_alerts_tmp.txt"
        done
    fi

    echo ""; echo "================================================================"
    echo "  [18g] NATIVE LIBRARIES in Temp (.so / .dylib)"
    echo "================================================================"
    while IFS= read -r f; do
        [ -f "$f" ] || continue
        file_in_range "$f" && { echo "  [!!!] Recent native library in temp: $f  |  Modified: $(file_mtime_str "$f")"; echo "Temp DLL|Possible Injector / JNI|$f|-" >> "$ROOT/cheat_alerts_tmp.txt"; }
    done < <(find /tmp /var/tmp "$HOME/.cache" -type f \( -name "*.so" -o -name "*.dylib" \) 2>/dev/null)

    echo ""; echo "================================================================"
    echo "  [18h] DNS CACHE - Cheat server domains"
    echo "================================================================"
    DNS_DATA=""
    if [ "$OS" = "macos" ]; then DNS_DATA=$(dscacheutil -cachedump -entries all 2>/dev/null)
    else command -v resolvectl &>/dev/null && DNS_DATA=$(resolvectl statistics 2>/dev/null); fi
    if [ -n "$DNS_DATA" ]; then
        echo "$DNS_DATA" | grep -iE 'doomsdayclient.me|vape.gg|drip.gg|entropy.club|astolfo.lgbt|intent.store|riseclient.com|novoline.lol|cheat.gq|speas.cc' | while IFS= read -r line; do
            cname=$(get_cheat_name "$line")
            echo "  [!!!] DNS cache cheat trace: $line"
            echo "DNS Cache|$cname|$line|-" >> "$ROOT/cheat_alerts_tmp.txt"
        done
    fi

    echo ""; echo "================================================================"
    echo "  [18i] BROWSER HISTORY - Cheat download traces"
    echo "================================================================"
    while IFS=$'\t' read -r cname path; do
        [ -n "$cname" ] || continue
        echo "  [!!!] Browser History ($cname): $path"
        echo "Browser History|$cname|$path|-" >> "$ROOT/cheat_alerts_tmp.txt"
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
    return "Unknown"
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
    echo "  TOTAL SELF-DESTRUCT ALERTS: $CHEAT_ALERT_COUNT"
    echo "================================================================"
} >> "$OUT_CHEAT"

show_step "CHEAT SELFDESTR" "Completed. $CHEAT_ALERT_COUNT alerts." "$([ "$CHEAT_ALERT_COUNT" -gt 0 ] && echo yellow || echo green)"
}

# ==============================================================================
#  MODULE: NICK SEARCH
# ==============================================================================
run_nick_search() {
show_step "NICK SEARCH" "Searching for nicknames across filesystem..." "cyan"

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
    GLOBAL_NICKS+=("$n	IAS Log	$lpath	$t	UUID: $u | Online: $ol")
done

printf '%s\n' "${GLOBAL_NICKS[@]:-}" | sort -u > "$ROOT/nick_search_tmp.txt"
NICK_COUNT=$(wc -l < "$ROOT/nick_search_tmp.txt" | xargs)
show_step "NICK SEARCH" "Found $NICK_COUNT unique nicknames." "green"
}

# ==============================================================================
#  MAIN EXECUTION
# ==============================================================================
run_minecraft

NUM_CORES=$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || grep -c ^processor /proc/cpuinfo 2>/dev/null || echo 1)

if [ "$NUM_CORES" -gt 1 ]; then
    show_step "SISTEMA" "Multi-core mode: $NUM_CORES cores. Running modules in parallel..." "green"
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
    show_step "SISTEMA" "All parallel modules completed." "green"
else
    show_step "SISTEMA" "Single-core mode. Sequential execution..." "yellow"
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
show_step "DASHBOARD" "Generating HTML..." "cyan"
DASH_PATH="$ROOT/DASHBOARD_$TS.html"

export ACC_JSON="[" FIRST=true
for acc in "${ALL_ACCOUNTS[@]:-}"; do
    n="${acc%%|*}"; rest="${acc#*|}"; u="${rest%%|*}"; rest="${rest#*|}"; t="${rest%%|*}"; rest="${rest#*|}"; ol="${rest%%|*}"; rest="${rest#*|}"; lname="${rest}"
    n="${n//\"/\\\"}"; u="${u//\"/\\\"}"; t="${t//\"/\\\"}"; lname="${lname//\"/\\\"}"
    $FIRST || ACC_JSON+=","; FIRST=false
    ACC_JSON+="{\"name\":\"$n\",\"uuid\":\"$u\",\"type\":\"$t\",\"online\":\"$ol\",\"launcher\":\"$lname\"}"
done
ACC_JSON+="]"

export IAS_JSON="["; FIRST=true
for entry in "${IAS_LOG_ENTRIES[@]:-}"; do
    t="${entry%%|*}"; rest="${entry#*|}"; n="${rest%%|*}"; rest="${rest#*|}"; u="${rest%%|*}"; rest="${rest#*|}"; ol="${rest%%|*}"; rest="${rest#*|}"; lname="${rest%%|*}"; rest="${rest#*|}"; lpath="${rest}"
    n="${n//\"/\\\"}"; u="${u//\"/\\\"}"; lname="${lname//\"/\\\"}"; lpath="${lpath//\"/\\\"}"
    $FIRST || IAS_JSON+=","; FIRST=false
    IAS_JSON+="{\"time\":\"$t\",\"name\":\"$n\",\"uuid\":\"$u\",\"online\":\"$ol\",\"launcher\":\"$lname\",\"logpath\":\"$lpath\"}"
done
IAS_JSON+="]"

export NICK_JSON="["; FIRST=true
for nline in "${GLOBAL_NICKS[@]:-}"; do
    nick="${nline%%	*}"; rest="${nline#*	}"; fonte="${rest%%	*}"; rest="${rest#*	}"; path="${rest%%	*}"; rest="${rest#*	}"; data="${rest%%	*}"; note="${rest#*	}"
    nick="${nick//\"/\\\"}"; fonte="${fonte//\"/\\\"}"; path="${path//\"/\\\"}"; note="${note//\"/\\\"}"
    $FIRST || NICK_JSON+=","; FIRST=false
    NICK_JSON+="{\"nick\":\"$nick\",\"fonte\":\"$fonte\",\"path\":\"$path\",\"data\":\"$data\",\"note\":\"$note\"}"
done
NICK_JSON+="]"

export CHEAT_ALERTS_JSON="["; FIRST=true
while IFS='|' read -r tipo cname det drv; do
    [ -n "$tipo" ] || continue
    tipo="${tipo//\"/\\\"}"; cname="${cname//\"/\\\"}"; det="${det//\"/\\\"}"; drv="${drv//\"/\\\"}"
    $FIRST || CHEAT_ALERTS_JSON+=","; FIRST=false
    CHEAT_ALERTS_JSON+="{\"tipo\":\"$tipo\",\"cheat\":\"$cname\",\"dettaglio\":\"$det\",\"drive\":\"$drv\"}"
done < "$ROOT/cheat_alerts_tmp.txt" 2>/dev/null
CHEAT_ALERTS_JSON+="]"
rm -f "$ROOT/cheat_alerts_tmp.txt"

export OS_NAME="$OS" DISTRO HOSTNAME="$(hostname 2>/dev/null || echo '?')" SYS_NAME SYS_BUILD DAYS DATE_LIMIT_STR TS ROOT NICK_COUNT CHEAT_ALERT_COUNT

python3 << 'PYEOF'
import json, html as h, os, sys

def he(s): return h.escape(str(s) if s else "")

accounts = json.loads(os.environ.get("ACC_JSON","[]"))
ias = json.loads(os.environ.get("IAS_JSON","[]"))
nicks = json.loads(os.environ.get("NICK_JSON","[]"))
cheat_alerts = json.loads(os.environ.get("CHEAT_ALERTS_JSON","[]"))
os_name = os.environ.get("OS_NAME","unknown")
distro = os.environ.get("DISTRO","")
sys_name = os.environ.get("SYS_NAME","")
sys_build = os.environ.get("SYS_BUILD","")
days = int(os.environ.get("DAYS","0"))
date_limit = os.environ.get("DATE_LIMIT_STR","")
ts = os.environ.get("TS","")
root_dir = os.environ.get("ROOT","/tmp")
nick_count = int(os.environ.get("NICK_COUNT","0"))
cheat_count = int(os.environ.get("CHEAT_ALERT_COUNT","0"))
hostname = os.environ.get("HOSTNAME","?")

multi_acc = len(set(a["name"] for a in accounts)) > 1
alert_count = (1 if multi_acc else 0) + (1 if len(ias) > 1 else 0) + (1 if cheat_count > 0 else 0)

def make_table(rows, cols, empty="No data."):
    if not rows: return f"<p class='empty'>{empty}</p>"
    s = "<div class='table-wrap'><table><thead><tr>" + "".join(f"<th>{he(c)}</th>" for c in cols) + "</tr></thead><tbody>"
    for r in rows: s += "<tr>" + "".join(f"<td>{he(r.get(c,''))}</td>" for c in cols) + "</tr>"
    return s + "</tbody></table></div>"

CSS = """@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');:root{--bg:#080b14;--bg2:#0e1220;--bg3:#141828;--bg4:#1a1f2e;--border:#1e2540;--border2:#252d45;--accent:#5865f2;--accent2:#7983f5;--accent3:#a5acf9;--green:#10b981;--green2:#34d399;--red:#ef4444;--red2:#f87171;--orange:#f97316;--orange2:#fb923c;--text:#e8eaf6;--text2:#8891b4;--text3:#4a5378;--radius:12px;--radius-sm:8px;--shadow-sm:0 2px 12px rgba(0,0,0,.4);--glow-r:0 0 20px rgba(239,68,68,.25);--glow-g:0 0 20px rgba(16,185,129,.2);--glow-a:0 0 20px rgba(88,101,242,.25)}*{box-sizing:border-box;margin:0;padding:0}body{background:var(--bg);color:var(--text);font-family:'Inter',system-ui,sans-serif;font-size:14px;line-height:1.65}.site-header{background:linear-gradient(135deg,#0d1021,#0e1525,#0f1020);border-bottom:1px solid var(--border);padding:18px 28px 16px}.header-inner{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}.header-brand{display:flex;align-items:center;gap:14px}.header-logo{width:42px;height:42px;background:linear-gradient(135deg,var(--accent),#06b6d4);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 0 16px rgba(88,101,242,.4)}.header-title{font-size:20px;font-weight:800;background:linear-gradient(90deg,#fff,var(--accent3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.header-sub{font-size:12px;color:var(--text2)}nav{position:sticky;top:0;z-index:100;background:rgba(8,11,20,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);display:flex;gap:2px;padding:0 20px;height:48px;overflow-x:auto}nav a{color:var(--text2);text-decoration:none;padding:5px 13px;border-radius:6px;white-space:nowrap;font-size:12.5px;font-weight:500;border:1px solid transparent}nav a:hover{background:var(--bg4);color:var(--text)}.page{display:none;padding:24px 28px;max-width:1440px;margin:0 auto;animation:fi .25s}.page.active{display:block}@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}section{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px 22px;margin-bottom:16px;box-shadow:var(--shadow-sm)}section h2{font-size:13.5px;font-weight:700;color:var(--accent3);margin-bottom:14px;display:flex;align-items:center;gap:8px}.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:16px}@media(max-width:1000px){.grid-4{grid-template-columns:1fr 1fr}}@media(max-width:700px){.grid-2,.grid-4{grid-template-columns:1fr}}.stat{background:var(--bg3);border:1px solid var(--border2);border-radius:var(--radius);padding:18px 20px;display:flex;flex-direction:column;gap:5px;position:relative;overflow:hidden}.stat .label{font-size:10.5px;text-transform:uppercase;letter-spacing:.1em;color:var(--text3);font-weight:600}.stat .value{font-size:28px;font-weight:800;line-height:1.1}.stat .sub{font-size:11.5px;color:var(--text2)}.stat.alert{border-color:rgba(239,68,68,.5);background:rgba(239,68,68,.07);box-shadow:var(--glow-r)}.stat.alert .value{color:var(--red2)}.stat.warn{border-color:rgba(249,115,22,.45);background:rgba(249,115,22,.07)}.stat.warn .value{color:var(--orange2)}.stat.ok{border-color:rgba(16,185,129,.4);background:rgba(16,185,129,.06);box-shadow:var(--glow-g)}.stat.ok .value{color:var(--green2)}.stat.info{border-color:rgba(88,101,242,.4);background:rgba(88,101,242,.06);box-shadow:var(--glow-a)}.stat.info .value{color:var(--accent2)}.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 11px;border-radius:20px;font-size:11.5px;font-weight:700}.badge.red{background:rgba(239,68,68,.18);color:var(--red2);border:1px solid rgba(239,68,68,.4)}.badge.green{background:rgba(16,185,129,.15);color:var(--green2);border:1px solid rgba(16,185,129,.35)}.badge.orange{background:rgba(249,115,22,.15);color:var(--orange2);border:1px solid rgba(249,115,22,.35)}.badge.purple{background:rgba(88,101,242,.18);color:var(--accent3);border:1px solid rgba(88,101,242,.3)}.badge.cyan{background:rgba(6,182,212,.15);color:#67e8f9;border:1px solid rgba(6,182,212,.3)}.table-wrap{overflow-x:auto;border-radius:var(--radius-sm);border:1px solid var(--border)}table{width:100%;border-collapse:collapse;font-size:12.5px}thead tr{background:var(--bg4)}th{padding:9px 14px;text-align:left;font-weight:600;color:var(--text2);font-size:10.5px;text-transform:uppercase;border-bottom:1px solid var(--border2);white-space:nowrap}td{padding:9px 14px;border-bottom:1px solid rgba(30,37,64,.8);vertical-align:top}tr:last-child td{border-bottom:none}tr:hover td{background:rgba(88,101,242,.04)}.nick-grid{display:flex;flex-wrap:wrap;gap:10px}.nick-card{background:var(--bg3);border:1px solid var(--border2);border-radius:var(--radius-sm);padding:11px 16px;min-width:150px}.nick-card:hover{border-color:var(--accent)}.nick-card .nick-name{font-size:15px;font-weight:700;margin-bottom:5px}.nick-card .nick-src{font-size:11px;color:var(--text3)}.ias-block{background:linear-gradient(135deg,rgba(249,115,22,.07),rgba(249,115,22,.03));border:1px solid rgba(249,115,22,.25);border-left:3px solid var(--orange);border-radius:0 var(--radius-sm) var(--radius-sm) 0;padding:14px 18px;margin-bottom:10px}.ias-block .ias-title{font-weight:700;color:var(--orange2);margin-bottom:10px;font-size:13px}.ias-block .ias-row{display:flex;gap:10px;margin-bottom:4px;font-size:13px}.ias-block .ias-key{color:var(--text3);min-width:65px;font-size:11.5px;text-transform:uppercase}.ias-block .ias-val{font-weight:600}.alert-box{border-radius:var(--radius-sm);padding:13px 16px;margin-bottom:10px;display:flex;gap:12px;align-items:flex-start}.alert-box.critical{background:linear-gradient(135deg,rgba(239,68,68,.12),rgba(239,68,68,.06));border:1px solid rgba(239,68,68,.4)}.alert-box.warning{background:linear-gradient(135deg,rgba(249,115,22,.1),rgba(249,115,22,.05));border:1px solid rgba(249,115,22,.38)}.alert-box.info2{background:linear-gradient(135deg,rgba(88,101,242,.1),rgba(88,101,242,.05));border:1px solid rgba(88,101,242,.3)}.alert-box.success{background:linear-gradient(135deg,rgba(16,185,129,.1),rgba(16,185,129,.05));border:1px solid rgba(16,185,129,.3)}.alert-box .a-icon{font-size:20px;flex-shrink:0}.alert-box .a-title{font-weight:700;font-size:13.5px;margin-bottom:2px}.alert-box .a-body{font-size:12px;color:var(--text2)}.alert-box.critical .a-title{color:var(--red2)}.alert-box.warning .a-title{color:var(--orange2)}.overview-hero{background:linear-gradient(135deg,var(--bg2),var(--bg3),var(--bg2));border:1px solid var(--border2);border-radius:var(--radius);padding:24px 28px;margin-bottom:20px}.overview-title{font-size:24px;font-weight:800;background:linear-gradient(90deg,#fff,var(--accent3) 60%,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:6px}.overview-meta{font-size:12.5px;color:var(--text2);display:flex;align-items:center;gap:12px;flex-wrap:wrap}.kv-list{display:grid;grid-template-columns:auto 1fr;gap:5px 18px;font-size:13px}.kv-list .kk{color:var(--text3);white-space:nowrap;font-size:12px;text-transform:uppercase}.kv-list .vv{font-weight:500}.mono-block{background:var(--bg);border-radius:var(--radius-sm);padding:11px 16px;font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--text2);white-space:pre-wrap;word-break:break-all;max-height:320px;overflow-y:auto;border:1px solid var(--border)}.empty{color:var(--text3);font-style:italic;font-size:13px;padding:10px 0}.chip{display:inline-block;padding:2px 9px;border-radius:12px;font-size:11px;background:rgba(88,101,242,.15);color:var(--accent3);margin:2px;border:1px solid rgba(88,101,242,.2)}hr.sh{border:none;border-top:1px solid var(--border);margin:16px 0}::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:4px}"""

cheat_badge = f'<span class="badge red">{cheat_count} Cheat</span>' if cheat_count > 0 else '<span class="badge green">No Cheat</span>'
multi_badge = f'<span class="badge orange">{len(accounts)} accounts</span>' if multi_acc else '<span class="badge green">1 account</span>'

# Pages
overview = f"""<div class='page active' id='page-overview'>
<div class='overview-hero'><div class='overview-title'>&#9732; Screen Share Analysis</div>
<div class='overview-meta'><span>{he(sys_name)} Build {he(sys_build)}</span><span>Analysis: last {days} days</span><span>{he(date_limit)} &rarr; now</span><span>OS: {he(os_name)} {he(distro)}</span></div></div>"""
if alert_count > 0:
    overview += "<section><h2>&#9888; Critical Alerts</h2>"
    if multi_acc: overview += f"<div class='alert-box warning'><div class='a-icon'>&#128100;</div><div><div class='a-title'>Multiple Accounts Found ({len(accounts)})</div></div></div>"
    if len(ias) > 1: overview += f"<div class='alert-box warning'><div class='a-icon'>&#128260;</div><div><div class='a-title'>IAS Account Switches: {len(ias)}</div></div></div>"
    if cheat_count > 0: overview += f"<div class='alert-box critical'><div class='a-icon'>&#128683;</div><div><div class='a-title'>Cheat Client Traces: {cheat_count}</div></div></div>"
    overview += "</section>"

c1="warn" if multi_acc else "ok"; c2="warn" if ias else "ok"; c4="alert" if cheat_count > 0 else "ok"
overview += f"""<div class='grid-4'>
<div class='stat {c1}'><div class='label'>Accounts</div><div class='value'>{len(accounts)}</div><div class='sub'>{multi_badge}</div></div>
<div class='stat {c2}'><div class='label'>IAS Switches</div><div class='value'>{len(ias)}</div><div class='sub'>in scanned logs</div></div>
<div class='stat ok'><div class='label'>OS</div><div class='value'>{he(os_name)}</div><div class='sub'><span class="badge cyan">{he(distro)}</span></div></div>
<div class='stat {c4}'><div class='label'>Cheat Traces</div><div class='value'>{cheat_count}</div><div class='sub'>{cheat_badge}</div></div>
</div>
<div class='stat info' style='margin-bottom:16px'><div class='label'>Unique Nicknames</div><div class='value'>{nick_count}</div></div>
<div class='grid-2'>
<section><h2>&#127918; Top Nicknames</h2><div class='nick-grid'>"""
seen_n = set()
for n in nicks[:12]:
    if n["nick"] in seen_n: continue; seen_n.add(n["nick"])
    ias_m = next((e for e in ias if e["name"] == n["nick"]), None)
    dot = "#22c55e" if (ias_m and ias_m["online"]=="true") else ("#f97316" if (ias_m and ias_m["online"]=="false") else "#64748b")
    overview += f"<div class='nick-card'><div class='nick-name'><span style='display:inline-block;width:7px;height:7px;border-radius:50%;background:{dot};margin-right:5px'></span>{he(n['nick'])}</div><div class='nick-src'>{he(n['fonte'])}</div></div>"
if not nicks: overview += "<p class='empty'>No nicknames found.</p>"
overview += "</div></section></div></div>"

nicks_page = f"""<div class='page' id='page-nicks'>
<section><h2>&#127918; All Nicknames Found <span class='badge purple'>{nick_count} unique</span></h2>
<div class='nick-grid' style='margin-bottom:18px'>"""
seen_n = set()
for n in sorted(nicks, key=lambda x: x["nick"].lower()):
    if n["nick"] in seen_n: continue; seen_n.add(n["nick"])
    ias_m = next((e for e in ias if e["name"] == n["nick"]), None)
    dot = "#22c55e" if (ias_m and ias_m["online"]=="true") else ("#f97316" if (ias_m and ias_m["online"]=="false") else "#64748b")
    nicks_page += f"<div class='nick-card'><div class='nick-name'><span style='display:inline-block;width:7px;height:7px;border-radius:50%;background:{dot};margin-right:5px'></span>{he(n['nick'])}</div><div class='nick-src'>{he(n['fonte'])}</div></div>"
nicks_page += "</div><hr class='sh'>"
nick_rows = [{"Nick":n["nick"],"Source":n["fonte"],"Date":n["data"],"Note":n["note"]} for n in nicks]
nicks_page += make_table(nick_rows, ["Nick","Source","Date","Note"], "No nicknames found.") + "</section></div>"

acc_page = f"""<div class='page' id='page-accounts'>
<section><h2>&#128100; Extracted Accounts <span class='badge {"orange" if multi_acc else "green"}'>{len(accounts)} account{"s" if len(accounts)!=1 else ""}</span></h2>"""
from itertools import groupby as gby
for ln, grp in gby(sorted(accounts, key=lambda x: x["launcher"]), key=lambda x: x["launcher"]):
    grp = list(grp)
    acc_page += f"<h3 style='font-size:13px;color:var(--accent2);margin:12px 0 8px'>{he(ln)}</h3>"
    acc_page += make_table([{"Nick":a["name"],"UUID":a["uuid"],"Type":a["type"],"Online":a["online"]} for a in grp], ["Nick","UUID","Type","Online"])
if not accounts: acc_page += "<p class='empty'>No accounts extracted.</p>"
acc_page += "</section></div>"

ias_page = f"""<div class='page' id='page-ias'>
<section><h2>&#128260; InGame Account Switcher - Account Switch Log</h2>"""
if not ias:
    ias_page += "<p class='empty'>No IAS account switches found in scanned logs.</p>"
else:
    if len(ias) > 1: ias_page += f"<div class='alert-box warning' style='margin-bottom:14px'><div class='a-icon'>&#9888;</div><div><div class='a-title'>{len(ias)} account switches detected</div></div></div>"
    for i, blk in enumerate(ias):
        dot = "#22c55e" if blk["online"]=="true" else ("#f97316" if blk["online"]=="false" else "#94a3b8")
        lbl = "OFFLINE / CRACKED" if blk["online"]=="false" else ("Online (premium)" if blk["online"]=="true" else "Unknown")
        ias_page += f"""<div class='ias-block'><div class='ias-title'>Switch #{i+1} &mdash; {he(blk['name'])}</div>
<div class='ias-row'><span class='ias-key'>Time</span><span class='ias-val'>{he(blk['time'])}</span></div>
<div class='ias-row'><span class='ias-key'>Name</span><span class='ias-val' style='font-size:15px'>{he(blk['name'])}</span></div>
<div class='ias-row'><span class='ias-key'>UUID</span><span class='ias-val'>{he(blk['uuid'])}</span></div>
<div class='ias-row'><span class='ias-key'>Online</span><span class='ias-val' style='color:{dot}'>{lbl}</span></div>
<div class='ias-row'><span class='ias-key'>Launcher</span><span class='ias-val'>{he(blk['launcher'])}</span></div></div>"""
ias_page += "<hr class='sh'>" + make_table([{"Time":e["time"],"Name":e["name"],"UUID":e["uuid"],"Online":e["online"],"Launcher":e["launcher"]} for e in ias], ["Time","Name","UUID","Online","Launcher"], "No IAS events.") + "</section></div>"

cheats_page = f"""<div class='page' id='page-cheats'>"""
if cheat_count > 0: cheats_page += f"<div class='alert-box critical' style='margin-bottom:18px'><div class='a-icon'>&#9888;</div><div><div class='a-title'>{cheat_count} CHEAT TRACES DETECTED</div><div class='a-body'>Self-destructions, residuals, or cheat jars found on filesystem.</div></div></div>"
else: cheats_page += "<div class='alert-box info2' style='margin-bottom:18px'><div class='a-icon'>&#10003;</div><div><div class='a-title'>No cheat traces detected</div></div></div>"
cheats_page += f"<section><h2>&#128683; Full report: {root_dir}/15_Misc/CheatSelfDestruct_{ts}.txt</h2>"
cheats_rows = [{"Type":a["tipo"],"Cheat":a["cheat"],"Detail":a["dettaglio"],"Drive":a["drive"]} for a in cheat_alerts]
cheats_page += make_table(cheats_rows, ["Type","Cheat","Detail","Drive"], "No alerts generated.")

cheat_names = ["Doomsday","Sigma","Wurst","Meteor","Aristois","Impact","XRay","Inertia","Future","LiquidBounce","Vape","Ghost","Entropy","Horion","Ares","Novoline","Remix","Rise","Zeroday","Drip","Rusherhack","Tenacity","BleachHack","Raven","Omega","Phase"]
cheats_page += "<section style='margin-top:16px'><h2>&#128203; Monitored Cheat Clients</h2><div class='nick-grid'>"
for cn in cheat_names:
    hit = any(a["cheat"]==cn for a in cheat_alerts)
    dot = "var(--red)" if hit else "var(--text3)"
    label = "TRACER FOUND" if hit else "Not found"
    cheats_page += f"<div class='nick-card' style='border-color:{dot}'><div class='nick-name'>{he(cn)}</div><div class='nick-src'><span style='display:inline-block;width:6px;height:6px;border-radius:50%;background:{dot};margin-right:4px'></span>{label}</div></div>"
cheats_page += "</div></section></div>"

net_page = f"""<div class='page' id='page-network'>
<section><h2>&#127760; Network Info</h2>
<p style='color:var(--text2);font-size:12px'>Output: <code style='background:var(--bg3);padding:2px 6px;border-radius:4px'>{root_dir}/17_Network/</code></p></section></div>"""

files_page = f"""<div class='page' id='page-files'>
<section><h2>&#128193; Output Files</h2>
<p style='color:var(--text2);font-size:12px'>Root: <code style='background:var(--bg3);padding:2px 6px;border-radius:4px'>{root_dir}</code></p>
<p style='color:var(--text2);font-size:12px;margin-top:8px'>Full reports are written to the directories above. Open them for detailed analysis.</p></section></div>"""

html = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CharlieRP Screen Share Dashboard</title><style>{CSS}</style></head><body>
<div class="site-header"><div class="header-inner"><div class="header-brand"><div class="header-logo">&#9732;</div><div><div class="header-title">CharlieRP Screen Share</div><div class="header-sub">Forensic anti-cheat analysis &mdash; {he(hostname)} &mdash; {he(os_name)}</div></div></div></div></div>
<nav><a href="#" class="active" onclick="sp('overview',this)">&#127968; Overview</a><a href="#" onclick="sp('nicks',this)">&#127918; Nick</a><a href="#" onclick="sp('accounts',this)">&#128100; Account</a><a href="#" onclick="sp('ias',this)">&#128260; IAS Log</a><a href="#" onclick="sp('cheats',this)">&#128683; Cheat</a><a href="#" onclick="sp('network',this)">&#127760; Network</a><a href="#" onclick="sp('files',this)">&#128193; Files</a></nav>
{overview}{nicks_page}{acc_page}{ias_page}{cheats_page}{net_page}{files_page}
<script>
function sp(id,el){{document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active'));document.getElementById('page-'+id).classList.add('active');el.classList.add('active');window.scrollTo(0,0)}}
document.querySelectorAll('td').forEach(td=>{{const t=td.textContent.trim();if(['SI','true','ONLINE','Online (premium)'].includes(t)){{td.style.color='var(--green2)';td.style.fontWeight='600'}}if(['false','OFFLINE / CRACKED','DISABILITATO'].includes(t)||t.startsWith('TRACER')){{td.style.color='var(--red2)';td.style.fontWeight='700'}}}});
</script></body></html>"""

with open(os.environ.get("DASH_PATH","/tmp/dashboard.html"), "w", encoding="utf-8") as f: f.write(html)
print(f"  [OK] Dashboard written: {os.environ.get('DASH_PATH')}")
PYEOF

show_step "DASHBOARD" "Completed." "green"

# ==============================================================================
#  FINAL SUMMARY
# ==============================================================================
echo ""
printf '\033[90m%s\033[0m\n' "  ___________________________________________________________________"
echo ""
printf '  \033[36m[\033[0m \033[32mCOMPLETED\033[0m \033[36m]\033[0m All modules executed successfully.\n'
echo ""
printf '  System    : %s\n' "$SYS_NAME"
printf '  Interval  : Last %s days\n' "$DAYS"
printf '  Output    : %s\n' "$ROOT"
printf '  Dashboard : \033[36m%s\033[0m\n' "$DASH_PATH"
echo ""

# Open dashboard
command -v xdg-open &>/dev/null && xdg-open "$DASH_PATH" 2>/dev/null &
command -v open &>/dev/null && open "$DASH_PATH" 2>/dev/null &
