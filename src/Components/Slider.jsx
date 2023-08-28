import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const Slider = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  return (
    <div className="container embla" ref={emblaRef}>
      <div className="embla__container">
        <img src="./sushi.png" className="embla__slide" />
        <img src="/sushi2.png" className="embla__slide" />
      </div>
    </div>
  );
};

export default Slider;
