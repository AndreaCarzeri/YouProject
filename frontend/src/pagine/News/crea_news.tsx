import React, { useState } from "react";
import { utente } from "../../logica/funzioni";
import Cookies from "js-cookie";
import axios from "axios";
import { baseUrl, root } from "../../main";
import { closeC } from "../User/create_profile";
const apiUrl = "add_news";
const apiUrl2 = "add_file_news";
interface CreaNewsProps {
  inputString: string;
  comp: JSX.Element;
}
let n = 0;
let files: any;
const handleFileChange = (e: any) => {
  files = e.target.files;
  n = e.target.files.length;
};

const Crea_news: React.FC<CreaNewsProps> = ({ inputString, comp }) => {
  history.pushState({ page: "crea_news" }, "", "/createNews");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const crea_news = () => {
    async function fetchData() {
      try {
        if (title === "" || description === "") {
          throw { message: "Compila tutti i campi obbligatori" };
        }
        const response = await axios.post(
          baseUrl + apiUrl,
          {
            description: description,
            title: title,
            publish_date: new Date(),
            project_id: inputString,
            author: utente.username,
          },
          {
            headers: {
              token: Cookies.get("authToken"),
            },
          }
        );
        if (response.data.message === "News added successfully") {
          async function uploadFiles() {
            try {
              for (let i = 0; i < n; i++) {
                const formData = new FormData();
                formData.append(`attachment`, files[i]);
                formData.append("news_id", response.data.news_id);

                const response2 = await axios.post(
                  baseUrl + apiUrl2,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      token: Cookies.get("authToken"),
                    },
                  }
                );
              }
            } catch (error: any) {
              document.getElementById("mess-text")!.innerHTML =
                "Errore nel caricamento dei file";
              document.getElementById("toast")!.classList.add("show");
            }
          }
          uploadFiles();
        }

        root.render(comp);
      } catch (error: any) {
        if (error.message === "Compila tutti i campi obbligatori") {
          document.getElementById("mess-text")!.innerHTML = error.message;
        }
        document.getElementById("toast")!.innerHTML =
          "Qualcosa è andato storto";
        document.getElementById("toast")!.classList.add("show");
      }
    }
    fetchData();
  };

  return (
    <>
      <button
        type="button"
        className="btn-close p-10"
        aria-label="Close"
        onClick={() => root.render(comp)}
      ></button>
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
      <div className="row g-3 jj" style={{ paddingTop: 15 }}>
        <label htmlFor="nomeProgetto" className="form-label">
          Titolo
        </label>
        <input
          type="text"
          id="nomeProgetto"
          className="form-control"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label htmlFor="descrizione" className="form-label">
          Descrizione
        </label>
        <textarea
          id="descrizione"
          rows={3}
          className="form-control"
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="col-12">
          <label htmlFor="inputFile" className="form-label">
            Seleziona le immagini da caricare (non obbligatorio)
          </label>
          <input
            type="file"
            className="form-control"
            id="inputFile"
            onChange={handleFileChange}
            multiple
          />
        </div>
        <div className="col-12 justify-content-center d-flex">
          <button className="btn bg-color-mod white " onClick={crea_news}>
            Crea news
          </button>{" "}
        </div>
      </div>
    </>
  );
};

export default Crea_news;
