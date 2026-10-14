/**
 * The layered parallax wave graphic.
 *
 * Rendered twice — once as the wide hero wave and once inside the circular
 * badge — so the `<path>` id is namespaced per instance to keep the ids unique.
 */
export default function Waves({ id }) {
  const waveId = `gentle-wave-${id}`;

  return (
    <svg
      className="waves"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shapeRendering="auto"
      aria-hidden="true"
    >
      <defs>
        <path
          id={waveId}
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <g className="parallax">
        <use xlinkHref={`#${waveId}`} x="48" y="0" fill="rgba(27,83,194,0.7)" />
        <use xlinkHref={`#${waveId}`} x="48" y="3" fill="rgba(27,83,194,0.5)" />
        <use xlinkHref={`#${waveId}`} x="48" y="5" fill="rgba(27,83,194,0.3)" />
        <use xlinkHref={`#${waveId}`} x="48" y="7" fill="rgba(27,83,194,1)" />
      </g>
    </svg>
  );
}
