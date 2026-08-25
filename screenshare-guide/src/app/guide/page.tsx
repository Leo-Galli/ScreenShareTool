"use client";

import { useState } from "react";

function FlagBadge({ f }: { f: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
      Flag {f}
    </span>
  );
}

function CmdBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-950 border border-gray-700 rounded-lg p-4 my-3 font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">
      {children}
    </div>
  );
}

function PartTitle({ id, num, title }: { id: string; num: number; title: string }) {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
        <span>Parte {num} &mdash; {title}</span>
      </h2>
    </section>
  );
}

export default function Guide() {
  const [openFlags, setOpenFlags] = useState<number[]>([]);
  const toggleFlag = (i: number) =>
    setOpenFlags((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Manuale Operativo ScreenShare
          </span>
        </h1>
        <p className="text-gray-400 text-lg">
          Procedura completa per condurre un&apos;ispezione professionale
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            v3.0
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            Windows
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
            mc.charlieroleplay.it
          </span>
        </div>
      </div>

      {/* TOC */}
      <nav className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold mb-4">Indice</h2>
        <div className="grid md:grid-cols-2 gap-1.5 text-sm">
          {[
            { href: "#p0", t: "Parte 0 — Ruoli, Requisiti e Codice di Condotta" },
            { href: "#p1", t: "Parte 1 — Deploy degli Strumenti" },
            { href: "#p2", t: "Parte 2 — Checklist Pre-Analisi" },
            { href: "#p3", t: "Parte 3 — Multiaccount e Ban Evading" },
            { href: "#p4", t: "Parte 4 — Ghost Client" },
            { href: "#p5", t: "Parte 5 — External Client e Autoclicker" },
            { href: "#p6", t: "Parte 6 — Dizionario Stringhe Forensi" },
            { href: "#p7", t: "Parte 7 — Flags di Ban Immediato" },
            { href: "#p8", t: "Parte 8 — Casi Borderline e Falsi Positivi" },
            { href: "#p9", t: "Parte 9 — Chiusura e Pulizia" },
          ].map((l, i) => (
            <a key={i} href={l.href} className="text-cyan-400 hover:text-cyan-300 py-1 transition-colors">
              {l.t}
            </a>
          ))}
        </div>
      </nav>

      {/* PARTE 0 */}
      <section id="p0" className="mb-16 scroll-mt-20">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
          <span>Parte 0 — Ruoli, Requisiti e Codice di Condotta</span>
        </h2>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Requisiti Minimi</h3>
          <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
            <li>Rango ispettore attivo e verificato.</li>
            <li>Conoscenza pratica di tutti gli strumenti elencati nella Parte 1.</li>
            <li>Database locale degli hash SHA-256 per versioni Minecraft pulite (1.8.9 Vanilla, 1.8.9 Forge, 1.12.2 Vanilla — necessario per Flag E).</li>
            <li>Connessione stabile. NON avviare un SS con ping superiore a 150ms.</li>
          </ol>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">Codice di Condotta</h3>
          <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
            <li>Non rivelare le procedure di questo manuale ai giocatori durante il controllo.</li>
            <li>Non minacciare, insultare o mettere pressione psicologica sul giocatore.</li>
            <li>Non prolungare il controllo oltre il tempo strettamente necessario.</li>
            <li>Ogni ban DEVE essere documentato con screenshot delle prove.</li>
            <li>In caso di dubbio, consultare un ispettore senior PRIMA di emettere sanzioni.</li>
            <li>I dati personali (path utente, username reale, ecc.) NON devono essere diffusi.</li>
          </ol>
        </div>
      </section>

      {/* PARTE 1 */}
      <section id="p1" className="mb-16 scroll-mt-20">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
          <span>Parte 1 — Deploy degli Strumenti tramite Terminale</span>
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Tutti gli strumenti vanno scaricati ed eseguiti tramite riga di comando sul PC del giocatore attraverso la sessione AnyDesk attiva.
        </p>

        {/* 1.1 Everything */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-cyan-400">1.1 Everything (VoidTools) — Indicizzatore MFT</h3>
          <p className="text-gray-400 text-sm mb-3">Permette ricerche istantanee su tutto il filesystem senza attendere l&apos;indicizzazione di Windows.</p>
          <CmdBox>winget install voidtools.Everything --silent</CmdBox>
        </div>

        {/* 1.2 System Informer */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-cyan-400">1.2 System Informer — Analizzatore RAM e Processi</h3>
          <p className="text-gray-400 text-sm mb-3">Sostituto moderno di Process Hacker. Permette dump della memoria, ispezione delle DLL caricate e scansione completa delle stringhe in RAM.</p>
          <CmdBox>winget install SystemInformer.SystemInformer --silent</CmdBox>
        </div>

        {/* 1.3 Luyten */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-cyan-400">1.3 Luyten — Decompilatore Java (.jar)</h3>
          <p className="text-gray-400 text-sm mb-3">Permette di aprire e ispezionare il bytecode di qualsiasi file .jar.</p>
          <CmdBox>{`powershell -Command "Invoke-WebRequest -Uri 'https://github.com/deathmarine/Luyten/releases/download/v0.5.4_Rebuilt_with_Latest_Depenencies/luyten-0.5.4.exe' -OutFile '$env:USERPROFILE\\Desktop\\Luyten.exe'"`}</CmdBox>
        </div>

        {/* 1.4 Suite NirSoft */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-cyan-400">1.4 Suite NirSoft — 5 Tool Forensi</h3>
          <p className="text-gray-400 text-sm mb-3">Ogni comando scarica lo zip, lo estrae nel Desktop e rimuove l&apos;archivio.</p>
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            {[
              { name: "LastActivityView", desc: "Attività recenti del sistema operativo" },
              { name: "WinPrefetchView", desc: "Analisi file Prefetch di Windows" },
              { name: "ExecutedProgramsList", desc: "Storico completo degli eseguibili avviati" },
              { name: "RecentFilesView", desc: "File aperti o modificati di recente" },
              { name: "USBDeview", desc: "Storico dispositivi USB collegati" },
            ].map((t, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-3">
                <span className="text-cyan-400 font-medium text-sm">{t.name}</span>
                <span className="text-gray-500 text-sm ml-2">— {t.desc}</span>
              </div>
            ))}
          </div>
          <CmdBox>{`powershell -Command "Invoke-WebRequest -Uri 'https://www.nirsoft.net/utils/lastactivityview.zip' -OutFile '$env:USERPROFILE\\Desktop\\lastactivityview.zip'; Expand-Archive -Path '$env:USERPROFILE\\Desktop\\lastactivityview.zip' -DestinationPath '$env:USERPROFILE\\Desktop\\LastActivityView' -Force; Remove-Item '$env:USERPROFILE\\Desktop\\lastactivityview.zip'"`}</CmdBox>
          <p className="text-gray-500 text-xs mt-2">Ripetere lo stesso schema sostituendo lastactivityview con winprefetchview, executedprogramslist, recentfilesview, usbdeview.</p>
        </div>
      </section>

      {/* PARTE 2 */}
      <section id="p2" className="mb-16 scroll-mt-20">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
          <span>Parte 2 — Checklist Pre-Analisi</span>
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Eseguire IMMEDIATAMENTE dopo aver ottenuto accesso AnyDesk. PRIMA di avviare qualsiasi tool. Scopo: fotografare lo stato iniziale della macchina e rilevare manomissioni in corso.
        </p>
        <div className="space-y-3">
          {[
            { ctrl: "2.1 Timestamp Cestino", proc: "Apri C:\\$Recycle.Bin — verifica data ultima modifica. Se coincide con la convocazione: anomalia.", flag: "A" },
            { ctrl: "2.2 Cartella %TEMP%", proc: "Win+R, %temp%, Invio. Cartella vuota o file con date recenti: sospetto.", flag: "Annotare" },
            { ctrl: "2.3 Prefetch", proc: "CMD admin: dir C:\\Windows\\Prefetch — Dir /Ar C:\\Windows\\Prefetch. Cartella vuota o file in sola lettura: anomalia.", flag: "B" },
            { ctrl: "2.4 Everything", proc: "Verificare che l'indicizzazione sia completa (barra inferiore: X oggetti).", flag: null },
            { ctrl: "2.5 USB attive", proc: "Apri USBDeview — controlla dispositivi connessi. Dispositivi scollegati pochi minuti prima dell'SS: anomalia.", flag: "D" },
            { ctrl: "2.6 Screenshot iniziale", proc: "Acquisisci screenshot di: Desktop, Task Manager, cartella .minecraft/mods. Base documentale.", flag: null },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center gap-3 md:w-64 shrink-0">
                <input type="checkbox" className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-cyan-500 accent-cyan-500" />
                <span className="font-medium text-white text-sm">{item.ctrl}</span>
              </div>
              <p className="text-gray-400 text-sm flex-1">{item.proc}</p>
              <div className="shrink-0">
                {item.flag ? (
                  item.flag === "Annotare" ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      Annotare
                    </span>
                  ) : (
                    <FlagBadge f={item.flag} />
                  )
                ) : (
                  <span className="text-gray-600 text-xs">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARTE 3 */}
      <section id="p3" className="mb-16 scroll-mt-20">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
          <span>Parte 3 — Multiaccount ed Evasione Sanzioni</span>
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Sospetto: il giocatore possiede account alternativi non dichiarati o si e connesso al network per eludere un ban attivo.
        </p>

        <div className="space-y-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">3.1 Log di Gioco Storici (.log e .log.gz)</h3>
            <p className="text-gray-400 text-sm mb-3">I client ufficiali e custom registrano ogni cambio account e sessione di login.</p>
            <div className="text-gray-300 text-sm mb-3 space-y-1">
              <p>Vanilla/Forge: %appdata%\.minecraft\logs\</p>
              <p>Lunar Client: C:\Users\%USERNAME%\.lunarclient\offline\logs\</p>
              <p>Badlion Client: C:\Users\%USERNAME%\AppData\Roaming\.minecraft\logs\blclient\</p>
            </div>
            <p className="text-gray-400 text-sm mb-2">Procedura: In Everything cerca latest.log, apri con Notepad++, cerca con Ctrl+F:</p>
            <CmdBox>{`LwjglWindow: Title: Minecraft\nLogging in as\nConnecting to mc.charlieroleplay.it\n[Client thread/INFO]: Setting user:\n[Client thread/INFO]: (Session ID is`}</CmdBox>
            <p className="text-gray-400 text-sm mt-3">Annotare ogni nickname trovato. Confrontare con il database dei ban. Match con account bannato = BAN PER EVASIONE SANZIONI.</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">3.2 File di Configurazione Launcher (.json)</h3>
            <p className="text-gray-400 text-sm mb-3">I launcher salvano localmente la cronologia degli account, token e profili.</p>
            <div className="text-gray-300 text-sm space-y-1 mb-3">
              <p>Vanilla/Forge: %appdata%\.minecraft\launcher_profiles.json, launcher_accounts.json</p>
              <p>TLauncher: %appdata%\.minecraft\TlauncherProfiles.json</p>
            </div>
            <p className="text-gray-400 text-sm">Cerca: &quot;displayName&quot; &quot;username&quot; &quot;localId&quot; &quot;name&quot;. Ogni nome trovato = account associato alla macchina.</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">3.3 Mod IAS — In-Game Account Switcher</h3>
            <p className="text-gray-400 text-sm mb-3">Questa mod permette di cambiare account senza riavviare il gioco. Il file di configurazione contiene la lista completa degli account memorizzati.</p>
            <p className="text-gray-400 text-sm">In Everything cerca: ias.json oppure ias-accounts.json. Il file contiene: nickname, UUID, tipo di autenticazione (Mojang / Microsoft / Cracked).</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">3.4 Cache Discord e Telegram</h3>
            <p className="text-gray-400 text-sm mb-3">Le app di messaggistica possono contenere tracce di scambi di account, credenziali condivise o acquisto di alt Minecraft.</p>
            <p className="text-gray-400 text-sm">Percorso Discord: %appdata%\Discord\Cache\Cache_Data\. Cerca: alts, account, mojang, mail:pass, token.</p>
          </div>
        </div>
      </section>

      {/* PARTE 4 */}
      <section id="p4" className="mb-16 scroll-mt-20">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
          <span>Parte 4 — Ghost Client</span>
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Sospetto: movimenti anomali, critici costanti, traiettorie di mira innaturali, o capacita di vedere attraverso i blocchi (X-Ray, ESP). Un Ghost Client e un cheat integrato direttamente nel client Minecraft.
        </p>

        <div className="space-y-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">4.1 Ispezione del File .json di Versione</h3>
            <p className="text-gray-400 text-sm mb-3">I Ghost Client sostituiscono le classi di avvio di Minecraft modificando il file .json della versione installata.</p>
            <p className="text-gray-400 text-sm mb-3">Percorso: %appdata%\.minecraft\versions\[versione]\[versione].json</p>
            <p className="text-gray-400 text-sm mb-2">Cerca la riga &quot;mainClass&quot; e confronta:</p>
            <div className="bg-gray-800/50 rounded-lg p-4 text-sm">
              <div className="mb-3">
                <p className="text-green-400 font-medium mb-1">Valori Legittimi:</p>
                <p className="text-gray-300">Vanilla: net.minecraft.client.main.Main</p>
                <p className="text-gray-300">Forge: net.minecraft.launchwrapper.Launch</p>
              </div>
              <div>
                <p className="text-red-400 font-medium mb-1">Valori Sospetti:</p>
                <p className="text-gray-300">net.knet.Client, net.wurst.Client, fdp.client.Main, liquidbounce.Launch</p>
                <p className="text-gray-400 text-xs">qualsiasi percorso non riconducibile a Mojang o MinecraftForge</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">4.2 Dump RAM — Moduli Rimossi a Gioco Aperto (Unload)</h3>
            <p className="text-gray-400 text-sm mb-3">Alcuni cheat vengono eliminati dal disco durante il gioco (unload), ma rimangono mappati nella RAM fino alla chiusura del processo.</p>
            <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
              <li>Avvia System Informer come Amministratore.</li>
              <li>Trova il processo javaw.exe, clic destro, Properties, scheda Memory.</li>
              <li>Disattiva &quot;Hide free regions&quot;, dimensione minima: 4, attiva filtri: Image, Mapped.</li>
              <li>Nel campo Filter - Contains (case insensitive): .minecraft\mods</li>
              <li>Se nella lista appare un .jar (es. LiquidBounce.jar) che NON e fisicamente presente nella cartella mods sul disco: BAN PER UNLOAD CHEAT / CANCELLAZIONE PROVE.</li>
            </ol>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">4.3 Stringhe Forensi Ghost Client in RAM</h3>
            <p className="text-gray-400 text-sm mb-3">Nella scheda Memory di javaw.exe - &quot;Strings&quot; (lunghezza minima: 4).</p>
            <div className="bg-gray-800/50 rounded-lg p-4 text-sm">
              <p className="text-cyan-400 font-medium mb-2">LiquidBounce</p>
              <p className="text-gray-300 mb-3">liquidbounce / net.ccbluex.liquidbounce / ccbluex</p>
              <p className="text-cyan-400 font-medium mb-2">Wurst</p>
              <p className="text-gray-300 mb-3">wurstclient / net.wurstclient</p>
              <p className="text-cyan-400 font-medium mb-2">Sigma</p>
              <p className="text-gray-300 mb-3">sigma.modules / net.sigmaclient</p>
              <p className="text-cyan-400 font-medium mb-2">FDPClient</p>
              <p className="text-gray-300 mb-3">fdpclient / fdp.client.Main</p>
              <p className="text-cyan-400 font-medium mb-2">Vape V4</p>
              <p className="text-gray-300 mb-3">net.vape.client / vape.v4 / vape.render</p>
              <p className="text-cyan-400 font-medium mb-2">Generici</p>
              <p className="text-gray-300">aura.class / speed.class / fly.class / noslowdown / nfall / nofall / reach.class</p>
            </div>
          </div>
        </div>
      </section>

      {/* PARTE 5 */}
      <section id="p5" className="mb-16 scroll-mt-20">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
          <span>Parte 5 — External Client e Autoclicker</span>
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Sospetto: CPS anomalo (16-20+ CPS fissi o innaturalmente costante) oppure assenza totale di rallentamento da knockback (NoVelocity).
        </p>

        <div className="space-y-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">5.1 Rilevamento JNativeHook (Autoclicker Java)</h3>
            <p className="text-gray-400 text-sm mb-3">La libreria JNativeHook e usata dagli autoclicker Java per intercettare i click del mouse al di fuori della finestra di gioco.</p>
            <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
              <li>In System Informer - processo explorer.exe - Properties - Memory.</li>
              <li>Filtra per: JNativeHook</li>
              <li>Se trovi una DLL tipo JNativeHook-[stringa].dll mappata in memoria: in Everything cerca JNativeHook.</li>
              <li>Se il file e in %temp% ma gia eliminato e la DLL e ancora in RAM: BAN IMMEDIATO PER AUTOCLICKER ATTIVO.</li>
            </ol>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">5.2 Stringhe Forensi Autoclicker in RAM</h3>
            <div className="bg-gray-800/50 rounded-lg p-4 text-sm">
              <p className="text-cyan-400 font-medium mb-1">Koid</p>
              <p className="text-gray-300 mb-3">koid / koid.gg / koidclicker / Clicker.java</p>
              <p className="text-cyan-400 font-medium mb-1">Dream Client</p>
              <p className="text-gray-300 mb-3">dreamclient / dream.clicker / dream.gg / dream.club</p>
              <p className="text-cyan-400 font-medium mb-1">Drip Client</p>
              <p className="text-gray-300 mb-3">drip.client / drip.gg / drip_autoclicker</p>
              <p className="text-cyan-400 font-medium mb-1">Whiteout</p>
              <p className="text-gray-300 mb-3">whiteout.gg / whiteout_client / wo_clicker</p>
              <p className="text-cyan-400 font-medium mb-1">Itami</p>
              <p className="text-gray-300 mb-3">itami.exe / itami_clicker / itami.club</p>
              <p className="text-cyan-400 font-medium mb-1">7Clicker / Mango</p>
              <p className="text-gray-300 mb-3">7clicker / mangoclicker / left_click_jitter / right_click_jitter</p>
              <p className="text-cyan-400 font-medium mb-1">Murmur / Phantom</p>
              <p className="text-gray-300">murmurclicker / phantom.gg / phantom_clicker</p>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">5.3 Analisi Prefetch: conhost.exe e javaw.exe</h3>
            <p className="text-gray-400 text-sm mb-3">Gli autoclicker basati su script invocano istanze nascoste della console Windows (conhost.exe) che lasciano traccia nel Prefetch.</p>
            <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
              <li>Apri WinPrefetchView come Amministratore.</li>
              <li>Cerca: Conhost.exe.pf — verifica i file d&apos;appoggio. Presenza di .bat, .cmd o file in %temp%: SOSPETTO ELEVATO.</li>
              <li>Cerca: Javaw.exe.pf — controlla se tra i file caricati compaiono eseguibili esterni o DLL estranee.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* PARTE 6 */}
      <section id="p6" className="mb-16 scroll-mt-20">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
          <span>Parte 6 — Dizionario Stringhe Forensi</span>
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Da usare nella sezione &quot;Strings&quot; di System Informer filtrando su: javaw.exe / explorer.exe / csrss.exe / qualsiasi eseguibile sospetto.
        </p>

        <div className="space-y-4">
          {[
            { cat: "Combat / Aim / Reach", items: "combat/Reach, combat/Killaura, combat/Aimbot, combat/Triggerbot, combat/Velocity, combat/AntiKnockback, Hitbox/Expand, Reach/Distance, TargetHUD, KeepSprint, Criticals, AutoWeapon, net/minecraft/client/entity/EntityPlayerSP/motionX, net/minecraft/client/entity/EntityPlayerSP/motionZ" },
            { cat: "Autoclicker Generici", items: "AutoClicker, ClickAssist, LeftClicker, RightClicker, JitterClick, BurstClick, CPSCounter, MinCPS, MaxCPS, RandomizationDelay, BlockBreakDelay, InventoryFillClick, RightClickBlatant, LegitimateClicker" },
            { cat: "Meccanismi di Autodistruzione", items: "SelfDestruct, DestructModule, CleanTracks, WipeLogs, DeleteEvidence, AntiForensic, UnloadModule, DisableLoader, StealthMode, HiddenProcess, DeleteOnClose, ExitClean, SecureDelete, WipeOnExit, ClearHistory" },
            { cat: "Movement / Speed / Fly", items: "Speed/Boost, Fly/NoFall, Sprint/HumanSprint, Step, Jesus, BoatFly, ElytraFly, Spider, NoSlow, FastPlace, FastBreak, Scaffold, Tower, Speed/Bhop, Timer" },
            { cat: "Render / ESP / Visuals", items: "ESP/PlayerESP, ESP/ChestESP, ESP/BlockESP, ESP/ItemESP, XRay, Nametags, Tracers, StorageESP, ItemESP, MobESP, AntiOverlay, FullBright, Chams, ItemPhysics, Tomograph, NewChunks, OldChunks" },
            { cat: "HUD / Overlay / UI", items: "ClickGUI, ArrayList, Watermark, TabGUI, InvViewer, ArmorHUD, CrosshairMod, Coords, Coordinates, ServerIP, MemoryDisplay, FPSDisplay, CPSDisplay, Keystrokes" },
            { cat: "Misc / Utility", items: "AutoEat, ChestStealer, InventoryManager, AutoArmor, AutoTool, AutoPot, AutoSnowball, Spammer, AntiAFK, FakePlayer, Step, FastUse, RightClickRefresh, MiddleClick, FastBridge" },
            { cat: "Packet / Network", items: "PacketFly, PacketElytra, Velocity, AntiVelocity, Bypass, Flag, Check, Disabler, PacketCancel, SendInterval, Limbo" },
            { cat: "Ghost Client Specifici", items: "Do0mClient, MoonClient, Tenacity, Astolfo, Kami, Phobos, SalHack, Seppuku, Flux, Snow, Rise, Rusher, Sigma, Vape, LiquidBounce, Wurst, FDP, RISE, Future, Impact, Aristois, Inertia" },
            { cat: "Doomsday / Auto-Destruct", items: "doomsday, doomsday.client, doomsday.Main, doomsday.unload, doomsday.clean, doomsday.selfdestruct, doomsday.delete, doomsday.wipe, doomsday.stealth, doomsday.hidden, doomsday.remove, doomsday.forge, Class.forName, ClassLoader, defineClass, loadClass, getDeclaredMethod" },
            { cat: "Anti-Cheat Bypass", items: "AntiCheat, Bypass, Vanilla, Watchdog, Grim, Vulcan, Matrix, Intave, Rewind, Polar, Aac, NCP, Spigot, Paper" },
            { cat: "Obfuscation / Offuscamento", items: "obfuscate, deobfuscate, remap, unmap, mapping, srg, notch, mojang, yarn, intermediary" },
            { cat: "Mod Loader / Forge", items: "FMLCommonHandler, FMLPreInitializationEvent, FMLPostInitializationEvent, ForgeModLoader, net.minecraftforge, MixinBootstrap, org.spongepowered.asm.mixin, @Mixin, @Inject, @Overwrite, @Shadow" },
            { cat: "Java Runtime", items: "ClassLoader, defineClass, loadClass, forName, getRuntime, ProcessBuilder, Runtime.exec, Process, Reflection, setAccessible, getDeclaredField, getDeclaredMethod" },
            { cat: "File System", items: "File.delete, File.deleteOnExit, Runtime.exec(rm), Runtime.exec(del), Files.delete, Files.deleteIfExists, NIO, Path.delete" },
            { cat: "Network Connections", items: "ServerSocket, Socket, connect, bind, InetSocketAddress, Channel, Selector, DatagramSocket, loopback, 127.0.0.1, localhost, ws://, wss://" },
            { cat: "Memory / Process", items: "VirtualAlloc, VirtualProtect, WriteProcessMemory, ReadProcessMemory, OpenProcess, CreateRemoteThread, NtMapViewOfSection, Inject, DLL, LoadLibrary, GetProcAddress" },
            { cat: "Cheats Tunnel / VPN", items: "Hamachi, ZeroTier, Tailscale, Radmin, ngrok, Cloudflare, WARP, WireGuard, OpenVPN, NordVPN, ExpressVPN, ProtonVPN, Mullvad" },
            { cat: "Hidden / Stealth Software", items: "HiddenMouse, HID, USB Rubber Ducky, Teensy, Arduino, BadUSB, Keylogger, KeySpy, ActivityMonitor, Spyrix, Refog, Agent, HiddenWindow, WindowHider" },
          ].map((cat, i) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <h4 className="text-cyan-400 font-semibold text-sm mb-2">{cat.cat}</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{cat.items}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PARTE 7 */}
      <section id="p7" className="mb-16 scroll-mt-20">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-b from-red-400 to-red-600 rounded-full" />
          <span>Parte 7 — Flags di Ban Immediato</span>
        </h2>

        <div className="space-y-3 mb-8">
          {[
            { flag: "A", desc: "Cestino svuotato alla convocazione", cat: "Cancellazione prove" },
            { flag: "B", desc: "Prefetch disabilitato o file bloccati", cat: "Alterazione Sistema" },
            { flag: "C", desc: "Eseguibile rinominato con metadati falsi", cat: "Mimetizzazione Cheat" },
            { flag: "D", desc: "USB scollegata alla convocazione", cat: "Rimozione Periferiche" },
            { flag: "E", desc: "Hash .jar difforme dalla versione ufficiale", cat: "Java Edit" },
            { flag: "F", desc: "Registro di sistema alterato", cat: "Manipolazione Policy" },
            { flag: "G", desc: "Mod .jar con classi illecite/offuscate", cat: "Mod Illecita" },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900/50 border border-red-500/20 rounded-xl p-4 flex items-center gap-4">
              <FlagBadge f={item.flag} />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{item.desc}</p>
                <p className="text-gray-500 text-xs">{item.cat}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3">Tabella Riepilogativa</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2 text-gray-300">Flag</th>
                  <th className="text-left p-2 text-gray-300">Anomalia</th>
                  <th className="text-left p-2 text-gray-300">Ban</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                <tr className="border-b border-gray-800"><td className="p-2"><FlagBadge f="A" /></td><td>Cestino svuotato</td><td>Si</td></tr>
                <tr className="border-b border-gray-800"><td className="p-2"><FlagBadge f="B" /></td><td>Prefetch alterato</td><td>Si</td></tr>
                <tr className="border-b border-gray-800"><td className="p-2"><FlagBadge f="C" /></td><td>Eseguibile rinominato</td><td>Si</td></tr>
                <tr className="border-b border-gray-800"><td className="p-2"><FlagBadge f="D" /></td><td>USB rimossa</td><td>Si</td></tr>
                <tr className="border-b border-gray-800"><td className="p-2"><FlagBadge f="E" /></td><td>Hash .jar difforme</td><td>Si</td></tr>
                <tr className="border-b border-gray-800"><td className="p-2"><FlagBadge f="F" /></td><td>Registro alterato</td><td>Si</td></tr>
                <tr><td className="p-2"><FlagBadge f="G" /></td><td>Mod illecita</td><td>Si</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PARTE 8 */}
      <section id="p8" className="mb-16 scroll-mt-20">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full" />
          <span>Parte 8 — Casi Borderline e Falsi Positivi</span>
        </h2>

        <div className="space-y-6">
          <div className="bg-gray-900/50 border border-yellow-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Quando NON Bannare</h3>
            <div className="space-y-3">
              {[
                { sit: "Stringhe generiche in RAM (speed, fly) senza contesto client-specifico", mot: "Compaino in browser, overlay, software legittimi. Servono stringhe contestualizzate." },
                { sit: "CPS elevato senza evidenza di autoclicker", mot: "Butterfly/drag clicker legittimi. CPS da solo non e sufficiente. Servono JNativeHook o stringhe specifiche." },
                { sit: "Hash .jar difforme per Forge o OptiFine", mot: "Variano legittimamente. Confrontare SOLO con la versione identica (es. 1.8.9-Forge-11.15.1.2318)." },
                { sit: "File sconosciuti in %TEMP%", mot: "Aggiornatori, driver, antivirus generano file temporanei. La data DEVE coincidere col freeze." },
                { sit: "IAS Mod con piu account presenti", mot: "Avere piu account non e violazione. La violazione e il match con un account BANNATO." },
              ].map((item, i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-white text-sm font-medium mb-1">{item.sit}</p>
                  <p className="text-gray-400 text-sm">{item.mot}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900/50 border border-yellow-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-yellow-400">Procedura in Caso di Dubbio</h3>
            <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
              <li>NON emettere ban in autonomia. Contatta un ispettore senior con gli screenshot delle anomalie.</li>
              <li>Documenta lo stato della macchina con screenshot dettagliati e salvali.</li>
              <li>Il giocatore puo essere messo in stato &quot;In osservazione&quot; per un periodo definito dal team.</li>
              <li>Se le prove sono state distrutte ma non c&apos;e prova diretta del cheat: considera &quot;Rifiuto SS&quot; — Ban per rifiuto/ostruzione allo ScreenShare.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* PARTE 9 */}
      <section id="p9" className="mb-16 scroll-mt-20">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
          <span>Parte 9 — Chiusura e Pulizia della Macchina</span>
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Al termine dell&apos;ispezione — sia in caso di assoluzione che di sanzione — l&apos;ispettore ha l&apos;OBBLIGO di rimuovere completamente tutti gli strumenti scaricati.
        </p>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3 text-cyan-400">Comando di Pulizia Completa</h3>
          <CmdBox>{`powershell -Command "Remove-Item -Path '$env:USERPROFILE\\Desktop\\LastActivityView', '$env:USERPROFILE\\Desktop\\WinPrefetchView', '$env:USERPROFILE\\Desktop\\RecentFilesView', '$env:USERPROFILE\\Desktop\\USBDeview', '$env:USERPROFILE\\Desktop\\ExecutedProgramsList', '$env:USERPROFILE\\Desktop\\Luyten.exe' -Recurse -Force -ErrorAction SilentlyContinue"`}</CmdBox>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3 text-cyan-400">Verifica Manuale Post-Pulizia</h3>
          <div className="space-y-2">
            {[
              "Desktop tornato allo stato originale.",
              "Nessun processo degli strumenti in esecuzione nel Task Manager.",
              "Sessione AnyDesk chiusa SOLO dopo questa verifica.",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-cyan-500 accent-cyan-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3 text-cyan-400">Documentazione Finale Obbligatoria</h3>
          <p className="text-gray-400 text-sm mb-3">Da documentare e archiviare:</p>
          <div className="space-y-2">
            {[
              "Nickname del giocatore ispezionato",
              "Esito: Assolto / Bannato / In osservazione",
              "Motivazione del ban con Flag di riferimento (es. Flag B + Flag D)",
              "Screenshot delle prove raccolte",
              "Orario di inizio e fine sessione",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-cyan-500 accent-cyan-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-gray-800 pt-8 mt-12 text-center">          <p className="text-gray-500 text-sm">
          CharlieRoleplay ScreenShare Documentation — v3.0 — LeoGalli
        </p>
      </div>
    </div>
  );
}
