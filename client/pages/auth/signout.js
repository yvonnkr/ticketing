import { useEffect } from "react";
import Router from "next/router";
import { useRequest } from "../../hooks/use-request";

const SignoutPage = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Logging out .....</div>;
};

export default SignoutPage;
