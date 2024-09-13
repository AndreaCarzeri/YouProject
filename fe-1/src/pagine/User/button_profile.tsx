import axios from "axios";
import Cookies from "js-cookie";
import { alert_butt, utente } from "../../logica/funzioni";
import { baseUrl, root } from "../../main";
import { handleLogOut } from "./profile";
import Update_profile from "./update_profile";
import Login from "./login";
let apiUrl = "remove_user";
const handleDelete = () => {
  const fetchData = async () => {
    try {
      var data = { id: utente._id };
      var header = { token: Cookies.get("authToken") };
      const response = await axios.delete(
        baseUrl + apiUrl,

        {
          data: data,
          headers: header,
        }
      );
      document.getElementById("mess-text")!.innerHTML =
        "Account eliminato con successo";
      document.getElementById("toast")!.classList.remove("text-bg-danger");
      document.getElementById("toast")!.classList.add("text-bg-success");
      document.getElementById("toast")!.classList.add("show");
      setTimeout(() => {
        handleLogOut();
      }, 500);
    } catch (error: any) {
      document.getElementById("mess-text")!.innerHTML =
        "Qualcosa è andato storto";
      document.getElementById("toast")!.classList.add("show");
    }
  };
  fetchData();
};
function f_prompt() {
  var x = window.confirm("Sei sicuro di voler eliminare l'account?");
  if (x) {
    handleDelete();
  }
}
function Button_prof() {
  return (
    <div className="ls-bt" style={{ paddingBottom: 70 }}>
      <div className="d-grid gap-3 ">
        <a
          className="btn bg-color-mod white btn-mod-2 d-flex justify-content-between"
          href="#"
          role="button"
          onClick={() => root.render(<Update_profile />)}
        >
          <p></p>
          <b>Modifica Profilo</b>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-pencil-fill"
            viewBox="0 0 16 16"
          >
            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
          </svg>
        </a>

        <a
          className="btn bg-color-mod white btn-mod-2 d-flex justify-content-between"
          href="#"
          role="button"
          onClick={alert_butt}
        >
          <p></p>
          <b>Modifica Preferenze</b>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-bell-fill"
            viewBox="0 0 16 16"
          >
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
          </svg>
        </a>

        <a
          className="btn bg-color-mod white btn-mod-2 d-flex justify-content-between"
          href="#"
          role="button"
          onClick={() => handleLogOut()}
        >
          <p></p>
          <b>Logout</b>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-box-arrow-right"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
            />
            <path
              fillRule="evenodd"
              d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
            />
          </svg>
        </a>
        <a
          className="btn btn-danger white btn-mod-2 d-flex justify-content-between"
          href="#"
          role="button"
          onClick={() => f_prompt()}
        >
          <p></p>
          <b>Elimina Profilo</b>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-trash3-fill"
            viewBox="0 0 16 16"
          >
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
          </svg>
        </a>
      </div>
    </div>
  );
}
export default Button_prof;
