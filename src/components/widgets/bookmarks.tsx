"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { CardTitle } from "../ui/card";
import {
  IconBookmark,
  IconDots,
  IconEdit,
  IconPlus,
  IconTrash,
  IconExternalLink,
  IconGripVertical,
  IconCheck,
  IconX,
  IconReorder,
  IconSearch,
  IconSearchOff,
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
import { Alert, AlertDescription } from "../ui/alert";
import { Skeleton } from "../ui/skeleton";
import { ConfirmDialog } from "../confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import ReactDOM from "react-dom";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon: string;
  createdAt: number;
}

function BookmarkDialog({
  open,
  onOpenChange,
  onSave,
  bookmark,
  isEditing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (bookmark: Omit<Bookmark, "id" | "createdAt" | "favicon">) => void;
  bookmark?: Bookmark;
  isEditing?: boolean;
}) {
  const [title, setTitle] = useState(bookmark?.title || "");
  const [url, setUrl] = useState(bookmark?.url || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(bookmark?.title || "");
      setUrl(bookmark?.url || "");
      setError("");
    }
  }, [open, bookmark]);

  const handleSave = () => {
    if (!title.trim()) {
      setError("Please enter a bookmark title");
      return;
    }

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setUrl("https://" + url);
    }

    onSave({ title, url });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit bookmark" : "Create a new bookmark"}
          </DialogTitle>
        </DialogHeader>
        {error && (
          <Alert variant="destructive" className="mb-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col gap-4">
          <div>
            <Input
              id="title"
              placeholder="Bookmark Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Input
              id="url"
              placeholder="URL e.g. http://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="w-full mt-4">
          <Button className="w-full" type="submit" onClick={handleSave}>
            {isEditing ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return "";
  }
}

function getInitials(text: string): string {
  if (!text) return "B";
  const words = text.split(" ");
  if (words.length === 1) {
    return text.substring(0, 1).toUpperCase();
  }
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

export function BookmarkList() {
  const { toast } = useToast();

  const [initialized, setInitialized] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [currentBookmark, setCurrentBookmark] = useState<
    Bookmark | undefined
  >();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookmarkToDelete, setBookmarkToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [reorderedBookmarks, setReorderedBookmarks] = useState<Bookmark[]>([]);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
  }, [bookmarks, initialized]);

  useEffect(() => {
    if (isReorderMode) {
      setReorderedBookmarks([...bookmarks]);
    }
  }, [isReorderMode, bookmarks]);

  const handleCreateBookmark = ({
    title,
    url,
  }: {
    title: string;
    url: string;
  }) => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title,
      url,
      favicon: getFaviconUrl(url),
      createdAt: Date.now(),
    };

    setBookmarks((prev) => [newBookmark, ...prev]);
  };

  const handleEditBookmark = ({
    title,
    url,
  }: {
    title: string;
    url: string;
  }) => {
    if (!currentBookmark) return;

    setBookmarks((prev) =>
      prev.map((bookmark) =>
        bookmark.id === currentBookmark.id
          ? {
              ...bookmark,
              title,
              url,
              favicon: getFaviconUrl(url),
            }
          : bookmark
      )
    );
  };

  const confirmDeleteBookmark = () => {
    if (bookmarkToDelete) {
      setBookmarks((prev) =>
        prev.filter((bookmark) => bookmark.id !== bookmarkToDelete)
      );
      setBookmarkToDelete(null);

      return Promise.resolve();
    }
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarkToDelete(id);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (bookmark: Bookmark) => {
    setCurrentBookmark(bookmark);
    setEditDialogOpen(true);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(reorderedBookmarks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setReorderedBookmarks(items);
  };

  const saveReorderedBookmarks = () => {
    setBookmarks(reorderedBookmarks);
    setIsReorderMode(false);

    toast({
      title: "Bookmarks reordered",
      description: "Your bookmark order has been saved",
      variant: "default",
    });
  };

  const cancelReordering = () => {
    setIsReorderMode(false);
  };

  const filteredBookmarks = !isReorderMode
    ? bookmarks.filter((bookmark) =>
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : reorderedBookmarks;

  const visitBookmark = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-4">
      <CardTitle className="text-2xl font-bold mb-4 flex gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <IconBookmark /> Bookmark List
        </div>

        <div className="flex gap-2">
          {!isReorderMode ? (
            bookmarks.length > 1 && (
              <>
                <Button
                  variant="neutral"
                  size="icon"
                  onClick={() => setIsReorderMode(true)}
                  className="text-xs"
                >
                  <IconReorder />
                </Button>
                <Button
                  variant="neutral"
                  size="icon"
                  onClick={() => setShowSearchBar(!showSearchBar)}
                  className="text-xs"
                >
                  {!showSearchBar ? <IconSearch /> : <IconSearchOff />}
                </Button>
              </>
            )
          ) : (
            <>
              <Button
                variant="neutral"
                size="icon"
                onClick={cancelReordering}
                className="text-xs"
              >
                <IconX />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={saveReorderedBookmarks}
                className="text-xs"
              >
                <IconCheck />
              </Button>
            </>
          )}
        </div>
      </CardTitle>

      {!isReorderMode && showSearchBar && (
        <div className="mb-4">
          <Input
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div className="flex flex-col gap-3 mb-4 max-h-96 overflow-y-auto overflow-x-hidden p-2">
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            {!initialized ? (
              <div className="flex items-center space-x-4 animate-pulse">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 sm:w-[250px] w-[100px]" />
                  <Skeleton className="h-4 sm:w-[200px] w-[100px]" />
                </div>
              </div>
            ) : searchTerm ? (
              "No bookmarks match your search"
            ) : (
              "No bookmarks yet. Add your first one!"
            )}
          </div>
        ) : isReorderMode ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="bookmarks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col gap-3"
                >
                  {filteredBookmarks.map((bookmark, index) => (
                    <Draggable
                      key={bookmark.id}
                      draggableId={bookmark.id}
                      index={index}
                    >
                      {(provided, snapshot) => {
                        const draggableItem = (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={provided.draggableProps.style}
                            className="flex flex-row items-center gap-2 p-4 rounded-xl text-mtext border-border shadow-shadow border-2 transition-all justify-between w-full bg-white"
                          >
                            <IconGripVertical
                              size={18}
                              className="cursor-grab active:cursor-grabbing"
                            />
                            <Avatar className="mx-1">
                              {bookmark.favicon ? (
                                <AvatarImage src={bookmark.favicon} />
                              ) : null}
                              <AvatarFallback>
                                {getInitials(bookmark.title)}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className="text-lg flex-grow truncate"
                              title={bookmark.url}
                            >
                              {bookmark.title}
                            </div>
                          </div>
                        );

                        return snapshot.isDragging
                          ? ReactDOM.createPortal(draggableItem, document.body)
                          : draggableItem;
                      }}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex flex-row items-center gap-2 p-4 rounded-xl text-mtext border-border shadow-shadow border-2 hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all justify-between w-full"
            >
              <Avatar
                className="cursor-pointer"
                onClick={() => visitBookmark(bookmark.url)}
              >
                {bookmark.favicon ? (
                  <AvatarImage src={bookmark.favicon} />
                ) : null}
                <AvatarFallback>{getInitials(bookmark.title)}</AvatarFallback>
              </Avatar>
              <div
                className="text-lg flex-grow cursor-pointer truncate"
                onClick={() => visitBookmark(bookmark.url)}
                title={bookmark.url}
              >
                {bookmark.title}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="neutral"
                  size="icon"
                  onClick={() => visitBookmark(bookmark.url)}
                  title="Visit site"
                >
                  <IconExternalLink size={18} />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="neutral" size="icon">
                      <IconDots />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => openEditDialog(bookmark)}
                      className="cursor-pointer"
                    >
                      <IconEdit className="mr-2" size={16} /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteBookmark(bookmark.id)}
                      className="cursor-pointer"
                    >
                      <IconTrash className="mr-2" size={16} /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      <Button
        className="w-full"
        onClick={() => setCreateDialogOpen(true)}
        disabled={isReorderMode}
      >
        <IconPlus className="mr-1" /> Add New Bookmark
      </Button>

      <BookmarkDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSave={handleCreateBookmark}
      />

      <BookmarkDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleEditBookmark}
        bookmark={currentBookmark}
        isEditing
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Bookmark"
        description={`Are you sure you want to delete "${
          bookmarks.find((b) => b.id === bookmarkToDelete)?.title ||
          "this bookmark"
        }"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDeleteBookmark}
        onSuccess={() => {
          toast({
            title: `Bookmark deleted successfully!`,
            variant: "destructive",
          });
        }}
        onError={() => {
          toast({
            title: `Couldn't delete the bookmark...Try Again.`,
            variant: "destructive",
          });
        }}
      />
    </div>
  );
}
