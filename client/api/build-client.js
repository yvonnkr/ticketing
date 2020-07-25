import axios from "axios";

//pre-configure axios then return the axios instance --use it to make ajax calls
export const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // we are on the server
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    //we must be on the browser
    return axios.create({ baseURL: "/" });
  }
};
