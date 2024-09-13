import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  News,
  Project,
  expand_proj,
  handleClick,
  show_profile,
  utente,
} from "../../logica/funzioni";
import Profile from "../User/profile";
import { reload } from "../User/login";
import Cookies from "js-cookie";
import { set } from "mongoose";
import { baseUrl, baseUrlImg, rootTopBar } from "../../main";
import TopBar2 from "../../components/top-bar2";
import { closeC } from "../User/create_profile";
let apiUrl = "get_news_followed";
let apiUrl1 = "add_or_remove_like";
let apiUrl2 = "add_comment_news";
const pathD1 =
  "m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.920 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15";
const pathD2 =
  "M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314";

//lista news dei progetti che segui

function copLink() {
  const c = document.getElementById("link-cop");
  c!.classList.remove("d-none");
  const linkText =
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley";

  // Crea un elemento di testo nascosto
  const hiddenElement = document.createElement("textarea");
  hiddenElement.value = linkText;
  hiddenElement.style.position = "absolute";
  hiddenElement.style.left = "-9999px";

  // Aggiungi l'elemento al DOM
  document.body.appendChild(hiddenElement);

  // Seleziona il testo
  hiddenElement.select();
  document.execCommand("copy");
  setTimeout(() => {
    c!.classList.add("d-none");
  }, 1000);
  // Rimuovi l'elemento di testo dal DOM
  document.body.removeChild(hiddenElement);
}

function gigi() {
  const element = document.getElementById("offcanvasBottom");

  if (element) {
    if (element.classList.contains("show")) {
      element.classList.remove("show");
    } else {
      element.classList.add("show");
    }
  }
}
function Home() {
  history.pushState({ page: "home" }, "", "front-end/home");
  rootTopBar.render(<TopBar2 />);
  const [loading, setLoading] = useState(true);
  const [t, setT] = useState<News[]>([]);
  const [comment, setComment] = useState<string>("");
  function submit_comment(item: News) {
    let fetchData = async () => {
      try {
        const response1 = await axios.post(
          baseUrl + apiUrl2,
          {
            news_id: item._id,
            username: utente.username,
            comment: comment,
          },
          {
            headers: {
              Token: Cookies.get("authToken"),
            },
          }
        );
        setComment("");
        reload_news();
      } catch (error) {
        document.getElementById("mess-text")!.innerHTML =
          "Qualcosa è andato storto";
        document.getElementById("toast")!.classList.add("show");
      }
    };
    fetchData();
    setComment("");
  }

  function add_like(item: News, e: string) {
    const pathElement = document.getElementById(e);
    const pathElement2 = document.getElementById(e + "like");

    let fetchData = async () => {
      try {
        const response1 = await axios.post(
          baseUrl + apiUrl1,
          {
            news_id: item._id,
            username: utente.username,
          },
          {
            headers: {
              Token: Cookies.get("authToken"),
            },
          }
        );

        if (pathElement) {
          if (response1.data.message === "Like removed successfully") {
            pathElement.setAttribute(
              "d",
              "m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"
            );
            pathElement2!.innerHTML = (
              Number(pathElement2!.innerHTML) - 1
            ).toString();
          } else {
            pathElement.setAttribute(
              "d",
              "M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
            );
            pathElement2!.innerHTML = (
              Number(pathElement2!.innerHTML) + 1
            ).toString();
          }
        }
      } catch (error) {
        document.getElementById("mess-text")!.innerHTML =
          "Qualcosa è andato storto";
        document.getElementById("toast")!.classList.add("show");
      }
    };
    fetchData();
  }

  function reload_news() {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          baseUrl + apiUrl,
          { user_id: utente._id },
          {
            headers: {
              Token: Cookies.get("authToken"),
            },
          }
        );
        setT(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        document.getElementById("mess-text")!.innerHTML =
          "Qualcosa è andato storto nel recupero delle news";
        document.getElementById("toast")!.classList.add("show");
      }
    };

    fetchData();
  }

  useEffect(() => {
    reload_news();
  }, []);

  return (
    <>
      <div
        className="alert alert-success d-none position-fixed "
        style={{ zIndex: 1000, margin: "auto", left: 10, top: 70 }}
        id="link-cop"
        role="alert"
      >
        Link copiato negli appunti
      </div>
      {reload() ? (
        <div className="jj" style={{ paddingTop: 30 }}>
          <div>
            Per visualizzare la pagina devi prima accedere o registrati presso
            la pagina profilo!
          </div>
        </div>
      ) : (
        <>
          <div
            className="toast position-fixed  start-50 translate-middle-x text-bg-danger "
            aria-live="assertive"
            aria-atomic="true"
            id="toast"
            style={{ zIndex: 1010, top: 65 }}
          >
            <div className="d-flex">
              <div className="toast-body" id="mess-text">
                Errore
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={closeC}
              ></button>
            </div>
          </div>
          {loading ? (
            <div className="text-center" style={{ marginTop: 80 }}>
              <div className="spinner-border color-mod" role="status">
                <span className="visually-hidden">Caricamento...</span>
              </div>
            </div>
          ) : (
            <div className="body-home jj" style={{ paddingTop: 5 }}>
              {t.length === 0 ? (
                <p style={{ textAlign: "center", paddingTop: 15 }}>
                  Inziare a seguire dei progetti per visualizzare le news
                </p>
              ) : (
                <></>
              )}
              {t.map((item) => (
                <div className="card news" key={item._id}>
                  <div className="card-body">
                    <p className="news-title" style={{ fontSize: 25 }}>
                      <b>{item.title}</b>
                    </p>
                    <p
                      className="pro-tg"
                      style={{ fontSize: 13 }}
                      onClick={() => expand_proj(item.project_id, <Home />)}
                    >
                      @{item.project_name}
                    </p>
                    <p className="news-data">
                      {new Date(item.publish_date).toLocaleDateString("it-IT")}
                    </p>

                    <p className="news-text" style={{ fontSize: 20 }}>
                      {item.description}
                    </p>
                    <p
                      className="ut-tg"
                      style={{ fontSize: 13 }}
                      onClick={() => show_profile(item.author_id, <Home />)}
                    >
                      @{item.author}
                    </p>
                  </div>
                  <div
                    className={
                      item.attachments?.length === 0
                        ? ""
                        : "image-scroll-container"
                    }
                  >
                    {item.attachments?.map((x) => (
                      <img
                        src={baseUrlImg + x}
                        className="card-img-top k"
                        height="250px"
                        alt="..."
                        key={item.attachments.indexOf(x)}
                      />
                    ))}
                  </div>
                  <div className="interazioni">
                    <div className="interazioni-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="rgb(235, 182, 75)"
                        className="bi bi-heart"
                        viewBox="0 0 16 16"
                        onClick={() => add_like(item, item._id)}
                      >
                        <path
                          d={
                            item.likes.includes(utente.username)
                              ? pathD2
                              : pathD1
                          }
                          id={item._id}
                        />
                      </svg>
                      <p id={item._id + "like"}>{item.likes.length}</p>
                    </div>
                    <div className="interazioni-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="rgb(235, 182, 75)"
                        className="bi bi-chat"
                        viewBox="0 0 16 16"
                        onClick={gigi}
                      >
                        <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
                      </svg>
                      <p>{item.comments.length}</p>
                    </div>
                    <div className="interazioni-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="rgb(235, 182, 75)"
                        className="bi bi-share-fill"
                        viewBox="0 0 16 16"
                        onClick={() => copLink()}
                      >
                        <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5" />
                      </svg>
                    </div>
                  </div>
                  <div
                    className="offcanvas offcanvas-bottom"
                    tabIndex={-1}
                    id="offcanvasBottom"
                    aria-labelledby="offcanvasBottomLabel"
                    style={{ height: 400 }}
                  >
                    <div className="offcanvas-header">
                      <h5 className="offcanvas-title" id="offcanvasBottomLabel">
                        Commenti
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        onClick={gigi}
                      ></button>
                    </div>
                    <div className="offcanvas-body small">
                      <ul className="list-group list-group-flush">
                        {item.comments.map((x) => (
                          <li
                            className="list-group-item"
                            key={item.comments.indexOf(x)}
                          >
                            <b>{x.username}</b>
                            <br />
                            {x.comment}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="offcanvas-header sticky-bottom col-12">
                      <input
                        type="text"
                        className=" form-control"
                        id={item._id}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button
                        className="btn bg-color-mod white"
                        style={{ marginLeft: 3 }}
                        type="submit"
                        onClick={() => submit_comment(item)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          className="bi bi-send"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
export default Home;
