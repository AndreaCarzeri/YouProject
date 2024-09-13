import Cookies from "js-cookie";
import { alert_butt, show_profile } from "../logica/funzioni";
import { baseUrl, baseUrlImg, root } from "../main";
import Crea_news from "../pagine/News/crea_news";
import MyComponent, { proj, user } from "./dettagli_proj";
import Manager_button from "./manager_menu";
import FollowButton from "./follow_butt";
import ManagerButton from "./manager_menu";
import Supporta from "./supporta";
import { useEffect } from "react";
import axios from "axios";
import { closeC } from "../pagine/User/create_profile";
import Mod_News from "../pagine/News/mod_news";
interface CompInt {
  livello: number;
  comp: JSX.Element;
  project: proj;
  collaboratori: user[];
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
function gigi2() {
  const element = document.getElementById("offcanvasBottom2");

  if (element) {
    if (element.classList.contains("show")) {
      element.classList.remove("show");
    } else {
      element.classList.add("show");
    }
  }
}
function tony() {
  const element = document.getElementById("offcanvasBottom2");
  if (element) {
    element.classList.remove("show");
  }
  document.getElementById("mess-text")!.innerHTML = "Richiesta inviata";
  document.getElementById("toast")!.classList.remove("text-bg-danger");
  document.getElementById("toast")!.classList.add("text-bg-success");
  document.getElementById("toast")!.classList.add("show");
}

const Comp: React.FC<CompInt> = ({ comp, livello, project, collaboratori }) => {
  history.pushState({ page: "comp" }, "", "/progetto");
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
            Hello, world! This is a toast message.
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
      <button
        type="button"
        className="btn-close p-10"
        aria-label="Close"
        onClick={() => root.render(comp)}
      ></button>
      <div className="row row-cols-1 row-cols-md-1 g-4 jj">
        <div className="col">
          <div className=" mb-3 h-100">
            <div className="card-body">
              <h5 className="card-title" style={{ fontSize: 25 }}>
                {project.name}
              </h5>
              <div
                className="news-text"
                style={{ fontSize: 13, textAlign: "right" }}
              >
                {project.opensource ? "Open Source" : "Closed source"}
              </div>
              <p className="news-text" style={{ fontSize: 20 }}>
                {project.description}
              </p>
              <div
                className={
                  project.images.length === 0 ? "" : "image-scroll-container"
                }
                style={{ paddingTop: 15 }}
              >
                {project.images.map((x) => (
                  <img
                    src={baseUrlImg + x}
                    className="card-img-top k"
                    height="250px"
                    alt="..."
                    key={project.images.indexOf(x)}
                  />
                ))}
              </div>
              <p className="news-text" style={{ paddingTop: 10, fontSize: 18 }}>
                Data di inizio progetto:{" "}
                {new Date(project.start_date).toLocaleDateString("it-IT")}
              </p>
              {new Date(project.end_date) < new Date(project.start_date) ? (
                <></>
              ) : (
                <p
                  className="news-text"
                  style={{ paddingTop: 10, fontSize: 18 }}
                >
                  Data di fine progetto:{" "}
                  {new Date(project.end_date).toLocaleDateString("it-IT")}
                </p>
              )}

              <p
                className="news-text"
                onClick={() =>
                  show_profile(
                    project.user._id,
                    <MyComponent parametroNumero={project._id} comp={comp} />
                  )
                }
                style={{ fontSize: 16 }}
              >
                Creato da: @{project.user.username}
              </p>
              {!Cookies.get("authToken") ? (
                <>
                  Per supportare, collaborare e interagire con un progetto
                  accedi o registrati
                </>
              ) : (
                <>
                  {collaboratori?.length != 0 ? (
                    <div className="list-group ">
                      <p>Lista collaboratori:</p>
                      {collaboratori?.map((item) => (
                        <button
                          type="button"
                          className="list-group-item list-group-item-action "
                          aria-current="true"
                          style={{ fontSize: 20 }}
                          key={item._id}
                        >
                          {item.name} {item.surname}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <></>
                  )}

                  <div className="ls-bt" style={{ marginTop: 20 }}>
                    <div className="d-grid gap-3 ">
                      {livello < 1 ? ( //solo per utenti normali non collaboratori o manager
                        <>
                          <a
                            className="btn bg-color-mod white btn-mod-2 d-flex justify-content-center"
                            href="#"
                            role="button"
                            onClick={() =>
                              root.render(
                                <Supporta
                                  proj={project}
                                  comp={
                                    <Comp
                                      comp={comp}
                                      livello={livello}
                                      project={project}
                                      collaboratori={collaboratori}
                                    />
                                  }
                                />
                              )
                            }
                          >
                            <b>Supporta</b>
                          </a>
                          <a
                            className="btn bg-color-mod white btn-mod-2 d-flex justify-content-center"
                            href="#"
                            role="button"
                            onClick={gigi2}
                          >
                            <b>Collabora</b>
                          </a>
                          <FollowButton str={project._id}></FollowButton>
                        </>
                      ) : (
                        <></>
                      )}
                      {livello > 0 ? (
                        <>
                          <a
                            className="btn bg-color-mod white btn-mod-2 d-flex justify-content-center"
                            href="#"
                            role="button"
                            onClick={() =>
                              root.render(
                                <Crea_news
                                  inputString={project._id}
                                  comp={
                                    <MyComponent
                                      parametroNumero={project._id}
                                      comp={comp}
                                    />
                                  }
                                />
                              )
                            }
                          >
                            <b>Crea News</b>
                          </a>
                          <a
                            className="btn bg-color-mod white btn-mod-2 d-flex justify-content-center"
                            href="#"
                            role="button"
                            onClick={() =>
                              root.render(
                                <Mod_News
                                  comp={
                                    <Comp
                                      comp={comp}
                                      livello={livello}
                                      project={project}
                                      collaboratori={collaboratori}
                                    />
                                  }
                                  id={project._id}
                                />
                              )
                            }
                          >
                            <b>Modifica News</b>
                          </a>
                        </>
                      ) : (
                        <></>
                      )}
                      {livello === 2 ? (
                        <ManagerButton proj={project}></ManagerButton>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div
          className="offcanvas offcanvas-bottom"
          tabIndex={-1}
          id="offcanvasBottom"
          aria-labelledby="offcanvasBottomLabel"
          style={{ height: 300 }}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasBottomLabel">
              Richieste di collaborazione:
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              onClick={gigi}
            ></button>
          </div>
          <div className="offcanvas-body small" style={{ textAlign: "center" }}>
            Non ci sono richieste
          </div>
        </div>
        <div
          className="offcanvas offcanvas-bottom"
          tabIndex={-1}
          id="offcanvasBottom2"
          aria-labelledby="offcanvasBottomLabel"
          style={{ height: 400 }}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasBottomLabel">
              Richiedi di collaborare:
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              onClick={gigi2}
            ></button>
          </div>
          <div className="offcanvas-body ">
            <label htmlFor="inputDesc">Lettera motivazionale: </label>
            <textarea
              rows={4}
              className="form-control"
              id="inputDesc"
            ></textarea>
            <label htmlFor="inputFile" className="form-label">
              Seleziona il tuo curriculum
            </label>
            <input type="file" className="form-control" id="inputFile" />
            <div
              className="col-12 d-flex justify-content-center"
              style={{ marginTop: 15 }}
            >
              <button
                className="btn bg-color-mod white "
                onClick={() => tony()}
              >
                Invia
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Comp;
