import { Fragment } from "react";
import Home from "../pagine/News/home";
import ReactDOM from "react-dom";
import React from "react";
import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import TopBar from "./top-bar";
import { handleClick } from "../logica/funzioni";
import Profile from "../pagine/User/profile";
import Exp from "../pagine/Projects/explore";
import Plus from "../pagine/Projects/plus";
import My_proj from "../pagine/Projects/my_proj";

function BottomNav() {
  return (
    <>
      <nav className="navbar fixed-bottom bg-body-tertiary ">
        <div className="container-fluid d-flex justify-content-center">
          <ul className="nav nav-pills">
            <div
              className="nav-link  bg-hj active"
              onClick={(e) => handleClick("home", e)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="rgb(235, 182, 75)"
                className="bi bi-house-door-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"
                />
              </svg>
            </div>
            <div
              className="nav-link "
              onClick={(e) => handleClick("explore", e)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="rgb(235, 182, 75)"
                className="bi bi-compass-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15.5 8.516a7.5 7.5 0 1 1-9.462-7.24A1 1 0 0 1 7 0h2a1 1 0 0 1 .962 1.276 7.5 7.5 0 0 1 5.538 7.24m-3.61-3.905L6.94 7.439 4.11 12.39l4.95-2.828 2.828-4.95z"
                />
              </svg>
            </div>
            <div className="nav-link" onClick={(e) => handleClick("plus", e)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="rgb(235, 182, 75)"
                className="bi bi-plus-circle"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
                />
                <path
                  fillRule="evenodd"
                  d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
                />
              </svg>
            </div>

            <div
              className="nav-link"
              onClick={(e) => handleClick("projects", e)}
              id="projects"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="rgb(235, 182, 75)"
                className="bi bi-suitcase-lg-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M7 0a2 2 0 0 0-2 2H1.5A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14H2a.5.5 0 0 0 1 0h10a.5.5 0 0 0 1 0h.5a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2H11a2 2 0 0 0-2-2zM6 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1zM3 13V3h1v10zm9 0V3h1v10z"
                />
              </svg>
            </div>

            <div
              className="nav-link "
              onClick={(e) => handleClick("profile", e)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="rgb(235, 182, 75)"
                className="bi bi-person-circle"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
                />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                />
              </svg>
            </div>
          </ul>
        </div>
      </nav>
    </>
  );
}
export default BottomNav;
