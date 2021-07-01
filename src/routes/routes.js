import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Test from "../components/test";
const Routes = () => {
  <Router>
    <Switch>
      <Route path='/' component={Test} />
    </Switch>
  </Router>;
};

export default Routes;
