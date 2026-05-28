import type { ReactNode } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className="w-full border-border/70 bg-card/95 shadow-sm">
      <CardHeader className="gap-2 px-5 pb-4 pt-6 text-center sm:px-7 sm:pt-7">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="px-5 pb-6 sm:px-7 sm:pb-7">
        {children}
      </CardContent>
    </Card>
  );
}
