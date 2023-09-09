"use client";

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { PredefinedCategories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

enum STEPS {
  CATEGORY_FIRST_STEP = 0,
  LOCATION_SECOND_STEP = 1,
  INFO_3RD_STEP = 2,
  IMAGES_4TH_STEP = 3,
  DESCRIPTION_5TH_STEP = 4,
  PRICE_FINAL_STEP = 5,
}

const RentModal = () => {
  const rentModal = useRentModal();
  const [step, setStep] = useState(STEPS.CATEGORY_FIRST_STEP);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: "",
      price: 1,
      title: "",
      description: "",
    },
  });

  //watch specific fields by their names
  const watchCategoryValue = watch("category");
  const watchLocationValue = watch("location");
  const watchGuestCountValue = watch("guestCount");
  const watchRoomCountValue = watch("roomCount");
  const watchBathroomCountValue = watch("bathroomCount");
  const watchImageSrcValue = watch("imageSrc");

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [watchLocationValue]
  );
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((step) => step - 1);
  };

  const onNext = () => {
    setStep((step) => step + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE_FINAL_STEP) {
      return onNext();
    }

    setIsLoading(true); //not allow user to interact

    axios
      .post("/api/listings", data)
      .then(() => {
        toast.success("Listing created");
        router.refresh();
        reset(); //when user complete the entire form ==> reset all of data
        setStep(STEPS.CATEGORY_FIRST_STEP);
        rentModal.onClose();
      })
      .catch(() => {
        toast.error("Listing creation failed!");
      })
      .finally(() => setIsLoading(false));
  };

  // START HTML CONTENT
  //generate label for primary button
  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE_FINAL_STEP) {
      return "Create";
    }

    return "Next";
  }, [step]);

  //generate label for secondary button
  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY_FIRST_STEP) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category?"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {PredefinedCategories.map((cate) => (
          <div key={cate.label} className="col-span-1">
            <CategoryInput
              onClick={(categoryLabel) =>
                setCustomValue("category", categoryLabel)
              }
              selected={watchCategoryValue === cate.label}
              label={cate.label}
              icon={cate.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION_SECOND_STEP) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your place located?"
          subtitle="Help guests find you!"
        />
        <CountrySelect
          value={watchLocationValue}
          onChange={(value) => setCustomValue("location", value)}
        />
        <Map center={watchLocationValue?.latlng} />
      </div>
    );
  }

  if (step === STEPS.INFO_3RD_STEP) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your place"
          subtitle="What amenities do you have?"
        />
        <Counter
          title="Guest"
          subtitle="How many guests do you allow?"
          value={watchGuestCountValue}
          onChange={(value) => setCustomValue("guestCount", value)}
        />
        <hr />
        <Counter
          title="Rooms"
          subtitle="How many rooms do you have?"
          value={watchRoomCountValue}
          onChange={(value) => setCustomValue("roomCount", value)}
        />
        <hr />
        <Counter
          title="Bathrooms"
          subtitle="How many bathrooms do you have?"
          value={watchBathroomCountValue}
          onChange={(value) => setCustomValue("bathroomCount", value)}
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES_4TH_STEP) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your place"
          subtitle="Show guests what your place looks like!"
        />
        <ImageUpload
          value={watchImageSrcValue}
          onChange={(value) => setCustomValue("imageSrc", value)}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION_5TH_STEP) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your place?"
          subtitle="Short and swee works best!"
        />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.PRICE_FINAL_STEP) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per night?"
        />
        <Input
          formatPrice
          id="price"
          label="Price"
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }
  // END HTML CONTENT

  return (
    <Modal
      title="Gobnb your home"
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLable={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY_FIRST_STEP ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default RentModal;
