"use client";

import type React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type WidgetCardProps = {
  id: string;
  index: number;
  onDelete: (id: string) => void;
  children: React.ReactNode;
};

const WidgetCard: React.FC<WidgetCardProps> = ({
  id,
  index,
  onDelete,
  children,
}) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="relative rounded-base shadow-shadow border-2 border-border text-text p-6 w-full hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all cursor-grab bg-bw"
        >
          <Button
            variant={"neutral"}
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => onDelete(id)}
          >
            <X className="h-4 w-4" />
          </Button>
          {children}
        </div>
      )}
    </Draggable>
  );
};

export { WidgetCard };
