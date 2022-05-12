import React, { useEffect, useState } from 'react';
import styles from './style/MyRoom.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, EffectCoverflow } from "swiper";

// 슬라이더 적용..
type pictureProps = {
  pictures: String[]
}

function MyPicture({ pictures } : pictureProps) {
  return (
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={4}
        coverflowEffect={{
          rotate: 40,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{
          clickable: true
        }}
        modules={[EffectCoverflow, Pagination]}
        className="mySwiper"
      >
        {pictures.map((value:any, index: number) => {
        return(
          <SwiperSlide className={styles.picture}><img src={value}></img></SwiperSlide>
        )
        })}
      </Swiper>
  )
};

export default MyPicture;