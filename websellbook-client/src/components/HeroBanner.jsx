import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

function HeroBanner() {
const banners = [
{
image:
"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1600",
title: "Kho sách trực tuyến",
desc: "Hơn 10.000 đầu sách chính hãng với giá ưu đãi mỗi ngày",
button: "Mua ngay",
},
{
image:
"https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600",
title: "Best Seller Collection",
desc: "Những cuốn sách được yêu thích nhất năm nay",
button: "Khám phá",
},
{
image:
"https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1600",
title: "Ưu đãi cuối tuần",
desc: "Giảm giá đến 50% cho hàng ngàn đầu sách",
button: "Xem ngay",
},
];

return ( <div className="mb-8">


  <Swiper
    modules={[Autoplay, Pagination]}
    autoplay={{
      delay: 4000,
      disableOnInteraction: false,
    }}
    pagination={{
      clickable: true,
    }}
    loop
    className="
    rounded-3xl
    overflow-hidden
    shadow-xl
    "
  >

    {banners.map((banner, index) => (

      <SwiperSlide key={index}>

        <div className="relative h-[420px]">

          <img
            src={banner.image}
            alt={banner.title}
            className="
            w-full
            h-full
            object-cover
            "
          />

          <div
            className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/80
            via-black/50
            to-black/10
            "
          />

          <div
            className="
            absolute
            inset-0
            flex
            items-center
            px-10
            md:px-20
            "
          >

            <div className="max-w-xl">

              <span
                className="
                inline-block
                bg-blue-600
                text-white
                px-4
                py-2
                rounded-full
                text-sm
                font-semibold
                mb-5
                "
              >
                📚 Book Store
              </span>

              <h1
                className="
                text-white
                text-5xl
                font-extrabold
                leading-tight
                "
              >
                {banner.title}
              </h1>

              <p
                className="
                text-white/90
                text-lg
                mt-5
                "
              >
                {banner.desc}
              </p>

              <div className="mt-8">

                <button
                  className="
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  px-8
                  py-3
                  rounded-xl
                  font-semibold
                  transition
                  shadow-lg
                  "
                >
                  {banner.button}
                </button>

              </div>

              <div
                className="
                flex
                gap-10
                mt-10
                text-white
                "
              >

                <div>
                  <h3 className="text-3xl font-bold">
                    10K+
                  </h3>
                  <p>Sách</p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold">
                    5K+
                  </h3>
                  <p>Khách hàng</p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold">
                    99%
                  </h3>
                  <p>Hài lòng</p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </SwiperSlide>

    ))}

  </Swiper>

</div>


);
}

export default HeroBanner;
