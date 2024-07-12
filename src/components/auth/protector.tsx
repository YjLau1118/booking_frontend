import { Fragment, PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setAccessToken, setRefreshToken } from "../../store/slices/authSlice";
import { getIdToken } from "../../utils/api/auth";
import { useNavigate, useLocation } from "react-router-dom";

const AuthProtector = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAdmin = useSelector((state: RootState) => state.auth.permission);
  const refreshToken = useSelector(
    (state: RootState) => state.auth.refreshToken
  );

  const checkProtectExcludedUrl = (url: string) => {
    return !["/login", "/signup", "/forgetPwd"].includes(url);
  };

  useEffect(() => {
    const fetchToken = async () => {
      if (!refreshToken) {
        navigate("/login");
        return;
      }

      try {
        const token = await getIdToken();
        dispatch(setAccessToken(token)); // Assuming you have setAccessToken in your authSlice
      } catch (err) {
        navigate("/login");
      }
    };

    if (checkProtectExcludedUrl(location.pathname)) {
      fetchToken();
    }

    const intervalId = setInterval(fetchToken, 14 * 60 * 1000); // Refresh every 14 minutes
    return () => clearInterval(intervalId);
  }, [location.pathname, refreshToken, navigate, dispatch]);

  useEffect(() => {
    if (!refreshToken && checkProtectExcludedUrl(location.pathname)) {
      navigate("/login");
    }
  }, [refreshToken, location.pathname, navigate]);

  useEffect(() => {
    if (!isAdmin && location.pathname === "/dashboard") {
      navigate("/");
    }
  }, [isAdmin, location.pathname, navigate]);

  return <Fragment>{children}</Fragment>;
};

export default AuthProtector;
