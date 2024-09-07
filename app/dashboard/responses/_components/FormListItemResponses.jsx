import { Button } from "@/components/ui/button";
import { db } from "@/configs";
import { userResponses } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import * as XLSX from "xlsx";

const FormListItemResponses = ({ jsonForm, formRecords }) => {
  const [loading, setLoading] = useState(false);
  const ExportData = async () => {
    let jsonData = [];
    setLoading(true);
    const res = await db
      .select()
      .from(userResponses)
      .where(eq(userResponses.formRef, formRecords.id));

    if (res) {
      res.forEach((item) => {
        const jsonItem = JSON.parse(item.jsonResponse);
        jsonData.push(jsonItem);
      });
      setLoading(false);
      ExportDataFile(jsonData);
    }
  };

  const ExportDataFile = (jsonData) => {
    const workSheet = XLSX.utils.json_to_sheet(jsonData);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "data");

    XLSX.writeFile(workBook, `${jsonForm.title}.xlsx`);
  };
  return (
    <div className="p-5 border shadow-sm rounded-lg my-5">
      <h2 className="text-lg text-black-500">{jsonForm.title}</h2>
      <h2 className="text-sm text-gray-500">{jsonForm.subheading}</h2>
      <hr className="my-4" />
      <div className="flex items-center justify-between">
        <h2 className="text-sm">
          <strong>{formRecords.responseCount}</strong> Responses
        </h2>
        <Button
          className=""
          size="sm"
          onClick={() => ExportData()}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Export"}
        </Button>
      </div>
    </div>
  );
};

export default FormListItemResponses;
