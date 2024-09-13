import React, { ReactNode } from "react";
import { root } from "../main";
import Cookies from "js-cookie";

type MessageProps = {
  comp: JSX.Element;
};

function Message({ comp }: MessageProps) {
  history.pushState({ page: "message" }, "", "/message");
  let l = [];

  return (
    <>
      <button
        type="button"
        className="btn-close p-10"
        aria-label="Close"
        onClick={() => {
          history.pushState({ page: "home" }, "", "/");
          root.render(comp);
        }}
      ></button>
      <div className="list-group jj">
        <h5 style={{ textAlign: "center" }}>
          <b>Messaggi:</b>{" "}
        </h5>
        {Cookies.get("authToken") ? (
          <p style={{ textAlign: "center" }}>
            Ehi! Qui non sembra esserci nessun messaggio
          </p>
        ) : (
          <p style={{ textAlign: "center" }}>
            Devi fare il login per visualizzare i tuoi messaggi
          </p>
        )}
      </div>
    </>
  );
}

export default Message;
