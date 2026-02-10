import { StrictMode } from 'react'
import ReactDOM from "react-dom/client"
import router from "./system.tsx"
import { RouterProvider } from "react-router"

ReactDOM
  .createRoot(document.getElementById('root')!)
  .render(
    <StrictMode>
      <RouterProvider router={router}/>
    </StrictMode>
  )