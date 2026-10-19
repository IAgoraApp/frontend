import Video from '../../assets/videos/bannerVideo.mp4';

export default function VideoSection() {
  return (
    <section>
      <video
        src={Video}
        autoPlay
        muted
        loop
        playsInline
        className='w-full h-150 object-cover'
      />
    </section>
  );
}
