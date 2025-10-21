"use client";

import { redirect } from "next/navigation";

import { authClient } from "@/server/auth/client";

import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

export const UserCard = () => {
  // 获取用户信息
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect("/login");
  }

  const logout = async () => {
    await authClient.signOut();
    redirect("/login");
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">用户信息</h2>
      </CardHeader>
      <CardContent>{session ? <div>欢迎回来，{session.user.name}!</div> : <div>请登录以访问您的帐户</div>}</CardContent>
      <CardFooter>
        <Button className="w-full" onClick={logout}>
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
};
