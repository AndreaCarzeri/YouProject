import { useState } from "react";
import { root } from "../../main";
import Profile from "./profile";
import { utente } from "../../logica/funzioni";
import axios from "axios";
import Cookies from "js-cookie";
import { baseUrl } from "../../main";
import { closeC } from "./create_profile";
const apiUrl = "update_user";

function Update_profile() {
  history.pushState({ page: "update_profile" }, "", "/updateProfile");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(utente.username);
  const [email, setEmail] = useState(utente.email);
  const [age, setAge] = useState(utente.age);
  const [phone, setPhone] = useState(utente.phone);
  const [name, setName] = useState(utente.name);
  const [surname, setSurname] = useState(utente.surname);
  const update_prof = () => {
    const fetchData = async () => {
      try {
        let pswNuova = password;
        if (password === "") {
          pswNuova = utente.password;
        }
        if (
          username === "" ||
          pswNuova === "" ||
          email === "" ||
          age === null ||
          phone === "" ||
          name === "" ||
          surname === ""
        ) {
          throw {
            response: {
              data: { message: "Compila il campo che hai cancellato" },
            },
          };
        }
        if (age < 12 || age > 120) {
          throw { response: { data: { message: "Età non valida" } } };
        }
        if (phone.length < 10 || phone.length > 13) {
          throw {
            response: { data: { message: "Numero di telefono non valido" } },
          };
        }
        const response = await axios.post(
          baseUrl + apiUrl,
          {
            id: utente._id,
            username: username,
            name: name,
            surname: surname,
            email: email,
            phone: phone,
            age: age,
            password: pswNuova,
          },
          { headers: { token: Cookies.get("authToken") } }
        );

        if (response.data.message === "User Updated Successfully") {
          utente.username = username;
          utente.name = name;
          utente.surname = surname;
          utente.email = email;
          utente.phone = phone;
          utente.age = age;
          utente.password = pswNuova;

          document.getElementById("mess-text")!.innerHTML =
            "Dati aggiornati con successo";
          document.getElementById("toast")!.classList.remove("text-bg-danger");
          document.getElementById("toast")!.classList.add("text-bg-success");
          document.getElementById("toast")!.classList.add("show");
          setTimeout(() => {
            root.render(<Profile />);
          }, 500);
        }
      } catch (error: any) {
        if (
          error.response.data.message === "password is not valid" ||
          error.response.data.message ===
            "Compila il campo che hai cancellato" ||
          error.response.data.message === "Età non valida" ||
          error.response.data.message === "Numero di telefono non valido"
        )
          document.getElementById("mess-text")!.innerHTML =
            error.response.data.message;
        else
          document.getElementById("mess-text")!.innerHTML =
            "Qualcosa è andato storto";
        document.getElementById("toast")!.classList.add("show");
      }
    };
    fetchData();
  };
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
        onClick={() => root.render(<Profile />)}
      ></button>
      <div className="jj">
        <div className="row g-3 jj">
          <div className="col-md-6 ">
            <label htmlFor="inputName" className="form-label">
              Nome
            </label>
            <input
              type="text"
              className="form-control"
              id="inputName"
              defaultValue={utente.name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="inputSurname" className="form-label">
              Cognome
            </label>
            <input
              type="text"
              className="form-control"
              id="inputSurname"
              defaultValue={utente.surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
          <div className="col-md-6 ">
            <label htmlFor="inputUsername" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="inputUsername"
              defaultValue={utente.username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="inputPhone" className="form-label">
              Telefono
            </label>
            <input
              type="text"
              className="form-control"
              id="inputPhone"
              defaultValue={utente.phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputPassword" className="form-label">
              Nuova password
            </label>
            <input
              type="password"
              className="form-control"
              id="inputPassword"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="inputEmail"
              defaultValue={utente.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="inputAge" className="form-label">
              Età
            </label>
            <input
              type="number"
              className="form-control"
              id="inputAge"
              defaultValue={utente.age}
              onChange={(e) => setAge(Number(e.target.value))}
            />
          </div>
          <div className="col-12 d-flex justify-content-center">
            <button
              className="btn bg-color-mod white "
              onClick={() => update_prof()}
            >
              Modifica
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Update_profile;
