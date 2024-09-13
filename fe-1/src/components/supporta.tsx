import React from "react";
import { proj } from "./dettagli_proj";
import { baseUrl, root } from "../main";
import Cookies from "js-cookie";
import axios from "axios";
import { utente } from "../logica/funzioni";
import { closeC } from "../pagine/User/create_profile";
export default function Supporta({
  proj,
  comp,
}: {
  proj: proj;
  comp: JSX.Element;
}) {
  const [qt, setQt] = React.useState(0);
  const [pag, setPag] = React.useState("Paypal");
  const [paypalEmail, setPaypalEmail] = React.useState("");
  function controlQt(e: any) {
    setQt(e);
    if (e < 10) {
      document.getElementById("inputQt")?.classList.add("is-invalid");
      document
        .getElementById("validationServerUsernameFeedback")
        ?.classList.add("show");
    } else {
      document.getElementById("inputQt")?.classList.remove("is-invalid");
      document
        .getElementById("validationServerUsernameFeedback")
        ?.classList.remove("show");
    }
  }
  function funzione(str: string) {
    if (str === "pagamento") {
      if (qt >= 10) {
        document.getElementById("pagamento")?.classList.remove("active");
        document.getElementById("conferma")?.classList.add("active");
        if (paypalEmail === "") {
          document.getElementById("inputEmail")?.classList.add("is-invalid");
          document.getElementById("conferma")?.classList.remove("active");
          document.getElementById("pagamento")?.classList.add("active");
        }
      } else {
        document.getElementById("inputQt")?.classList.add("is-invalid");
      }
    } else {
      document.getElementById("conferma")?.classList.remove("active");
      document.getElementById("pagamento")?.classList.add("active");
    }
  }
  function supp() {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          baseUrl + "add_support_proj",
          {
            user_id: utente._id,
            project_id: proj._id,
          },
          {
            headers: {
              token: Cookies.get("authToken"),
            },
          }
        );

        if (
          response.data.message ===
          "The user support a new project Successfully"
        ) {
          const userDataString = localStorage.getItem("user");

          if (userDataString) {
            // Converti la stringa JSON in un oggetto JavaScript
            const userData = JSON.parse(userDataString);
            userData.supported_projects += 1; // Sostituisci 1 con il nuovo valore desiderato

            // Aggiorna i dati utente nel localStorage
            localStorage.setItem("user", JSON.stringify(userData));
          }
        }
        alert("Pagamento inviato");
        root.render(comp);
      } catch (error) {
        document.getElementById("mess-text")!.innerHTML =
          "Non è possibile effettuare il pagamento verso questo progetto. Riprova più tardi.";
        document.getElementById("toast")!.classList.add("show");
      }
    };
    fetchData();
  }
  return (
    <>
      <button
        type="button"
        className="btn-close p-10"
        aria-label="Close"
        onClick={() => root.render(comp)}
      ></button>
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
      <div className="jj" style={{ paddingTop: 15 }}>
        <h2 className=" btn bg-color-mod white d-flex justify-content-center">
          <b>Supporta il progetto</b>
        </h2>
        <div id="carouselExample" className="carousel slide">
          <div className="carousel-inner">
            <div className="carousel-item active" id="pagamento">
              <div className="row g-3 " style={{ paddingTop: 15 }}>
                <div className="col-md-6 ">
                  <label htmlFor="inputName" className="form-label">
                    Quantità da donare (minimo 10 euro):
                  </label>
                  <input
                    type="number"
                    className="form-control "
                    id="inputQt"
                    onChange={(e) => controlQt(Number(e.target.value))}
                    required
                  />
                  <div
                    id="validationServerUsernameFeedback"
                    className="invalid-feedback"
                  >
                    La quantità minima è di 10 euro
                  </div>
                </div>

                <div className="col-md-6 ">
                  <label htmlFor="inputUsername" className="form-label">
                    Metodo di pagamento:
                  </label>
                  <select
                    id="inputState"
                    className="form-select"
                    onChange={(e) => setPag(e.target.value)}
                    required
                  >
                    <option value={"Paypal"}>Paypal</option>
                  </select>
                </div>
                <div className="col-md-12 ">
                  <label htmlFor="inputEmail" className="form-label">
                    Indirizzo email PayPal:
                  </label>
                  <input
                    type="email"
                    className="form-control "
                    id="inputEmail"
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12 d-flex justify-content-center">
                  <button
                    className="btn bg-color-mod white "
                    onClick={() => funzione("pagamento")}
                  >
                    Procedi
                  </button>
                </div>
              </div>
            </div>
            <div className="carousel-item" id="conferma">
              <h2 style={{ textAlign: "center" }}>Riepilogo</h2>
              <div className="centro-piccolo">
                <p>importo: {qt} €</p>
                <p>metodo: {pag}</p>
                <p>email: {paypalEmail}</p>
                <p>progetto finanziato: {proj.name}</p>
                <p>
                  manager: {proj.user.name} {proj.user.surname}
                </p>
              </div>
              <div className="col-12 d-flex justify-content-center">
                <button
                  className="btn bg-color-mod white "
                  onClick={() => funzione("conferma")}
                  style={{ marginRight: 10 }}
                >
                  Indietro
                </button>
                <button
                  className="btn bg-color-mod white "
                  onClick={() => supp()}
                >
                  Conferma
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
