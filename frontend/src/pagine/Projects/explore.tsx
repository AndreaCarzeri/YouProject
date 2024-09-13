import { useEffect, useState } from "react";
import {
  alert_butt,
  expand_proj,
  Project,
  utente,
} from "../../logica/funzioni";
import TopBar from "../../components/top-bar";
import axios from "axios";
import Cookies from "js-cookie";
import { baseUrl, baseUrlImg } from "../../main";
import { proj } from "../../components/dettagli_proj";
import { closeC } from "../User/create_profile";
import { get } from "mongoose";
let apiUrl1 = "explore_projects";
const apiUrl2 = "get_proj_by_name";

function Exp() {
  history.pushState({ page: "explore" }, "", "/explore");
  const [projectList, setProjectList] = useState<proj[]>([]);
  const [ricerca, setRicerca] = useState("");
  const [loading, setLoading] = useState(true);
  const getDati = () => {
    setProjectList([]);
    const fetchData = async () => {
      if (Cookies.get("authToken") === undefined) {
        apiUrl1 = "get_all_projects";
        try {
          const response = await axios.get(baseUrl + apiUrl1);
          setProjectList(response.data);
          setLoading(false);
        } catch (error: any) {
          setLoading(false);
          document.getElementById("mess-text")!.innerHTML =
            "Errore durante il recupero dei dati";
          document.getElementById("toast")!.classList.add("show");
        }
      } else {
        apiUrl1 = "explore_projects";
        try {
          const response = await axios.post(
            baseUrl + apiUrl1,
            {
              user_id: utente._id,
            },
            {
              headers: {
                token: Cookies.get("authToken"),
              },
            }
          );
          setProjectList(response.data);
          setLoading(false);
        } catch (error: any) {
          document.getElementById("mess-text")!.innerHTML =
            "Qualcosa è andato storto";
          document.getElementById("toast")!.classList.add("show");
          setLoading(false);
        }
      }
    };
    fetchData();
  };

  const search = () => {
    setLoading(true);
    setProjectList([]);
    const fetchData = async () => {
      try {
        if (ricerca === "") {
          throw { message: "dixi" };
        }
        const response = await axios.post(
          baseUrl + apiUrl2,
          {
            project_name: ricerca,
            //manager: ricerca,
          },
          {
            headers: {
              token: Cookies.get("authToken"),
            },
          }
        );
        setProjectList(response.data);
        setLoading(false);
      } catch (error: any) {
        if (error.message === "dixi") {
          getDati();
        } else {
          document.getElementById("mess-text")!.innerHTML =
            "Qualcosa è andato storto nella ricerca";
          document.getElementById("toast")!.classList.add("show");
          setLoading(false);
        }
      }
    };
    fetchData();
  };
  useEffect(() => {
    getDati();
  }, []);

  return (
    <>
      <div
        className="toast position-fixed  start-50 translate-middle-x text-bg-danger"
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
      <div id="explore">
        <nav className="navbar bg-body-tertiary" style={{ height: 70 }}>
          <div className="container-fluid">
            <div className="d-flex w-100" role="search">
              <input
                className="form-control me-2"
                id="search-button"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={(e) => setRicerca(e.target.value)}
              />
              <button
                className="btn bg-color-mod white"
                style={{ marginRight: 5 }}
                onClick={() => search()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </button>
              <button className="btn bg-color-mod white" onClick={alert_butt}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-filter-right"
                  viewBox="0 0 16 16"
                >
                  <path d="M14 10.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0 0 1h11a.5.5 0 0 0 .5-.5" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {loading ? (
          <div className="text-center" style={{ marginTop: 80 }}>
            <div className="spinner-border color-mod" role="status">
              <span className="visually-hidden">Caricamento...</span>
            </div>
          </div>
        ) : (
          <>
            {projectList.length === 0 ? (
              <div className="text-center" style={{ marginTop: 30 }}>
                Nessun progetto trovato
              </div>
            ) : (
              <div
                className="row row-cols-1 row-cols-md-2 g-4 jj"
                style={{ paddingTop: 10 }}
              >
                {projectList.map((item) => (
                  <div className="col" key={item._id}>
                    <div
                      className="card mb-3 h-100"
                      onClick={() => expand_proj(item._id, <Exp />)}
                    >
                      <img
                        src={
                          item.images?.length > 0
                            ? baseUrlImg + item.images[0]
                            : ""
                        }
                        className="card-img-top"
                        alt=""
                      />
                      <div className="card-body">
                        <h5 className="card-title" style={{ fontSize: 25 }}>
                          {item.name}
                        </h5>
                        <p
                          className="news-text text-truncate"
                          style={{ fontSize: 20 }}
                        >
                          {item.description}
                        </p>
                        <p className="news-text sticky-bottom">
                          <small
                            className="text-body-secondary "
                            style={{ fontSize: 15 }}
                          >
                            {item.category}
                          </small>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
export default Exp;
