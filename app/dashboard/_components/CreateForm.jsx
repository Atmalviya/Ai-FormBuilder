"use client";
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AiChatSession } from "@/configs/AiModal";
import { useUser } from "@clerk/nextjs";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import moment from "moment";
import { useRouter } from "next/router";

const PROMPT = `, On the basis of description please give form in jsonformat with form title, form subheading with form having Form field, form name, placeholder name, and form label, fieldType, fieldrequired In Json format`;

const CreateForm = () => {
  const [userInput, setUserInput] = useState("");
  const [openDialog, setopenDialog] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const { user } = useUser();
  const route = useRouter();

  const onCreateForm = async () => {
    setisLoading(true);
    const result = await AiChatSession.sendMessage(
      `Description: ${userInput} ${PROMPT}`
    );
    if (result.response.text()) {
      const res = await db
        .insert(JsonForms)
        .values({
          jsonform: result.response.text(),
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD/MM/YYYY"),
        })
        .returning({ id: JsonForms.id });
      setisLoading(false);
      if (res[0].id) {
        route.push(`/edit-form/${res[0].id}`);
      }
    }
    setisLoading(false);
  };
  return (
    <div>
      <Button onClick={() => setopenDialog(true)}>+ Create Form</Button>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new form</DialogTitle>
            <DialogDescription>
              <Textarea
                placeholder="write description of your form"
                className="my-2"
                onChange={(e) => setUserInput(e.target.value)}
              />
              <div className="flex gap-2 my-2 justify-end">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setopenDialog(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={onCreateForm} disabled={isLoading}>
                  Create
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateForm;
