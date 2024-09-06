'use client'
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import FormListItem from "./FormListItem";

const FormList = () => {
  const { user, isSignedIn } = useUser();
  const [formList, setFormList] = useState([])
  useEffect(() => {
    user && getFormList()
  }, [user])
  const getFormList = async () => {
    const res = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(JsonForms.id, "desc");
      console.log(res)
    setFormList(res)
  };
  return <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-5">
    {
      formList?.map((form, index) => (
        <div key={index} className="">
          <FormListItem 
          jsonForm={JSON.parse(form.jsonform)}
          formRecords={form}
          refreshData={getFormList}
          />
        </div>
      ))
    }
  </div>;
};

export default FormList;
