"use client";

// Libs
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Apis
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

// Components
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

// Utils
import { useEdgeStore } from "@/lib/edgestore";

interface BannerProps {
  document: Doc<"documents">;
}

export const Banner = ({ document }: BannerProps) => {
  const router = useRouter();
  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const { edgestore } = useEdgeStore();

  const onRemove = async () => {
    if (document.coverImage) {
      const url = document.coverImage;

      await edgestore.publicFiles.delete({ url });
    }

    const promise = remove({ id: document._id });

    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note.",
    });

    router.push("/documents");
  };

  const onRestore = () => {
    const promise = restore({ id: document._id });

    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note deleted!",
      error: "Failed to restore note.",
    });
  };

  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>This page is in the Trash</p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        Restore page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          onClick={onRemove}
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
};
