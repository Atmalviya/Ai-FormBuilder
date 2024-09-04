import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import FieldEdit from "./FieldEdit";

const FormUi = ({ jsonFromData, onFieldUpdate, deleteField, setselectedTheme, editable=true }) => {
  return (
    <div className="border p-5 md:w-[600px] rounded-lg " data-theme={setselectedTheme}>
      <h2 className="font-bold text-center text-2xl text-primary">
        {jsonFromData?.title}
      </h2>
      <h2 className="text-sm text-gray-400 text-center">
        {jsonFromData?.subheading}
      </h2>

      {jsonFromData?.fields?.map((field, index) => (
        <div key={index} className="flex items-center gap-2">
          {field?.type === "select" ? (
            <div className="my-3 w-full">
              <label className="text-xs text-gray-500">{field?.label}</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={field?.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field?.options?.map((option, optionIndex) => (
                    <SelectItem value={option.value} key={optionIndex}>
                      {option.label} 
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : field?.type === "radio" ? (
            <div className="my-3 w-full">
              <label className="text-xs text-gray-500">{field?.label}</label>
              <RadioGroup>
                {field?.options?.map((option, index) => (
                  <div className="flex items-center space-x-2" key={index}>
                    <RadioGroupItem value={option.value} id={option.label} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : field?.type === "checkbox" ? (
            <div className="my-3 w-full">
              <label className="text-xs text-gray-500">{field?.label}</label>
              {field?.options ? (
                field?.options?.map((option, index) => (
                  <div className="flex items-center gap-2 my-2" key={index}>
                    <Checkbox />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))
              ) : (
                <div className="flex gap-2">
                  <Checkbox />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              )}
            </div>
          ) : (
            <div className="my-3 w-full">
              <label className="text-xs text-gray-500">{field?.label}</label>

              <Input
                type={field?.type}
                label={field?.label}
                placeholder={field?.placeholder}
                name={field?.fieldName}
              />
            </div>
          )}
          {editable && <div>
            <FieldEdit
              defaultValue={field}
              onUpdate={(value) => onFieldUpdate(value, index)}
              deleteField={() => {
                deleteField(index);
              }}
            />
          </div>}
        </div>
      ))}
      <button className="btn btn-primary">Submit</button>
    </div>
  );
};

export default FormUi;
