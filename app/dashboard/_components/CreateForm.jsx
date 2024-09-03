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
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const PROMPT = `, Provide a JSON representation of a form based on the given description. The JSON should include the following details:
- title: The title of the form.
- subheading: A brief description or subheading for the form.
- Fields: An array of objects where each object represents a form field. Each field object should include:
  - name: The HTML name attribute for the field.
  - label: The label for the field, which will be displayed next to it.
  - placeholder: The placeholder text for the field, if applicable.
  - type: The type of field (e.g., "text", "select", "radio", "checkbox").
  - required: A boolean indicating whether the field is required.
  - options: For "select", "radio", or "checkbox" fields, an array of options, where each option is an object with "label" and "value" properties.
  - fieldName: The internal name or identifier for the field, if different from the HTML name attribute.
Ensure that the JSON is structured to match the standard HTML form elements and types, and that each field type has the appropriate properties.`

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
                    {isLoading ? <Loader2 className="animate-spin" /> : "Create"}
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
