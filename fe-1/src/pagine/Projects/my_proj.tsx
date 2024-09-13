import axios from "axios";
import { useState, useEffect } from "react";
import { Project, expand_proj, utente } from "../../logica/funzioni";
import Cookies from "js-cookie";
import { reload } from "../User/login";
import { baseUrl, baseUrlImg } from "../../main";
import { set } from "mongoose";
import { proj } from "../../components/dettagli_proj";
import { closeC } from "../User/create_profile";
const apiUrl = "get_proj_created";

function My_proj() {
  history.pushState({ page: "projects" }, "", "/my_proj");
  const [lista_tuoi_progetti, setProjects] = useState<proj[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Funzione asincrona per ottenere i dati e aggiornare lo stato
    const fetchData = async () => {
      try {
        const response = await axios.post(
          baseUrl + apiUrl,
          {
            user_id: utente._id,
          },
          {
            headers: {
              token: Cookies.get("authToken"),
            },
          }
        );

        setLoading(false);
        setProjects(response.data);
      } catch (error: any) {
        setLoading(false);
        if (Cookies.get("authToken")) {
          document.getElementById("mess-text")!.innerHTML =
            "Errore durante il recupero dei progetti";
          document.getElementById("toast")!.classList.add("show");
          document.getElementById("messaggioVuoto")!.innerHTML =
            "Errore nel recupero delle informazioni dei progetti<br>Error code: 500";
        }
      }
    };

    // Chiamata alla funzione asincrona
    fetchData();
  }, []);
  return (
    <>
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
          {loading ? (
            <div className="text-center" style={{ marginTop: 80 }}>
              <div className="spinner-border color-mod" role="status">
                <span className="visually-hidden">Caricamento...</span>
              </div>
            </div>
          ) : (
            <>
              {lista_tuoi_progetti.length === 0 ? (
                <p
                  style={{ textAlign: "center", paddingTop: 15 }}
                  id="messaggioVuoto"
                >
                  Qui puoi vedere i progetti che hai creato!
                  <br />
                  Crea un nuovo progetto per iniziare!
                </p>
              ) : (
                <></>
              )}
              <div
                className="row row-cols-1 row-cols-md-2 g-4 jj"
                style={{ paddingTop: 5 }}
              >
                {lista_tuoi_progetti.map((item) => (
                  <div className="col" key={item._id}>
                    <div
                      className="card mb-3 h-100"
                      onClick={() => expand_proj(item._id, <My_proj />)}
                    >
                      {item.images.length > 0 ? (
                        <img
                          src={baseUrlImg + item.images[0]}
                          className="card-img-top"
                          alt=""
                        />
                      ) : (
                        <></>
                      )}
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
                        <p className="news-text">
                          <small
                            className="text-body-secondary"
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
            </>
          )}
        </>
      )}
    </>
  );
}
export default My_proj;
