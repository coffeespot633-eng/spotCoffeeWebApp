import { useEffect, useState } from "react";
import { bannerService } from "../../services/bannerService";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchBanner = async () => {
      const data = await bannerService.getActive();
      setBanners(data);
    };

    fetchBanner();
  }, []);

  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  if (!banners.length) return null;

  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl">
      <img
        src={banners[current].imageUrl}
        alt={banners[current].title}
        className="h-[260px] w-full object-cover md:h-[400px]"
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
        <h2 className="text-3xl font-black">
          {banners[current].title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm">
          {banners[current].description}
        </p>
      </div>

      <button
        onClick={() =>
          setCurrent(
            current === 0
              ? banners.length - 1
              : current - 1
          )
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={() =>
          setCurrent(
            current === banners.length - 1
              ? 0
              : current + 1
          )
        }
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2"
      >
        <ChevronRight />
      </button>
    </section>
  );
}