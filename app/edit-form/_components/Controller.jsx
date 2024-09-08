import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import themes from "@/app/_theme/Themes";
import GradientBg from "@/app/_theme/GradientBg";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const Controller = ({selectedTheme, selectedBackground, EnableSignin}) => {
    const [showMore, setShowMore] = useState(6)
  return (
    <div>
        {/* Theme selection controller */}
      <h2 className="my-1">Select Themes</h2>
      <Select onValueChange={(value) => selectedTheme(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          {themes.map((theme, index) => (
            <SelectItem value={theme.theme} key={index}>
              <div className="flex gap-3">
              <div className="flex">
                <div
                  className="h-5 w-5 rounded-l-md"
                  style={{ backgroundColor: theme.primary }}
                  ></div>
                <div
                  className="h-5 w-5"
                  style={{ backgroundColor: theme.secondary }}
                  ></div>
                <div
                  className="h-5 w-5"
                  style={{ backgroundColor: theme.Accent }}
                ></div>
                <div
                  className="h-5 w-5 rounded-r-md"
                  style={{ backgroundColor: theme.neutral }}
                ></div>
              </div>
                  {theme.theme}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Background selection controller */}
      <h2 className="mt-8 my-1"> Select Backgound</h2>
      <div className="grid grid-cols-3 gap-3">
        {GradientBg.map((bg, index) => index <showMore && (
            <div className="w-full h-[70px] border rounded-lg hover:border-black flex items-center justify-center cursor-pointer" style={{background: bg.gradient}} key={index} onClick={() => selectedBackground(bg.gradient)}>
                {index == 0 && "None"}
            </div>
        ))}
      </div>
        <Button variant="ghost" className="w-full my-1" size="sm" onClick={() => setShowMore(showMore>6 ? 6 : 200)}>{showMore > 6 ?  "Show less" : "Show more" }</Button>
        <div className="flex flex-row gap-3 items-center justify-center">
          <Checkbox onCheckedChange={(e) => EnableSignin(e)} />
          <h2>Only signed in user can fill the form</h2>
        </div> 
    </div>
  );
};

export default Controller;
