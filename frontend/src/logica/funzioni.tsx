import Home from "../pagine/News/home";
import Notif from "../pagine/notification";
import Message from "../pagine/message";
import Profile from "../pagine/User/profile";
import Exp from "../pagine/Projects/explore";
import Plus from "../pagine/Projects/plus";
import My_proj from "../pagine/Projects/my_proj";
import React from "react";
import { baseUrl, root, rootTopBar } from "../main";
import MyComponent from "../components/dettagli_proj";
import Dettagli_prof from "../pagine/User/dettagli_prof";
import Cookies from "js-cookie";
import axios from "axios";
import TopBar from "../components/top-bar";

//creo la classe delle news
export class News {
  _id: string;
  project_id: string;
  project_name: string;
  title: string;
  description: string;
  author: string;
  publish_date: string;
  attachments: any[];
  likes: any[];
  comments: any[];
  author_id: string;

  constructor(
    _id: string,
    project_id: string,
    project_name: string,
    title: string,
    description: string,
    author: string,
    publish_date: string,
    attachments: any[],
    likes: any[],
    comments: any[],
    author_id: string
  ) {
    this._id = _id;
    this.project_id = project_id;
    this.project_name = project_name;
    this.title = title;
    this.description = description;
    this.author = author;
    this.publish_date = publish_date;
    this.attachments = attachments;
    this.likes = likes;
    this.comments = comments;
    this.author_id = author_id;
  }
}
//creo la classe utente
export class Utente {
  age: number;
  created: Date;
  email: string;
  name: string;
  password: string;
  phone: string;
  surname: string;
  username: string;
  supported_projects: number;

  __v: number;
  _id: string; //-1->non loggato 0->loggato 1->supporter 2->collaboratore 3->manager
  constructor(
    age: number,
    created: Date,
    email: string,
    name: string,
    password: string,
    phone: string,
    surname: string,
    username: string,
    __v: number,
    _id: string,
    supported_projects: number
  ) {
    this.age = age;
    this.created = created;
    this.email = email;
    this.name = name;
    this.password = password;
    this.phone = phone;
    this.surname = surname;
    this.username = username;
    this.__v = __v;
    this._id = _id;
    this.supported_projects = supported_projects;
  }
}

//creo la classe dei progetti
export class Project {
  _id: string;
  name: string;
  description: string;
  category: string;
  start_date: Date;
  end_date: Date;
  opensource: Boolean;
  constructor(
    _id: string,
    name: string,
    description: string,
    category: string,
    start_date: Date,
    end_date: Date,
    opensource: Boolean
  ) {
    this._id = _id;
    (this.name = name),
      (this.description = description),
      (this.category = category),
      (this.start_date = start_date),
      (this.end_date = end_date);
    this.opensource = opensource;
  }
}

//creo l'oggetto utente in cui verranno salvati i dati dell'utente loggato
export let utente = new Utente(0, new Date(), "", "", "", "", "", "", 0, "", 0);

export const lista_tuoi_progetti = [];

//funzione che gestisce i bottoni della barra in fondo
export const handleClick = (
  str: string,
  event: React.MouseEvent<HTMLDivElement>
) => {
  const clickedElement = event.currentTarget as HTMLDivElement;
  const allNavLinks = document.querySelectorAll(".nav-link");
  allNavLinks.forEach((link) => link.classList.remove("active"));
  clickedElement.classList.add("active");
  clickedElement.classList.add("bg-hj");

  rootTopBar.render(<TopBar />);
  if (str === "home") {
    const homeComponent = (
      <>
        <Home />
      </>
    );
    root.render(homeComponent);
  } else if (str === "notif") {
    const homeComponent = (
      <>
        <Notif comp={<Home />} />
      </>
    );
    root.render(homeComponent);
  } else if (str === "chat") {
    const homeComponent = (
      <>
        <Message comp={<Home />} />
      </>
    );
    root.render(homeComponent);
  } else if (str === "profile") {
    const homeComponent = (
      <>
        <Profile />
      </>
    );
    root.render(homeComponent);
  } else if (str === "explore") {
    const homeComponent = (
      <>
        <Exp />
      </>
    );
    root.render(homeComponent);
  } else if (str === "plus") {
    const homeComponent = (
      <>
        <Plus />
      </>
    );
    root.render(homeComponent);
  } else if (str === "projects") {
    const homeComponent = (
      <>
        <My_proj />
      </>
    );
    root.render(homeComponent);
  } else {
    history.pushState(null, "", "/");
    root.render(
      <div
        className="alert alert-danger d-flex align-items-center"
        role="alert"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
          viewBox="0 0 16 16"
          width="40"
          role="img"
          aria-label="Warning:"
        >
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        </svg>
        <div>Errore nel caricamento della pagina</div>
      </div>
    );
  }
};

//funzione che renderizza la componente visualizza_progetto
export const expand_proj = (id: string, comp: JSX.Element) => {
  root.render(
    <>
      <MyComponent parametroNumero={id} comp={comp} />
    </>
  );
};

//funzione che renderizza la componente visualizza_progetto
export const show_profile = (id: string, comp: JSX.Element) => {
  root.render(
    <>
      <Dettagli_prof id={id} comp={comp} />
    </>
  );
};

export const alert_butt = () => {
  document.getElementById("mess-text")!.innerHTML =
    "Funzione in fase di sviluppo";
  document.getElementById("toast")!.classList.remove("text-bg-danger");
  document.getElementById("toast")!.classList.add("text-bg-secondary");
  document.getElementById("toast")!.classList.add("show");
};

export const eliminaProgetto = (id: string) => {
  const fetchData = async () => {
    try {
      var data = { project_id: id };
      var header = { token: Cookies.get("authToken") };
      const response = await axios.delete(baseUrl + "delete_project", {
        data: data,
        headers: header,
      });
      root.render(<My_proj />);
    } catch (error: any) {
      document.getElementById("mess-text")!.innerHTML =
        "Errore durante l'eliminazione del progetto";
      document.getElementById("toast")!.classList.remove("text-bg-secondary");
      document.getElementById("toast")!.classList.add("text-bg-danger");
      document.getElementById("toast")!.classList.add("show");
    }
  };
  var x = window.confirm("Sei sicuro di voler eliminare il progetto?");
  if (x) {
    fetchData();
  }
};
