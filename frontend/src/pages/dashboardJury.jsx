"use client";

import { useState } from "react";
import {Eye, X, Start, Filter} from "lucide-react";

export default function DashboardJury(){
    const [Films,setFilms] = useState([
    {
    id: 1,
    title: "Gourou",
    director: "Yann Gozlan",
    category: "Court métrage",
    status: "À évaluer",
    rating: null,
    comment: "",
    },
    {
    id: 2,
    title: "Le Mage Du Kremlin",
    director: "Olivier Assayas",
    category: "Documentaire",
    status: "Approuvé",
    rating: 6,
    comment: "Très belle réalisation.",
    },
    {
    id: 3,
    title: "L'affaire Bojarski",
    director: "Jean-Paul Salomé",
    category: "Long métrage",
    status: "Rejeté",
    rating: 4,
    comment: "Manque de rythme.",
    },
]);


    return();
}