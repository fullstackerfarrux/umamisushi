import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const Slider = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function get() {
      await fetch("https://api.umamisushibot.uz/banner/get", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => setImages(data.images));
    }

    get();
  }, []);

  return (
    <div className="container embla" ref={emblaRef}>
      <div className="embla__container">
        {images?.map((p, index) => (
          <img
            src={p.banner_img}
            className="embla__slide"
            width={350}
            height={140}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
