import React from "react";
import { Link } from "react-router-dom";

import Button from "@mui/material/Button";

import styles from "./Header.module.scss";
import Container from "@mui/material/Container";

export const Header = () => {
  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>FUllSTACK BLOG</div>
          </Link>
          <div className={styles.buttons}>
            <Link to="/login">
              <Button variant="outlined">Войти</Button>
            </Link>
            <Link to="/register">
              <Button variant="contained">Создать аккаунт</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};