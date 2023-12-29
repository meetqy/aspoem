"use client";

import { Command } from "cmdk";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./index.css";

interface CommandMenuHandle {
  setOpen: (open: boolean) => void;
}

export const CommandMenu = forwardRef<CommandMenuHandle>((_props, ref) => {
  const [open, setOpen] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      setOpen,
    }),
    [],
  );

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} className="linear">
      <div className="mt-4 flex space-x-2 px-4">
        <div cmdk-linear-badge="">诗人</div>
        <div cmdk-linear-badge="">诗词</div>
      </div>
      <Command.Input placeholder="查找作者、诗词、名句..." />

      <Command.List>
        <Command.Empty>可惜，没有结果！</Command.Empty>

        <Command.Group heading="诗词">
          <Command.Item>
            Apple
            <div cmdk-linear-shortcuts="">
              <kbd>1</kbd>
            </div>
          </Command.Item>
          <Command.Item>Orange</Command.Item>
          <Command.Item>Pear</Command.Item>
          <Command.Item>Blueberry</Command.Item>
        </Command.Group>

        <Command.Group heading="诗人">
          <Command.Item>Fish A</Command.Item>
          <Command.Item>Fish V</Command.Item>
          <Command.Item>Fish C</Command.Item>
          <Command.Item>Fish D</Command.Item>
          <Command.Item>Fish E</Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
});

export const CommandInputSearch = () => {
  const ref = useRef<CommandMenuHandle>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const open = () => {
    ref.current?.setOpen(true);
    inputRef.current?.blur();
  };

  return (
    <>
      <CommandMenu ref={ref} />
      <div className="relative flex items-center" onClick={open}>
        <input
          ref={inputRef}
          className="input input-bordered w-full flex-1"
          placeholder="查找作者、诗词、名句..."
          onFocus={open}
        />
        <div className="absolute right-2 space-x-1">
          <kbd className="kbd kbd-sm">⌘</kbd>
          <kbd className="kbd kbd-sm">k</kbd>
        </div>
      </div>
    </>
  );
};
