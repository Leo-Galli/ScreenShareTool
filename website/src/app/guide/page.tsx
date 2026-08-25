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
            { href: "#checklist", label: "Parte 2 — Checklist Pre-Analisi" },
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
          <h3 className="text-lg font-semibold mb-3 text-cyan-400">Requisiti Minimi per Condurre un SS</h3>
          <ol className="space-y-3 text-gray-300 text-sm">
            <li className="flex gap-3">
              <span className="badge badge-cyan shrink-0">1</span>
              <span>Rango ispettore ATTIVO e verificato da uno staff senior.</span>
            </li>
            <li className="flex gap-3">
              <span className="badge badge-cyan shrink-0">2</span>
              <span>Conoscenza pratica di tutti gli strumenti elencati nella Parte 1.</span>
            </li>
            <li className="flex gap-3">
              <span className="badge badge-cyan shrink-0">3</span>
              <span>Database locale degli hash SHA-256 per versioni Minecraft pulite: 1.8.9 Vanilla, 1.8.9 Forge, 1.12.2 Vanilla (necessario per Flag E).</span>
            </li>
            <li className="flex gap-3">
              <span className="badge badge-cyan shrink-0">4</span>
              <span>Connessione stabile. NON avviare un SS con ping superiore a 150ms.</span>
            </li>
          </ol>
        </div>

        <div className="card border-red-500/20">
          <h3 className="text-lg font-semibold mb-3 text-red-400">Codice di Condotta — Obbligatorio</h3>
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
        <p className="text-gray-400 mb-6">Tutti gli strumenti vanno scaricati ed eseguiti tramite riga di comando (CMD / PowerShell) sul PC del giocatore attraverso la sessione AnyDesk attiva. Questo elimina i tempi morti e riduce la possibilita che il giocatore intervenga sui file durante l&apos;attesa.</p>

        <div className="space-y-6">
          <ToolCard
            title="Everything (VoidTools)"
            desc="Indicizzatore MFT — ricerche istantanee su tutto il filesystem senza attendere l'indicizzazione di Windows. Indispensabile per localizzare log, .json e file sospetti ovunque si trovino."
            badge="Indispensabile"
            badgeColor="red"
            command="winget install voidtools.Everything --silent"
          />
          <ToolCard
            title="System Informer"
            desc="Analizzatore RAM e processi (successore di Process Hacker). Permette dump della memoria, ispezione delle DLL caricate da ogni processo e scansione completa delle stringhe in RAM."
            badge="Indispensabile"
            badgeColor="red"
            command="winget install SystemInformer.SystemInformer --silent"
          />
          <ToolCard
            title="Luyten"
            desc="Decompilatore Java — permette di aprire e ispezionare il bytecode di qualsiasi file .jar. Indispensabile per analizzare mod sospette e versioni modificate di Minecraft."
            command={`powershell -Command "Invoke-WebRequest -Uri 'https://github.com/deathmarine/Luyten/releases/download/v0.5.4_Rebuilt_with_Latest_Depenencies/luyten-0.5.4.exe' -OutFile '$env:USERPROFILE\\Desktop\\Luyten.exe'"`}
          />
          <NirsoftSuite />
        </div>
      </section>

      {/* PARTE 2 */}
      <section id="checklist" className="mb-16">
        <h2 className="section-title">Parte 2 — Checklist Pre-Analisi</h2>
        <p className="text-gray-400 mb-6">Eseguire IMMEDIATAMENTE dopo aver ottenuto accesso AnyDesk. Eseguire PRIMA di avviare qualsiasi tool. Scopo: fotografare lo stato iniziale della macchina e rilevare manomissioni in corso.</p>

        <div className="card overflow-x-auto">
          <table className="string-table">
            <thead>
              <tr>
                <th>Fatto</th>
                <th>Controllo</th>
                <th>Procedura</th>
                <th>Flag se KO</th>
              </tr>
            </thead>
            <tbody>
              <ChecklistRow item="2.1 Timestamp Cestino" desc="Apri C:\$Recycle.Bin — verifica data ultima modifica. Se coincide con la convocazione / attesa: anomalia." flag="A" />
              <ChecklistRow item="2.2 Cartella %TEMP%" desc="Win+R, %temp%, Invio. Cartella vuota o file con date recenti: sospetto." flag="Annotare" />
              <ChecklistRow item="2.3 Prefetch" desc="CMD admin: dir C:\Windows\Prefetch e Dir /Ar C:\Windows\Prefetch. Cartella vuota o file in sola lettura: anomalia." flag="B" />
              <ChecklistRow item="2.4 Everything" desc="Verificare che l'indicizzazione sia completa (barra inferiore: X oggetti)." flag="—" />
              <ChecklistRow item="2.5 USB attive" desc="Apri USBDeview e controlla dispositivi connessi. Dispositivi scollegati pochi minuti prima dell'SS: anomalia." flag="D" />
              <ChecklistRow item="2.6 Screenshot iniziale" desc="Acquisisci screenshot di: Desktop, Task Manager, cartella .minecraft\mods. Sono la base documentale." flag="—" />
            </tbody>
          </table>
        </div>
      </section>

      {/* PARTE 3 */}
      <section id="part3" className="mb-16">
        <h2 className="section-title">Parte 3 — Multiaccount e Ban Evading</h2>
        <p className="text-gray-400 mb-6">Sospetto: il giocatore possiede account alternativi non dichiarati o si e connesso al network per eludere un ban attivo.</p>

        <div className="space-y-6">
          <SubSection title="3.1 Log di Gioco Storici (.log e .log.gz)">
            <p className="text-gray-400 text-sm mb-3">I client ufficiali e custom registrano ogni cambio account e ogni sessione di login.</p>
            <div className="cmd-box mb-3 text-xs">
              <div className="text-gray-500 mb-1">Percorsi:</div>
              <div>Vanilla / Forge: %appdata%\.minecraft\logs\</div>
              <div>Lunar Client: C:\Users\%USERNAME%\.lunarclient\offline\logs\</div>
              <div>Badlion Client: C:\Users\%USERNAME%\AppData\Roaming\.minecraft\logs\blclient\</div>
            </div>
            <p className="text-gray-400 text-sm mb-2">Procedura:</p>
            <ol className="text-gray-300 text-sm space-y-1 ml-4">
              <li>1. In Everything cerca: latest.log</li>
              <li>2. Clic destro sul risultato, Apri percorso cartella</li>
              <li>3. Per i log compressi (.log.gz): estrarli con 7-Zip o WinRAR</li>
              <li>4. Apri con Notepad++ e usa Ctrl+F per cercare:</li>
            </ol>
            <div className="cmd-box mt-2 text-xs">
              <div>LwjglWindow: Title: Minecraft</div>
              <div>Logging in as</div>
              <div>Connecting to mc.charlieroleplay.it</div>
              <div>[Client thread/INFO]: Setting user:</div>
              <div>[Client thread/INFO]: (Session ID is</div>
            </div>
            <p className="text-gray-400 text-sm mt-3">5. Annotare ogni nickname trovato. 6. Confrontare con il database dei ban del network.</p>
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-semibold">
              ESITO: Match con account permanentemente bannato — BAN PER EVASIONE SANZIONI
            </div>
          </SubSection>

          <SubSection title="3.2 File di Configurazione Launcher (.json)">
            <p className="text-gray-400 text-sm mb-3">I launcher salvano localmente la cronologia degli account, token e profili.</p>
            <div className="cmd-box text-xs">
              <div className="text-gray-500 mb-1">Percorsi:</div>
              <div>%appdata%\.minecraft\launcher_profiles.json</div>
              <div>%appdata%\.minecraft\launcher_accounts.json</div>
              <div>%appdata%\.tlauncher\legacy\Minecraft\game\profiles.json</div>
            </div>
            <p className="text-gray-400 text-sm mt-3">Apri i file con il Blocco Note. Cerca: &quot;displayName&quot; &quot;username&quot; &quot;localId&quot; &quot;name&quot;. Ogni nome trovato = account fisicamente associato alla macchina. Account multipli non dichiarati: approfondire.</p>
          </SubSection>

          <SubSection title="3.3 Mod IAS — In-Game Account Switcher">
            <p className="text-gray-400 text-sm mb-3">Questa mod permette di cambiare account senza riavviare il gioco. Il suo file di configurazione contiene la lista completa degli account memorizzati.</p>
            <p className="text-gray-400 text-sm">Cerca in Everything: ias.json oppure ias-accounts.json. Il file contiene: nickname, UUID, tipo di autenticazione (Mojang / Microsoft / Cracked). Account multipli non dichiarati: approfondire.</p>
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-semibold">
              ESITO: Match con account bannato — BAN PER EVASIONE SANZIONI
            </div>
          </SubSection>

          <SubSection title="3.4 Cache Discord e Telegram">
            <p className="text-gray-400 text-sm mb-3">Le app di messaggistica possono contenere tracce di scambi di account, credenziali condivise o acquisto di alt Minecraft.</p>
            <p className="text-gray-400 text-sm mb-2">Percorso Discord: %appdata%\Discord\Cache\Cache_Data\</p>
            <p className="text-gray-400 text-sm">Procedura: In Everything filtra per file modificati di recente in quella cartella. Trascina i file sospetti in un editor di testo. Cerca: alts / account / mojang / mail:pass / token. Presenza di scambi relativi ad account Minecraft: documentare e segnalare allo staff senior per valutazione.</p>
          </SubSection>
        </div>
      </section>

      {/* PARTE 4 */}
      <section id="part4" className="mb-16">
        <h2 className="section-title">Parte 4 — Ghost Client</h2>
        <p className="text-gray-400 mb-6">Sospetto: il giocatore mostra movimenti anomali, critici costanti, traiettorie di mira innaturali, o capacita di vedere attraverso i blocchi (X-Ray, ESP). Un Ghost Client e un cheat integrato direttamente nel client Minecraft, spesso invisibile ai controlli superficiali.</p>

        <div className="space-y-6">
          <SubSection title="4.1 Ispezione del file .JSON di versione">
            <p className="text-gray-400 text-sm mb-3">I Ghost Client sostituiscono le classi di avvio di Minecraft modificando il file .json della versione installata.</p>
            <p className="text-gray-400 text-sm mb-2">Percorso: %appdata%\.minecraft\versions\[versione]\[versione].json</p>
            <p className="text-gray-400 text-sm mb-3">Procedura: Apri la cartella della versione usata dal giocatore (es. 1.8.9-Forge). Apri il file .json omonimo con il Blocco Note. Cerca la riga: &quot;mainClass&quot;. Confronta con i valori attesi:</p>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <h4 className="text-green-400 font-semibold text-sm mb-2">Valori Legittimi</h4>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>Vanilla — net.minecraft.client.main.Main</div>
                  <div>Forge — net.minecraft.launchwrapper.Launch</div>
                </div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <h4 className="text-red-400 font-semibold text-sm mb-2">Valori Sospetti (esempi noti)</h4>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>net.knet.Client</div>
                  <div>net.wurst.Client</div>
                  <div>fdp.client.Main</div>
                  <div>liquidbounce.Launch</div>
                  <div>(qualsiasi percorso non riconducibile a Mojang o MinecraftForge)</div>
                </div>
              </div>
            </div>
          </SubSection>

          <SubSection title="4.2 Dump RAM — Moduli Rimossi a Gioco Aperto (Unload)">
            <p className="text-gray-400 text-sm mb-3">Alcuni cheat vengono eliminati dal disco durante il gioco (unload), ma rimangono mappati nella RAM fino alla chiusura del processo. Questo permette di rilevarli anche dopo la cancellazione fisica del file.</p>
            <ol className="text-gray-300 text-sm space-y-2">
              <li>1. Avvia System Informer come Amministratore.</li>
              <li>2. Trova il processo javaw.exe, clic destro, Properties, scheda Memory.</li>
              <li>3. Configurazione: Disattiva &quot;Hide free regions&quot;, dimensione minima: 4, attiva filtri: Image, Mapped.</li>
              <li>4. Nel campo Filter, Contains (case insensitive), incolla: .minecraft\mods</li>
              <li>5. Se nella lista appare un file .jar (es. LiquidBounce.jar, Slinky.jar, Flux.jar) che NON e fisicamente presente nella cartella mods sul disco:</li>
            </ol>
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-semibold">
              ESITO: BAN PER UNLOAD CHEAT / CANCELLAZIONE PROVE
            </div>
          </SubSection>

          <SubSection title="4.3 Stringhe Forensi Ghost Client in RAM">
            <p className="text-gray-400 text-sm mb-3">Nella stessa scheda Memory di javaw.exe, sezione &quot;Strings&quot; (lunghezza minima: 4). La presenza di anche una sola di queste in contesto non giustificabile e prova sufficiente.</p>
            <div className="overflow-x-auto">
              <table className="string-table">
                <thead><tr><th>Client</th><th>Stringhe da Cercare</th></tr></thead>
                <tbody>
                  <tr><td className="text-cyan-400 font-medium">LiquidBounce</td><td>liquidbounce / net.ccbluex.liquidbounce / ccbluex</td></tr>
                  <tr><td className="text-cyan-400 font-medium">Wurst</td><td>wurstclient / net.wurstclient</td></tr>
                  <tr><td className="text-cyan-400 font-medium">Sigma</td><td>sigma.modules / net.sigmaclient</td></tr>
                  <tr><td className="text-cyan-400 font-medium">FDPClient</td><td>fdpclient / fdp.client.Main</td></tr>
                  <tr><td className="text-cyan-400 font-medium">Vape V4</td><td>net.vape.client / vape.v4 / vape.render</td></tr>
                  <tr><td className="text-cyan-400 font-medium">Generici</td><td>aura.class / speed.class / fly.class / noslowdown / nfall / nofall / reach.class</td></tr>
                </tbody>
              </table>
            </div>
          </SubSection>
        </div>
      </section>

      {/* PARTE 5 */}
      <section id="part5" className="mb-16">
        <h2 className="section-title">Parte 5 — External Client e Autoclicker</h2>
        <p className="text-gray-400 mb-6">Sospetto: CPS anomalo — eccessivamente alto (16-20+ CPS fissi) o innaturalmente costante — oppure assenza totale di rallentamento da knockback (NoVelocity).</p>

        <div className="space-y-6">
          <SubSection title="5.1 Rilevamento JNativeHook (Autoclicker Java)">
            <p className="text-gray-400 text-sm mb-3">La libreria JNativeHook e usata dagli autoclicker Java per intercettare i click del mouse al di fuori della finestra di gioco. Viene estratta come DLL temporanea.</p>
            <ol className="text-gray-300 text-sm space-y-2">
              <li>1. In System Informer, processo explorer.exe, Properties, Memory (stessa configurazione della sezione 4.2).</li>
              <li>2. Filtra per: JNativeHook</li>
              <li>3. Se trovi una DLL tipo JNativeHook-[stringa].dll mappata in memoria:</li>
            </ol>
            <p className="text-gray-400 text-sm mt-2 ml-4">a. In Everything cerca: JNativeHook</p>
            <p className="text-gray-400 text-sm ml-4">b. Se il file e in %temp% ma gia eliminato e la DLL e ancora in RAM:</p>
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-semibold">
              ESITO: BAN IMMEDIATO PER AUTOCLICKER ATTIVO / CANCELLAZIONE PROVE
            </div>
          </SubSection>

          <SubSection title="5.2 Stringhe Forensi Autoclicker in RAM">
            <p className="text-gray-400 text-sm mb-3">Scansiona &quot;Strings&quot; su javaw.exe o su eseguibili sospetti.</p>
            <div className="overflow-x-auto">
              <table className="string-table">
                <thead><tr><th>Software</th><th>Stringhe da Cercare</th></tr></thead>
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

          <SubSection title="5.3 Analisi Prefetch: conhost.exe e javaw.exe">
            <p className="text-gray-400 text-sm mb-3">Gli autoclicker basati su script invocano istanze nascoste della console Windows (conhost.exe) che lasciano traccia nel Prefetch.</p>
            <ol className="text-gray-300 text-sm space-y-2">
              <li>1. Apri WinPrefetchView come Amministratore.</li>
              <li>2. Cerca: Conhost.exe.pf — Nella sezione inferiore, verifica i file d'appoggio. Presenza di .bat, .cmd, o file in %temp% / %appdata% / Desktop: SOSPETTO ELEVATO.</li>
              <li>3. Cerca: Javaw.exe.pf — Controlla se tra i file caricati compaiono eseguibili esterni o DLL estranee al normale funzionamento di Minecraft e Forge.</li>
            </ol>
          </SubSection>
        </div>
      </section>

      {/* PARTE 6 */}
      <section id="part6" className="mb-16">
        <h2 className="section-title">Parte 6 — Dizionario Stringhe Forensi</h2>
        <p className="text-gray-400 mb-6">Da usare nella sezione &quot;Strings&quot; di System Informer filtrando su: javaw.exe / explorer.exe / csrss.exe / qualsiasi eseguibile sospetto.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <StringCard title="Combat / Aim / Reach" items={["combat/Reach", "combat/Killaura", "combat/Aimbot", "combat/Triggerbot", "combat/Velocity", "combat/AntiKnockback", "Hitbox/Expand", "Reach/Distance", "TargetHUD", "KeepSprint", "Criticals", "AutoWeapon", "net/minecraft/client/entity/EntityPlayerSP/motionX", "net/minecraft/client/entity/EntityPlayerSP/motionZ"]} />
          <StringCard title="Autoclicker Generici" items={["AutoClicker", "ClickAssist", "LeftClicker", "RightClicker", "JitterClick", "BurstClick", "CPSCounter", "MinCPS", "MaxCPS", "RandomizationDelay", "BlockBreakDelay", "InventoryFillClick", "RightClickBlatant", "LegitimateClicker"]} />
          <StringCard title="Self-Destruct / Anti-Forensics" items={["SelfDestruct", "DestructModule", "CleanTracks", "WipeLogs", "DetachConsole", "DeleteOnClose", "UnloadDriver", "HideProcess", "RemoveRegistryKeys", "KillSwitch", "PanicButton"]} />
          <StringCard title="Movement / World" items={["flight/Flight", "scaffold/Scaffold", "speed/Speed", "nofall/NoFall", "ESP/EntityESP", "Xray/XRay", "freecam/FreeCam", "phase/Phase", "blink/Blink", "Timer/SpeedHack"]} />
        </div>
      </section>

      {/* PARTE 7 — FLAGS */}
      <section id="flags" className="mb-16">
        <h2 className="section-title">Parte 7 — Flags di Ban Immediato</h2>
        <p className="text-gray-400 mb-8">Ogni Flag corrisponde a un&apos;anomalia specifica. Le azioni sono TASSATIVE. Documentare SEMPRE le prove con screenshot PRIMA di procedere al ban.</p>

        <div className="space-y-6">
          <FlagCard letter="A" title="Pulizia Prove durante Freeze / Attesa SS" severity="red" details={
            <>
              <p className="mb-3">Sospetto: il giocatore ha modificato o eliminato file prima di accettare AnyDesk.</p>
              <p className="mb-2 text-sm font-semibold">Ispezioni obbligatorie:</p>
              <ul className="text-sm space-y-1 ml-4 text-gray-300">
                <li>C:\$Recycle.Bin (Cestino profondo)</li>
                <li>%temp%\Rar$Exa[...] (Archivi volatili)</li>
                <li>shell:recent (Accessi recenti)</li>
                <li>%appdata%\Microsoft\Windows\Recent</li>
              </ul>
              <p className="mt-3 text-sm">Regola: data modifica Cestino / %TEMP% coincide con freeze o attesa pre-SS</p>
            </>
          } />

          <FlagCard letter="B" title="Prefetch Disabilitato o Alterato" severity="red" details={
            <>
              <p className="mb-3">Sospetto: il giocatore ha bloccato il tracciamento di Windows per nascondere l&apos;avvio del cheat.</p>
              <p className="mb-2 text-sm font-semibold">Ispezione 1 — Registro di sistema:</p>
              <div className="cmd-box text-xs mb-3">regedit — HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters\EnablePrefetcher</div>
              <p className="text-sm">0 = Prefetch disabilitato (ANOMALO su macchina da gaming) / 1 = Solo boot / 2 = Solo applicazioni / 3 = Entrambi (VALORE ATTESO)</p>
              <p className="mt-2 text-sm font-semibold">Ispezione 2 — File Prefetch in sola lettura:</p>
              <p className="text-sm">CMD admin: Dir /Ar C:\Windows\Prefetch — File .pf con attributo sola lettura = blocco intenzionale degli aggiornamenti.</p>
            </>
          } />

          <FlagCard letter="C" title="Metadati Incoerenti degli Eseguibili (Rinomina Cheat)" severity="red" details={
            <>
              <p className="text-sm mb-2">Sospetto: il giocatore ha rinominato un eseguibile cheat con un nome innocuo (es. Optifine.exe, Spotify.exe, javaw.exe).</p>
              <p className="text-sm">Procedura: Apri ExecutedProgramsList di NirSoft. Ordina per data, identifica l&apos;eseguibile sospetto. Controlla le colonne &quot;Company Name&quot; e &quot;Product Version&quot;.</p>
              <p className="mt-2 text-sm">Regola: nome file non corrisponde ai metadati del produttore (es. &quot;Optifine.exe&quot; con Company Name &quot;Vape Software&quot; o campo vuoto)</p>
            </>
          } />

          <FlagCard letter="D" title="Disconnessione USB in Prossimita dell&apos;SS" severity="red" details={
            <p className="text-sm">Sospetto: il giocatore ha rimosso fisicamente una chiavetta USB o HDD esterno contenente i file del cheat prima di accettare lo ScreenShare. Procedura: Apri USBDeview come Amministratore. Controlla la colonna &quot;Last Plug/Unplug Date&quot;. Regola: dispositivo di massa USB scollegato nell&apos;esatto minuto della convocazione o durante il periodo di freeze.</p>
          } />

          <FlagCard letter="E" title="Hash SHA-256 Difforme (Java Edit)" severity="red" details={
            <>
              <p className="text-sm mb-2">Sospetto: i file nativi del Launcher sono stati sostituiti per integrare il cheat direttamente nel codice di Minecraft, senza usare la cartella mods.</p>
              <p className="text-sm mb-2">Procedura — Calcola l&apos;hash del file .jar della versione in uso:</p>
              <div className="cmd-box text-xs">Get-FileHash &quot;$env:APPDATA\.minecraft\versions\[ver]\[ver].jar&quot; -Algorithm SHA256</div>
              <p className="mt-2 text-sm">Confronta con il tuo database locale di hash verificati. Nota: mantieni aggiornato il DB per 1.8.9 Vanilla, 1.8.9 Forge, 1.12.2, ecc.</p>
            </>
          } />

          <FlagCard letter="F" title="Alterazione del Registro di Sistema" severity="red" details={
            <>
              <p className="text-sm mb-2">Sospetto: il giocatore ha cancellato chiavi del registro o rimosso i permessi di scrittura per impedire la registrazione dei log di esecuzione.</p>
              <p className="text-sm mb-2">Ispezione 1 — Compatibility Assistant Store: Esporta la chiave HKEY_CURRENT_USER\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Compatibility Assistant\Store. Controlla &quot;Last Write Time&quot;. Coincide con il freeze o la convocazione: BAN PER ALTERAZIONE REGISTRO.</p>
              <p className="text-sm">Ispezione 2 — Event Viewer (Sicurezza): eventvwr.msc, Registri di Windows, Sicurezza. Filtra per ID Evento: 4798.</p>
            </>
          } />

          <FlagCard letter="G" title="Mod .jar Offuscata o con Classi Illecite" severity="red" details={
            <>
              <p className="text-sm mb-2">Sospetto: una mod apparentemente estetica o di utility nasconde funzioni illecite (Reach, Velocity, Autoclicker integrato).</p>
              <p className="text-sm mb-2">Procedura: Trascina il file .jar sospetto dentro Luyten. Controlla il file mcmod.info (campo authorList). Analizza l&apos;albero delle classi .class.</p>
              <p className="text-sm">Regola A: classi con funzioni illecite (Reach, Velocity, Aura, ecc.) — BAN PER MOD CON FUNZIONI ILLECITE</p>
              <p className="text-sm">Regola B: mod PvP estetica criptata/offuscata in modo da impedirne la decompilazione — BAN PER SOFTWARE ARTEFATTO / MOD CRIPTATA</p>
            </>
          } />
        </div>

        {/* Summary Table */}
        <div className="card mt-8 overflow-x-auto">
          <h3 className="font-semibold text-lg mb-4">Riepilogo Flags — Tabella Rapida</h3>
          <table className="string-table">
            <thead>
              <tr><th>Flag</th><th>Anomalia</th><th>Motivazione del Ban</th></tr>
            </thead>
            <tbody>
              <tr><td className="text-red-400 font-bold">A</td><td>Pulizia prove durante freeze/attesa SS</td><td>Cancellazione Prove</td></tr>
              <tr><td className="text-red-400 font-bold">B</td><td>Prefetch disabilitato o file bloccati</td><td>Alterazione Sistema / Elusione</td></tr>
              <tr><td className="text-red-400 font-bold">C</td><td>Eseguibile rinominato con metadati falsi</td><td>Mimetizzazione Cheat / Alterazione File</td></tr>
              <tr><td className="text-red-400 font-bold">D</td><td>USB scollegata alla convocazione</td><td>Rimozione Periferiche</td></tr>
              <tr><td className="text-red-400 font-bold">E</td><td>Hash .jar difforme dalla versione ufficiale</td><td>Java Edit</td></tr>
              <tr><td className="text-red-400 font-bold">F</td><td>Registro di sistema alterato</td><td>Manipolazione Policy di Sistema</td></tr>
              <tr><td className="text-red-400 font-bold">G</td><td>Mod .jar con classi illecite/offuscata</td><td>Mod Illecita / Software Artefatto</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* PARTE 8 */}
      <section id="part8" className="mb-16">
        <h2 className="section-title">Parte 8 — Casi Borderline e Falsi Positivi</h2>

        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">Quando NON Bannare</h3>
          <div className="overflow-x-auto">
            <table className="string-table">
              <thead><tr><th>Situazione</th><th>Motivazione</th></tr></thead>
              <tbody>
                <tr><td>Stringhe generiche in RAM (es. &quot;speed&quot;, &quot;fly&quot;) senza contesto client-specifico</td><td>Queste stringhe compaiono in browser, overlay, software legittimi. Servono stringhe contestualizzate per procedere.</td></tr>
                <tr><td>CPS elevato senza evidenza di autoclicker</td><td>Alcuni giocatori sono butterfly/drag clicker. Il CPS da solo non e sufficiente. Servono JNativeHook o stringhe specifiche.</td></tr>
                <tr><td>Hash .jar difforme per Forge o OptiFine</td><td>Versioni di Forge/OptiFine variano legittimamente. Confrontare SOLO con la versione identica (es. 1.8.9-Forge-11.15.1.2318).</td></tr>
                <tr><td>File sconosciuti in %TEMP%</td><td>Aggiornatori software, driver, antivirus generano file temporanei frequenti. La data DEVE coincidere col freeze per essere rilevante.</td></tr>
                <tr><td>IAS Mod con piu account presenti</td><td>Avere piu account non e di per se una violazione. La violazione e il match con un account BANNATO sul network.</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card border-yellow-500/20">
          <h3 className="text-lg font-semibold mb-3 text-yellow-400">Procedura in Caso di Dubbio</h3>
          <ol className="text-gray-300 text-sm space-y-2">
            <li>1. NON emettere ban in autonomia. Contatta uno staff senior tramite il canale dedicato con gli screenshot delle anomalie.</li>
            <li>2. Documenta lo stato della macchina con screenshot dettagliati e salvali.</li>
            <li>3. Il giocatore puo essere messo in stato &quot;In osservazione&quot; per un periodo definito dallo staff senior in attesa di ulteriori verifiche.</li>
            <li>4. Se le prove sono state distrutte ma non c&apos;e prova diretta del cheat: considera &quot;Rifiuto SS&quot; — Ban per rifiuto/ostruzione allo ScreenShare.</li>
          </ol>
        </div>
      </section>

      {/* PARTE 9 */}
      <section id="part9" className="mb-16">
        <h2 className="section-title">Parte 9 — Chiusura e Pulizia della Macchina</h2>

        <div className="card mb-6 border-green-500/20">
          <h3 className="text-lg font-semibold mb-3 text-green-400">Pulizia Completa</h3>
          <p className="text-gray-400 text-sm mb-3">Al termine dell&apos;ispezione — sia in caso di assoluzione che di sanzione — l&apos;ispettore ha l&apos;OBBLIGO di rimuovere completamente tutti gli strumenti scaricati.</p>
          <div className="cmd-box text-xs overflow-x-auto">
            powershell -Command &quot;Remove-Item -Path &apos;$env:USERPROFILE\Desktop\LastActivityView&apos;, &apos;$env:USERPROFILE\Desktop\WinPrefetchView&apos;, &apos;$env:USERPROFILE\Desktop\RecentFilesView&apos;, &apos;$env:USERPROFILE\Desktop\USBDeview&apos;, &apos;$env:USERPROFILE\Desktop\ExecutedProgramsList&apos;, &apos;$env:USERPROFILE\Desktop\Luyten.exe&apos; -Recurse -Force -ErrorAction SilentlyContinue&quot;
          </div>
        </div>

        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-3 text-yellow-400">Verifica Manuale Post-Pulizia</h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>Desktop tornato allo stato originale.</li>
            <li>Nessun processo degli strumenti in esecuzione nel Task Manager.</li>
            <li>Sessione AnyDesk chiusa SOLO dopo questa verifica.</li>
          </ul>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-3 text-cyan-400">Documentazione Finale Obbligatoria</h3>
          <p className="text-gray-400 text-sm mb-3">Da pubblicare nel canale staff dedicato:</p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2 text-gray-300">
              <div>Nickname del giocatore ispezionato</div>
              <div>Esito: Assolto / Bannato / In osservazione</div>
              <div>Motivazione del ban con Flag di riferimento (es. Flag B + Flag D)</div>
            </div>
            <div className="space-y-2 text-gray-300">
              <div>Screenshot delle prove raccolte</div>
              <div>Orario di inizio e fine sessione</div>
              <div>Desktop tornato allo stato originale</div>
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
    { name: "LastActivityView", desc: "Attivita recenti del sistema operativo" },
    { name: "WinPrefetchView", desc: "Analisi file Prefetch di Windows" },
    { name: "ExecutedProgramsList", desc: "Storico completo degli eseguibili avviati" },
    { name: "RecentFilesView", desc: "File aperti o modificati di recente" },
    { name: "USBDeview", desc: "Storico di tutti i dispositivi USB collegati" },
  ];

  return (
    <div className="card">
      <h3 className="font-semibold text-white mb-2">Suite NirSoft — 5 Tool Forensi</h3>
      <p className="text-gray-400 text-sm mb-3">Ogni comando scarica lo .zip, lo estrae nel Desktop e rimuove l&apos;archivio. Eseguire uno per uno nel Prompt dei Comandi.</p>
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
      <td className="text-center">
        <input type="checkbox" className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-cyan-500 focus:ring-cyan-500" />
      </td>
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
        BAN IMMEDIATO
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
