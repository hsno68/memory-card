export default function Card({ name, src, onClick }) {
  const pokemonName = name[0].toUpperCase() + name.slice(1);

  return (
    <button type="button" className="card" onClick={onClick}>
      {src ? <img src={src} alt={pokemonName} /> : "Loading..."}
      <h2>{pokemonName}</h2>
    </button>
  );
}
