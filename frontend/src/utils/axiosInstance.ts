import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../components/Authorization/Authorization";


const instance = axios.create({
    baseURL: 'http://localhost:8000/',
  });

export { instance }