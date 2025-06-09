/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Users from "layouts/users";
import Teachers from "layouts/teachers";
import Kids from "layouts/kids";
import Classs from "layouts/classs";
import Meals from "layouts/meals";
import Enrollments from "layouts/enrollments";
import Activities from "layouts/activities";
import Feedbacks from "layouts/feedbacks";
import HealthRecords from "layouts/healthRecords";
import Supplies from "layouts/supplies";
import Logout from "layouts/logout";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/users",
    component: <Users />,
  },
  {
    type: "collapse",
    name: "Kids",
    key: "kids",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/kids",
    component: <Kids />,
  },
  {
    type: "collapse",
    name: "Teachers",
    key: "teachers",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/teachers",
    component: <Teachers />,
  },
  {
    type: "collapse",
    name: "Classes",
    key: "classes",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/classes",
    component: <Classs />,
  },
  {
    type: "collapse",
    name: "Meals",
    key: "meals",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/meals",
    component: <Meals />,
  },
  {
    type: "collapse",
    name: "Enrollments",
    key: "enrollments",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/enrollments",
    component: <Enrollments />,
  },
  {
    type: "collapse",
    name: "Activities",
    key: "activities",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/activities",
    component: <Activities />,
  },
  {
    type: "collapse",
    name: "Feedbacks",
    key: "feedbacks",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/feedbacks",
    component: <Feedbacks />,
  },
  {
    type: "collapse",
    name: "Health Records",
    key: "healthRecords",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/healthRecords",
    component: <HealthRecords />,
  },
  {
    type: "collapse",
    name: "Supplies",
    key: "supplies",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/supplies",
    component: <Supplies />,
  },
  {
    type: "collapse",
    name: "Logout",
    key: "logout",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/logout",
    component: <Logout />, // Logout page component
  },
];

export default routes;
