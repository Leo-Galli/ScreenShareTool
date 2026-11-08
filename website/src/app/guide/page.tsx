import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Operational Guide",
  description:
    "Complete operational manual for Minecraft screen shares: tool deploy, checklist, multi-accounting, ghosts, autoclickers, ban flags, sstool workflow, USN deep-dive, evidence packaging, and string builder usage.",
};

function FlagBadge({ f }: { f: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-mono"
      style={{
        color: "var(--danger)",
        border: "1px solid rgba(255,92,92,0.45)",
        backgroundColor: "rgba(255,92,92,0.1)",
      }}
    >
      Flag {f}
    </span>
  )
}

function CmdBox({ children }: { children: ReactNode }) {
  return <pre className="cmd-box">{children}</pre>
}

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
  const accentColor = color === "red" ? "var(--danger)" : "var(--amber)";
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <h2
        className="font-display text-2xl font-bold mb-6 flex items-center gap-3"
        style={{ color: "#fff" }}
      >
        <span
          className="w-0.5 h-7 shrink-0"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />
        Part {num} — {title}
      </h2>
      {children}
    </section>
  );
}

function CheckItem({ children }: { children: ReactNode }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--chalk)" }}>
      <input
        type="checkbox"
        className="w-4 h-4"
        style={{ accentColor: "var(--amber)" }}
      />
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
  { href: "#p10", t: "Part 10 — ScreenShareTool (sstool) Workflow" },
  { href: "#p11", t: "Part 11 — NTFS USN Deep Dive" },
  { href: "#p12", t: "Part 12 — Evidence Packaging & Chain of Custody" },
  { href: "#p13", t: "Part 13 — Custom String Lists (.txt Builder)" },
];

export default function Guide() {
  return (
    <div className="page-shell py-16 sm:py-20">
      <div className="mb-14 max-w-3xl border-b border-[var(--rule)] pb-10">
        <p className="section-label">Manual</p>
        <h1
          className="font-display font-semibold tracking-tight text-white"
          style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)", letterSpacing: "-0.045em", lineHeight: 1.05 }}
        >
          Operational Manual
        </h1>
        <p className="mt-5 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          Complete procedure for a professional Minecraft screen share — roles, deploy, checklist,
          multi-accounting, ghosts, autoclickers, ban flags, sstool workflow, USN deep-dive, evidence
          packaging, and custom string exports.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {["v4.0.1", "sstool", "14 parts", "Windows", "macOS", "Linux"].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium"
              style={{ color: "var(--muted)", border: "1px solid var(--rule)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <nav className="guide-panel mb-14" aria-label="Guide table of contents">
        <h2 className="font-display mb-4 text-sm font-semibold" style={{ color: "var(--accent)" }}>
          Contents
        </h2>
        <div className="grid md:grid-cols-2 gap-1 text-sm">
          {toc.map((l, i) => (
            <a
              key={i}
              href={l.href}
              className="toc-link py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amber)] rounded"
            >
              {l.t}
            </a>
          ))}
        </div>
      </nav>

      {/* PART 0 */}
      <PartSection id="p0" num={0} title="Roles, Requirements, and Code of Conduct">
        <div className="guide-panel mb-6">
          <h3 className="text-lg font-semibold mb-4 guide-h">Minimum Requirements</h3>
          <ol className="text-white/80 text-sm space-y-2 list-decimal list-inside">
            <li>Active and verified inspector rank.</li>
            <li>Practical knowledge of every tool listed in Part 1.</li>
            <li>A local database of SHA-256 hashes for clean Minecraft versions (1.8.9 Vanilla, 1.8.9 Forge, 1.12.2 Vanilla — required for Flag E).</li>
            <li>A stable connection. Do NOT start a screen share with ping above 150ms.</li>
          </ol>
        </div>

        <div className="guide-panel">
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">Code of Conduct</h3>
          <ol className="text-white/80 text-sm space-y-2 list-decimal list-inside">
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
        <p className="text-[var(--muted)] text-sm mb-6">
          All tools are downloaded and run from the command line on the player&apos;s PC, through the active AnyDesk session.
        </p>

        {/* 1.1 Everything */}
        <div className="guide-panel mb-6">
          <h3 className="text-lg font-semibold mb-2 guide-h">1.1 Everything (VoidTools) — MFT Indexer</h3>
          <p className="text-[var(--muted)] text-sm mb-3">Enables instant searches across the entire filesystem without waiting for Windows indexing.</p>
          <CmdBox>winget install voidtools.Everything --silent</CmdBox>
        </div>

        {/* 1.2 System Informer */}
        <div className="guide-panel mb-6">
          <h3 className="text-lg font-semibold mb-2 guide-h">1.2 System Informer — RAM and Process Analyzer</h3>
          <p className="text-[var(--muted)] text-sm mb-3">A modern replacement for Process Hacker. Supports memory dumps, inspection of loaded DLLs, and full RAM string scanning.</p>
          <CmdBox>winget install SystemInformer.SystemInformer --silent</CmdBox>
        </div>

        {/* 1.3 Luyten */}
        <div className="guide-panel mb-6">
          <h3 className="text-lg font-semibold mb-2 guide-h">1.3 Luyten — Java Decompiler (.jar)</h3>
          <p className="text-[var(--muted)] text-sm mb-3">Opens and inspects the bytecode of any .jar file.</p>
          <CmdBox>{`powershell -Command "Invoke-WebRequest -Uri 'https://github.com/deathmarine/Luyten/releases/download/v0.5.4_Rebuilt_with_Latest_Depenencies/luyten-0.5.4.exe' -OutFile '$env:USERPROFILE\\Desktop\\Luyten.exe'"`}</CmdBox>
        </div>

        {/* 1.4 Suite NirSoft */}
        <div className="guide-panel mb-6">
          <h3 className="text-lg font-semibold mb-2 guide-h">1.4 NirSoft Suite — 5 Forensic Tools</h3>
          <p className="text-[var(--muted)] text-sm mb-3">Each command downloads the zip, extracts it to the Desktop, and removes the archive.</p>
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            {[
              { name: "LastActivityView", desc: "Recent operating system activity" },
              { name: "WinPrefetchView", desc: "Windows Prefetch file analysis" },
              { name: "ExecutedProgramsList", desc: "Complete history of executed programs" },
              { name: "RecentFilesView", desc: "Recently opened or modified files" },
              { name: "USBDeview", desc: "History of connected USB devices" },
            ].map((t, i) => (
              <div key={i} className="guide-inset">
                <span className="guide-h font-medium text-sm">{t.name}</span>
                <span className="text-[var(--muted)] text-sm ml-2">— {t.desc}</span>
              </div>
            ))}
          </div>
          <CmdBox>{`powershell -Command "Invoke-WebRequest -Uri 'https://www.nirsoft.net/utils/lastactivityview.zip' -OutFile '$env:USERPROFILE\\Desktop\\lastactivityview.zip'; Expand-Archive -Path '$env:USERPROFILE\\Desktop\\lastactivityview.zip' -DestinationPath '$env:USERPROFILE\\Desktop\\LastActivityView' -Force; Remove-Item '$env:USERPROFILE\\Desktop\\lastactivityview.zip'"`}</CmdBox>
          <p className="text-[var(--muted)] text-xs mt-2">Repeat the same pattern, substituting lastactivityview with winprefetchview, executedprogramslist, recentfilesview, or usbdeview.</p>
        </div>
      </PartSection>

      {/* PART 2 */}
      <PartSection id="p2" num={2} title="Pre-Analysis Checklist">
        <p className="text-[var(--muted)] text-sm mb-6">
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
            <div key={i} className="guide-panel flex flex-col md:flex-row md:items-center gap-3">
              <div className="md:w-64 shrink-0">
                <CheckItem>
                  <span className="font-medium text-white">{item.ctrl}</span>
                </CheckItem>
              </div>
              <p className="text-[var(--muted)] text-sm flex-1">{item.proc}</p>
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
                  <span className="text-[var(--muted)] text-xs">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </PartSection>

      {/* PART 3 */}
      <PartSection id="p3" num={3} title="Multi-Accounting and Ban Evasion">
        <p className="text-[var(--muted)] text-sm mb-6">
          Suspicion: the player holds undeclared alternate accounts, or connected to the network to evade an active ban.
        </p>

        <div className="space-y-6">
          <div className="guide-panel">
            <h3 className="text-lg font-semibold mb-3 guide-h">3.1 Historical Game Logs (.log and .log.gz)</h3>
            <p className="text-[var(--muted)] text-sm mb-3">Official and custom clients log every account switch and login session.</p>
            <div className="text-white/80 text-sm mb-3 space-y-1">
              <p>Vanilla/Forge: %appdata%\.minecraft\logs\</p>
              <p>Lunar Client: C:\Users\%USERNAME%\.lunarclient\offline\logs\</p>
              <p>Badlion Client: C:\Users\%USERNAME%\AppData\Roaming\.minecraft\logs\blclient\</p>
            </div>
            <p className="text-[var(--muted)] text-sm mb-2">Procedure: in Everything, search for latest.log, open it with Notepad++, and search with Ctrl+F for:</p>
            <CmdBox>{`LwjglWindow: Title: Minecraft
Logging in as
Connecting to
[Client thread/INFO]: Setting user:
[Client thread/INFO]: (Session ID is`}</CmdBox>
            <p className="text-[var(--muted)] text-sm mt-3">Record every nickname found. Cross-reference it against the ban database. A match with a banned account = BAN FOR SANCTION EVASION.</p>
          </div>

          <div className="guide-panel">
            <h3 className="text-lg font-semibold mb-3 guide-h">3.2 Launcher Configuration Files (.json)</h3>
            <p className="text-[var(--muted)] text-sm mb-3">Launchers store account history, tokens, and profiles locally.</p>
            <div className="text-white/80 text-sm space-y-1 mb-3">
              <p>Vanilla/Forge: %appdata%\.minecraft\launcher_profiles.json, launcher_accounts.json</p>
              <p>TLauncher: %appdata%\.minecraft\TlauncherProfiles.json</p>
            </div>
            <p className="text-[var(--muted)] text-sm">Search for: &quot;displayName&quot; &quot;username&quot; &quot;localId&quot; &quot;name&quot;. Every name found is an account associated with this machine.</p>
          </div>

          <div className="guide-panel">
            <h3 className="text-lg font-semibold mb-3 guide-h">3.3 IAS Mod — In-Game Account Switcher</h3>
            <p className="text-[var(--muted)] text-sm mb-3">This mod allows switching accounts without restarting the game. Its configuration file contains the full list of stored accounts.</p>
            <p className="text-[var(--muted)] text-sm">In Everything, search for ias.json or ias-accounts.json. The file contains: nickname, UUID, and authentication type (Mojang / Microsoft / Cracked).</p>
          </div>

          <div className="guide-panel">
            <h3 className="text-lg font-semibold mb-3 guide-h">3.4 Discord and Telegram Cache</h3>
            <p className="text-[var(--muted)] text-sm mb-3">Messaging apps can contain traces of account trading, shared credentials, or purchases of alt Minecraft accounts.</p>
            <p className="text-[var(--muted)] text-sm">Discord path: %appdata%\Discord\Cache\Cache_Data\. Search for: alts, account, mojang, mail:pass, token.</p>
          </div>
        </div>
      </PartSection>

      {/* PART 4 */}
      <PartSection id="p4" num={4} title="Ghost Clients">
        <p className="text-[var(--muted)] text-sm mb-6">
          Suspicion: anomalous movement, constant critical hits, unnatural aim trajectories, or the ability to see through blocks (X-Ray, ESP). A Ghost Client is a cheat built directly into the Minecraft client.
        </p>

        <div className="space-y-6">
          <div className="guide-panel">
            <h3 className="text-lg font-semibold mb-3 guide-h">4.1 Inspecting the Version .json File</h3>
            <p className="text-[var(--muted)] text-sm mb-3">Ghost Clients replace Minecraft&apos;s launch classes by modifying the installed version&apos;s .json file.</p>
            <p className="text-[var(--muted)] text-sm mb-3">Path: %appdata%\.minecraft\versions\[version]\[version].json</p>
            <p className="text-[var(--muted)] text-sm mb-2">Find the &quot;mainClass&quot; line and compare it against:</p>
            <div className="guide-inset text-sm">
              <div className="mb-3">
                <p className="text-green-400 font-medium mb-1">Legitimate values:</p>
                <p className="text-white/80">Vanilla: net.minecraft.client.main.Main</p>
                <p className="text-white/80">Forge: net.minecraft.launchwrapper.Launch</p>
              </div>
              <div>
                <p className="text-red-400 font-medium mb-1">Suspicious values:</p>
                <p className="text-white/80">net.knet.Client, net.wurst.Client, fdp.client.Main, liquidbounce.Launch</p>
                <p className="text-[var(--muted)] text-xs">any path that doesn&apos;t trace back to Mojang or MinecraftForge</p>
              </div>
            </div>
          </div>

          <div className="guide-panel">
            <h3 className="text-lg font-semibold mb-3 guide-h">4.2 RAM Dump — Modules Removed While Running (Unload)</h3>
            <p className="text-[var(--muted)] text-sm mb-3">Some cheats delete themselves from disk while the game is running (unload), but remain mapped in RAM until the process is closed.</p>
            <ol className="text-white/80 text-sm space-y-2 list-decimal list-inside">
              <li>Launch System Informer as Administrator.</li>
              <li>Find the javaw.exe process, right-click, Properties, Memory tab.</li>
              <li>Disable &quot;Hide free regions&quot;, set minimum size to 4, and enable the Image and Mapped filters.</li>
              <li>In the Filter field — Contains (case insensitive): .minecraft\mods</li>
              <li>If a .jar appears in the list (e.g. LiquidBounce.jar) that is NOT physically present in the mods folder on disk: BAN FOR UNLOAD CHEAT / EVIDENCE DESTRUCTION.</li>
            </ol>
          </div>

          <div className="guide-panel">
            <h3 className="text-lg font-semibold mb-3 guide-h">4.3 Ghost Client Forensic Strings in RAM</h3>
            <p className="text-[var(--muted)] text-sm mb-3">In the Memory tab of javaw.exe, open &quot;Strings&quot; (minimum length: 4).</p>
            <div className="guide-inset text-sm">
              <p className="guide-h font-medium mb-2">LiquidBounce</p>
              <p className="text-white/80 mb-3">liquidbounce / net.ccbluex.liquidbounce / ccbluex</p>
              <p className="guide-h font-medium mb-2">Wurst</p>
              <p className="text-white/80 mb-3">wurstclient / net.wurstclient</p>
              <p className="guide-h font-medium mb-2">Sigma</p>
              <p className="text-white/80 mb-3">sigma.modules / net.sigmaclient</p>
              <p className="guide-h font-medium mb-2">FDPClient</p>
              <p className="text-white/80 mb-3">fdpclient / fdp.client.Main</p>
              <p className="guide-h font-medium mb-2">Vape V4</p>
              <p className="text-white/80 mb-3">net.vape.client / vape.v4 / vape.render</p>
              <p className="guide-h font-medium mb-2">Generic</p>
              <p className="text-white/80">aura.class / speed.class / fly.class / noslowdown / nfall / nofall / reach.class</p>
            </div>
          </div>
        </div>
      </PartSection>

      {/* PART 5 */}
      <PartSection id="p5" num={5} title="External Clients and Autoclickers">
        <p className="text-[var(--muted)] text-sm mb-6">
          Suspicion: abnormal CPS (a fixed or unnaturally constant 16-20+ CPS), or a complete absence of knockback slowdown (NoVelocity).
        </p>

        <div className="space-y-6">
          <div className="guide-panel">
            <h3 className="text-lg font-semibold mb-3 guide-h">5.1 Detecting JNativeHook (Java Autoclickers)</h3>
            <p className="text-[var(--muted)] text-sm mb-3">The JNativeHook library is used by Java autoclickers to intercept mouse clicks outside the game window.</p>
            <ol className="text-white/80 text-sm space-y-2 list-decimal list-inside">
              <li>In System Informer, open the explorer.exe process — Properties — Memory.</li>
              <li>Filter for: JNativeHook</li>
              <li>If you find a DLL like JNativeHook-[string].dll mapped in memory, search Everything for JNativeHook.</li>
              <li>If the file is in %temp% but already deleted, and the DLL is still in RAM: IMMEDIATE BAN FOR ACTIVE AUTOCLICKER.</li>
            </ol>
          </div>

          <div className="guide-panel">
            <h3 className="text-lg font-semibold mb-3 guide-h">5.2 Autoclicker Forensic Strings in RAM</h3>
            <div className="guide-inset text-sm">
              <p className="guide-h font-medium mb-1">Koid</p>
              <p className="text-white/80 mb-3">koid / koid.gg / koidclicker / Clicker.java</p>
              <p className="guide-h font-medium mb-1">Dream Client</p>
              <p className="text-white/80 mb-3">dreamclient / dream.clicker / dream.gg / dream.club</p>
              <p className="guide-h font-medium mb-1">Drip Client</p>
              <p className="text-white/80 mb-3">drip.client / drip.gg / drip_autoclicker</p>
              <p className="guide-h font-medium mb-1">Whiteout</p>
              <p className="text-white/80 mb-3">whiteout.gg / whiteout_client / wo_clicker</p>
              <p className="guide-h font-medium mb-1">Itami</p>
              <p className="text-white/80 mb-3">itami.exe / itami_clicker / itami.club</p>
              <p className="guide-h font-medium mb-1">7Clicker / Mango</p>
              <p className="text-white/80 mb-3">7clicker / mangoclicker / left_click_jitter / right_click_jitter</p>
              <p className="guide-h font-medium mb-1">Murmur / Phantom</p>
              <p className="text-white/80">murmurclicker / phantom.gg / phantom_clicker</p>
            </div>
          </div>

          <div className="guide-panel">
            <h3 className="text-lg font-semibold mb-3 guide-h">5.3 Prefetch Analysis: conhost.exe and javaw.exe</h3>
            <p className="text-[var(--muted)] text-sm mb-3">Script-based autoclickers spawn hidden instances of the Windows console (conhost.exe), which leave traces in Prefetch.</p>
            <ol className="text-white/80 text-sm space-y-2 list-decimal list-inside">
              <li>Open WinPrefetchView as Administrator.</li>
              <li>Search for Conhost.exe.pf and check its referenced files. The presence of .bat, .cmd, or files in %temp%: HIGH SUSPICION.</li>
              <li>Search for Javaw.exe.pf and check whether its loaded files include unrelated executables or foreign DLLs.</li>
            </ol>
          </div>
        </div>
      </PartSection>

      {/* PART 6 */}
      <PartSection id="p6" num={6} title="Forensic String Dictionary">
        <p className="text-[var(--muted)] text-sm mb-4">
          Use this in the &quot;Strings&quot; tab of System Informer, filtering on javaw.exe, explorer.exe, csrss.exe, or any suspicious executable.
          The live dictionary on this site holds 2500+ entries — browse{" "}
          <a href="/strings" className="text-[var(--accent-2)] underline-offset-2 hover:underline">/strings</a>
          {" "}or build a custom list at{" "}
          <a href="/builder" className="text-[var(--accent-2)] underline-offset-2 hover:underline">/builder</a>.
        </p>
        <div className="guide-panel mb-6">
          <h3 className="text-lg font-semibold mb-3 guide-h">How to load strings in System Informer</h3>
          <ol className="text-white/80 text-sm space-y-2 list-decimal list-inside">
            <li>Open System Informer as Administrator → find javaw.exe → Properties → Memory → Strings.</li>
            <li>Disable &quot;Hide free regions&quot; when hunting unloaded modules.</li>
            <li>Paste a category from your exported .txt into the filter, or search one keyword at a time.</li>
            <li>Always corroborate a RAM hit with disk/USN/Prefetch — a string alone is not a ban.</li>
          </ol>
        </div>

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
            <div key={i} className="guide-panel">
              <h4 className="guide-h font-semibold text-sm mb-2">{cat.cat}</h4>
              <p className="text-white/80 text-sm leading-relaxed">{cat.items}</p>
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
            <div key={i} className="guide-panel flex items-center gap-4">
              <FlagBadge f={item.flag} />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{item.desc}</p>
                <p className="text-[var(--muted)] text-xs">{item.cat}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="guide-panel">
          <h3 className="text-lg font-semibold mb-3">Summary Table</h3>
          <div className="table-wrap">
            <table className="w-full min-w-[28rem] text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2 text-white/80">Flag</th>
                  <th className="text-left p-2 text-white/80">Anomaly</th>
                  <th className="text-left p-2 text-white/80">Ban</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
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
          <div className="guide-panel">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">When NOT to Ban</h3>
            <div className="space-y-3">
              {[
                { sit: "Generic strings in RAM (speed, fly) without client-specific context", mot: "These also appear in browsers, overlays, and legitimate software. Context-specific strings are required." },
                { sit: "High CPS without evidence of an autoclicker", mot: "Butterfly/drag clicking is legitimate. CPS alone is not sufficient evidence — JNativeHook traces or specific strings are required." },
                { sit: "Jar hash mismatch for Forge or OptiFine", mot: "These legitimately vary by build. Compare ONLY against the identical version (e.g. 1.8.9-Forge-11.15.1.2318)." },
                { sit: "Unknown files in %TEMP%", mot: "Updaters, drivers, and antivirus software generate temporary files routinely. The date MUST line up with the freeze." },
                { sit: "IAS mod with multiple accounts present", mot: "Having multiple accounts is not a violation. The violation is a match with a BANNED account." },
              ].map((item, i) => (
                <div key={i} className="guide-inset">
                  <p className="text-white text-sm font-medium mb-1">{item.sit}</p>
                  <p className="text-[var(--muted)] text-sm">{item.mot}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="guide-panel">
            <h3 className="text-lg font-semibold mb-3 text-yellow-400">Procedure in Case of Doubt</h3>
            <ol className="text-white/80 text-sm space-y-2 list-decimal list-inside">
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
        <p className="text-[var(--muted)] text-sm mb-6">
          At the end of the inspection — whether the player is cleared or sanctioned — the inspector MUST completely remove all downloaded tools.
        </p>

        <div className="guide-panel mb-6">
          <h3 className="text-lg font-semibold mb-3 guide-h">Full Cleanup Command</h3>
          <CmdBox>{`powershell -Command "Remove-Item -Path '$env:USERPROFILE\\Desktop\\LastActivityView', '$env:USERPROFILE\\Desktop\\WinPrefetchView', '$env:USERPROFILE\\Desktop\\RecentFilesView', '$env:USERPROFILE\\Desktop\\USBDeview', '$env:USERPROFILE\\Desktop\\ExecutedProgramsList', '$env:USERPROFILE\\Desktop\\Luyten.exe' -Recurse -Force -ErrorAction SilentlyContinue"`}</CmdBox>
        </div>

        <div className="guide-panel mb-6">
          <h3 className="text-lg font-semibold mb-3 guide-h">Manual Post-Cleanup Verification</h3>
          <div className="space-y-2">
            <CheckItem>Desktop restored to its original state.</CheckItem>
            <CheckItem>No tool processes still running in Task Manager.</CheckItem>
            <CheckItem>AnyDesk session closed ONLY after this verification.</CheckItem>
          </div>
        </div>

        <div className="guide-panel">
          <h3 className="text-lg font-semibold mb-3 guide-h">Mandatory Final Documentation</h3>
          <p className="text-[var(--muted)] text-sm mb-3">To document and archive:</p>
          <div className="space-y-2">
            <CheckItem>Nickname of the inspected player</CheckItem>
            <CheckItem>Outcome: Cleared / Banned / Under observation</CheckItem>
            <CheckItem>Ban rationale with referenced Flag(s) (e.g. Flag B + Flag D)</CheckItem>
            <CheckItem>Screenshots of the collected evidence</CheckItem>
            <CheckItem>Session start and end time</CheckItem>
            <CheckItem>Path to ScreenShareTool dashboard.html if a scan was run</CheckItem>
          </div>
        </div>
      </PartSection>

      <PartSection id="p10" num={10} title="ScreenShareTool (sstool) Workflow">
        <p className="text-[var(--muted)] text-sm mb-6">
          ScreenShareTool automates collection. It does not replace Parts 0–9 — it accelerates them and produces an HTML dashboard you can archive.
        </p>
        <div className="guide-panel mb-6">
          <h3 className="text-lg font-semibold mb-3 guide-h">10.1 Install & launch</h3>
          <CmdBox>{`winget install LeoGalli.CharlieRPScreenShareTool
sstool`}</CmdBox>
          <p className="text-[var(--muted)] text-sm mt-3">
            Or download the ZIP from Releases. Display name: ScreenShareTool. Command: <code className="text-white">sstool</code>.
            On Windows, run elevated for BAM / Prefetch / Event Log coverage.
          </p>
        </div>
        <div className="guide-panel mb-6">
          <h3 className="text-lg font-semibold mb-3 guide-h">10.2 Day window selection</h3>
          <ul className="text-white/80 text-sm space-y-2 list-disc list-inside">
            <li><strong>1 day</strong> — freeze-to-share window; use when the summons is immediate.</li>
            <li><strong>7 days</strong> — default for most shares; balances noise vs coverage.</li>
            <li><strong>30 / 90 days</strong> — multi-accounting history, old self-delete traces, USB history.</li>
            <li><strong>--quick</strong> — skips slow journal/deep walks when time is short; re-run full if hits appear.</li>
          </ul>
        </div>
        <div className="guide-panel mb-6">
          <h3 className="text-lg font-semibold mb-3 guide-h">10.3 Modules you should expect</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-white/80">
            {[
              "NTFS USN journal",
              "BAM last executions",
              "Prefetch",
              "Registry (UserAssist, RunMRU, ShellBags)",
              "Minecraft launchers + IAS",
              "Cheat self-destruction patterns",
              "Macro / peripheral software",
              "Event Log highlights",
              "Network snapshot",
              "HTML dashboard export",
            ].map((m) => (
              <div key={m} className="guide-inset">{m}</div>
            ))}
          </div>
        </div>
        <div className="guide-panel">
          <h3 className="text-lg font-semibold mb-3 guide-h">10.4 Reading the dashboard</h3>
          <ol className="text-white/80 text-sm space-y-2 list-decimal list-inside">
            <li>Check KPI tiles first (accounts, IAS switches, cheat alerts, nick count).</li>
            <li>Open every module marked error/skipped — know why coverage is incomplete.</li>
            <li>Treat cheat alerts as leads: verify with Luyten / System Informer / Prefetch before Flag G.</li>
            <li>Archive <code className="text-[var(--accent-2)]">dashboard.html</code> + screenshots with the case notes (Part 12).</li>
          </ol>
        </div>
      </PartSection>

      <PartSection id="p11" num={11} title="NTFS USN Deep Dive">
        <p className="text-[var(--muted)] text-sm mb-6">
          The USN journal is the strongest disk timeline on Windows. Players who delete cheats mid-share still leave create/delete/rename reasons.
        </p>
        <div className="guide-panel mb-6">
          <h3 className="text-lg font-semibold mb-3 guide-h">11.1 Capture</h3>
          <CmdBox>{`fsutil usn readjournal C: csv > %USERPROFILE%\\Desktop\\usn.csv`}</CmdBox>
          <p className="text-[var(--muted)] text-sm mt-3">
            Prefer capturing to Desktop early (Part 2) before the player can clear more artifacts. Admin CMD required.
          </p>
        </div>
        <div className="guide-panel mb-6">
          <h3 className="text-lg font-semibold mb-3 guide-h">11.2 Reason codes that matter</h3>
          <div className="table-wrap text-sm">
            <table className="w-full min-w-[32rem]">
              <thead>
                <tr className="border-b border-[var(--rule)] text-left text-white/80">
                  <th className="p-2">Code</th>
                  <th className="p-2">Meaning</th>
                  <th className="p-2">SS relevance</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                <tr className="border-b border-[var(--rule)]"><td className="p-2 font-mono">0x00000100</td><td className="p-2">FILE_CREATE</td><td className="p-2">New jar/exe appeared</td></tr>
                <tr className="border-b border-[var(--rule)]"><td className="p-2 font-mono">0x00000200</td><td className="p-2">FILE_DELETE</td><td className="p-2">Self-delete / wipe</td></tr>
                <tr className="border-b border-[var(--rule)]"><td className="p-2 font-mono">0x00001000</td><td className="p-2">RENAME_OLD_NAME</td><td className="p-2">Rename-away disguise</td></tr>
                <tr className="border-b border-[var(--rule)]"><td className="p-2 font-mono">0x00002000</td><td className="p-2">RENAME_NEW_NAME</td><td className="p-2">Pair with old name</td></tr>
                <tr><td className="p-2 font-mono">0x80000200</td><td className="p-2">CLOSE + DELETE</td><td className="p-2">Common cheat wipe pattern</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="guide-panel">
          <h3 className="text-lg font-semibold mb-3 guide-h">11.3 High-value findstr filters</h3>
          <CmdBox>{`findstr /i /C:".jar" /C:"jnativehook" /C:"liquidbounce" /C:"wurst" usn.csv
findstr /i /C:"0x00000200" /C:"0x80000200" usn.csv | findstr /i ".jar .exe .dll"`}</CmdBox>
          <p className="text-[var(--muted)] text-sm mt-3">
            Align timestamps with the freeze / summons time. Deletes clustered in the minute after freeze are Flag-adjacent leads.
          </p>
        </div>
      </PartSection>

      <PartSection id="p12" num={12} title="Evidence Packaging & Chain of Custody">
        <p className="text-[var(--muted)] text-sm mb-6">
          A ban without a recoverable evidence pack is a liability. Package before you wipe tools (Part 9).
        </p>
        <div className="guide-panel mb-6">
          <h3 className="text-lg font-semibold mb-3 guide-h">12.1 Minimum evidence pack</h3>
          <div className="space-y-2">
            <CheckItem>Screenshots: Desktop, Task Manager, mods folder, System Informer hits</CheckItem>
            <CheckItem>ScreenShareTool output folder / dashboard.html</CheckItem>
            <CheckItem>usn.csv (or journal excerpt) if USN was used</CheckItem>
            <CheckItem>Exported string list used during the share (from /builder)</CheckItem>
            <CheckItem>Case note: nick, time window, flags, outcome, inspector id</CheckItem>
          </div>
        </div>
        <div className="guide-panel mb-6">
          <h3 className="text-lg font-semibold mb-3 guide-h">12.2 Naming convention</h3>
          <CmdBox>{`YYYYMMDD_HHMM_<nick>_<outcome>.zip
# example: 20261108_2215_Steve_BAN_FlagB-D.zip`}</CmdBox>
        </div>
        <div className="guide-panel">
          <h3 className="text-lg font-semibold mb-3 guide-h">12.3 Privacy</h3>
          <p className="text-[var(--muted)] text-sm">
            Redact real Windows usernames, Discord IDs, and unrelated personal files before sharing packs outside the staff channel.
            Never paste full user paths into public tickets.
          </p>
        </div>
      </PartSection>

      <PartSection id="p13" num={13} title="Custom String Lists (.txt Builder)">
        <p className="text-[var(--muted)] text-sm mb-6">
          Different shares need different focus (ghost vs multi-account vs USB). Build a reusable .txt instead of improvising filters under pressure.
        </p>
        <div className="guide-panel mb-6">
          <h3 className="text-lg font-semibold mb-3 guide-h">13.1 Build</h3>
          <ol className="text-white/80 text-sm space-y-2 list-decimal list-inside">
            <li>Open <a href="/builder" className="text-[var(--accent-2)] underline-offset-2 hover:underline">/builder</a>.</li>
            <li>Filter by OS or search (e.g. &quot;IAS&quot;, &quot;Prefetch&quot;, &quot;LiquidBounce&quot;).</li>
            <li>Select whole categories or individual lines.</li>
            <li>Enable category headers + dedupe, then Download .txt.</li>
          </ol>
        </div>
        <div className="guide-panel mb-6">
          <h3 className="text-lg font-semibold mb-3 guide-h">13.2 Suggested presets</h3>
          <ul className="text-white/80 text-sm space-y-2 list-disc list-inside">
            <li><strong>Freeze kit</strong> — Recycle Bin, Prefetch, USBSTOR, Self-Destruct, USN delete codes.</li>
            <li><strong>Ghost kit</strong> — Ghost paths, RAM strings, Cheat clients, Mod loaders, Java runtime.</li>
            <li><strong>Alts kit</strong> — Minecraft paths, IAS, launcher JSON, Discord cache, Browser downloads.</li>
            <li><strong>Macro kit</strong> — Autoclicker, Macro software, JNativeHook, HID / BadUSB.</li>
          </ul>
        </div>
        <div className="guide-panel">
          <h3 className="text-lg font-semibold mb-3 guide-h">13.3 Use during the share</h3>
          <p className="text-[var(--muted)] text-sm">
            Keep the .txt on your (inspector) machine, not the player PC when possible. Copy one line at a time into System Informer filters.
            After the share, attach the exact .txt used to the evidence pack so seniors can reproduce your search.
          </p>
        </div>
      </PartSection>

    </div>
  );
}
