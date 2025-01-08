import Cookies from "js-cookie";
import axios from "axios";
import BaseUrl from "./baseUrl";

const authToken = Cookies.get("authToken");

const AxiosInstance = axios.create({
    baseURL: BaseUrl,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
    },
});

export default AxiosInstance;