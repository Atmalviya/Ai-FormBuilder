'use client'
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import FormListItem from "./FormListItem";
import { Loader2 } from "lucide-react";

const FormList = () => {
  const { user, isSignedIn } = useUser();
  const [formList, setFormList] = useState([])
  const [isFormLoading, setIsFormLoading] = useState(false)
  useEffect(() => {
    setIsFormLoading(true)
    user && getFormList()
  }, [user])
  const getFormList = async () => {
    const res = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(JsonForms.id, "desc");
    setFormList(res)
    setIsFormLoading(false)
  };
  if(isFormLoading){
    return <div className="flex text-center mt-10 items-center justify-center"><Loader2 className="animate-spin"/></div>
  }
  if(formList.length < 1){
    return <div className="flex text-center mt-10 items-center justify-center">No form found</div>
  }
  return <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
  </div>
};

export default FormList;
