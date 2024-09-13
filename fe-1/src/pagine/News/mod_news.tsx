import { useEffect, useState } from "react";
import { baseUrl, baseUrlImg, root } from "../../main";
import { closeC } from "../User/create_profile";
import axios from "axios";
import Cookies from "js-cookie";
import { News, expand_proj, show_profile } from "../../logica/funzioni";
import Home from "./home";
import { set } from "mongoose";
const apiUrl = "get_news_by_proj";
const apiUrl2 = "delete_news";

function Mod_News({ comp, id }: { comp: JSX.Element; id: string }) {
  history.pushState({ page: "update_news" }, "", "/updateNews");
  const [t, setT] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  function deleteNews(item: News) {
    async function fetchData() {
      try {
        var data = { news_id: item._id };
        var header = { token: Cookies.get("authToken") };
        const response = await axios.delete(
          baseUrl + apiUrl2,

          {
            data: data,
            headers: header,
          }
        );

        if (response.data.message === "News Removed Successfully") {
          document.getElementById("mess-text")!.innerHTML = "News eliminata";
          document.getElementById("toast")!.classList.remove("text-bg-danger");
          document.getElementById("toast")!.classList.add("text-bg-success");
          document.getElementById("toast")!.classList.add("show");
          setTimeout(() => {
            root.render(comp);
          }, 500);
        }
      } catch (e) {
        document.getElementById("mess-text")!.innerHTML =
          "Errore durante l'eliminazione della news";
        document.getElementById("toast")!.classList.add("show");
      }
    }
    var x = window.confirm("Sei sicuro di voler eliminare la news?");
    if (x) {
      fetchData();
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          baseUrl + apiUrl,
          {
            project_id: id,
          },

          {
            headers: {
              token: Cookies.get("authToken"),
            },
          }
        );
        setT(response.data);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        document.getElementById("mess-text")!.innerHTML =
          "Errore durante il recupero delle news";
        document.getElementById("toast")!.classList.add("show");
      }
    };
    fetchData();
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
      <div>
        {loading ? (
          <div className="text-center" style={{ marginTop: 80 }}>
            <div className="spinner-border color-mod" role="status">
              <span className="visually-hidden">Caricamento...</span>
            </div>
          </div>
        ) : (
          <div className="jj">
            {t.length === 0 ? (
              <p style={{ textAlign: "center", paddingTop: 15 }}>
                Non ci sono news
              </p>
            ) : (
              <></>
            )}
            {t.map((item: News) => (
              <div className="card news" key={item._id}>
                <div className="card-body">
                  <p className="news-title" style={{ fontSize: 25 }}>
                    <b>{item.title}</b>
                  </p>
                  <p className="pro-tg" style={{ fontSize: 13 }}>
                    @{item.project_name}
                  </p>
                  <p className="news-data">
                    <button
                      className="btn bg-color-mod white "
                      style={{ marginRight: 3 }}
                      onClick={() => deleteNews(item)}
                    >
                      Elimina
                    </button>{" "}
                    {new Date(item.publish_date).toLocaleDateString("it-IT")}
                  </p>

                  <p className="news-text" style={{ fontSize: 20 }}>
                    {item.description}
                  </p>
                  <p className="ut-tg" style={{ fontSize: 13 }}>
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
                  {item.attachments?.map((x: any) => (
                    <img
                      src={baseUrlImg + x}
                      className="card-img-top k"
                      height="250px"
                      alt="..."
                      key={item.attachments.indexOf(x)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
export default Mod_News;
