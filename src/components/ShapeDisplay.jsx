import React from 'react';

/**
 * ShapeDisplay — Renders SVG shapes for the Shapes learning module.
 * Uses clean SVGs so shapes are visually accurate (not emoji).
 *
 * Props:
 *   type   {string}  - Shape type id
 *   color  {string}  - Fill color
 *   size   {number}  - SVG size in px (default 200)
 */
function ShapeDisplay({ type, color = '#A855F7', size = 200 }) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.42;

  const shapes = {
    circle: (
      <circle cx={cx} cy={cy} r={r} fill={color} />
    ),
    square: (
      <rect x={s * 0.1} y={s * 0.1} width={s * 0.8} height={s * 0.8}
        rx={s * 0.06} fill={color} />
    ),
    triangle: (
      <polygon
        points={`${cx},${s * 0.1} ${s * 0.92},${s * 0.88} ${s * 0.08},${s * 0.88}`}
        fill={color}
      />
    ),
    rectangle: (
      <rect x={s * 0.05} y={s * 0.22} width={s * 0.9} height={s * 0.56}
        rx={s * 0.06} fill={color} />
    ),
    star: (
      <polygon
        points={buildStar(cx, cy, 5, r, r * 0.42)}
        fill={color}
      />
    ),
    heart: (
      <path
        d={buildHeart(cx, cy, r)}
        fill={color}
      />
    ),
    diamond: (
      <polygon
        points={`${cx},${s * 0.08} ${s * 0.92},${cy} ${cx},${s * 0.92} ${s * 0.08},${cy}`}
        fill={color}
      />
    ),
    oval: (
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.65} fill={color} />
    ),
  };

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.2))' }}
    >
      {shapes[type] || shapes.circle}
    </svg>
  );
}

/** Build a 5-point star polygon string */
function buildStar(cx, cy, points, outerR, innerR) {
  const step = Math.PI / points;
  let d = '';
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    d += `${x},${y} `;
  }
  return d.trim();
}

/** Build a simple heart SVG path */
function buildHeart(cx, cy, r) {
  const scale = r / 100;
  const x = cx;
  const y = cy + 10 * scale;
  return `
    M ${x} ${y}
    C ${x} ${y - 50 * scale}, ${x - 80 * scale} ${y - 90 * scale}, ${x - 80 * scale} ${y - 40 * scale}
    C ${x - 80 * scale} ${y - 10 * scale}, ${x} ${y + 30 * scale}, ${x} ${y + 60 * scale}
    C ${x} ${y + 30 * scale}, ${x + 80 * scale} ${y - 10 * scale}, ${x + 80 * scale} ${y - 40 * scale}
    C ${x + 80 * scale} ${y - 90 * scale}, ${x} ${y - 50 * scale}, ${x} ${y}
    Z
  `;
}

export default ShapeDisplay;
