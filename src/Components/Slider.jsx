import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const Slider = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  return (
    <div className="container embla" ref={emblaRef}>
      <div className="embla__container">
        <img
          src="./bannerumami.png"
          className="embla__slide"
          width={350}
          height={140}
        />
      </div>
    </div>
  );
};

export default Slider;
