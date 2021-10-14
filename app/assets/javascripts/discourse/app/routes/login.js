import buildStaticRoute from "discourse/routes/build-static-route";
import { defaultHomepage } from "discourse/lib/utilities";
import { next } from "@ember/runloop";

const LoginRoute = buildStaticRoute("login");

LoginRoute.reopen({
  beforeModel() {
    if (!this.siteSettings.login_required) {
      this.replaceWith(`/${defaultHomepage()}`).then((e) => {
        next(() => e.send("showLogin"));
      });
    }
  },
});

export default LoginRoute;
