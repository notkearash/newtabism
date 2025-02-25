"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardTitle } from "./ui/card";
import { IconClock12, IconClock24 } from "@tabler/icons-react";

export function Clock() {
  const [time, setTime] = useState(new Date());
  const [format, setFormat] = useState<"12" | "24">("12");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    if (format === "12") {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } else {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    }
  };

  return (
    <div>
      <CardTitle className="text-2xl font-bold mb-4">Clock</CardTitle>
      <div className="text-5xl font-bold mb-4">{formatTime(time)}</div>
      <Select
        value={format}
        onValueChange={(value: "12" | "24") => setFormat(value)}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Time format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="12">
            <IconClock12 />
          </SelectItem>
          <SelectItem value="24">
            <IconClock24 />
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
