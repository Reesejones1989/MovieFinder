import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function RedirectByIMDb() {
  const { imdbID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkType() {
      try {
        const res = await fetch(`/api/type/${imdbID}`);
        const data = await res.json();

        if (data.type === "movie") {
          navigate(`/movie/${imdbID}`);
        } else {
          navigate(`/tv/${imdbID}`);
        }
      } catch (err) {
        navigate("/"); // fallback
      }
    }

    if (imdbID) checkType();
  }, [imdbID]);

  return <div className="loading">Loading...</div>;
}