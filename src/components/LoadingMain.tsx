export function LoadingMain({ label }: { label: string }) {
  return (
    <main>
      <p className="loading-copy">{label}</p>
    </main>
  );
}
