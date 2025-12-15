import config as cfg
import psutil
import os
import requests
import subprocess
import time
import shutil
from os import listdir
from os.path import isfile

class Screenshare:
    def __init__(self):
        self.cwd = os.getcwd()
        self.user_path = os.path.expanduser('~')
        self.drive_letter = os.path.splitdrive(self.cwd)[0] + os.sep
        self.win_username = os.getlogin()
        self.temp_path = os.path.join(self.drive_letter, 'Windows', 'Temp', 'Astro')
        self.javaw_pid = None
        self.mc_path = None

    def mcProcess(self):
        processi = [p for p in psutil.process_iter(attrs=['pid', 'name', 'cmdline']) if p.info['name'] and 'javaw' in p.info['name'].lower()]
        if not processi:
            input('Minecraft non trovato\nPremi invio per uscire')
            raise SystemExit
        processo = processi[0]
        self.javaw_pid = processo.info['pid']
        args = processo.info['cmdline']
        info = {}
        for i, arg in enumerate(args):
            if arg.startswith('--') and i + 1 < len(args):
                info[arg.replace('--', '')] = args[i + 1]
        self.mc_path = info.get('gameDir')
        print(f'{cfg.prefix} Minecraft trovato su PID: {self.javaw_pid}')
        if 'username' in info:
            print(f'    Username: {info["username"]}')
        if 'version' in info:
            print(f'    Versione: {info["version"]}')
        if 'gameDir' in info:
            print(f'    Percorso: {info["gameDir"]}')

    def dependencies(self):
        os.makedirs(self.temp_path, exist_ok=True)
        file_path = os.path.join(self.temp_path, 'strings2.exe')
        if not os.path.isfile(file_path):
            r = requests.get(cfg.strings2Url, timeout=15)
            with open(file_path, 'wb') as f:
                f.write(r.content)

    def getPID(self, nome, service=False):
        if service:
            output = subprocess.check_output(f'tasklist /svc /FI "Services eq {nome}"', shell=True).decode(errors='ignore').splitlines()
            for riga in output:
                if nome.lower() in riga.lower():
                    parti = riga.split()
                    if len(parti) > 1 and parti[1].isdigit():
                        return int(parti[1])
            return None
        for p in psutil.process_iter(attrs=['pid', 'name']):
            if p.info['name'] and p.info['name'].lower() == nome.lower():
                return p.info['pid']
        return None

    def dump(self, pid):
        exe = os.path.join(self.temp_path, 'strings2.exe')
        cmd = f'"{exe}" -pid {pid} -raw -nh'
        try:
            output = subprocess.check_output(cmd, shell=True, timeout=20)
            testo = output.decode(errors='ignore').replace('\\', '/')
            return list(set(testo.splitlines()))
        except Exception:
            return []

    def recordingCheck(self):
        try:
            tasks = subprocess.check_output('tasklist', shell=True).decode(errors='ignore').lower()
        except Exception:
            tasks = ''
        trovati = [x for x in cfg.recordingSoftwares if x in tasks]
        if trovati:
            for s in trovati:
                print(f'    {cfg.prefixWarning} {cfg.recordingSoftwares[s]} rilevato')
        else:
            print(f'    {cfg.prefix} Nessun software trovato')

    def modificationTimes(self):
        try:
            sid_raw = subprocess.check_output(f'wmic useraccount where name="{self.win_username}" get sid', shell=True).decode(errors='ignore')
            sid = [x for x in sid_raw.splitlines() if x and 'S-' in x][0].strip()
            recycle = os.path.join(self.drive_letter, '$Recycle.Bin', sid)
            if os.path.exists(recycle):
                t = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(os.path.getmtime(recycle)))
                print(f'    Cestino: {t}')
        except Exception:
            pass
        pid_exp = self.getPID('explorer.exe')
        if pid_exp:
            t = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(psutil.Process(pid_exp).create_time()))
            print(f'    Explorer: {t}')
        if self.javaw_pid:
            t = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(psutil.Process(self.javaw_pid).create_time()))
            print(f'    Minecraft: {t}')

    def inInstance(self):
        if not self.javaw_pid:
            return
        strings = self.dump(self.javaw_pid)
        rilevati = [f'{cfg.javawStrings[x]} ({x})' for x in strings if x in cfg.javawStrings]
        if rilevati:
            for r in rilevati:
                print(f'    {cfg.prefixWarning} {r}')
        else:
            print(f'    {cfg.prefix} Pulito')

    def outOfInstance(self):
        pid = self.getPID('DPS', service=True)
        if not pid:
            print(f'    {cfg.prefix} Servizio DPS non trovato')
            return
        strings = self.dump(pid)
        normalizzati = []
        for s in strings:
            if s.startswith('!!') and '.exe!' in s:
                parti = s.split('!')
                if len(parti) >= 4:
                    normalizzati.append('.exe!' + parti[3])
        trovati = [x for x in cfg.dpsStrings if x in normalizzati]
        if trovati:
            for t in trovati:
                print(f'    {cfg.prefixWarning} {cfg.dpsStrings[t]} ({t})')
        else:
            print(f'    {cfg.prefix} Pulito')

    def jnativehook(self):
        temp = os.path.join(self.user_path, 'AppData', 'Local', 'Temp')
        trovati = [x for x in listdir(temp) if isfile(os.path.join(temp, x)) and 'jnativehook' in x.lower() and x.lower().endswith('.dll')]
        if trovati:
            print(f'    {cfg.prefixWarning} JNativeHook rilevato ({trovati[0]})')
        else:
            print(f'    {cfg.prefix} Nessun file trovato')

    def executedDeleted(self):
        risultati = {}
        pid_pca = self.getPID('PcaSvc', service=True)
        pid_exp = self.getPID('explorer.exe')
        strings_pca = self.dump(pid_pca) if pid_pca else []
        strings_exp = self.dump(pid_exp) if pid_exp else []
        for s in strings_pca:
            s = s.lower()
            if s.startswith(self.drive_letter.lower()) and s.endswith('.exe') and not os.path.isfile(s):
                if s in strings_exp:
                    risultati[s] = '01'
        for s in strings_exp:
            s = s.lower()
            if 'pcaclient' in s and '.exe' in s:
                parti = [x for x in s.split(',') if x.endswith('.exe')]
                if parti:
                    p = parti[0]
                    if not os.path.isfile(p):
                        risultati[p] = '02'
        if risultati:
            print(f'    {cfg.prefixWarning} File eseguiti e cancellati rilevati:')
            for p, m in risultati.items():
                print(f'        {os.path.basename(p)} - {p} ({m})')
        else:
            print(f'    {cfg.prefix} Nessun file trovato')

print(f'{cfg.prefix} Avvio scansione ID: {cfg.scanID}\n')
s = Screenshare()
s.mcProcess()
s.dependencies()
print(f'{cfg.prefix} Controllo software di registrazione')
s.recordingCheck()
print(f'{cfg.prefix} Controllo date di modifica')
s.modificationTimes()
print(f'{cfg.prefix} Controlli in istanza')
s.inInstance()
print(f'{cfg.prefix} Controlli fuori istanza')
s.outOfInstance()
print(f'{cfg.prefix} Controllo JNativeHook')
s.jnativehook()
print(f'{cfg.prefix} Recupero file eseguiti e cancellati')
s.executedDeleted()
input('\nScansione completata\nPremi invio per uscire')

if os.path.exists(s.temp_path):
    shutil.rmtree(s.temp_path, ignore_errors=True)