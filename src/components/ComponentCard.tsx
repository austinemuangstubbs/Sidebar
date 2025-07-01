import React from "react";
import { ComponentItem } from "./ComponentList";

export interface ComponentCardProps {
  component: ComponentItem;
}

export default function ComponentCard({ component }: ComponentCardProps) {
  return (
    <div
      style={{
        padding: "0.5rem 1rem",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
      }}
    >
      <span style={{ fontWeight: 600, marginRight: 8 }}>{component.id}</span>
      <span>{JSON.stringify(component)}</span>
    </div>
  );
}