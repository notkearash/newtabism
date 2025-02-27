"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { CardTitle } from "../ui/card";
import {
  IconBookmark,
  IconDots,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";

function CreateBookmarkDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new bookmark</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="">
            <Input id="name" placeholder="Bookmark Title" />
          </div>
          <div className="">
            <Input id="username" placeholder="URL e.g. http://example.com" />
          </div>
        </div>
        <DialogFooter className="w-full">
          <Button
            className="w-full"
            type="submit"
            onClick={() => {
              /* Add this bookmark to the bookmark list in the bookmark list */
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BookmarkList() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  return (
    <div className="p-4">
      <CardTitle className="text-2xl font-bold mb-4 flex gap-2">
        <IconBookmark /> {"Bookmark List"}
      </CardTitle>
      <div className="flex items-center">
        <div className="flex flex-row items-center gap-2 my-4 p-4 rounded-xl text-mtext border-border shadow-shadow border-2 hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all justify-between w-full">
          <Avatar>
            <AvatarImage src="https://github.com/notkearash.png" />
            <AvatarFallback>K</AvatarFallback>
          </Avatar>
          <div className="text-lg">{"Lorem Ipsum"}</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"neutral"} size={"icon"}>
                <IconDots />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {}} className="cursor-pointer">
                <IconEdit /> {"Edit"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}} className="cursor-pointer">
                <IconTrash /> {"Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Button className="w-full" onClick={() => setDialogOpen(!dialogOpen)}>
        <IconPlus /> {"Create a new Bookmark"}
      </Button>
      <CreateBookmarkDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
