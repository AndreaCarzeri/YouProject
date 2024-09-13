import { handleClick } from "../logica/funzioni";

function TopBar() {
  return (
    <>
      <nav className="navbar sticky-top bg-color-mod  ">
        <div className="container-fluid bg-color-mod d-flex justify-content-center align-items-center">
          <a className="navbar-brand " href="#">
            <h2 className="white">YouProject</h2>
          </a>
        </div>
      </nav>
    </>
  );
}
export default TopBar;
