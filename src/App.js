import Calculator from "./Calculator";

function App() {
  return (
    <div className="App">
      <nav className="main-nav">
        <div className="main-nav__logo">
          <a href="https://projectx.financial/" aria-current="page">
            <img src="https://projectx.financial/img/logo/projectx-logo-3-letters-onblack.png" alt="logo" />
          </a>
        </div>
      </nav>

      <main className="main-content">
        <Calculator></Calculator>
      </main>
    </div>
  );
}

export default App;
