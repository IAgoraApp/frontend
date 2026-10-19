import { Sections } from '../components/Home';

export default function Home() {
  return (
    <main className='mx-30'>
      <Sections.TittleSection />
      <Sections.NavSection />
      <div className='mt-10 gap-10 flex'>
        <div className='w-2/5'>
          <Sections.RotinaSection />
        </div>
        <div className='flex-1'>
          <Sections.CozinhaSection />
        </div>
      </div>
    </main>
  );
}
