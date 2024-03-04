import type { PropsWithChildren } from "react";
import "./layout.css";

export function Layout({ children }: PropsWithChildren) {
  return <div className="layout">{children}</div>;
}
