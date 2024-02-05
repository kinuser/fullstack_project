import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../components/Authorization/Authorization";


const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
  });

export { instance }