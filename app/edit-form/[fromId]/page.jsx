"use client";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FormUi from "../_components/FormUi";
import { toast } from "sonner";

const EditForm = ({ params }) => {
  const { user } = useUser();
  const [jsonFromData, setJsonFromData] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState();
  const [record, setRecord] = useState([]);
  const route = useRouter();

  useEffect(() => {
    user && getFormData();
  }, [user]);
  const getFormData = async () => {
    const res = await db
      .select()
      .from(JsonForms)
      .where(
        and(
          eq(JsonForms.id, params?.fromId),
          eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      );
    console.log(JSON.parse(res[0].jsonform));
    setRecord(res[0]);
    setJsonFromData(JSON.parse(res[0].jsonform));
  };

  useEffect(() => {
    if (updateTrigger) {
      setJsonFromData(jsonFromData);
      updateJsonFromInDb();
    }
  }, [updateTrigger]);

  const onFieldUpdate = (value, index) => {
    console.log(jsonFromData);
    jsonFromData.fields[index].label = value.label;
    jsonFromData.fields[index].placeholder = value.placeholder;
    console.log(jsonFromData);
    setUpdateTrigger(Date.now());
  };

  const onDeleteField = (indexToRemove) => {
    const res = jsonFromData.fields.filter(
      (item, index) => index !== indexToRemove
    );
    console.log(res);
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
      toast.success("Form updated successfully")
  };

  return (
    <div className="p-10">
      <h2
        className="flex gap-2 items-center my-5 cursor-pointer hover:font-bold transition max-w-fit"
        onClick={() => route.back()}
      >
        <ArrowLeft /> Back
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 border rounded-lg shadow-md ">Controller</div>
        <div className="md:col-span-2 border rounded-lg p-5 flex items-center justify-center">
          <FormUi
            jsonFromData={jsonFromData}
            onFieldUpdate={onFieldUpdate}
            deleteField={(index) => onDeleteField(index)}
          />
        </div>
      </div>
    </div>
  );
};

export default EditForm;
