import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Test from "../components/test";
import Header from "../components/Header/Header";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../themes";
import { useState } from "react";

const Routes = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };
  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalStyles />
      <Router>
        <Header toggleTheme={toggleTheme} theme={theme} />
        <Switch>
          <Route path='/' component={Test} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default Routes;
