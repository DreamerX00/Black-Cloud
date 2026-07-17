/**
 * Icon barrel — single source of truth for icons across BlackCloud.
 *
 * The app previously imported from `lucide-react` (limited pack, dropped
 * brand icons over trademark). We now use `react-icons`, which aggregates
 * 30+ packs. Each icon below is chosen from the pack whose visual language
 * best fits its role:
 *
 *   si   Simple Icons     brand marks (AWS, Azure, GCP, GitHub, X, LinkedIn,
 *                          Kubernetes, Docker, Terraform, ...)
 *   hi2  Heroicons v2      primary UI actions (arrows, close, check, plus)
 *   pi   Phosphor          organic/cosmic decorative (sparkles, cloud, orbits)
 *   rx   Radix Icons       controls (caret, cross, dot)
 *   fi   Feather           fallbacks (lucide was a Feather fork originally)
 *   tb   Tabler            technical (grid, layers, network)
 *
 * All icons re-exported with the same names the code already uses, so the
 * codebase-wide migration is import-path-only.
 */

import type { IconType } from "react-icons";

// ── Actions / arrows / UI (Heroicons v2 outline — clean geometric line) ────
import {
  HiOutlineArrowUpRight,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlineArrowLongRight,
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineXMark,
  HiOutlineCheck,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowRightOnRectangle, // sign in
  HiOutlineArrowLeftOnRectangle, // sign out
  HiOutlineUser,
  HiOutlineTrash,
  HiOutlineArrowUturnLeft, // undo
  HiOutlineArrowUturnRight, // redo
  HiOutlineArrowDownTray, // save/download
  HiOutlineEllipsisVertical,
  HiOutlineSquares2X2, // layout grid
  HiOutlineSquare2Stack,
  HiOutlineBell,
  HiOutlineCurrencyDollar,
  HiOutlineBookOpen,
  HiOutlinePlayCircle,
  HiOutlinePlay,
  HiOutlineClock,
  HiOutlineCube,
  HiOutlineCubeTransparent,
  HiOutlineCommandLine,
  HiOutlineBolt, // zap
  HiOutlineHome,
  HiOutlineCog6Tooth,
  HiOutlineExclamationTriangle,
  HiOutlineShieldCheck,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowsRightLeft, // migrate
  HiOutlineRocketLaunch,
  HiOutlineSignal,
  HiOutlineDocumentText,
  HiOutlineDocumentArrowDown,
} from "react-icons/hi2";

// ── Cosmic / decorative (Phosphor duotone — for hero moments) ─────────────
import {
  PiSparkleFill,
  PiSparkle,
  PiCloud,
  PiCloudDuotone,
  PiStar,
  PiStarFill,
  PiCompass,
  PiCompassDuotone,
  PiPlanet,
  PiPlanetDuotone,
  PiWaveform,
  PiCircuitry,
  PiGraph,
  PiNetwork,
  PiStack,
  PiStackDuotone,
  PiTreeStructure,
  PiLightning,
  PiInfinity,
  PiCircleDashed,
  PiDotsSixVertical,
  PiRss,
  PiLinkedinLogo,
  PiOpenAiLogo,
  PiInfo,
  PiWarning,
  PiWarningOctagon,
  PiCheckCircle,
  PiCloudArrowUp,
} from "react-icons/pi";

// ── Radix (small precise controls) ─────────────────────────────────────────
import {
  RxCircle,
  RxDotFilled,
  RxComponent1,
  RxCross2,
  RxOpenInNewWindow,
} from "react-icons/rx";

// ── Simple Icons (brands — mono-glyph, filled) ─────────────────────────────
import {
  SiGithub,
  SiX,
  SiDiscord,
  SiYoutube,
  SiKubernetes,
  SiDocker,
  SiTerraform,
  SiPulumi,
  SiCloudflare,
  SiVercel,
  SiTypescript,
  SiPython,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiAnthropic,
} from "react-icons/si";

// ── Tabler (technical) ─────────────────────────────────────────────────────
import { TbLoader2 } from "react-icons/tb";

/* ══════════════════════════════════════════════════════════════════════════
 * Public API — names match the app's existing conventions so file-level
 * migration is `s/from "@/components/icons"/from "@/components/icons"/g`.
 * ═════════════════════════════════════════════════════════════════════════ */

// Loader — lucide's Loader2 spinning "-" is idiomatic across the codebase.
export const Loader2: IconType = TbLoader2;

// Nav / actions
export const ArrowUpRight: IconType = HiOutlineArrowUpRight;
export const ArrowRight: IconType = HiOutlineArrowRight;
export const ArrowLeft: IconType = HiOutlineArrowLeft;
export const ArrowLongRight: IconType = HiOutlineArrowLongRight;
export const ChevronRight: IconType = HiOutlineChevronRight;
export const ChevronRightIcon: IconType = HiOutlineChevronRight;
export const ChevronDown: IconType = HiOutlineChevronDown;
export const ChevronLeft: IconType = HiOutlineChevronLeft;
export const Plus: IconType = HiOutlinePlus;
export const Minus: IconType = HiOutlineMinus;
export const Check: IconType = HiOutlineCheck;
export const CheckIcon: IconType = HiOutlineCheck;
export const X: IconType = HiOutlineXMark;
export const XIcon: IconType = HiOutlineXMark;
export const CrossIcon: IconType = RxCross2;
export const Search: IconType = HiOutlineMagnifyingGlass;
export const SearchIcon: IconType = HiOutlineMagnifyingGlass;
export const MoreVertical: IconType = HiOutlineEllipsisVertical;
export const Trash2: IconType = HiOutlineTrash;
export const Undo2: IconType = HiOutlineArrowUturnLeft;
export const Redo2: IconType = HiOutlineArrowUturnRight;
export const Save: IconType = HiOutlineArrowDownTray;
export const LayoutGrid: IconType = HiOutlineSquares2X2;
export const LayoutDashboard: IconType = HiOutlineSquare2Stack;
export const Copy: IconType = HiOutlineSquare2Stack;
export const Bell: IconType = HiOutlineBell;
export const Coins: IconType = HiOutlineCurrencyDollar;
export const BookText: IconType = HiOutlineBookOpen;
export const Play: IconType = HiOutlinePlay;
export const PlayCircle: IconType = HiOutlinePlayCircle;
export const History: IconType = HiOutlineClock;
export const Clock: IconType = HiOutlineClock;
export const Boxes: IconType = HiOutlineCube;
export const Cube: IconType = HiOutlineCube;
export const CubeTransparent: IconType = HiOutlineCubeTransparent;
export const CommandIcon: IconType = HiOutlineCommandLine;
export const Command: IconType = HiOutlineCommandLine;
export const Zap: IconType = HiOutlineBolt;
export const Bolt: IconType = HiOutlineBolt;
export const Home: IconType = HiOutlineHome;
export const Settings: IconType = HiOutlineCog6Tooth;
export const Alert: IconType = HiOutlineExclamationTriangle;
export const Shield: IconType = HiOutlineShieldCheck;
export const ShieldCheck: IconType = HiOutlineShieldCheck;
export const Terminal: IconType = HiOutlineCommandLine;
export const KeyRound: IconType = HiOutlineCog6Tooth;
export const Eye: IconType = HiOutlineEye;
export const EyeOff: IconType = HiOutlineEyeSlash;
export const ArrowsRightLeft: IconType = HiOutlineArrowsRightLeft;
export const Rocket: IconType = HiOutlineRocketLaunch;
export const Signal: IconType = HiOutlineSignal;
export const DocText: IconType = HiOutlineDocumentText;
export const DocDownload: IconType = HiOutlineDocumentArrowDown;
export const OpenInNew: IconType = RxOpenInNewWindow;

// Account
export const User: IconType = HiOutlineUser;
export const UserIcon: IconType = HiOutlineUser;
export const LogIn: IconType = HiOutlineArrowRightOnRectangle;
export const LogOut: IconType = HiOutlineArrowLeftOnRectangle;

// Cosmic / decorative (Phosphor — organic + duotone flavor)
export const Sparkles: IconType = PiSparkleFill;
export const SparklesOutline: IconType = PiSparkle;
export const Cloud: IconType = PiCloud;
export const CloudDuo: IconType = PiCloudDuotone;
export const Star: IconType = PiStar;
export const StarFill: IconType = PiStarFill;
export const Compass: IconType = PiCompass;
export const CompassDuo: IconType = PiCompassDuotone;
export const Planet: IconType = PiPlanet;
export const PlanetDuo: IconType = PiPlanetDuotone;
export const Orbit: IconType = PiPlanet;   // planet stands in for orbit
export const Waveform: IconType = PiWaveform;
export const Circuitry: IconType = PiCircuitry;
export const Graph: IconType = PiGraph;
export const Network: IconType = PiNetwork;
export const Stack: IconType = PiStack;
export const StackDuo: IconType = PiStackDuotone;
export const TreeStructure: IconType = PiTreeStructure;
export const Lightning: IconType = PiLightning;
export const Infinity: IconType = PiInfinity;
export const CircleDashed: IconType = PiCircleDashed;
export const DragHandle: IconType = PiDotsSixVertical;
export const Rss: IconType = PiRss;
export const CircleIcon: IconType = RxCircle;
export const Circle: IconType = RxCircle;
export const DotFilled: IconType = RxDotFilled;
export const ComponentIcon: IconType = RxComponent1;

// Brand icons — react-icons v5.7 stripped LinkedIn + cloud-provider marks
// (trademark cleanup). We use Phosphor's logo variants for LinkedIn and
// OpenAI; for AWS/Azure/GCP we use the official SVGs already bundled in
// public/AWS-ICONS + public/GCP-ICON (DESIGN_SYSTEM §Icons rule:
// "Always use provider-approved service icons").
export const IconGithub: IconType = SiGithub;
export const IconTwitter: IconType = SiX;
export const IconX: IconType = SiX;
export const IconLinkedin: IconType = PiLinkedinLogo;
export const IconDiscord: IconType = SiDiscord;
export const IconYoutube: IconType = SiYoutube;
export const IconKubernetes: IconType = SiKubernetes;
export const IconDocker: IconType = SiDocker;
export const IconTerraform: IconType = SiTerraform;
export const IconPulumi: IconType = SiPulumi;
export const IconCloudflare: IconType = SiCloudflare;
export const IconVercel: IconType = SiVercel;
export const IconTypescript: IconType = SiTypescript;
export const IconPython: IconType = SiPython;
export const IconNextjs: IconType = SiNextdotjs;
export const IconReact: IconType = SiReact;
export const IconTailwind: IconType = SiTailwindcss;
export const IconOpenAI: IconType = PiOpenAiLogo;
export const IconAnthropic: IconType = SiAnthropic;

/* ─── Provider brand marks — sourced from public/ folders ─────────────────
 * These are the OFFICIAL marks (not service icons). Rendered as <img>
 * because they're multi-color SVG assets, not glyph fonts.
 *
 * Sources bundled in /public:
 *   AWS   — /AWS-ICONS/Architecture-Group-Icons_04302026/AWS-Cloud-logo_32.svg
 *           (official AWS Cloud wordmark, dark-theme variant available too)
 *   GCP   — /GCP-ICON/Unique Icons/Anthos/SVG/Anthos-512-color.svg
 *           (Google Cloud umbrella brand — closest master mark in the pack)
 *   Azure — no bundled asset; renders "Az" wordmark until a pack is added.
 *
 * DESIGN_SYSTEM §Icons: "Always use provider-approved service icons.
 *   Never create custom cloud service logos." — this component enforces that.
 * ────────────────────────────────────────────────────────────────────── */

const PROVIDER_MARK_SRC = {
  aws: "/AWS-ICONS/Architecture-Group-Icons_04302026/AWS-Cloud-logo_32.svg",
  awsDark: "/AWS-ICONS/Architecture-Group-Icons_04302026/AWS-Cloud-logo_32_Dark.svg",
  gcp: "/GCP-ICON/Unique Icons/Anthos/SVG/Anthos-512-color.svg",
  azure: null, // asset pack pending
} as const;

type ProviderKey = "aws" | "azure" | "gcp";

function makeProviderMark(provider: ProviderKey) {
  const src =
    provider === "aws"
      ? PROVIDER_MARK_SRC.awsDark
      : provider === "gcp"
        ? PROVIDER_MARK_SRC.gcp
        : null;
  const label = provider.toUpperCase();
  const Component = ({ className }: { className?: string }) =>
    src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={label} className={className} />
    ) : (
      <span
        className={className}
        aria-label={label}
        role="img"
        style={{ display: "inline-grid", placeItems: "center", fontWeight: 600 }}
      >
        Az
      </span>
    );
  Component.displayName = `ProviderMark(${provider})`;
  return Component;
}

export const IconAws = makeProviderMark("aws");
export const IconAzure = makeProviderMark("azure");
export const IconGcp = makeProviderMark("gcp");

/**
 * Generic <ProviderMark provider="aws" /> component — convenient when the
 * provider is dynamic (marketing, dashboard tiles).
 */
export function ProviderMark({
  provider,
  className,
}: {
  provider: ProviderKey;
  className?: string;
}) {
  const Mark =
    provider === "aws" ? IconAws : provider === "azure" ? IconAzure : IconGcp;
  return <Mark className={className} />;
}

/**
 * ServiceMark — resolves a NodeDefinition.iconPath to an <img>. Used by
 * playground nodes, palette items, and inspector previews. Falls back to
 * an initials chip when the definition has no iconPath (Azure services).
 */
export function ServiceMark({
  src,
  alt,
  fallbackInitials,
  className,
}: {
  src: string | null;
  alt: string;
  fallbackInitials: string;
  className?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} />;
  }
  return (
    <span
      className={className}
      aria-label={alt}
      role="img"
      style={{
        display: "inline-grid",
        placeItems: "center",
        fontWeight: 600,
        letterSpacing: "-0.02em",
      }}
    >
      {fallbackInitials}
    </span>
  );
}

// Sonner-required aliases (matching lucide's *Icon suffix convention)
export const CircleCheckIcon: IconType = PiCheckCircle;
export const InfoIcon: IconType = PiInfo;
export const Loader2Icon: IconType = TbLoader2;
export const OctagonXIcon: IconType = PiWarningOctagon;
export const TriangleAlertIcon: IconType = PiWarning;

// Provider icon lookup — used across pages and CommandPalette.
export const PROVIDER_ICON = {
  aws: IconAws,
  azure: IconAzure,
  gcp: IconGcp,
} as const;

export type ProviderIconKey = keyof typeof PROVIDER_ICON;
