import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "~/components/shadcn";
import { prisma } from "~/utils/prisma.server";
import { getSessionStorage } from "~/utils/session.server";

export default function Auth() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Form method="post">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" required />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Login
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = String(formData.get("username"));

  const session = await getSessionStorage(request);
  // finds existing user or creates a new one
  const user = await prisma.user.upsert({
    where: { username },
    create: { username },
    update: {},
  });
  session.setSession({ id: user.id, username: user.username });
  return redirect("/app", {
    headers: { "Set-Cookie": await session.commit() },
  });
}
