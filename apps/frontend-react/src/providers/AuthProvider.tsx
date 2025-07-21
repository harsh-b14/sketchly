import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "../redux/store";
import type { AppDispatch } from "../redux/store";
import axios from "axios";
import { restoreToken } from "../redux/authSlice";

function TokenInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(restoreToken(token));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [dispatch]);

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <TokenInitializer />
      {children}
    </Provider>
  );
}
