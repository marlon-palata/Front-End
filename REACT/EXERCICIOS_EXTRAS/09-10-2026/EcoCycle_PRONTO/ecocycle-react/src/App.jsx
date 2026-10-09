import { useState } from "react";
import Header from "./components/Header";
import Rodape from "./components/Rodape";
import CardMaterial from "./components/CardMaterial";
// T7: export nomeado é importado COM chaves e com o mesmo nome
import { materiais } from "./data/materiais";
import "./App.css";

function App() {
  const cidade = "Itu/SP";

  // T11: os totais moram no App, porque o Header mostra e o CardMaterial altera
  const [totalKg, setTotalKg] = useState(0);
  const [totalValor, setTotalValor] = useState(0);

  // T11: função que o card vai chamar
  function registrarColeta(kg, precoKg) {
    setTotalKg(totalKg + kg);
    setTotalValor(totalValor + kg * precoKg);
  }

  // T12: volta os dois totais para zero
  function limparColeta() {
    setTotalKg(0);
    setTotalValor(0);
  }

  return (
    <main className="app">
      <Header totalKg={totalKg} totalValor={totalValor} onLimpar={limparColeta} />
      <p className="subtitulo">Coleta seletiva em {cidade}</p>
      {/* T6: .length = quantos itens a lista tem */}
      <p className="contador">{materiais.length} materiais cadastrados</p>

      {/* T5: .map cria um CardMaterial para cada item da lista */}
      <section className="lista">
        {materiais.map((material) => (
          <CardMaterial
            key={material.id}
            nome={material.nome}
            lixeira={material.lixeira}
            precoKg={material.precoKg}
            perigoso={material.perigoso}
            dica={material.dica}
            onRegistrar={registrarColeta}
          />
        ))}
      </section>

      <Rodape />
    </main>
  );
}

export default App;
