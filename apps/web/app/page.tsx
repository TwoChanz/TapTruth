import { Glyph } from '@/components/Glyph';

// TODO (marketing phase): real landing page copy approved against Character Bible.
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5">
      <Glyph size={168} tier={3} className="mb-12" />
      <h1 className="font-prophecy text-prophecy-display text-bone tracking-tight text-center">
        TruthTap
      </h1>
      <p className="font-voice text-caption text-bone-faint text-center mt-12 tracking-ritual uppercase">
        Coming soon.
      </p>
    </main>
  );
}
