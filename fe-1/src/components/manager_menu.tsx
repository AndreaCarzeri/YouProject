import { proj } from "./dettagli_proj";
import { alert_butt, eliminaProgetto } from "../logica/funzioni";
import { render } from "react-dom";
import { root } from "../main";

interface ManagerButtonProps {
  proj: proj;
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
function ManagerButton({ proj }: ManagerButtonProps) {
  return (
    <>
      <a
        className="btn bg-color-mod white btn-mod-2 d-flex justify-content-center"
        href="#"
        role="button"
        onClick={alert_butt}
      >
        <b>Modifica Progetto</b>
      </a>

      <a
        className="btn bg-color-mod white btn-mod-2 d-flex justify-content-center"
        role="button"
        onClick={gigi}
      >
        <b>Richieste di partecipazione</b>
      </a>

      <a
        className="btn btn-danger white btn-mod-2 d-flex justify-content-center"
        href="#"
        role="button"
        onClick={() => eliminaProgetto(proj._id)}
      >
        <b>Elimina progetto</b>
      </a>
    </>
  );
}
export default ManagerButton;
