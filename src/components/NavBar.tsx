import * as React from "react";

function NavBar() {
  return (
    <div className="navbar-container">
      <div className="navbar-content">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand" href="/Dashboard">
              runit
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    aria-current="page"
                    href="/Dashboard"
                  >
                    Dashboard
                  </a>
                </li>
              </ul>
            </div>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    aria-current="page"
                    href="/Analysis"
                  >
                    Analysis
                  </a>
                </li>
              </ul>
            </div>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    aria-current="page"
                    href="/Predictor"
                  >
                    Predictor
                  </a>
                </li>
              </ul>
            </div>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    aria-current="page"
                    href="/Resources"
                  >
                    Resources
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default NavBar;
