"use client";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, Loader2, Share2, SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FormUi from "../_components/FormUi";
import { toast } from "sonner";
import Controller from "../_components/Controller";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RWebShare } from "react-web-share";

const EditForm = ({ params }) => {
  const { user } = useUser();
  const [jsonFromData, setJsonFromData] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState();
  const [record, setRecord] = useState([]);
  const [setselectedTheme, setSetselectedTheme] = useState("light");
  const [SelectedBackground, setSelectedBackground] = useState();
  const [enableSignin, setEnableSignin] = useState(false);
  const [loading, setLoading] = useState(false)
  const route = useRouter();

  useEffect(() => {
    user && getFormData();
  }, [user]);
  const getFormData = async () => {
    setLoading(true)
    const res = await db
      .select()
      .from(JsonForms)
      .where(
        and(
          eq(JsonForms.id, params?.fromId),
          eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      );
    if(res.length > 0){
      setLoading(false)
      setRecord(res[0]);
      setSetselectedTheme(res[0].theme);
      setSelectedBackground(res[0].background);
      setJsonFromData(JSON.parse(res[0].jsonform));
    }
  };

  useEffect(() => {
    if (updateTrigger) {
      setJsonFromData(jsonFromData);
      updateJsonFromInDb();
    }
  }, [updateTrigger]);

  const onFieldUpdate = (value, index) => {
    jsonFromData.fields[index].label = value.label;
    jsonFromData.fields[index].placeholder = value.placeholder;
    setUpdateTrigger(Date.now());
  };

  const onDeleteField = (indexToRemove) => {
    const res = jsonFromData.fields.filter(
      (item, index) => index !== indexToRemove
    );
    jsonFromData.fields = res;
    setUpdateTrigger(Math.random());
  };

  const updateJsonFromInDb = async () => {
    const res = await db
      .update(JsonForms)
      .set({
        jsonform: JSON.stringify(jsonFromData),
      })
      .where(
        and(
          eq(JsonForms.id, record.id),
          eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      );
    toast.success("Form updated successfully");
  };

  const updateControllerFields = async (value, columnNamw) => {
    const res = await db
      .update(JsonForms)
      .set({
        [columnNamw]: value,
      })
      .where(
        and(
          eq(JsonForms.id, record.id),
          eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      );
    toast.success("Form updated successfully");
  };

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <h2
          className="flex gap-2 items-center my-5 cursor-pointer hover:font-bold transition max-w-fit"
          onClick={() => route.back()}
        >
          <ArrowLeft /> Back
        </h2>
        <div className="flex gap-2 ">
          <Link href={`/aiform/${record.id}`} target="_blank">
            <Button className="flex gap-2 hover:bg-secondary">
              {" "}
              <SquareArrowOutUpRight className="h-5 w-5" /> Live preview
            </Button>
          </Link>
          <RWebShare
            data={{
              text:  jsonFromData.subheading+" , Build with Ai Form Builder",
              url:
                process.env.NEXT_PUBLIC_BASR_URL+"/aiform/"+record.id,
              title: jsonFromData.title,
            }}
          >
            <Button className="flex gap-2 hover:bg-secondary">
              {" "}
              <Share2 className="h-5 w-5" /> Share
            </Button>
          </RWebShare>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Controller */}
        <div className="p-5 border rounded-lg shadow-md ">
          <div className="flex items-center justify-end">
            <Button
              onClick={() => {
                updateControllerFields(setselectedTheme, "theme");
                updateControllerFields(SelectedBackground, "background");
                updateControllerFields(enableSignin, "enableSignIn");
              }}
            >
              Save changes
            </Button>
          </div>
          <Controller
            selectedTheme={(value) => {
              setSetselectedTheme(value);
            }}
            selectedBackground={(value) => {
              setSelectedBackground(value);
            }}
            EnableSignin={(value) => {
              setEnableSignin(value)
            }}
          />
        </div>

        {/* Form UI */}
        {loading ? <Loader2 className="h-10 w-10 animate-spin" /> : <div
          className="md:col-span-2 border rounded-lg p-5 flex items-center justify-center"
          style={{ backgroundImage: SelectedBackground }}
        >
          <FormUi
            setselectedTheme={setselectedTheme}
            jsonFromData={jsonFromData}
            onFieldUpdate={onFieldUpdate}
            deleteField={(index) => onDeleteField(index)}
          />
        </div>}
      </div>
    </div>
  );
};

export default EditForm;
