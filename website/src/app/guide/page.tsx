"use client";

export default function Guide() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Manuale Operativo ScreenShare
          </span>
        </h1>
        <p className="text-gray-400 text-lg">Procedura completa per condurre un&apos;ispezione professionale</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="badge badge-cyan">v3.0</span>
          <span className="badge badge-yellow">Windows</span>
          <span className="badge badge-green">mc.charlieroleplay.it</span>
        </div>
      </div>

      {/* Table of Contents */}
      <nav className="card mb-12">
        <h2 className="text-lg font-bold mb-4">Indice dei Contenuti</h2>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          {[
            { href: "#part0", label: "Parte 0 — Ruoli, Requisiti e Codice di Condotta" },
            { href: "#part1", label: "Parte 1 — Deploy degli Strumenti" },
            { href: "#part2", label: "Parte 2 — Checklist Pre-Analisi" },
            { href: "#part3", label: "Parte 3 — Multiaccount e Ban Evading" },
            { href: "#part4", label: "Parte 4 — Ghost Client" },
            { href: "#part5", label: "Parte 5 — External Client e Autoclicker" },
            { href: "#part6", label: "Parte 6 — Dizionario Stringhe Forensi" },
            { href: "#flags", label: "Parte 7 — Flags di Ban Immediato" },
            { href: "#part8", label: "Parte 8 — Casi Borderline e Falsi Positivi" },
            { href: "#part9", label: "Parte 9 — Chiusura e Pulizia" },
          ].map((item, i) => (
            <a key={i} href={item.href} className="text-cyan-400 hover:text-cyan-300 transition-colors py-1">
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* PARTE 0 */}
      <section id="part0" className="mb-16">
        <h2 className="section-title">Parte 0 — Ruoli, Requisiti e Codice di Condotta</h2>

        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-3 text-cyan-400">Requisiti Minimi</h3>
          <ol className="space-y-2 text-gray-300 text-sm">
            <li className="flex gap-3"><span className="badge badge-cyan shrink-0">1</span> Rango ispettore ATTIVO e verificato da uno staff senior.</li>
            <li className="flex gap-3"><span className="badge badge-cyan shrink-0">2</span> Conoscenza pratica di tutti gli strumenti elencati nella Parte 1.</li>
            <li className="flex gap-3"><span className="badge badge-cyan shrink-0">3</span> Database locale degli hash SHA-256 per versioni Minecraft pulite (1.8.9 Vanilla, 1.8.9 Forge, 1.12.2).</li>
            <li className="flex gap-3"><span className="badge badge-cyan shrink-0">4</span> Connessione stabile. NON avviare un SS con ping &gt; 150ms.</li>
          </ol>
        </div>

        <div className="card border-red-500/20">
          <h3 className="text-lg font-semibold mb-3 text-red-400">⚠️ Codice di Condotta — Obbligatorio</h3>
          <ol className="space-y-2 text-gray-300 text-sm">
            <li>1. Non rivelare le procedure di questo manuale ai giocatori durante il controllo.</li>
            <li>2. Non minacciare, insultare o mettere pressione psicologica sul giocatore.</li>
            <li>3. Non prolungare il controllo oltre il tempo strettamente necessario.</li>
            <li>4. Ogni ban DEVE essere documentato con screenshot delle prove nel canale staff.</li>
            <li>5. In caso di dubbio, consultare un ispettore senior PRIMA di emettere sanzioni.</li>
            <li>6. I dati personali (path utente, username reale, ecc.) NON devono essere diffusi.</li>
          </ol>
        </div>
      </section>

      {/* PARTE 1 */}
      <section id="part1" className="mb-16">
        <h2 className="section-title">Parte 1 — Deploy degli Strumenti</h2>
        <p className="text-gray-400 mb-6">Tutti gli strumenti vanno scaricati ed eseguiti tramite riga di comando sul PC del giocatore attraverso la sessione AnyDesk attiva.</p>

        <div className="space-y-6">
          <ToolCard
            title="Everything (VoidTools)"
            desc="Indicizzatore MFT — ricerche istantanee su tutto il filesystem."
            badge="Indispensabile"
            badgeColor="red"
            command='winget install voidtools.Everything --silent'
          />
          <ToolCard
            title="System Informer"
            desc="Analizzatore RAM e processi (successore di Process Hacker). Dump memoria, DLL caricate, scansione stringhe."
            badge="Indispensabile"
            badgeColor="red"
            command='winget install SystemInformer.SystemInformer --silent'
          />
          <ToolCard
            title="Luyten"
            desc="Decompilatore Java per ispezionare il bytecode di qualsiasi file .jar."
            command={`powershell -Command "Invoke-WebRequest -Uri 'https://github.com/deathmarine/Luyten/releases/download/v0.5.4_Rebuilt_with_Latest_Depenencies/luyten-0.5.4.exe' -OutFile '$env:USERPROFILE\\Desktop\\Luyten.exe'"`}
          />
          <NirsoftSuite />
        </div>
      </section>

      {/* PARTE 2 */}
      <section id="checklist" className="mb-16">
        <h2 className="section-title">Parte 2 — Checklist Pre-Analisi</h2>
        <p className="text-gray-400 mb-6">Eseguire IMMEDIATAMENTE dopo aver ottenuto accesso AnyDesk, PRIMA di avviare qualsiasi tool.</p>

        <div className="card overflow-x-auto">
          <table className="string-table">
            <thead>
              <tr>
                <th>Controllo</th>
                <th>Procedura</th>
                <th>Flag</th>
              </tr>
            </thead>
            <tbody>
              <ChecklistRow item="Timestamp Cestino" desc="Apri C:\\$Recycle.Bin — verifica data ultima modifica. Se coincide con la convocazione: anomalia." flag="A" />
              <ChecklistRow item="Cartella %TEMP%" desc="Win+R → %temp% → Invio. Cartella vuota o file con date recenti: sospetto." flag="Annotare" />
              <ChecklistRow item="Prefetch" desc="CMD admin: dir C:\\Windows\\Prefetch — Dir /Ar C:\\Windows\\Prefetch. Cartella vuota o file in sola lettura: anomalia." flag="B" />
              <ChecklistRow item="Everything" desc="Verificare che l'indicizzazione sia completa (barra inferiore: X oggetti)." flag="—" />
              <ChecklistRow item="USB attive" desc="Apri USBDeview → controlla dispositivi connessi. Dispositivi scollegati pochi min prima dell'SS: anomalia." flag="D" />
              <ChecklistRow item="Screenshot iniziale" desc="Acquisisci screenshot di: Desktop, Task Manager, cartella .minecraft\\mods." flag="—" />
            </tbody>
          </table>
        </div>
      </section>

      {/* PARTE 3 */}
      <section id="part3" className="mb-16">
        <h2 className="section-title">Parte 3 — Multiaccount e Ban Evading</h2>

        <div className="space-y-6">
          <SubSection title="3.1 Log di Gioco Storici (.log e .log.gz)">
            <p className="text-gray-400 text-sm mb-3">I client ufficiali e custom registrano ogni cambio account e ogni sessione di login.</p>
            <div className="cmd-box mb-3 text-xs">
              <div className="text-gray-500 mb-1">// Percorsi:</div>
              <div>Vanilla/Forge → %appdata%\\.minecraft\\logs\\</div>
              <div>Lunar Client → C:\\Users\\%USERNAME%\\.lunarclient\\offline\\logs\\</div>
              <div>Badlion Client → C:\\Users\\%USERNAME%\\AppData\\Roaming\\.minecraft\\logs\\blclient\\</div>
            </div>
            <p className="text-gray-400 text-sm mb-2">Procedura:</p>
            <ol className="text-gray-300 text-sm space-y-1 ml-4">
              <li>1. In Everything cerca: <code className="bg-gray-800 px-1.5 py-0.5 rounded text-cyan-300">latest.log</code></li>
              <li>2. Apri con Notepad++ e cerca:</li>
            </ol>
            <div className="cmd-box mt-2 text-xs">
              <div>LwjglWindow: Title: Minecraft</div>
              <div>Logging in as</div>
              <div>Connecting to mc.charlieroleplay.it</div>
              <div>[Client thread/INFO]: Setting user:</div>
              <div>[Client thread/INFO]: (Session ID is</div>
            </div>
          </SubSection>

          <SubSection title="3.2 File di Configurazione Launcher (.json)">
            <div className="cmd-box text-xs">
              <div className="text-gray-500 mb-1">// Percorsi:</div>
              <div>%appdata%\\.minecraft\\launcher_profiles.json</div>
              <div>%appdata%\\.minecraft\\launcher_accounts.json</div>
              <div>%appdata%\\.tlauncher\\legacy\\Minecraft\\game\\profiles.json</div>
            </div>
            <p className="text-gray-400 text-sm mt-3">Cerca: &quot;displayName&quot; &quot;username&quot; &quot;localId&quot; &quot;name&quot;</p>
          </SubSection>

          <SubSection title="3.3 Mod IAS — In-Game Account Switcher">
            <p className="text-gray-400 text-sm">Cerca in Everything: <code className="bg-gray-800 px-1.5 py-0.5 rounded text-cyan-300">ias.json</code> oppure <code className="bg-gray-800 px-1.5 py-0.5 rounded text-cyan-300">ias-accounts.json</code></p>
          </SubSection>
        </div>
      </section>

      {/* PARTE 4 */}
      <section id="part4" className="mb-16">
        <h2 className="section-title">Parte 4 — Ghost Client</h2>

        <SubSection title="4.1 Ispezione del file .JSON di versione">
          <p className="text-gray-400 text-sm mb-3">Percorso: <code className="bg-gray-800 px-1.5 py-0.5 rounded text-cyan-300">%appdata%\\.minecraft\\versions\\[versione]\\[versione].json</code></p>
          <p className="text-gray-400 text-sm mb-3">Cerca la riga: <code className="bg-gray-800 px-1.5 py-0.5 rounded text-cyan-300">&quot;mainClass&quot;</code></p>
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <h4 className="text-green-400 font-semibold text-sm mb-2">✓ Valori Legittimi</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <div>Vanilla → net.minecraft.client.main.Main</div>
                <div>Forge → net.minecraft.launchwrapper.Launch</div>
              </div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <h4 className="text-red-400 font-semibold text-sm mb-2">✗ Valori Sospetti</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <div>net.knet.Client</div>
                <div>net.wurst.Client</div>
                <div>fdp.client.Main</div>
                <div>liquidbounce.Launch</div>
              </div>
            </div>
          </div>
        </SubSection>

        <SubSection title="4.2 Dump RAM — Moduli Rimossi a Gioco Aperto">
          <ol className="text-gray-300 text-sm space-y-2">
            <li>1. Avvia System Informer come Amministratore.</li>
            <li>2. Trova il processo javaw.exe → clic destro → Properties → scheda Memory.</li>
            <li>3. Configurazione: Disattiva &quot;Hide free regions&quot;, dimensione minima: 4, attiva filtri: Image, Mapped.</li>
            <li>4. Nel campo Filter → Contains: <code className="bg-gray-800 px-1.5 py-0.5 rounded text-cyan-300">\\.minecraft\\mods</code></li>
            <li>5. Se appare un .jar NON fisicamente presente nella cartella mods → BAN PER UNLOAD CHEAT.</li>
          </ol>
        </SubSection>

        <SubSection title="4.3 Stringhe Forensi Ghost Client in RAM">
          <p className="text-gray-400 text-sm mb-3">Nella stessa scheda Memory di javaw.exe → &quot;Strings&quot; (lunghezza minima: 4).</p>
          <div className="overflow-x-auto">
            <table className="string-table">
              <thead><tr><th>Client</th><th>Stringhe da Cercare</th></tr></thead>
              <tbody>
                <tr><td className="text-cyan-400 font-medium">LiquidBounce</td><td>liquidbounce / net.ccbluex.liquidbounce / ccbluex</td></tr>
                <tr><td className="text-cyan-400 font-medium">Wurst</td><td>wurstclient / net.wurstclient</td></tr>
                <tr><td className="text-cyan-400 font-medium">Sigma</td><td>sigma.modules / net.sigmaclient</td></tr>
                <tr><td className="text-cyan-400 font-medium">FDPClient</td><td>fdpclient / fdp.client.Main</td></tr>
                <tr><td className="text-cyan-400 font-medium">Vape V4</td><td>net.vape.client / vape.v4 / vape.render</td></tr>
                <tr><td className="text-cyan-400 font-medium">Generici</td><td>aura.class / speed.class / fly.class / noslowdown / nofall / reach.class</td></tr>
              </tbody>
            </table>
          </div>
        </SubSection>
      </section>

      {/* PARTE 5 */}
      <section id="part5" className="mb-16">
        <h2 className="section-title">Parte 5 — External Client e Autoclicker</h2>

        <SubSection title="5.1 Rilevamento JNativeHook">
          <ol className="text-gray-300 text-sm space-y-2">
            <li>1. System Informer → processo explorer.exe → Properties → Memory.</li>
            <li>2. Filtra per: <code className="bg-gray-800 px-1.5 py-0.5 rounded text-cyan-300">JNativeHook</code></li>
            <li>3. Se trovi una DLL tipo JNativeHook-[stringa].dll mappata in memoria:</li>
          </ol>
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-semibold">
            ✦ BAN IMMEDIATO PER AUTOCLICKER ATTIVO / CANCELLAZIONE PROVE
          </div>
        </SubSection>

        <SubSection title="5.2 Stringhe Forensi Autoclicker">
          <div className="overflow-x-auto">
            <table className="string-table">
              <thead><tr><th>Software</th><th>Stringhe</th></tr></thead>
              <tbody>
                <tr><td className="text-cyan-400">Koid</td><td>koid / koid.gg / koidclicker / Clicker.java</td></tr>
                <tr><td className="text-cyan-400">Dream Client</td><td>dreamclient / dream.clicker / dream.gg / dream.club</td></tr>
                <tr><td className="text-cyan-400">Drip Client</td><td>drip.client / drip.gg / drip_autoclicker</td></tr>
                <tr><td className="text-cyan-400">Whiteout</td><td>whiteout.gg / whiteout_client / wo_clicker</td></tr>
                <tr><td className="text-cyan-400">Itami</td><td>itami.exe / itami_clicker / itami.club</td></tr>
                <tr><td className="text-cyan-400">7Clicker / Mango</td><td>7clicker / mangoclicker / left_click_jitter / right_click_jitter</td></tr>
                <tr><td className="text-cyan-400">Murmur / Phantom</td><td>murmurclicker / phantom.gg / phantom_clicker</td></tr>
              </tbody>
            </table>
          </div>
        </SubSection>
      </section>

      {/* PARTE 6 */}
      <section id="part6" className="mb-16">
        <h2 className="section-title">Parte 6 — Dizionario Stringhe Forensi</h2>
        <p className="text-gray-400 mb-6">Da usare nella sezione &quot;Strings&quot; di System Informer filtrando su: javaw.exe / explorer.exe / csrss.exe</p>

        <div className="grid md:grid-cols-2 gap-6">
          <StringCard title="Combat / Aim / Reach" items={["combat/Reach", "combat/Killaura", "combat/Aimbot", "combat/Triggerbot", "combat/Velocity", "combat/AntiKnockback", "Hitbox/Expand", "KeepSprint", "Criticals", "AutoWeapon", "TargetHUD"]} />
          <StringCard title="Autoclicker" items={["AutoClicker", "ClickAssist", "LeftClicker", "RightClicker", "JitterClick", "BurstClick", "CPSCounter", "RandomizationDelay", "LegitimateClicker"]} />
          <StringCard title="Self-Destruct / Anti-Forensics" items={["SelfDestruct", "DestructModule", "CleanTracks", "WipeLogs", "DetachConsole", "DeleteOnClose", "UnloadDriver", "HideProcess", "RemoveRegistryKeys", "KillSwitch", "PanicButton"]} />
          <StringCard title="Movement / World" items={["flight/Flight", "scaffold/Scaffold", "speed/Speed", "nofall/NoFall", "ESP/EntityESP", "Xray/XRay", "freecam/FreeCam", "phase/Phase", "blink/Blink", "Timer/SpeedHack"]} />
        </div>
      </section>

      {/* PARTE 7 — FLAGS */}
      <section id="flags" className="mb-16">
        <h2 className="section-title">Parte 7 — Flags di Ban Immediato</h2>
        <p className="text-gray-400 mb-8">Ogni Flag corrisponde a un&apos;anomalia specifica. Documentare SEMPRE le prove con screenshot PRIMA di procedere al ban.</p>

        <div className="space-y-6">
          <FlagCard letter="A" title="Pulizia Prove durante Freeze" severity="red" details={
            <>
              <p className="mb-3">Sospetto: il giocatore ha modificato o eliminato file prima di accettare AnyDesk.</p>
              <p className="mb-2 text-sm font-semibold">Ispezioni obbligatorie:</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• C:\$Recycle.Bin (Cestino profondo)</li>
                <li>%temp%\Rar$Exa[...] (Archivi volatili)</li>
                <li>shell:recent (Accessi recenti)</li>
                <li>%appdata%\Microsoft\Windows\Recent</li>
              </ul>
              <p className="mt-3 text-sm">Regola: data modifica Cestino / %TEMP% coincide con freeze o attesa pre-SS</p>
            </>
          } />

          <FlagCard letter="B" title="Prefetch Disabilitato o Alterato" severity="red" details={
            <>
              <p className="mb-3">Il giocatore ha bloccato il tracciamento di Windows per nascondere l&apos;avvio del cheat.</p>
              <p className="mb-2 text-sm font-semibold">Ispezione Registro:</p>
              <div className="cmd-box text-xs mb-3">HKLM\\...\\Memory Management\\PrefetchParameters\\EnablePrefetcher</div>
              <p className="text-sm">0 = DISABILITATO (anomalo su macchina da gaming) • 3 = ATTESO (default)</p>
            </>
          } />

          <FlagCard letter="C" title="Metadati Incoerenti (Rinomina Cheat)" severity="red" details={
            <p className="text-sm">Eseguibile rinominato con nome innocuo (es. Optifine.exe) ma metadati del produttore differenti (Company Name &quot;Vape Software&quot; o campo vuoto).</p>
          } />

          <FlagCard letter="D" title="Disconnessione USB in Prossimità SS" severity="red" details={
            <p className="text-sm">Dispositivo di massa USB scollegato nell&apos;esatto minuto della convocazione o durante il freeze. Verificare con USBDeview.</p>
          } />

          <FlagCard letter="E" title="Hash SHA-256 Difforme (Java Edit)" severity="red" details={
            <>
              <p className="text-sm mb-2">File .jar della versione modificato rispetto alla versione ufficiale.</p>
              <div className="cmd-box text-xs">Get-FileHash &quot;$env:APPDATA\\.minecraft\\versions\\[ver]\\[ver].jar&quot; -Algorithm SHA256</div>
            </>
          } />

          <FlagCard letter="F" title="Alterazione del Registro di Sistema" severity="red" details={
            <p className="text-sm">Chiavi del registro cancellate o permessi rimossi per impedire la registrazione dei log di esecuzione.</p>
          } />

          <FlagCard letter="G" title="Mod .jar Offuscata o con Classi Illecite" severity="red" details={
            <>
              <p className="text-sm mb-2">Mod PvP estetica criptata o con funzioni illecite (Reach, Velocity, Autoclicker integrato).</p>
              <p className="text-sm">Procedura: Trascina il .jar in Luyten → controlla mcmod.info e albero classi.</p>
            </>
          } />
        </div>
      </section>

      {/* PARTE 8 */}
      <section id="part8" className="mb-16">
        <h2 className="section-title">Parte 8 — Casi Borderline e Falsi Positivi</h2>

        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">⚠️ Quando NON Bannare</h3>
          <div className="overflow-x-auto">
            <table className="string-table">
              <thead><tr><th>Situazione</th><th>Motivazione</th></tr></thead>
              <tbody>
                <tr><td>Stringhe generiche senza contesto</td><td>Appaiono in browser, overlay, software legittimi. Servono stringhe contestualizzate.</td></tr>
                <tr><td>CPS elevato senza JNativeHook</td><td>Butterfly/drag clicker legittimi. CPS da solo non è sufficiente.</td></tr>
                <tr><td>Hash .jar difforme per Forge/OptiFine</td><td>Variano legittimamente. Confrontare SOLO con versione identica.</td></tr>
                <tr><td>File sconosciuti in %TEMP%</td><td>Aggiornatori, driver, antivirus generano file temporanei. La data DEVE coincidere col freeze.</td></tr>
                <tr><td>IAS Mod con più account</td><td>Avere più account non è violazione. La violazione è il match con account BANNATO.</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card border-yellow-500/20">
          <h3 className="text-lg font-semibold mb-3 text-yellow-400">Procedura in Caso di Dubbio</h3>
          <ol className="text-gray-300 text-sm space-y-2">
            <li>1. NON emettere ban in autonomia. Contatta uno staff senior con gli screenshot.</li>
            <li>2. Documenta lo stato della macchina con screenshot dettagliati.</li>
            <li>3. Il giocatore può essere messo &quot;In osservazione&quot; per un periodo definito dallo staff senior.</li>
            <li>4. Se le prove sono state distrutte ma non c&apos;è prova diretta: considera &quot;Rifiuto SS&quot;.</li>
          </ol>
        </div>
      </section>

      {/* PARTE 9 */}
      <section id="part9" className="mb-16">
        <h2 className="section-title">Parte 9 — Chiusura e Pulizia della Macchina</h2>

        <div className="card mb-6 border-green-500/20">
          <h3 className="text-lg font-semibold mb-3 text-green-400">🧹 Pulizia Completa</h3>
          <p className="text-gray-400 text-sm mb-3">Al termine dell&apos;ispezione — sia in caso di assoluzione che di sanzione — rimuovere completamente tutti gli strumenti.</p>
          <div className="cmd-box text-xs">
            <span className="text-gray-500">powershell -Command &quot;Remove-Item -Path</span><br />
            <span className="text-cyan-300">$env:USERPROFILE\\Desktop\\LastActivityView, $env:USERPROFILE\\Desktop\\WinPrefetchView,</span><br />
            <span className="text-cyan-300">$env:USERPROFILE\\Desktop\\RecentFilesView, $env:USERPROFILE\\Desktop\\USBDeview,</span><br />
            <span className="text-cyan-300">$env:USERPROFILE\\Desktop\\ExecutedProgramsList, $env:USERPROFILE\\Desktop\\Luyten.exe</span><br />
            <span className="text-gray-500">-Recurse -Force -ErrorAction SilentlyContinue&quot;</span>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-3 text-cyan-400">📋 Documentazione Finale Obbligatoria</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2 text-gray-300">
              <div>☐ Nickname del giocatore ispezionato</div>
              <div>☐ Esito: Assolto / Bannato / In osservazione</div>
              <div>☐ Motivazione del ban con Flag di riferimento</div>
            </div>
            <div className="space-y-2 text-gray-300">
              <div>☐ Screenshot delle prove raccolte</div>
              <div>☐ Orario di inizio e fine sessione</div>
              <div>☐ Desktop tornato allo stato originale</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ToolCard({ title, desc, badge, badgeColor, command }: {
  title: string; desc: string; badge?: string; badgeColor?: string; command: string;
}) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-white">{title}</h3>
        {badge && <span className={`badge badge-${badgeColor}`}>{badge}</span>}
      </div>
      <p className="text-gray-400 text-sm mb-3">{desc}</p>
      <div className="cmd-box text-xs">{command}</div>
    </div>
  );
}

function NirsoftSuite() {
  const tools = [
    { name: "LastActivityView", desc: "Attività recenti del sistema", url: "https://www.nirsoft.net/utils/lastactivityview.zip" },
    { name: "WinPrefetchView", desc: "Analisi file Prefetch", url: "https://www.nirsoft.net/utils/winprefetchview.zip" },
    { name: "ExecutedProgramsList", desc: "Storico eseguibili avviati", url: "https://www.nirsoft.net/utils/executedprogramslist.zip" },
    { name: "RecentFilesView", desc: "File aperti/modificati di recente", url: "https://www.nirsoft.net/utils/recentfilesview.zip" },
    { name: "USBDeview", desc: "Storico dispositivi USB", url: "https://www.nirsoft.net/utils/usbdeview.zip" },
  ];

  return (
    <div className="card">
      <h3 className="font-semibold text-white mb-2">Suite NirSoft — 5 Tool Forensi</h3>
      <p className="text-gray-400 text-sm mb-3">Ogni comando scarica lo .zip, lo estrae nel Desktop e rimuove l&apos;archivio.</p>
      <div className="space-y-2">
        {tools.map((t, i) => (
          <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2 text-sm">
            <span className="text-cyan-400 font-medium">{t.name}</span>
            <span className="text-gray-500 text-xs">{t.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <h3 className="font-semibold text-lg mb-3 text-cyan-400">{title}</h3>
      {children}
    </div>
  );
}

function ChecklistRow({ item, desc, flag }: { item: string; desc: string; flag: string }) {
  const flagColor = flag === "—" ? "badge-green" : "badge-red";
  return (
    <tr>
      <td className="font-medium text-white whitespace-nowrap">{item}</td>
      <td className="text-sm">{desc}</td>
      <td className="text-center"><span className={`badge ${flagColor}`}>{flag}</span></td>
    </tr>
  );
}

function FlagCard({ letter, title, severity, details }: {
  letter: string; title: string; severity: "red" | "yellow"; details: React.ReactNode;
}) {
  return (
    <div className={`flag-card flag-card-${severity}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg ${severity === "red" ? "bg-gradient-to-br from-red-500 to-orange-600" : "bg-gradient-to-br from-yellow-500 to-amber-600"}`}>
          {letter}
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <div className="text-gray-300 text-sm leading-relaxed">{details}</div>
      <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-semibold">
        ✦ BAN IMMEDIATO
      </div>
    </div>
  );
}

function StringCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card">
      <h3 className="font-semibold text-cyan-400 mb-3">{title}</h3>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="text-sm text-gray-300 font-mono bg-gray-800/50 rounded px-2 py-1">{item}</div>
        ))}
      </div>
    </div>
  );
}
