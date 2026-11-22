/** Template se iznova montira pri svakoj promjeni stranice, pa nova stranica meko uđe. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="ulaz">{children}</div>;
}
