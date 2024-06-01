import { useEffect, useLayoutEffect, useState } from "react";
import { Menu } from "./components";
import { Routes, Route } from "react-router-dom";
import { Error, Forgot, Login, Main, Signup } from "./page";
import { useSelector } from "react-redux";
import ProtectedRoute from "./protected";
import Loading from "./components/loading/loading";

const App = () => {
  const [offline, setOffline] = useState(!window.navigator.onLine);

  const { loading, user } = useSelector((state) => state);



  // Dark & Light Mode
  useLayoutEffect(() => {
    localStorage.setItem("darkMode", true);
    document.body.className = "dark";
    let mode = localStorage.getItem("darkMode");
 //  localStorage.removeItem("darkMode");
     // document.body.className = "light";
    
  });

  // Offline
  useEffect(() => {
    window.addEventListener("online", (e) => {
      location.reload();
    });

    window.addEventListener("offline", (e) => {
      setOffline(true);
    });
  });

  return (
    <section className={user ? "main-grid" : null}>
      {user && (
        <div>
          <Menu />
        </div>
      )}

      {loading && <Loading />}

      {offline && (
        <Error
          status={503}
          content={"Website in offline check your network."}
        />
      )}

      <Routes>
        <Route element={<ProtectedRoute offline={offline} authed={true} />}>
          <Route exact path="/" element={<Main />} />
          <Route path="/chat" element={<Main />} />
          <Route path="/chat/:id" element={<Main />} />
        </Route>

        <Route element={<ProtectedRoute offline={offline} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/login/auth" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/pending/:id" element={<Signup />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/forgot/set/:userId/:secret" element={<Forgot />} />
        </Route>
        <Route
          path="*"
          element={
            <Error status={404} content={"This page could not be found."} />
          }
        />
      </Routes>
    </section>
  );
};

export default App;
