import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style/Navbar.module.scss';

const Navbar = () => {
  const navigate = useNavigate();

  const handleGotoMain = (e : React.MouseEvent) => {
    e.preventDefault();
    navigate(`/`);
  }

  return <div className={styles.NavbarContainer} onClick={handleGotoMain}>Aracde</div>;
};

export default Navbar;
