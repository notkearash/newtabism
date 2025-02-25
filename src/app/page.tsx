"use client";

import React from "react";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DropResult,
} from "@hello-pangea/dnd";
import { Clock } from "@/components/widgets/clock";
import { ModeToggle } from "@/components/mode-toggle";
import { WidgetCard } from "@/components/widget-card";
import { Weather } from "@/components/widgets/weather";

function Dashboard() {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="widgets">
        {(provided: DroppableProvided) => (
          <main
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 gap-8 w-full place-items-center"
          >
            <WidgetCard id={"0"} index={0} onDelete={() => {}}>
              <Clock />
            </WidgetCard>
            <WidgetCard id={"1"} index={1} onDelete={() => {}}>
              <Weather />
            </WidgetCard>
            {provided.placeholder}
          </main>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default function HomePage() {
  return (
    <div className="flex justify-center items-center max-w-lg mx-auto mt-8 h-[90svh]">
      <div className="w-11/12">
        <Dashboard />
        <div className="absolute bottom-4 right-4">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
