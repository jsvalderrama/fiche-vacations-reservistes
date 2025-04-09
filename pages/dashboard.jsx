import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { generateFicheDocx } from "../utils/ficheGenerator";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mois, setMois] = useState("Avril");
  const [annee, setAnnee] = useState("2025");
  const [jours, setJours] = useState("");
  const [vacations, setVacations] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("reserviste"));
    if (!stored || stored.role !== "user") {
      router.push("/");
    } else {
      setUser(stored);
    }
  }, []);

  const handleGeneratePdf = () => {
    setMessage("Fiche PDF générée (simulation)");
  };

  const handleGenerateDocx = () => {
    if (!mois || !annee || !jours || !vacations) {
      setMessage("Tous les champs sont obligatoires.");
      return;
    }

    generateFicheDocx({
      nom: user.name,
      mois,
      annee,
      jours: jours.split(",").map(j => j.trim()),
      vacations
    });

    setMessage("Fiche DOCX générée !");
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Bienvenue, {user.name}</h1>
      <p className="mb-6">Générez votre fiche de vacations ci-dessous :</p>

      <div className="space-y-4">
        <div>
          <label>Mois :</label>
          <input type="text" value={mois} onChange={e => setMois(e.target.value)} className="w-full border p-2" />
        </div>
        <div>
          <label>Année :</label>
          <input type="text" value={annee} onChange={e => setAnnee(e.target.value)} className="w-full border p-2" />
        </div>
        <div>
          <label>Jours de vacation (ex: 05, 06, 10) :</label>
          <input type="text" value={jours} onChange={e => setJours(e.target.value)} className="w-full border p-2" />
        </div>
        <div>
          <label>Nombre de vacations :</label>
          <input type="number" value={vacations} onChange={e => setVacations(e.target.value)} className="w-full border p-2" />
        </div>
        <div className="flex gap-4 mt-4">
          <button onClick={handleGenerateDocx} className="bg-blue-600 text-white px-4 py-2 rounded">Générer .docx</button>
          <button onClick={handleGeneratePdf} className="bg-green-600 text-white px-4 py-2 rounded">Générer .pdf</button>
        </div>
        {message && <p className="text-sm text-blue-700 mt-4">{message}</p>}
      </div>
    </div>
  );
}