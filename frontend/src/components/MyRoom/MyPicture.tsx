import React, { useEffect, useState } from 'react';
import styles from './style/MyRoom.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";

// 슬라이더 적용..
type pictureProps = {
  pictures: String[]
}

function MyPicture({ pictures } : pictureProps) {

  return (
      <Swiper
        spaceBetween={50}
        slidesPerView={4}
        pagination={{
          clickable: true,
        }}
        loop={true}
        modules={[Pagination]}
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