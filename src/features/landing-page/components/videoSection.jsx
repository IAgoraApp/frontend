import Video from '../assets/bannerVideo.mp4';
import { Container } from '../../../shared/ui';

export default function VideoSection() {
  return (
    <Container as='section' className='flex items-center justify-center'>
      <div className='w-full max-w-250 pr-3 pb-3 sm:pr-5 sm:pb-5'>
        <video
          src={Video}
          autoPlay
          muted
          loop
          playsInline
          className='w-full object-cover shadow-[12px_12px_0px_var(--laranja-principal)] sm:shadow-[20px_20px_0px_var(--laranja-principal)]'
        />
      </div>
    </Container>
  );
}
