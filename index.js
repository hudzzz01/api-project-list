import routerUser from "./router/router.user.js";
import routerProject from "./router/router.project.js";
import cors from "cors"
import app from "./app.js";
import routerAuth from "./router/router.auth.js";

const port = 5000;
app.use(cors({
    origin: '*',
  }));
app.use("/user",routerUser);
app.use("/project",routerProject);
app.use("/auth",routerAuth);


app.listen(port)
console.log(`listen in ${port}`)
