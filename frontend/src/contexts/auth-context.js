import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import AuthService from "../services/auth/AuthService";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    try {
      const response = await AuthService.checkAuth();

      const user = {
        name: await AuthService.me(),
      };
      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user,
      });
    } catch (err) {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signIn = async (email, password) => {
    try {
      const data = {
        email: email,
        password: password,
      };
      const response = await AuthService.login(data);
      if (response) {
        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: {
            name: response.name,
          },
        });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      throw new Error("Invalid credentials");
    }
  };

  const signUp = async (email, name, password) => {
    try {
      const data = {
        name: name,
        email: email,
        password: password,
      };
      const response = await AuthService.register(data);
      return response;
    } catch (err) {
      throw new Error(err);
    }
  };

  const signOut = async () => {
    try {
      await AuthService.logout();
      dispatch({
        type: HANDLERS.SIGN_OUT,
      });
    } catch (err) {
      throw new Error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}{" "}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
