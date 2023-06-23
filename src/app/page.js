'use client'
import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    window.location.replace("http://localhost:3000/login")
  },[])
  return (
    <div>
      <h1>Soy el home</h1>
    </div>
  )
}
