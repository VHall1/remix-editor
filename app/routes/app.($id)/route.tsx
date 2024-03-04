import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import * as React from "react";
import { prisma } from "~/utils/prisma.server";
import { requireUserSession } from "~/utils/session.server";
import { Editor } from "./editor.client";
import { Layout } from "./layout";

export default function App() {
  const data = useLoaderData<typeof loader>();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Layout>
      <nav className="max-lg:hidden border-r" style={{ gridArea: "nav" }}>
        b
      </nav>
      <header style={{ gridArea: "header" }}>a</header>
      <main style={{ gridArea: "editor" }}>{mounted ? <Editor /> : null}</main>
    </Layout>
  );
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const user = await requireUserSession(request);

  const pasteId = params.id;
  if (!pasteId) {
    const { id } = await prisma.paste.create({ data: { userId: user.id } });
    return redirect(id);
  }

  const paste = await prisma.paste.findUnique({ where: { id: pasteId } });

  // return paste data
  return paste;
}
