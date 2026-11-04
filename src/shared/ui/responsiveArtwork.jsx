import { useLayoutEffect, useRef } from 'react';

export function ResponsiveArtwork({
  width,
  height,
  children,
  className = '',
  ...props
}) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    function resize() {
      canvas.style.setProperty(
        '--artwork-scale',
        String(wrapper.clientWidth / width)
      );
    }
    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);
    resize();
    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
      {...props}
    >
      <div
        ref={canvasRef}
        className='absolute top-0 left-0 origin-top-left scale-(--artwork-scale) [--artwork-scale:1]'
        style={{ width, height }}
      >
        {children}
      </div>
    </div>
  );
}
