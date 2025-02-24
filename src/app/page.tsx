import React from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

const colors = [
  { name: "Primary", bg: "bg-primary", text: "text-primary-foreground" },
  { name: "Secondary", bg: "bg-secondary", text: "text-secondary-foreground" },
  { name: "Accent", bg: "bg-accent", text: "text-accent-foreground" },
  {
    name: "Destructive",
    bg: "bg-destructive",
    text: "text-destructive-foreground",
  },
  { name: "Muted", bg: "bg-muted", text: "text-muted-foreground" },
  { name: "Background", bg: "bg-background", text: "text-foreground" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen justify-center items-center gap-8">
      <div className="flex flex-col gap-2 shadow shadow-primary p-4 rounded-lg">
        <p className="font-sans">Your font in sans</p>
        <p className="font-mono">Your font in mono</p>
      </div>

      <div className="flex flex-row items-center gap-1 shadow shadow-primary p-4 rounded-lg">
        <h1 className="text-lg">Theme Switcher:</h1>
        <ModeToggle />
      </div>

      <div className="grid grid-cols-3 my-4 gap-4 shadow shadow-primary p-4 rounded-lg">
        {colors.map((color) => (
          <div
            key={color.name}
            className={`p-4 h-10 flex justify-center items-center ${color.bg} ${color.text} rounded-lg border border-border shadow-md`}
          >
            {color.name}
          </div>
        ))}
      </div>

      <div className="grid grid-rows-2 grid-cols-3 my-2 gap-2 p-4 rounded-lg shadow shadow-primary">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="flex flex-row items-center font-mono">
        <a href="https://github.com/notkearash/next15-shadcnui">
          <Button variant={"link"}>next15 + shadcn/ui </Button>
        </a>
        <p>{"by"}</p>
        <a href="https://github.com/notkearash">
          <Button variant={"link"}>@notkearash</Button>
        </a>
      </div>
    </div>
  );
}
