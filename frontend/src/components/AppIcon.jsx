const iconPaths = {
  upload: (
    <>
      <path d="M12 16V7" />
      <path d="M8.5 10.5 12 7l3.5 3.5" />
      <path d="M6.8 18.5a4.8 4.8 0 0 1 .5-9.6 6 6 0 0 1 11.2 2.7 3.5 3.5 0 0 1-.7 6.9H6.8Z" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h4l2-3h4l2 3h4v11H4z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  image: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m7 17 4-4 3 3 2-2 3 3" />
    </>
  ),
  prescription: (
    <>
      <path d="M7 3h8l4 4v14H7z" />
      <path d="M15 3v5h5" />
      <path d="M10 13h3.5a2 2 0 0 0 0-4H10v8" />
      <path d="m13 14 4 4" />
    </>
  ),
  ai: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9 2v3" />
      <path d="M15 2v3" />
      <path d="M9 19v3" />
      <path d="M15 19v3" />
      <path d="M2 9h3" />
      <path d="M2 15h3" />
      <path d="M19 9h3" />
      <path d="M19 15h3" />
      <path d="M9 15V9h2.2L15 15" />
      <path d="M10 13h4" />
    </>
  ),
  info: (
    <>
      <path d="M8 5h7l3 3v11H8z" />
      <path d="M15 5v4h4" />
      <path d="M11 12h5" />
      <path d="M11 16h5" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M5 19h14" />
    </>
  ),
  language: (
    <>
      <path d="M4 5h8" />
      <path d="M8 3v2" />
      <path d="M6 5c.7 3.2 2.8 5.6 6 7" />
      <path d="M11 5c-.6 2.2-2 4.2-4.5 6" />
      <path d="M14 19l3-8 3 8" />
      <path d="M15.2 16h3.6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5.5 5.6v5.2c0 4.2 2.7 7.9 6.5 9.2 3.8-1.3 6.5-5 6.5-9.2V5.6L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  pdf: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v5h5" />
      <path d="M9 16h6" />
      <path d="M9 12h3" />
    </>
  ),
  history: (
    <>
      <path d="M4 12a8 8 0 1 0 2.3-5.7" />
      <path d="M4 5v5h5" />
      <path d="M12 8v5l3 2" />
    </>
  ),
  lock: (
    <>
      <rect x="6" y="10" width="12" height="10" rx="2" />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" />
      <path d="M12 14v2" />
    </>
  ),
  fast: (
    <>
      <path d="m13 2-8 12h6l-1 8 8-12h-6z" />
    </>
  ),
  medicine: (
    <>
      <path d="M10 21H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h4" />
      <path d="M14 3h4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-4" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </>
  ),
  alert: (
    <>
      <path d="m12 3 9 16H3z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  support: (
    <>
      <path d="M5 12a7 7 0 0 1 14 0v4" />
      <path d="M5 12v3a2 2 0 0 0 2 2h1v-6H7a2 2 0 0 0-2 2Z" />
      <path d="M19 12v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z" />
      <path d="M15 20h-3" />
      <path d="M19 16v1a3 3 0 0 1-3 3h-1" />
    </>
  ),
  chevronRight: (
    <>
      <path d="m9 6 6 6-6 6" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  )
};

function AppIcon({ name = "info", className = "" }) {
  return (
    <svg className={`app-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      {iconPaths[name] || iconPaths.info}
    </svg>
  );
}

export default AppIcon;
