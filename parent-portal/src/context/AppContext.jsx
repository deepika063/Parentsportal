import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../data/translations";

const AppContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [currentStudent, setCurrentStudent] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [language, setLanguage] = useState("en");
  const [authStep, setAuthStep] = useState(1); // 1=credentials, 2=otp
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        setIsInitialLoading(true);
          // Parent user needs to fetch their dashboard data
          const success = await fetchDashboardData(token);
          if (success) {
            setIsAuthenticated(true);
          }
      }
      setIsInitialLoading(false);
    };
    initAuth();
  }, [token]);

  const fetchDashboardData = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/api/student/dashboard`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentStudent(data.student);
        setDashboardData(data);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      return false;
    }
  }

  const verifyCredentials = async (regNumber, email) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNumber, parentEmail: email })
      });
      const data = await response.json();
      if (response.ok) {
        return {
          id: data.studentId,
          emailToDisplay: data.emailToDisplay
        };
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const verifyOtp = async (student, otp) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id, otp })
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const login = async (data) => {
    localStorage.setItem('token', data.token);
    setToken(data.token);
    
    setIsInitialLoading(true);
    const success = await fetchDashboardData(data.token);
    if (success) {
      setIsAuthenticated(true);
    }
    setIsInitialLoading(false);
  };



  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setCurrentStudent(null);
    setDashboardData(null);
    setAuthStep(1);
  };

  const getStudentData = () => {
    return dashboardData;
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,

        isInitialLoading,
        currentStudent,
        language,
        setLanguage,
        authStep,
        setAuthStep,
        token,
        t,
        verifyCredentials,
        verifyOtp,
        login,

        logout,
        getStudentData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}