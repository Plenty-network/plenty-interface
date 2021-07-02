import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Test from "../Components/test";
//Components
import Header from "../Components/Header/Header";
import Farms from "../Pages/Farms";
import Ponds from "../Pages/Ponds";
import Pools from "../Pages/Pools";
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
          <Route path='/' exact component={Test} />
          <Route path='/farms' component={Farms} />
          <Route path='/pools' component={Pools} />
          <Route path='/ponds' component={Ponds} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default Routes;
