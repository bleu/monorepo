"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import classNames from "classnames";

export function ImageDialog({ src }: { src: string }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <ArrowTopRightIcon className=" text-white" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className={classNames(
            "bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0"
          )}
        />
        <Dialog.Content
          className={classNames(
            "bg-gray-100 data-[state=open]:animate-contentShow fixed top-[50%] border-2 border-gray-800 left-[50%] max-h-[85vh] w-[90vw] max-w-[400px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
          )}
        >
          <img src={src} alt="" className="h-full w-full" />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
