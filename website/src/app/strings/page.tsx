"use client";

import { useState, useMemo } from "react";

const categories = [
  {
    name: "Combat / Aim / Reach",
    color: "red",
    strings: [
      "combat/Reach", "combat/Killaura", "combat/Aimbot", "combat/Triggerbot",
      "combat/Velocity", "combat/AntiKnockback", "Hitbox/Expand", "Reach/Distance",
      "TargetHUD", "KeepSprint", "Criticals", "AutoWeapon",
      "net/minecraft/client/entity/EntityPlayerSP/motionX",
      "net/minecraft/client/entity/EntityPlayerSP/motionZ",
    ],
  },
  {
    name: "Autoclicker Generici",
    color: "orange",
    strings: [
      "AutoClicker", "ClickAssist", "LeftClicker", "RightClicker",
      "JitterClick", "BurstClick", "CPSCounter", "MinCPS", "MaxCPS",
      "RandomizationDelay", "BlockBreakDelay", "InventoryFillClick",
      "RightClickBlatant", "LegitimateClicker",
    ],
  },
  {
    name: "Meccanismi di Autodistruzione",
    color: "red",
    strings: [
      "SelfDestruct", "DestructModule", "CleanTracks", "WipeLogs",
      "DeleteEvidence", "AntiForensic", "UnloadModule", "DisableLoader",
      "StealthMode", "HiddenProcess", "DeleteOnClose", "ExitClean",
      "SecureDelete", "WipeOnExit", "ClearHistory",
    ],
  },
  {
    name: "Movement / Speed / Fly",
    color: "blue",
    strings: [
      "Speed/Boost", "Fly/NoFall", "Sprint/HumanSprint", "Step", "Jesus",
      "BoatFly", "ElytraFly", "Spider", "NoSlow", "FastPlace", "FastBreak",
      "Scaffold", "Tower", "Speed/Bhop", "Timer",
    ],
  },
  {
    name: "Render / ESP / Visuals",
    color: "purple",
    strings: [
      "ESP/PlayerESP", "ESP/ChestESP", "ESP/BlockESP", "ESP/ItemESP",
      "XRay", "Nametags", "Tracers", "StorageESP", "ItemESP", "MobESP",
      "AntiOverlay", "FullBright", "Chams", "ItemPhysics", "Tomograph",
      "NewChunks", "OldChunks",
    ],
  },
  {
    name: "HUD / Overlay / UI",
    color: "cyan",
    strings: [
      "ClickGUI", "ArrayList", "Watermark", "TabGUI", "InvViewer",
      "ArmorHUD", "CrosshairMod", "Coords", "Coordinates", "ServerIP",
      "MemoryDisplay", "FPSDisplay", "CPSDisplay", "Keystrokes",
    ],
  },
  {
    name: "Misc / Utility",
    color: "gray",
    strings: [
      "AutoEat", "ChestStealer", "InventoryManager", "AutoArmor",
      "AutoTool", "AutoPot", "AutoSnowball", "Spammer", "AntiAFK",
      "FakePlayer", "Step", "FastUse", "RightClickRefresh",
      "MiddleClick", "FastBridge",
    ],
  },
  {
    name: "Packet / Network",
    color: "yellow",
    strings: [
      "PacketFly", "PacketElytra", "Velocity", "AntiVelocity", "Bypass",
      "Flag", "Check", "Disabler", "PacketCancel", "SendInterval", "Limbo",
    ],
  },
  {
    name: "Ghost Client Specifici",
    color: "cyan",
    strings: [
      "Do0mClient", "MoonClient", "Tenacity", "Astolfo", "Kami", "Phobos",
      "SalHack", "Seppuku", "Flux", "Snow", "Rise", "Rusher", "Sigma",
      "Vape", "LiquidBounce", "Wurst", "FDP", "RISE", "Future", "Impact",
      "Aristois", "Inertia",
    ],
  },
  {
    name: "Doomsday / Auto-Destruct",
    color: "red",
    strings: [
      "doomsday", "doomsday.client", "doomsday.Main", "doomsday.unload",
      "doomsday.clean", "doomsday.selfdestruct", "doomsday.delete",
      "doomsday.wipe", "doomsday.stealth", "doomsday.hidden",
      "doomsday.remove", "doomsday.forge", "Class.forName",
      "ClassLoader", "defineClass", "loadClass", "getDeclaredMethod",
    ],
  },
  {
    name: "Anti-Cheat Bypass",
    color: "yellow",
    strings: [
      "AntiCheat", "Bypass", "Vanilla", "Watchdog", "Grim", "Vulcan",
      "Matrix", "Intave", "Rewind", "Polar", "Aac", "NCP", "Spigot", "Paper",
    ],
  },
  {
    name: "Obfuscation / Offuscamento",
    color: "gray",
    strings: [
      "obfuscate", "deobfuscate", "remap", "unmap", "mapping", "srg",
      "notch", "mojang", "yarn", "intermediary",
    ],
  },
  {
    name: "Mod Loader / Forge",
    color: "orange",
    strings: [
      "FMLCommonHandler", "FMLPreInitializationEvent", "FMLPostInitializationEvent",
      "ForgeModLoader", "net.minecraftforge", "MixinBootstrap",
      "org.spongepowered.asm.mixin", "@Mixin", "@Inject", "@Overwrite", "@Shadow",
    ],
  },
  {
    name: "Java Runtime",
    color: "red",
    strings: [
      "ClassLoader", "defineClass", "loadClass", "forName", "getRuntime",
      "ProcessBuilder", "Runtime.exec", "Process", "Reflection",
      "setAccessible", "getDeclaredField", "getDeclaredMethod",
    ],
  },
  {
    name: "File System",
    color: "gray",
    strings: [
      "File.delete", "File.deleteOnExit", "Runtime.exec(rm)",
      "Runtime.exec(del)", "Files.delete", "Files.deleteIfExists",
      "NIO", "Path.delete",
    ],
  },
  {
    name: "Network Connections",
    color: "blue",
    strings: [
      "ServerSocket", "Socket", "connect", "bind", "InetSocketAddress",
      "Channel", "Selector", "DatagramSocket", "loopback", "127.0.0.1",
      "localhost", "ws://", "wss://",
    ],
  },
  {
    name: "Memory / Process Injection",
    color: "red",
    strings: [
      "VirtualAlloc", "VirtualProtect", "WriteProcessMemory",
      "ReadProcessMemory", "OpenProcess", "CreateRemoteThread",
      "NtMapViewOfSection", "Inject", "DLL", "LoadLibrary", "GetProcAddress",
    ],
  },
  {
    name: "Cheats Tunnel / VPN",
    color: "purple",
    strings: [
      "Hamachi", "ZeroTier", "Tailscale", "Radmin", "ngrok", "Cloudflare",
      "WARP", "WireGuard", "OpenVPN", "NordVPN", "ExpressVPN", "ProtonVPN",
      "Mullvad",
    ],
  },
  {
    name: "Hidden / Stealth Software",
    color: "red",
    strings: [
      "HiddenMouse", "HID", "USB Rubber Ducky", "Teensy", "Arduino",
      "BadUSB", "Keylogger", "KeySpy", "ActivityMonitor", "Spyrix",
      "Refog", "Agent", "HiddenWindow", "WindowHider",
    ],
  },
  {
    name: "Known Cheat Clients (File/Process)",
    color: "red",
    strings: [
      "LiquidBounce", "net.ccbluex.liquidbounce", "ccbluex",
      "Wurst", "wurstclient", "net.wurstclient",
      "Sigma", "sigma.modules", "net.sigmaclient",
      "FDPClient", "fdpclient", "fdp.client.Main",
      "Vape", "net.vape.client", "vape.v4", "vape.render",
      "Koid", "koid.gg", "koidclicker",
      "Dream Client", "dreamclient", "dream.clicker", "dream.gg",
      "Drip Client", "drip.client", "drip.gg", "drip_autoclicker",
      "Whiteout", "whiteout.gg", "whiteout_client",
      "Itami", "itami.exe", "itami_clicker",
      "7Clicker", "mangoclicker", "left_click_jitter", "right_click_jitter",
      "Murmur", "murmurclicker", "phantom.gg", "phantom_clicker",
      "net.knet.Client",
    ],
  },
  {
    name: "Self-Destruct Indicators",
    color: "red",
    strings: [
      "SelfDestruct", "DestructModule", "CleanTracks", "WipeLogs",
      "DeleteEvidence", "AntiForensic", "UnloadModule", "DisableLoader",
      "StealthMode", "HiddenProcess", "DeleteOnClose", "ExitClean",
      "SecureDelete", "WipeOnExit", "ClearHistory",
      "Class.forName", "ClassLoader", "defineClass", "loadClass",
      "getDeclaredMethod",
    ],
  },
  {
    name: "Launcher / Account Strings",
    color: "cyan",
    strings: [
      "LwjglWindow: Title: Minecraft", "Logging in as",
      "Connecting to mc.charlieroleplay.it",
      "[Client thread/INFO]: Setting user:",
      "[Client thread/INFO]: (Session ID is",
      "displayName", "username", "localId", "launcher_profiles.json",
      "launcher_accounts.json", "TlauncherProfiles.json",
      "ias.json", "ias-accounts.json",
    ],
  },
  {
    name: "Miscellaneous Red Flags",
    color: "yellow",
    strings: [
      "toggle", "module", "settings", "config", "client",
      "aimbot", "killaura", "reach", "velocity", "sprint",
      "autoclicker", "clicker", "macro", "bind", "keybind",
      "scaffold", "tower", "nuker", "freecam", "xray",
      "esp", "tracers", "nametags", "fullbright",
    ],
  },
];

const colorMap: Record<string, string> = {
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  green: "bg-green-500/10 text-green-400 border-green-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  gray: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const tagColor: Record<string, string> = {
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  green: "bg-green-500/10 text-green-400 border-green-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  gray: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function StringsPage() {
  const [search, setSearch] = useState("");
  const [openCats, setOpenCats] = useState<number[]>(
    categories.map((_, i) => i)
  );
  const [highlight, setHighlight] = useState(false);

  const toggleCat = (i: number) =>
    setOpenCats((p) =>
      p.includes(i) ? p.filter((x) => x !== i) : [...p, i]
    );

  const totalStrings = useMemo(
    () => categories.reduce((a, c) => a + c.strings.length, 0),
    []
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        strings: cat.strings.filter((s) => s.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.strings.length > 0);
  }, [search]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Dizionario Stringhe Forensi
          </span>
        </h1>
        <p className="text-gray-400 text-lg">
          Reference card completa — {totalStrings} stringhe in {categories.length} categorie
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Cerca una stringa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setHighlight(!highlight)}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
              highlight
                ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400"
                : "bg-gray-900/50 border-gray-700 text-gray-400 hover:text-white"
            }`}
          >
            {highlight ? "Disattiva Evidenziazione" : "Evidenzia Ricerche"}
          </button>
          <button
            onClick={() => {
              if (openCats.length === categories.length) {
                setOpenCats([]);
              } else {
                setOpenCats(categories.map((_, i) => i));
              }
            }}
            className="text-sm px-3 py-1.5 rounded-lg border bg-gray-900/50 border-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            {openCats.length === categories.length ? "Comprimi Tutto" : "Espandi Tutto"}
          </button>
          {search && (
            <span className="text-sm text-gray-500">
              {filtered.reduce((a, c) => a + c.strings.length, 0)} risultati
            </span>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {filtered.map((cat, ci) => {
          const origIdx = categories.findIndex((c) => c.name === cat.name);
          const isOpen = openCats.includes(origIdx);
          return (
            <div key={ci} className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleCat(origIdx)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorMap[cat.color]}`}
                  >
                    {cat.strings.length}
                  </span>
                  <h3 className="text-white font-semibold text-sm">{cat.name}</h3>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-4 pb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {cat.strings.map((s, si) => (
                      <span
                        key={si}
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono border ${
                          highlight && search && s.toLowerCase().includes(search.toLowerCase())
                            ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                            : tagColor[cat.color]
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">Nessun risultato per &quot;{search}&quot;</p>
          <p className="text-sm">Prova con un&apos;altra stringa o rimuovi il filtro.</p>
        </div>
      )}

      <div className="border-t border-gray-800 pt-8 mt-12 text-center">
        <p className="text-gray-500 text-sm">
          CharlieRoleplay Forensic Reference — {totalStrings} stringhe documentate
        </p>
      </div>
    </div>
  );
}
