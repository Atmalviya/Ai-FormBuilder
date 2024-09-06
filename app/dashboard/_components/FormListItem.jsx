import { Button } from "@/components/ui/button";
import { Edit, Share, Trash } from "lucide-react";
import Link from "next/link";
import React from "react";
import { RWebShare } from "react-web-share";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUser } from "@clerk/nextjs";
import { db } from "@/configs";
import { and, eq } from "drizzle-orm";
import { JsonForms } from "@/configs/schema";
import { toast } from "sonner";

const FormListItem = ({ jsonForm, formRecords, refreshData }) => {
  const { user } = useUser();
  const onDeleteForm = async () => {
    console.log(jsonForm);
    console.log(jsonForm.id, formRecords.id);
    try {
      const res = await db
        .delete(JsonForms)
        .where(
          and(
            eq(JsonForms.id, formRecords.id),
            eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );
      console.log(res);
      if (res) {
        toast.success("Form deleted successfully!");
        refreshData();
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
      console.log(err);
    }
  };
  return (
    <div className="p-5 border shadow-sm rounded-lg">
      <div className="flex items-center justify-between">
        <h2></h2>
        <h2>
          {" "}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Trash className="h-5 w-5 text-red-500 cursor-pointer hover:scale-105 transition-all" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this form from our servers. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-700"
                  onClick={() => onDeleteForm()}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </h2>
      </div>
      <h2 className="text-lg text-black-500">{jsonForm.title}</h2>
      <h2 className="text-sm text-gray-500">{jsonForm.subheading}</h2>
      <hr className="my-4" />
      <div className="flex items-center justify-between">
        <RWebShare
          data={{
            text: jsonForm?.subheading+" , Build with Ai Form Builder",
            url: process.env.NEXT_PUBLIC_BASR_URL + `/aiform/${formRecords.id}`,
            title: jsonForm?.title,
          }}
          onClick={() => console.log("shared successfully!")}
        >
          <Button variant="outline" className="flex gap-2" size="sm">
            {" "}
            <Share className="h-5 w-5" /> Share{" "}
          </Button>
        </RWebShare>

        <Link href={`/edit-form/${formRecords.id}`}>
          <Button className="flex gap-2" size="sm">
            {" "}
            <Edit className="h-5 w-5" /> Edit
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FormListItem;
