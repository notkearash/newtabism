"use client";

import { Clock } from "@/components/clock";
import { WidgetCard } from "@/components/widget-card";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DropResult,
} from "@hello-pangea/dnd";
import React from "react";

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
            className="grid grid-cols-1 gap-8"
          >
            <WidgetCard id={"0"} index={0} onDelete={() => {}}>
              <Clock />
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
    <div className="flex justify-center items-center max-w-xl mt-8">
      {/* <ModeToggle /> */}
      <Dashboard />
    </div>
  );
}
