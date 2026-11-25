export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 26 26" aria-hidden="true">
      <path d="M13 2 24 22H2Z" fill="#8257f5" />
      <path d="M13 2 24 22 13 15Z" fill="#2fd1c1" />
      <path d="M2 22 13 15 24 22Z" fill="#f2b41b" />
    </svg>
  );
}
