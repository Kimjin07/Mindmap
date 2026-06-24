/**
 * Hand-drawn line-art icons for the application row.
 * All share the gold gradient stroke + sketch filter defined in SketchDefs.
 */
import type { ReactNode } from "react";

function Ico({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      <g
        stroke="url(#gold)"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#sketch)"
      >
        {children}
      </g>
    </svg>
  );
}

export const ChatbotsIcon = () => (
  <Ico>
    <path d="M9 13 h26 a4 4 0 0 1 4 4 v12 a4 4 0 0 1 -4 4 H20 l-7 6 v-6 h-4 a4 4 0 0 1 -4 -4 V17 a4 4 0 0 1 4 -4 Z" />
    <path d="M15 21 h18 M15 26 h12" />
  </Ico>
);

export const DigitalBiologyIcon = () => (
  <Ico>
    <ellipse cx="24" cy="16" rx="11" ry="6" />
    <path d="M13 16 v9 c0 3.3 4.9 6 11 6 s11 -2.7 11 -6 v-9" />
    <path d="M18 14 l4 4 M28 13 l3 5 M21 24 l5 3" />
    <circle cx="24" cy="38" r="4" />
  </Ico>
);

export const RobotaxiIcon = () => (
  <Ico>
    <path d="M8 30 l3 -10 c0.6 -2 2 -3 4 -3 h18 c2 0 3.4 1 4 3 l3 10" />
    <path d="M6 30 h36 v6 h-3 v3 h-4 v-3 H17 v3 h-4 v-3 H6 Z" />
    <path d="M14 20 h20" />
    <circle cx="14" cy="33" r="1.6" />
    <circle cx="34" cy="33" r="1.6" />
  </Ico>
);

export const EnterpriseIcon = () => (
  <Ico>
    <rect x="11" y="9" width="16" height="30" rx="1.5" />
    <path d="M27 18 h10 v21 h-10" />
    <path d="M15 14 h3 M21 14 h3 M15 19 h3 M21 19 h3 M15 24 h3 M21 24 h3 M15 29 h3 M21 29 h3" />
    <path d="M31 23 h3 M31 28 h3 M31 33 h3" />
    <path d="M6 39 h36" />
  </Ico>
);

export const ScienceIcon = () => (
  <Ico>
    <circle cx="24" cy="24" r="3.2" />
    <ellipse cx="24" cy="24" rx="16" ry="7" />
    <ellipse
      cx="24"
      cy="24"
      rx="16"
      ry="7"
      transform="rotate(60 24 24)"
    />
    <ellipse
      cx="24"
      cy="24"
      rx="16"
      ry="7"
      transform="rotate(120 24 24)"
    />
  </Ico>
);

export const RoboticsIcon = () => (
  <Ico>
    <rect x="15" y="14" width="18" height="15" rx="3" />
    <path d="M24 14 V9" />
    <circle cx="24" cy="7.5" r="1.6" />
    <circle cx="20" cy="21" r="1.6" />
    <circle cx="28" cy="21" r="1.6" />
    <path d="M19 33 h10 v6 h-10 Z" />
    <path d="M15 20 H10 M33 20 h5" />
    <path d="M22 29 v4 M26 29 v4" />
  </Ico>
);

export const ManufacturingIcon = () => (
  <Ico>
    <path d="M10 38 V20 l8 4 V20 l8 4 V20 l10 5 v13 Z" />
    <path d="M10 38 h30" />
    <path d="M30 20 V9 h5 v16" />
    <path d="M16 31 h3 M22 31 h3 M28 31 h3" />
  </Ico>
);

export const AICoderIcon = () => (
  <Ico>
    <rect x="7" y="11" width="34" height="26" rx="3" />
    <path d="M7 17 h34" />
    <circle cx="11" cy="14" r="0.9" />
    <circle cx="14.5" cy="14" r="0.9" />
    <path d="M18 23 l-4 4 l4 4 M30 23 l4 4 l-4 4 M26 22 l-4 10" />
  </Ico>
);

/* ---- infrastructure / chips / energy icons ---- */

export const GPUIcon = () => (
  <Ico>
    <rect x="6" y="14" width="36" height="20" rx="2" />
    <circle cx="17" cy="24" r="5" />
    <path d="M17 19 v10 M12 24 h10" />
    <path d="M28 20 h9 M28 24 h9 M28 28 h9" />
    <path d="M12 34 v4 M21 34 v4 M31 34 v4" />
  </Ico>
);

export const CPUIcon = () => (
  <Ico>
    <rect x="14" y="14" width="20" height="20" rx="2" />
    <rect x="20" y="20" width="8" height="8" rx="1" />
    <path d="M19 14 v-4 M24 14 v-4 M29 14 v-4" />
    <path d="M19 34 v4 M24 34 v4 M29 34 v4" />
    <path d="M14 19 h-4 M14 24 h-4 M14 29 h-4" />
    <path d="M34 19 h4 M34 24 h4 M34 29 h4" />
  </Ico>
);

export const DPUIcon = () => (
  <Ico>
    <rect x="13" y="14" width="22" height="20" rx="2" />
    <path d="M17 21 h12 l-3 -3 M29 21 l-3 3" />
    <path d="M31 27 h-12 l3 -3 M19 27 l3 3" />
    <path d="M19 14 v-3 M29 14 v-3 M19 34 v3 M29 34 v3" />
    <path d="M13 20 h-3 M13 28 h-3 M35 20 h3 M35 28 h3" />
  </Ico>
);

export const NVLinkIcon = () => (
  <Ico>
    <rect x="6" y="17" width="13" height="14" rx="2" />
    <rect x="29" y="17" width="13" height="14" rx="2" />
    <path d="M20 21 h8 l-3 -3 M28 21 l-3 3" />
    <path d="M28 27 h-8 l3 -3 M20 27 l3 3" />
    <path d="M10 21 h5 M10 27 h5 M33 21 h5 M33 27 h5" />
  </Ico>
);

export const NetworkIcon = () => (
  <Ico>
    <circle cx="24" cy="12" r="3.4" />
    <circle cx="11" cy="34" r="3.4" />
    <circle cx="24" cy="34" r="3.4" />
    <circle cx="37" cy="34" r="3.4" />
    <path d="M24 15.4 L13 31 M24 15.4 V30.6 M24 15.4 L35 31" />
  </Ico>
);

export const StorageIcon = () => (
  <Ico>
    <ellipse cx="24" cy="12" rx="13" ry="4.5" />
    <path d="M11 12 v24 c0 2.5 5.8 4.5 13 4.5 s13 -2 13 -4.5 V12" />
    <path d="M11 21 c0 2.5 5.8 4.5 13 4.5 s13 -2 13 -4.5" />
    <path d="M11 30 c0 2.5 5.8 4.5 13 4.5 s13 -2 13 -4.5" />
  </Ico>
);

export const CoolingIcon = () => (
  <Ico>
    <path d="M24 7 V41" />
    <path d="M9 15.5 L39 32.5" />
    <path d="M39 15.5 L9 32.5" />
    <path d="M21 11 l3 -3 l3 3 M21 37 l3 3 l3 -3" />
    <path d="M12 13 l1 4 l4 -1 M36 13 l-1 4 l-4 -1" />
    <path d="M12 35 l1 -4 l4 1 M36 35 l-1 -4 l-4 1" />
  </Ico>
);

export const PowerIcon = () => (
  <Ico>
    <path d="M27 6 L13 27 H22 L20 42 L35 20 H25 Z" />
  </Ico>
);

export const GridIcon = () => (
  <Ico>
    <path d="M15 40 L23 9 H25 L33 40" />
    <path d="M11 40 H37" />
    <path d="M18 22 H30 M16 30 H32" />
    <path d="M18 22 L30 30 M30 22 L18 30" />
    <path d="M23 9 H25" />
  </Ico>
);

export const FiberIcon = () => (
  <Ico>
    <rect x="18" y="29" width="12" height="10" rx="1.5" />
    <path d="M22 29 V22 M26 29 V22" />
    <path d="M22 22 C 19 15 14 12 11 9" />
    <path d="M24 22 V7" />
    <path d="M26 22 C 29 15 34 12 37 9" />
    <circle cx="11" cy="9" r="1.2" />
    <circle cx="24" cy="7" r="1.2" />
    <circle cx="37" cy="9" r="1.2" />
  </Ico>
);
