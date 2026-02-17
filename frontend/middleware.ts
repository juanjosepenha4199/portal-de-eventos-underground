import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;
      if (path.startsWith("/admin")) return token?.role === "ADMIN";
      if (path.startsWith("/events/new") || path.startsWith("/events/my")) {
        return !!token && (token.role === "ORGANIZER" || token.role === "ADMIN");
      }
      if (path.startsWith("/events/favorites") || path.startsWith("/events/tickets")) return !!token;
      if (path.match(/^\/events\/[^/]+\/edit$/)) return !!token;
      return true;
    },
  },
  pages: { signIn: "/auth/login" },
});

export const config = {
  matcher: ["/admin/:path*", "/events/new", "/events/my", "/events/favorites", "/events/tickets", "/events/:id/edit"],
};
