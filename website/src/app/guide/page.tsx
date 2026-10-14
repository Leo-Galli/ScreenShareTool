import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Operational Guide",
  description:
    "The complete, 10-part operational manual for conducting a Minecraft screen share: tool deployment, pre-analysis checklist, multi-accounting, ghost clients, autoclickers, immediate ban flags, false positives, and machine cleanup.",
};

function FlagBadge({ f }: { f: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
      Flag {f}
    </span>
  );
}

function CmdBox({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-950 border border-gray-700 rounded-lg p-4 my-3 font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">
      {children}
    </div>
  );
}

const headingGradient: Record<string, string> = {
  cyan: "from-cyan-400 to-blue-500",
  red: "from-red-400 to-red-600",
  yellow: "from-yellow-400 to-yellow-600",
};

function PartSection({
  id,
  num,
  title,
  color = "cyan",
  children,
}: {
  id: string;
  num: number;
  title: string;
  color?: "cyan" | "red" | "yellow";
  children: ReactNode;
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <span className={`w-1.5 h-8 bg-gradient-to-b ${headingGradient[color]} rounded-full`} />
        <span>
          Part {num} — {title}
        </span>
      </h2>
      {children}
    </section>
  );
}

function CheckItem({ children }: { children: ReactNode }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
      <input type="checkbox" className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-cyan-500 accent-cyan-500" />
      <span>{children}</span>
    </label>
  );
}

const toc = [
  { href: "#p0", t: "Part 0 — Roles, Requirements, and Code of Conduct" },
  { href: "#p1", t: "Part 1 — Tool Deployment" },
  { href: "#p2", t: "Part 2 — Pre-Analysis Checklist" },
  { href: "#p3", t: "Part 3 — Multi-Accounting and Ban Evasion" },
  { href: "#p4", t: "Part 4 — Ghost Clients" },
  { href: "#p5", t: "Part 5 — External Clients and Autoclickers" },
  { href: "#p6", t: "Part 6 — Forensic String Dictionary" },
  { href: "#p7", t: "Part 7 — Immediate Ban Flags" },
  { href: "#p8", t: "Part 8 — Borderline Cases and False Positives" },
  { href: "#p9", t: "Part 9 — Closure and Cleanup" },
];

export default function Guide() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Screen Share Operational Manual
          </span>
        </h1>
        <p className="text-gray-400 text-lg">
          A complete procedure for conducting a professional screen share inspection
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            v3.1.0
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
      <nav className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-12" aria-label="Guide table of contents">
        <h2 className="text-lg font-bold mb-4">Table of Contents</h2>
        <div className="grid md:grid-cols-2 gap-1.5 text-sm">
          {toc.map((l, i) => (
            <a key={i} href={l.href} className="text-cyan-400 hover:text-cyan-300 py-1 transition-colors">
              {l.t}
            </a>
          ))}
        </div>
      </nav>

      {/* PART 0 */}
      <PartSection id="p0" num={0} title="Roles, Requirements, and Code of Conduct">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Minimum Requirements</h3>
          <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
            <li>Active and verified inspector rank.</li>
            <li>Practical knowledge of every tool listed in Part 1.</li>
            <li>A local database of SHA-256 hashes for clean Minecraft versions (1.8.9 Vanilla, 1.8.9 Forge, 1.12.2 Vanilla — required for Flag E).</li>
            <li>A stable connection. Do NOT start a screen share with ping above 150ms.</li>
          </ol>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">Code of Conduct</h3>
          <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
            <li>Do not reveal the procedures in this manual to players during the check.</li>
            <li>Do not threaten, insult, or psychologically pressure the player.</li>
            <li>Do not extend the check beyond strictly necessary time.</li>
            <li>Every ban MUST be documented with screenshot evidence.</li>
            <li>In case of doubt, consult a senior inspector BEFORE issuing sanctions.</li>
            <li>Personal data (user path, real username, etc.) must NOT be disclosed.</li>
          </ol>
        </div>
      </PartSection>

      {/* PART 1 */}
      <PartSection id="p1" num={1} title="Tool Deployment via Terminal">
        <p className="text-gray-400 text-sm mb-6">
          All tools are downloaded and run from the command line on the player&apos;s PC, through the active AnyDesk session.
        </p>

        {/* 1.1 Everything */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-cyan-400">1.1 Everything (VoidTools) — MFT Indexer</h3>
          <p className="text-gray-400 text-sm mb-3">Enables instant searches across the entire filesystem without waiting for Windows indexing.</p>
          <CmdBox>winget install voidtools.Everything --silent</CmdBox>
        </div>

        {/* 1.2 System Informer */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-cyan-400">1.2 System Informer — RAM and Process Analyzer</h3>
          <p className="text-gray-400 text-sm mb-3">A modern replacement for Process Hacker. Supports memory dumps, inspection of loaded DLLs, and full RAM string scanning.</p>
          <CmdBox>winget install SystemInformer.SystemInformer --silent</CmdBox>
        </div>

        {/* 1.3 Luyten */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-cyan-400">1.3 Luyten — Java Decompiler (.jar)</h3>
          <p className="text-gray-400 text-sm mb-3">Opens and inspects the bytecode of any .jar file.</p>
          <CmdBox>{`powershell -Command "Invoke-WebRequest -Uri 'https://github.com/deathmarine/Luyten/releases/download/v0.5.4_Rebuilt_with_Latest_Depenencies/luyten-0.5.4.exe' -OutFile '$env:USERPROFILE\\Desktop\\Luyten.exe'"`}</CmdBox>
        </div>

        {/* 1.4 Suite NirSoft */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-cyan-400">1.4 NirSoft Suite — 5 Forensic Tools</h3>
          <p className="text-gray-400 text-sm mb-3">Each command downloads the zip, extracts it to the Desktop, and removes the archive.</p>
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            {[
              { name: "LastActivityView", desc: "Recent operating system activity" },
              { name: "WinPrefetchView", desc: "Windows Prefetch file analysis" },
              { name: "ExecutedProgramsList", desc: "Complete history of executed programs" },
              { name: "RecentFilesView", desc: "Recently opened or modified files" },
              { name: "USBDeview", desc: "History of connected USB devices" },
            ].map((t, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-3">
                <span className="text-cyan-400 font-medium text-sm">{t.name}</span>
                <span className="text-gray-500 text-sm ml-2">— {t.desc}</span>
              </div>
            ))}
          </div>
          <CmdBox>{`powershell -Command "Invoke-WebRequest -Uri 'https://www.nirsoft.net/utils/lastactivityview.zip' -OutFile '$env:USERPROFILE\\Desktop\\lastactivityview.zip'; Expand-Archive -Path '$env:USERPROFILE\\Desktop\\lastactivityview.zip' -DestinationPath '$env:USERPROFILE\\Desktop\\LastActivityView' -Force; Remove-Item '$env:USERPROFILE\\Desktop\\lastactivityview.zip'"`}</CmdBox>
          <p className="text-gray-500 text-xs mt-2">Repeat the same pattern, substituting lastactivityview with winprefetchview, executedprogramslist, recentfilesview, or usbdeview.</p>
        </div>
      </PartSection>

      {/* PART 2 */}
      <PartSection id="p2" num={2} title="Pre-Analysis Checklist">
        <p className="text-gray-400 text-sm mb-6">
          Run IMMEDIATELY after gaining AnyDesk access, BEFORE launching any tool. Purpose: capture the machine&apos;s initial state and detect tampering already in progress.
        </p>
        <div className="space-y-3">
          {[
            { ctrl: "2.1 Recycle Bin Timestamp", proc: "Open C:\\$Recycle.Bin and check the last-modified date. If it matches the time of the summons: anomaly.", flag: "A" },
            { ctrl: "2.2 %TEMP% Folder", proc: "Win+R, type %temp%, Enter. An empty folder or files with recent dates: suspicious.", flag: "Note" },
            { ctrl: "2.3 Prefetch", proc: "Admin CMD: dir C:\\Windows\\Prefetch — dir /ar C:\\Windows\\Prefetch. An empty folder or read-only files: anomaly.", flag: "B" },
            { ctrl: "2.4 Everything", proc: "Verify that indexing is complete (status bar: X objects).", flag: null },
            { ctrl: "2.5 Active USB Devices", proc: "Open USBDeview and check connected devices. Devices disconnected minutes before the screen share: anomaly.", flag: "D" },
            { ctrl: "2.6 Initial Screenshot", proc: "Capture screenshots of: Desktop, Task Manager, and the .minecraft/mods folder. This forms your documentation baseline.", flag: null },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3">
              <div className="md:w-64 shrink-0">
                <CheckItem>
                  <span className="font-medium text-white">{item.ctrl}</span>
                </CheckItem>
              </div>
              <p className="text-gray-400 text-sm flex-1">{item.proc}</p>
              <div className="shrink-0">
                {item.flag ? (
                  item.flag === "Note" ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      Note
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
      </PartSection>

      {/* PART 3 */}
      <PartSection id="p3" num={3} title="Multi-Accounting and Ban Evasion">
        <p className="text-gray-400 text-sm mb-6">
          Suspicion: the player holds undeclared alternate accounts, or connected to the network to evade an active ban.
        </p>

        <div className="space-y-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">3.1 Historical Game Logs (.log and .log.gz)</h3>
            <p className="text-gray-400 text-sm mb-3">Official and custom clients log every account switch and login session.</p>
            <div className="text-gray-300 text-sm mb-3 space-y-1">
              <p>Vanilla/Forge: %appdata%\.minecraft\logs\</p>
              <p>Lunar Client: C:\Users\%USERNAME%\.lunarclient\offline\logs\</p>
              <p>Badlion Client: C:\Users\%USERNAME%\AppData\Roaming\.minecraft\logs\blclient\</p>
            </div>
            <p className="text-gray-400 text-sm mb-2">Procedure: in Everything, search for latest.log, open it with Notepad++, and search with Ctrl+F for:</p>
            <CmdBox>{`LwjglWindow: Title: Minecraft\nLogging in as\nConnecting to mc.charlieroleplay.it\n[Client thread/INFO]: Setting user:\n[Client thread/INFO]: (Session ID is`}</CmdBox>
            <p className="text-gray-400 text-sm mt-3">Record every nickname found. Cross-reference it against the ban database. A match with a banned account = BAN FOR SANCTION EVASION.</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">3.2 Launcher Configuration Files (.json)</h3>
            <p className="text-gray-400 text-sm mb-3">Launchers store account history, tokens, and profiles locally.</p>
            <div className="text-gray-300 text-sm space-y-1 mb-3">
              <p>Vanilla/Forge: %appdata%\.minecraft\launcher_profiles.json, launcher_accounts.json</p>
              <p>TLauncher: %appdata%\.minecraft\TlauncherProfiles.json</p>
            </div>
            <p className="text-gray-400 text-sm">Search for: &quot;displayName&quot; &quot;username&quot; &quot;localId&quot; &quot;name&quot;. Every name found is an account associated with this machine.</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">3.3 IAS Mod — In-Game Account Switcher</h3>
            <p className="text-gray-400 text-sm mb-3">This mod allows switching accounts without restarting the game. Its configuration file contains the full list of stored accounts.</p>
            <p className="text-gray-400 text-sm">In Everything, search for ias.json or ias-accounts.json. The file contains: nickname, UUID, and authentication type (Mojang / Microsoft / Cracked).</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">3.4 Discord and Telegram Cache</h3>
            <p className="text-gray-400 text-sm mb-3">Messaging apps can contain traces of account trading, shared credentials, or purchases of alt Minecraft accounts.</p>
            <p className="text-gray-400 text-sm">Discord path: %appdata%\Discord\Cache\Cache_Data\. Search for: alts, account, mojang, mail:pass, token.</p>
          </div>
        </div>
      </PartSection>

      {/* PART 4 */}
      <PartSection id="p4" num={4} title="Ghost Clients">
        <p className="text-gray-400 text-sm mb-6">
          Suspicion: anomalous movement, constant critical hits, unnatural aim trajectories, or the ability to see through blocks (X-Ray, ESP). A Ghost Client is a cheat built directly into the Minecraft client.
        </p>

        <div className="space-y-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">4.1 Inspecting the Version .json File</h3>
            <p className="text-gray-400 text-sm mb-3">Ghost Clients replace Minecraft&apos;s launch classes by modifying the installed version&apos;s .json file.</p>
            <p className="text-gray-400 text-sm mb-3">Path: %appdata%\.minecraft\versions\[version]\[version].json</p>
            <p className="text-gray-400 text-sm mb-2">Find the &quot;mainClass&quot; line and compare it against:</p>
            <div className="bg-gray-800/50 rounded-lg p-4 text-sm">
              <div className="mb-3">
                <p className="text-green-400 font-medium mb-1">Legitimate values:</p>
                <p className="text-gray-300">Vanilla: net.minecraft.client.main.Main</p>
                <p className="text-gray-300">Forge: net.minecraft.launchwrapper.Launch</p>
              </div>
              <div>
                <p className="text-red-400 font-medium mb-1">Suspicious values:</p>
                <p className="text-gray-300">net.knet.Client, net.wurst.Client, fdp.client.Main, liquidbounce.Launch</p>
                <p className="text-gray-400 text-xs">any path that doesn&apos;t trace back to Mojang or MinecraftForge</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">4.2 RAM Dump — Modules Removed While Running (Unload)</h3>
            <p className="text-gray-400 text-sm mb-3">Some cheats delete themselves from disk while the game is running (unload), but remain mapped in RAM until the process is closed.</p>
            <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
              <li>Launch System Informer as Administrator.</li>
              <li>Find the javaw.exe process, right-click, Properties, Memory tab.</li>
              <li>Disable &quot;Hide free regions&quot;, set minimum size to 4, and enable the Image and Mapped filters.</li>
              <li>In the Filter field — Contains (case insensitive): .minecraft\mods</li>
              <li>If a .jar appears in the list (e.g. LiquidBounce.jar) that is NOT physically present in the mods folder on disk: BAN FOR UNLOAD CHEAT / EVIDENCE DESTRUCTION.</li>
            </ol>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">4.3 Ghost Client Forensic Strings in RAM</h3>
            <p className="text-gray-400 text-sm mb-3">In the Memory tab of javaw.exe, open &quot;Strings&quot; (minimum length: 4).</p>
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
              <p className="text-cyan-400 font-medium mb-2">Generic</p>
              <p className="text-gray-300">aura.class / speed.class / fly.class / noslowdown / nfall / nofall / reach.class</p>
            </div>
          </div>
        </div>
      </PartSection>

      {/* PART 5 */}
      <PartSection id="p5" num={5} title="External Clients and Autoclickers">
        <p className="text-gray-400 text-sm mb-6">
          Suspicion: abnormal CPS (a fixed or unnaturally constant 16-20+ CPS), or a complete absence of knockback slowdown (NoVelocity).
        </p>

        <div className="space-y-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">5.1 Detecting JNativeHook (Java Autoclickers)</h3>
            <p className="text-gray-400 text-sm mb-3">The JNativeHook library is used by Java autoclickers to intercept mouse clicks outside the game window.</p>
            <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
              <li>In System Informer, open the explorer.exe process — Properties — Memory.</li>
              <li>Filter for: JNativeHook</li>
              <li>If you find a DLL like JNativeHook-[string].dll mapped in memory, search Everything for JNativeHook.</li>
              <li>If the file is in %temp% but already deleted, and the DLL is still in RAM: IMMEDIATE BAN FOR ACTIVE AUTOCLICKER.</li>
            </ol>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">5.2 Autoclicker Forensic Strings in RAM</h3>
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
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">5.3 Prefetch Analysis: conhost.exe and javaw.exe</h3>
            <p className="text-gray-400 text-sm mb-3">Script-based autoclickers spawn hidden instances of the Windows console (conhost.exe), which leave traces in Prefetch.</p>
            <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
              <li>Open WinPrefetchView as Administrator.</li>
              <li>Search for Conhost.exe.pf and check its referenced files. The presence of .bat, .cmd, or files in %temp%: HIGH SUSPICION.</li>
              <li>Search for Javaw.exe.pf and check whether its loaded files include unrelated executables or foreign DLLs.</li>
            </ol>
          </div>
        </div>
      </PartSection>

      {/* PART 6 */}
      <PartSection id="p6" num={6} title="Forensic String Dictionary">
        <p className="text-gray-400 text-sm mb-6">
          Use this in the &quot;Strings&quot; tab of System Informer, filtering on javaw.exe, explorer.exe, csrss.exe, or any suspicious executable.
        </p>

        <div className="space-y-4">
          {[
            { cat: "Combat / Aim / Reach", items: "combat/Reach, combat/Killaura, combat/Aimbot, combat/Triggerbot, combat/Velocity, combat/AntiKnockback, Hitbox/Expand, Reach/Distance, TargetHUD, KeepSprint, Criticals, AutoWeapon, net/minecraft/client/entity/EntityPlayerSP/motionX, net/minecraft/client/entity/EntityPlayerSP/motionZ" },
            { cat: "Generic Autoclicker", items: "AutoClicker, ClickAssist, LeftClicker, RightClicker, JitterClick, BurstClick, CPSCounter, MinCPS, MaxCPS, RandomizationDelay, BlockBreakDelay, InventoryFillClick, RightClickBlatant, LegitimateClicker" },
            { cat: "Self-Destruct Mechanisms", items: "SelfDestruct, DestructModule, CleanTracks, WipeLogs, DeleteEvidence, AntiForensic, UnloadModule, DisableLoader, StealthMode, HiddenProcess, DeleteOnClose, ExitClean, SecureDelete, WipeOnExit, ClearHistory" },
            { cat: "Movement / Speed / Fly", items: "Speed/Boost, Fly/NoFall, Sprint/HumanSprint, Step, Jesus, BoatFly, ElytraFly, Spider, NoSlow, FastPlace, FastBreak, Scaffold, Tower, Speed/Bhop, Timer" },
            { cat: "Render / ESP / Visuals", items: "ESP/PlayerESP, ESP/ChestESP, ESP/BlockESP, ESP/ItemESP, XRay, Nametags, Tracers, StorageESP, ItemESP, MobESP, AntiOverlay, FullBright, Chams, ItemPhysics, Tomograph, NewChunks, OldChunks" },
            { cat: "HUD / Overlay / UI", items: "ClickGUI, ArrayList, Watermark, TabGUI, InvViewer, ArmorHUD, CrosshairMod, Coords, Coordinates, ServerIP, MemoryDisplay, FPSDisplay, CPSDisplay, Keystrokes" },
            { cat: "Misc / Utility", items: "AutoEat, ChestStealer, InventoryManager, AutoArmor, AutoTool, AutoPot, AutoSnowball, Spammer, AntiAFK, FakePlayer, Step, FastUse, RightClickRefresh, MiddleClick, FastBridge" },
            { cat: "Packet / Network", items: "PacketFly, PacketElytra, Velocity, AntiVelocity, Bypass, Flag, Check, Disabler, PacketCancel, SendInterval, Limbo" },
            { cat: "Ghost Client-Specific", items: "Do0mClient, MoonClient, Tenacity, Astolfo, Kami, Phobos, SalHack, Seppuku, Flux, Snow, Rise, Rusher, Sigma, Vape, LiquidBounce, Wurst, FDP, RISE, Future, Impact, Aristois, Inertia" },
            { cat: "Doomsday / Auto-Destruct", items: "doomsday, doomsday.client, doomsday.Main, doomsday.unload, doomsday.clean, doomsday.selfdestruct, doomsday.delete, doomsday.wipe, doomsday.stealth, doomsday.hidden, doomsday.remove, doomsday.forge, Class.forName, ClassLoader, defineClass, loadClass, getDeclaredMethod" },
            { cat: "Anti-Cheat Bypass", items: "AntiCheat, Bypass, Vanilla, Watchdog, Grim, Vulcan, Matrix, Intave, Rewind, Polar, Aac, NCP, Spigot, Paper" },
            { cat: "Obfuscation", items: "obfuscate, deobfuscate, remap, unmap, mapping, srg, notch, mojang, yarn, intermediary" },
            { cat: "Mod Loader / Forge", items: "FMLCommonHandler, FMLPreInitializationEvent, FMLPostInitializationEvent, ForgeModLoader, net.minecraftforge, MixinBootstrap, org.spongepowered.asm.mixin, @Mixin, @Inject, @Overwrite, @Shadow" },
            { cat: "Java Runtime", items: "ClassLoader, defineClass, loadClass, forName, getRuntime, ProcessBuilder, Runtime.exec, Process, Reflection, setAccessible, getDeclaredField, getDeclaredMethod" },
            { cat: "File System", items: "File.delete, File.deleteOnExit, Runtime.exec(rm), Runtime.exec(del), Files.delete, Files.deleteIfExists, NIO, Path.delete" },
            { cat: "Network Connections", items: "ServerSocket, Socket, connect, bind, InetSocketAddress, Channel, Selector, DatagramSocket, loopback, 127.0.0.1, localhost, ws://, wss://" },
            { cat: "Memory / Process", items: "VirtualAlloc, VirtualProtect, WriteProcessMemory, ReadProcessMemory, OpenProcess, CreateRemoteThread, NtMapViewOfSection, Inject, DLL, LoadLibrary, GetProcAddress" },
            { cat: "VPN / Tunnel", items: "Hamachi, ZeroTier, Tailscale, Radmin, ngrok, Cloudflare, WARP, WireGuard, OpenVPN, NordVPN, ExpressVPN, ProtonVPN, Mullvad" },
            { cat: "Hidden / Stealth Software", items: "HiddenMouse, HID, USB Rubber Ducky, Teensy, Arduino, BadUSB, Keylogger, KeySpy, ActivityMonitor, Spyrix, Refog, Agent, HiddenWindow, WindowHider" },
          ].map((cat, i) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <h4 className="text-cyan-400 font-semibold text-sm mb-2">{cat.cat}</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{cat.items}</p>
            </div>
          ))}
        </div>
      </PartSection>

      {/* PART 7 */}
      <PartSection id="p7" num={7} title="Immediate Ban Flags" color="red">
        <div className="space-y-3 mb-8">
          {[
            { flag: "A", desc: "Recycle Bin emptied at the time of summons", cat: "Evidence destruction" },
            { flag: "B", desc: "Prefetch disabled or files locked", cat: "System tampering" },
            { flag: "C", desc: "Executable renamed with falsified metadata", cat: "Cheat disguise" },
            { flag: "D", desc: "USB device disconnected at the time of summons", cat: "Peripheral removal" },
            { flag: "E", desc: "Jar hash mismatched against the official version", cat: "Modified jar" },
            { flag: "F", desc: "System registry altered", cat: "Policy manipulation" },
            { flag: "G", desc: "Mod jar containing illicit or obfuscated classes", cat: "Unauthorized mod" },
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
          <h3 className="text-lg font-semibold mb-3">Summary Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2 text-gray-300">Flag</th>
                  <th className="text-left p-2 text-gray-300">Anomaly</th>
                  <th className="text-left p-2 text-gray-300">Ban</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                <tr className="border-b border-gray-800"><td className="p-2"><FlagBadge f="A" /></td><td>Recycle Bin emptied</td><td>Yes</td></tr>
                <tr className="border-b border-gray-800"><td className="p-2"><FlagBadge f="B" /></td><td>Prefetch altered</td><td>Yes</td></tr>
                <tr className="border-b border-gray-800"><td className="p-2"><FlagBadge f="C" /></td><td>Executable renamed</td><td>Yes</td></tr>
                <tr className="border-b border-gray-800"><td className="p-2"><FlagBadge f="D" /></td><td>USB removed</td><td>Yes</td></tr>
                <tr className="border-b border-gray-800"><td className="p-2"><FlagBadge f="E" /></td><td>Jar hash mismatch</td><td>Yes</td></tr>
                <tr className="border-b border-gray-800"><td className="p-2"><FlagBadge f="F" /></td><td>Registry altered</td><td>Yes</td></tr>
                <tr><td className="p-2"><FlagBadge f="G" /></td><td>Unauthorized mod</td><td>Yes</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </PartSection>

      {/* PART 8 */}
      <PartSection id="p8" num={8} title="Borderline Cases and False Positives" color="yellow">
        <div className="space-y-6">
          <div className="bg-gray-900/50 border border-yellow-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">When NOT to Ban</h3>
            <div className="space-y-3">
              {[
                { sit: "Generic strings in RAM (speed, fly) without client-specific context", mot: "These also appear in browsers, overlays, and legitimate software. Context-specific strings are required." },
                { sit: "High CPS without evidence of an autoclicker", mot: "Butterfly/drag clicking is legitimate. CPS alone is not sufficient evidence — JNativeHook traces or specific strings are required." },
                { sit: "Jar hash mismatch for Forge or OptiFine", mot: "These legitimately vary by build. Compare ONLY against the identical version (e.g. 1.8.9-Forge-11.15.1.2318)." },
                { sit: "Unknown files in %TEMP%", mot: "Updaters, drivers, and antivirus software generate temporary files routinely. The date MUST line up with the freeze." },
                { sit: "IAS mod with multiple accounts present", mot: "Having multiple accounts is not a violation. The violation is a match with a BANNED account." },
              ].map((item, i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-white text-sm font-medium mb-1">{item.sit}</p>
                  <p className="text-gray-400 text-sm">{item.mot}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900/50 border border-yellow-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-yellow-400">Procedure in Case of Doubt</h3>
            <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
              <li>Do NOT issue a ban on your own. Contact a senior inspector with screenshots of the anomalies.</li>
              <li>Document the machine&apos;s state with detailed screenshots and save them.</li>
              <li>The player can be placed &quot;Under observation&quot; for a period defined by the team.</li>
              <li>If evidence was destroyed but there&apos;s no direct proof of a cheat, consider &quot;Screen Share Refusal&quot; — a ban for refusing or obstructing the screen share.</li>
            </ol>
          </div>
        </div>
      </PartSection>

      {/* PART 9 */}
      <PartSection id="p9" num={9} title="Closure and Machine Cleanup">
        <p className="text-gray-400 text-sm mb-6">
          At the end of the inspection — whether the player is cleared or sanctioned — the inspector MUST completely remove all downloaded tools.
        </p>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3 text-cyan-400">Full Cleanup Command</h3>
          <CmdBox>{`powershell -Command "Remove-Item -Path '$env:USERPROFILE\\Desktop\\LastActivityView', '$env:USERPROFILE\\Desktop\\WinPrefetchView', '$env:USERPROFILE\\Desktop\\RecentFilesView', '$env:USERPROFILE\\Desktop\\USBDeview', '$env:USERPROFILE\\Desktop\\ExecutedProgramsList', '$env:USERPROFILE\\Desktop\\Luyten.exe' -Recurse -Force -ErrorAction SilentlyContinue"`}</CmdBox>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3 text-cyan-400">Manual Post-Cleanup Verification</h3>
          <div className="space-y-2">
            <CheckItem>Desktop restored to its original state.</CheckItem>
            <CheckItem>No tool processes still running in Task Manager.</CheckItem>
            <CheckItem>AnyDesk session closed ONLY after this verification.</CheckItem>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3 text-cyan-400">Mandatory Final Documentation</h3>
          <p className="text-gray-400 text-sm mb-3">To document and archive:</p>
          <div className="space-y-2">
            <CheckItem>Nickname of the inspected player</CheckItem>
            <CheckItem>Outcome: Cleared / Banned / Under observation</CheckItem>
            <CheckItem>Ban rationale with referenced Flag(s) (e.g. Flag B + Flag D)</CheckItem>
            <CheckItem>Screenshots of the collected evidence</CheckItem>
            <CheckItem>Session start and end time</CheckItem>
          </div>
        </div>
      </PartSection>

      {/* Footer */}
      <div className="border-t border-gray-800 pt-8 mt-12 text-center">
        <p className="text-gray-500 text-sm">CharlieRP Screen Share Documentation — v3.1.0 — LeoGalli</p>
      </div>
    </div>
  );
}
