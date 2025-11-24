export default function auth({ next, router, to }) {
  if (!sessionStorage.getItem("vorma_admin_dashboard_user_token")) {
    // Store the intended destination before redirecting to login
    sessionStorage.setItem("vorma_intended_route", to.fullPath);
    return router.push("/");
  }
  return next();
}
