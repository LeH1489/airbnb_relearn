"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";
import queryString from "query-string";

interface CategoryBoxProps {
  icon: IconType;
  label: string;
  selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon,
  label,
  selected,
}) => {
  const router = useRouter();
  //read current URL query string
  const searchParams = useSearchParams();

  const handleClick = useCallback(() => {
    //define an empty query (Object)
    let currentQueryObject = {};

    //check if we have an params at all
    //if first click on category => not have searchParams yet
    if (searchParams) {
      //using queryString lib to parse searchParams into an Object
      //we will have so many params (guestCount, roomCount, date...)
      //store bunch of that on url
      //and when we click on one of the category ==> don't remove previous url(guestCount, roomCount, date...)
      //combine all kind of params
      currentQueryObject = queryString.parse(searchParams.toString());
    }

    const updatedQueryObject: any = {
      ...currentQueryObject,
      category: label, //thêm category: label vào Object
      //if click on Beach => updatedQueryObject = {category: "Beach"}
    };

    //if click the category again ==> remove
    if (searchParams?.get("category") === label) {
      delete updatedQueryObject.category;
    }

    //generate query string by using Stringify an object into a URL
    //ex: Object updatedQueryObject = {category: "Beach"} ==> stringifyUrl ==> category=Beach
    const url = queryString.stringifyUrl(
      {
        url: "/",
        query: updatedQueryObject,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [label, searchParams, router]);

  return (
    <div
      onClick={handleClick}
      className={`
        flex 
        flex-col
        gap-2
        items-center
        p-3
        border-b-2
        hover:text-neutral-800 
        transition
        cursor-pointer
        ${selected ? "border-b-neutral-800" : "border-transparent"}
         ${selected ? "text-neutral-800" : "text-neutral-500"}
  `}
    >
      <Icon size={26} />
      <div className="font-medium text-sm">{label}</div>
    </div>
  );
};

export default CategoryBox;
