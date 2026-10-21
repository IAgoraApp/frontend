import Video from '../../assets/videos/bannerVideo.mp4';

export default function VideoSection() {
  return (
    <section className='w-screen flex items-center justify-center'>
      <video
        src={Video}
        autoPlay
        muted
        loop
        playsInline
        className='w-250 object-cover shadow-[20px_20px_0px_var(--laranja-principal)]'
      />
    </section>
  );
}
