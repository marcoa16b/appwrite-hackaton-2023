'use client'
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Home() {
  const { user, login, logout } = useContext(AuthContext); 

  return (
    <main className="mt-20 bg-gray-900">
      <p>Pagina de inicio</p>
      
    </main>
  )
}
