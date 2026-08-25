"use client";

import { useState } from "react";

type Category = {
  name: string;
  strings: string[];
  color: string;
};

const categories: Category[] = [
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
    name: "Autoclicker",
    color: "orange",
    strings: [
      "AutoClicker", "ClickAssist", "LeftClicker", "RightClicker",
      "JitterClick", "BurstClick", "CPSCounter", "MinCPS", "MaxCPS",
      "RandomizationDelay", "BlockBreakDelay", "InventoryFillClick",
      "RightClickBlatant", "LegitimateClicker",
    ],
  },
  {
    name: "Self-Destruct / Anti-Forensics",
    color: "red",
    strings: [
      "SelfDestruct", "DestructModule", "CleanTracks", "WipeLogs",
      "DetachConsole", "DeleteOnClose", "UnloadDriver", "HideProcess",
      "RemoveRegistryKeys", "KillSwitch", "PanicButton",
    ],
  },
  {
    name: "Movement / World",
    color: "blue",
    strings: [
      "flight/Flight", "scaffold/Scaffold", "speed/Speed", "nofall/NoFall",
      "ESP/EntityESP", "Xray/XRay", "freecam/FreeCam", "phase/Phase",
      "blink/Blink", "Timer/SpeedHack",
    ],
  },
  {
    name: "Ghost Client — LiquidBounce",
    color: "cyan",
    strings: [
      "liquidbounce", "net.ccbluex.liquidbounce", "ccbluex",
      "LiquidBounce", "LiquidBounce v4", "liquidbounce-rel",
    ],
  },
  {
    name: "Ghost Client — Wurst",
    color: "cyan",
    strings: [
      "wurstclient", "net.wurstclient", "Wurst", "Wurst Client",
      "wurst-b1", "wurst-b2", "wurst-b3", "wurst-b4",
    ],
  },
  {
    name: "Ghost Client — Sigma",
    color: "cyan",
    strings: [
      "sigma.modules", "net.sigmaclient", "Sigma", "Sigma 5", "Sigma 6",
    ],
  },
  {
    name: "Ghost Client — FDPClient",
    color: "cyan",
    strings: [
      "fdpclient", "fdp.client.Main", "FDPClient", "FDP Client",
    ],
  },
  {
    name: "Ghost Client — Vape",
    color: "cyan",
    strings: [
      "net.vape.client", "vape.v4", "vape.render", "Vape", "Vape Lite",
      "Vape V4", "vape.gg",
    ],
  },
  {
    name: "Ghost Client — Altri Noti",
    color: "cyan",
    strings: [
      "aristois", "aristois-client", "meteor-client", "meteorclient",
      "impact-client", "impactclient", "future-client", "futureclient",
      "inertia-client", "horion", "horion-client", "novoline",
      "novoline-client", "liquidbounce",
    ],
  },
  {
    name: "Autoclicker — Koid",
    color: "orange",
    strings: [
      "koid", "koid.gg", "koidclicker", "Clicker.java",
    ],
  },
  {
    name: "Autoclicker — Dream Client",
    color: "orange",
    strings: [
      "dreamclient", "dream.clicker", "dream.gg", "dream.club",
    ],
  },
  {
    name: "Autoclicker — Drip Client",
    color: "orange",
    strings: [
      "drip.client", "drip.gg", "drip_autoclicker",
    ],
  },
  {
    name: "Autoclicker — Whiteout",
    color: "orange",
    strings: [
      "whiteout.gg", "whiteout_client", "wo_clicker",
    ],
  },
  {
    name: "Autoclicker — Itami",
    color: "orange",
    strings: [
      "itami.exe", "itami_clicker", "itami.club",
    ],
  },
  {
    name: "Autoclicker — 7Clicker / Mango",
    color: "orange",
    strings: [
      "7clicker", "mangoclicker", "left_click_jitter", "right_click_jitter",
    ],
  },
  {
    name: "Autoclicker — Murmur / Phantom",
    color: "orange",
    strings: [
      "murmurclicker", "phantom.gg", "phantom_clicker",
    ],
  },
  {
    name: "48 Cheat Client Rilevati dal Tool",
    color: "red",
    strings: [
      "Doomsday", "doomsday", "doomsdayclient", "doomsday-client", "dday",
      "Sigma", "sigma", "sigma5", "sigma6", "sigmaclient",
      "Wurst", "wurst", "wurstclient", "wurst-client",
      "Meteor", "meteor-client", "meteorclient",
      "Aristois", "aristois", "hacked-1", "hacked-fabric",
      "Impact", "impact-client", "impactclient",
      "XRay", "xray", "xray-mod", "xraymod",
      "Inertia", "inertia", "inertia-client",
      "Future", "future-client", "futureclient",
      "LiquidBounce", "liquidbounce", "liquid-bounce",
      "Vape", "vape", "vape-lite", "vapelite",
      "Ghost", "ghost-client", "ghostclient",
      "Entropy", "entropy-client", "entropyclient",
      "Horion", "horion", "horion-client",
      "Ares", "ares-client", "aresclient",
      "Novoline", "novoline", "novoline-client",
      "Remix", "remix-client", "remixclient",
      "Rise", "rise-client", "riseclient",
      "Zeroday", "zeroday", "zero-day",
      "Drip", "dripx", "drip-client", "dripplus",
      "Rusherhack", "rusherhack", "rusher-client",
      "Tenacity", "tenacity-client", "tenacityclient",
      "BleachHack", "bleachhack", "bleach-hack",
      "Raven", "raven-client", "ravenclient",
      "Omega", "omega-hack", "omegahack",
      "Phase", "phase-client", "phaseclient",
      "Astolfo", "astolfo", "astolfo-client",
      "Kami", "kamiblue", "kami-blue",
      "SalHack", "salhack", "sal-hack",
      "Seppuku", "seppuku", "seppuku-client",
      "Phobos", "phobos", "phobos-client",
      "Azura", "azura", "azura-client",
      "NightX", "nightx", "nightx-client",
      "Flux", "flux-b4", "fluxclient",
      "Snow", "snowclient", "snow-client",
      "Moon", "moonclient", "moon-client",
      "Skid", "skidclient", "skid-client",
      "Zues", "zues", "zues-client",
      "Sensation", "sensation", "sensation-client",
      "Gamesense", "gamesense", "game-sense",
      "Oldfag", "oldfag", "oldfag-client",
      "Abyss", "abyss", "abyss-client",
      "AutoClicker", "autoclicker", "auto-clicker",
      "JNativeHook", "jnativehook", "j-native-hook",
      "Injector", "injector", "injection", "dll-injector",
      "KillAura", "killaura", "kill-aura",
      "Reach", "reach-mod", "reachmod",
      "Velocity", "velocity-hack", "velocityhack",
    ],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  red: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", badge: "badge-red" },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400", badge: "badge-orange" },
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", badge: "badge-blue" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400", badge: "badge-cyan" },
};

export default function StringsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const allStrings = categories.flatMap(c => c.strings.map(s => ({ str: s, cat: c.name })));
  const filtered = search
    ? allStrings.filter(s => s.str.toLowerCase().includes(search.toLowerCase()))
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Stringhe Forensi — Reference Card
          </span>
        </h1>
        <p className="text-gray-400 text-lg">Tutte le stringhe da cercare in System Informer &gt; Strings su javaw.exe / explorer.exe</p>
        <p className="text-gray-500 text-sm mt-2">Lunghezza minima stringhe: 4 caratteri. Filtrare su processi sospetti.</p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cerca una stringa (es. killaura, doomsday, autoclicker)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
        {search && (
          <p className="text-sm text-gray-500 mt-2">{filtered?.length} risultati per &quot;{search}&quot;</p>
        )}
      </div>

      {/* Search results */}
      {filtered && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Risultati Ricerca</h2>
          <div className="grid gap-2">
            {filtered.map((s, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2">
                <code className="text-cyan-300 font-mono text-sm">{s.str}</code>
                <span className="text-gray-600 text-xs">— {s.cat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category cards */}
      <div className="space-y-6">
        {categories.map((cat, i) => {
          const colors = colorMap[cat.color] || colorMap.cyan;
          return (
            <div key={i} className={`${colors.bg} border ${colors.border} rounded-2xl overflow-hidden`}>
              <button
                onClick={() => setSelected(selected === cat.name ? null : cat.name)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`badge ${colors.badge}`}>{cat.strings.length}</span>
                  <h3 className={`font-semibold ${colors.text}`}>{cat.name}</h3>
                </div>
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${selected === cat.name ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {(selected === cat.name || search) && !search && (
                <div className="px-6 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {cat.strings.map((s, j) => (
                      <code key={j} className="text-sm text-gray-300 bg-gray-950/50 border border-gray-700/50 rounded-lg px-3 py-1.5 font-mono hover:border-gray-600 transition-colors cursor-default">
                        {s}
                      </code>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Total count */}
      <div className="mt-12 text-center text-gray-600 text-sm">
        Totale: {categories.reduce((a, c) => a + c.strings.length, 0)} stringhe in {categories.length} categorie
      </div>
    </div>
  );
}
