import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Test from "../components/test";
const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' component={Test} />
      </Switch>
    </Router>
  );
};

export default Routes;
