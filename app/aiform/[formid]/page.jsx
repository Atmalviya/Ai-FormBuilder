"use client";
import FormUi from "@/app/edit-form/_components/FormUi";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";

const LiveAiForm = ({ params }) => {
  const [record, setRecord] = useState();
  const [jsonFromData, setJsonFromData] = useState([]);

  useEffect(() => {
    getFormData();
  }, [params]);
  const getFormData = async () => {
    const res = await db
      .select()
      .from(JsonForms)
      .where(and(eq(JsonForms.id, Number(params?.formid))));
    setRecord(res[0]);
    setJsonFromData(JSON.parse(res[0].jsonform));
  };
  return (
    <div
      className="p-10 flex items-center justify-center"
      style={{ backgroundImage: `${record?.background}` }}
    >
      {record && (
        <FormUi
          jsonFromData={jsonFromData}
          onFieldUpdate={() => {
            console.log();
          }}
          deleteField={() => {
            console.log();
          }}
          setselectedTheme={record?.theme}
          editable={false}
          formId={record?.id}
        />
      )}
    </div>
  );
};

export default LiveAiForm;
