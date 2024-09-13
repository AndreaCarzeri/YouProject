import { expand_proj } from "../../logica/funzioni";
import { baseUrl, baseUrlImg, root } from "../../main";
import { closeC } from "./create_profile";

interface DettProfInt {
  list: proj[];
  comp: JSX.Element;
}

interface proj {
  _id: string;
  name: string;
  description: string;
  category: string;
  start_date: Date;
  end_date: Date;
  opensource: boolean;
  images: string[];
}

const Proj_prof: React.FC<DettProfInt> = ({ list, comp }) => {
  history.pushState({ page: "proj_prof" }, "", "/listaProgetti");

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
      <button
        type="button"
        className="btn-close p-10"
        aria-label="Close"
        onClick={() => root.render(comp)}
      ></button>
      {list.length === 0 ? (
        <p style={{ textAlign: "center", paddingTop: 15 }}>
          Non ci sono progetti o riprova
        </p>
      ) : (
        <div
          className="row row-cols-1 row-cols-md-2 g-4 jj"
          style={{ paddingTop: 5 }}
        >
          {list.map((item) => (
            <div className="col" key={item._id}>
              <div
                className="card mb-3 h-100"
                onClick={() =>
                  expand_proj(item._id, <Proj_prof list={list} comp={comp} />)
                }
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
      )}
    </>
  );
};
export default Proj_prof;
