import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Person from "./components/Person.jsx";

function App() {
  return (
    <>
      <Header header={"hrApp"} />
      <div class="people-row">
        <Person
          id={"person1"}
          name={"Nimi: Matti Meikäläinen"}
          title={"Tehtävä: Ohjelmistokehittäjä"}
          salary={"Palkka: 3400 € / kk"}
          phone={"Puh. 040-1234567"}
          email={"Sähköposti: matti.meikalainen@ohjelmisto.fi"}
          animal={"Lemmikki: Koira"}
        />
        <Person
          id={"person2"}
          name={"Nimi: Katja Korhonen"}
          title={"Tehtävä: UI/UX-suunnittelija"}
          salary={"Palkka: 3400 € / kk"}
          phone={"Puh. 050-7654321"}
          email={"Sähköposti: katja.korhonen@ohjelmisto.fi"}
          animal={"Lemmikki: Kissa"}
        />
        <Person
          id={"person3"}
          name={"Nimi: Elias Virtanen"}
          title={"Tehtävä: DevOps-insinööri"}
          salary={"Palkka: 4500 € / kk"}
          phone={"Puh. 045-9876543"}
          email={"Sähköposti: elias.virtanen@ohjelmisto.fi"}
          animal={"Lemmikki: Papukaija"}
        />
      </div>
      <Footer footer={"© Alessio Zanasi WPK25K All rights reserved"} />
    </>
  );
}

export default App;
