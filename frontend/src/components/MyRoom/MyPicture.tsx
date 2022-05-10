import React, { useEffect, useState } from 'react';
import styles from './style/MyRoom.module.scss';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 슬라이더 적용..
type pictureProps = {
  pictures: String[]
}

function MyPicture({ pictures } : pictureProps) {
  const settings = {
    dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
  }
  return (
    <div className={styles.pictureContent}>
      <h2>나의 Picture</h2>
        {pictures.map((value:any, index: number) => {
        return(
          <div 
            key={index}
            className={styles.picture} >
            <img 
              src={value}>  
            </img>
          </div>
        )
        })}
    </div>
  )
};

export default MyPicture;