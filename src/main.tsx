import { StrictMode } from 'react'
import ReactDOM from "react-dom/client"
import router from "./system.tsx"
import { RouterProvider } from "react-router"
import { Amplify } from "aws-amplify";
// import amplifyOutputs from "../amplify_outputs.json";
// 
// Amplify.configure(amplifyOutputs);

ReactDOM
  .createRoot(document.getElementById('root')!)
  .render(
    <StrictMode>
      <RouterProvider router={router}/>
    </StrictMode>
  )