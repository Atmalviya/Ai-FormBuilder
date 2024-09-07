"use client";
import { db } from "@/configs";
import { JsonForms, userResponses } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { eq, and, count } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import FormListItemResponses from "./_components/FormListItemResponses";

const Responses = () => {
    const { user } = useUser();
    const [formList, setFormList] = useState([]);

    useEffect(() => {
        if (user) {
            getFormListWithResponseCount();
        }
    }, [user]);

    const getFormListWithResponseCount = async () => {
        if (user?.primaryEmailAddress?.emailAddress) {
            const res = await db
                .select({
                    id: JsonForms.id,
                    jsonform: JsonForms.jsonform,
                    theme: JsonForms.theme,
                    background: JsonForms.background,
                    style: JsonForms.style,
                    createdAt: JsonForms.createdAt,
                    responseCount: count(userResponses.id).as('responseCount')
                })
                .from(JsonForms)
                .leftJoin(userResponses, eq(JsonForms.id, userResponses.formRef))
                .where(eq(JsonForms.createdBy, user.primaryEmailAddress.emailAddress))
                .groupBy(JsonForms.id)
                .orderBy(JsonForms.createdAt, "desc");

            setFormList(res);
        }
    };

    return (
        <div className="p-10">
            <h2 className="text-3xl font-bold flex items-center justify-between">
                Responses
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {formList.map((form, index) => (
                    <div key={index} className="">
                        <FormListItemResponses
                            formRecords={form}
                            jsonForm={JSON.parse(form.jsonform)}
                            responseCount={form.responseCount}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Responses;