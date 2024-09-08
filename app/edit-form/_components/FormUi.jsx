import React, { useEffect, useRef, useState } from "react";
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
import { db } from "@/configs";
import { userResponses } from "@/configs/schema";
import moment from "moment";
import { toast } from "sonner";
import { useUser, isSignedIn, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const FormUi = ({ jsonFromData, onFieldUpdate, deleteField, setselectedTheme, editable=true, formId=0, enableSignin=false }) => {
  const [formData, setFormData] = useState({});
  const formRef = useRef(null);
  const [formKey, setFormKey] = useState(0); 
  const {user, isSignedIn} = useUser()


  const handleInputChange = (event) => {
    const {name, value} = event.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleCheckboxChange = (fieldName, itemName, value) => {
    const list = formData?.[fieldName] ? formData?.[fieldName] : [];
    if(value){
      list.push({
        label: itemName,
        value: true
      })
      setFormData({
       ...formData,
        [fieldName]: list
      })
    }else {
      const result = list.filter(item => item.label !== itemName);
      setFormData({
        ...formData,
        [fieldName]: result
      })
    }
  }

  const onFormSubmit = async(event) => {
    event.preventDefault();
    try {
      const res = await db.insert(userResponses).values({
        jsonResponse: formData,
        createdAt: moment().format("DD-MM-YYYY"),
        formRef: formId,
      });
      if(res){
        setFormData({});
        if (formRef.current) {
          formRef.current.reset();
        }
        
        setFormKey(prevKey => prevKey + 1);
        toast.success("Form submitted successfully");
      }
    } catch(err){
      console.log(err);
      toast.error("Something went wrong");
    }
  }
  return (
    <form ref={formRef} className="border p-5 md:w-[600px] rounded-lg " data-theme={setselectedTheme} onSubmit={onFormSubmit}>
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
              <Select
                key={`${formKey}-${field.name}`} 
                required={field?.required}
                onValueChange={(value) => handleSelectChange(field?.name, value)}
                value={formData[field?.name] || ""}
              >
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
              <RadioGroup required={field?.required}>
                {field?.options?.map((option, index) => (
                  <div className="flex items-center space-x-2" key={index}>
                    <RadioGroupItem value={option.value} id={option.label} name={field?.name} onClick={(value) => handleSelectChange(field?.name, option.value)} />
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
                    <Checkbox onCheckedChange={(v)=>handleCheckboxChange(field?.label, option.label, v)}/>
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
                name={field?.name}
                required={field?.required}
                onChange={(e)=>handleInputChange(e)}
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
      {enableSignin ? 
      <div>
      {isSignedIn ? <Button className="btn btn-primary" type="submit">Submit</Button> : 
          <Button className="" onClick={(e) =>e.preventDefault() }>
            <SignInButton mode="modal">
              Sign In First
            </SignInButton>
        </Button>
        }  
        </div> :
      <Button className="btn btn-primary" type="submit">Submit</Button>
      }
    </form>
  );
};

export default FormUi;
