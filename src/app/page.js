'use client'
import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    window.location.replace("https://localstorage-window--aquamarine-mochi-2abaaf.netlify.app/login")
  },[])
  return (
    <div>
      <h1>Soy el home</h1>
    </div>
  )
} 
