"use client";

import useSearchModal from "@/app/hooks/useSearchModal";
import Modal from "./Modal";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import queryString from "query-string";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calender from "../inputs/Calender";
import Counter from "../inputs/Counter";

enum STEPS {
  LOCATION_1ST_STEP = 0,
  DATE_2ND_STEP = 1,
  INFO_3RD_STEP = 2,
}

const SearchModal = () => {
  const searchModal = useSearchModal();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(STEPS.LOCATION_1ST_STEP);
  const [location, setLocation] = useState<CountrySelectValue>();
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );

  const onBack = useCallback(() => {
    setStep((step) => step - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((step) => step + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO_3RD_STEP) {
      return onNext();
    }

    let currentQueryObject = {};

    if (searchParams) {
      currentQueryObject = queryString.parse(searchParams.toString());
    }

    const updatedQueryObject: any = {
      ...currentQueryObject,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
    };

    if (dateRange.startDate) {
      updatedQueryObject.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQueryObject.endDate = formatISO(dateRange.endDate);
    }

    const url = queryString.stringifyUrl(
      {
        url: "/",
        query: updatedQueryObject,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION_1ST_STEP);
    searchModal.onClose();
    router.push(url);
  }, [
    step,
    searchModal,
    location,
    router,
    guestCount,
    roomCount,
    bathroomCount,
    dateRange,
    onNext,
    searchParams,
  ]);

  //START HTML
  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO_3RD_STEP) {
      return "Search";
    }

    return "Next";
  }, []);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION_1ST_STEP) {
      return undefined;
    }

    return "Back";
  }, []);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where do you wanna go?"
        subtitle="Find your perfect location!"
      />
      <CountrySelect
        value={location}
        onChange={(value) => setLocation(value as CountrySelectValue)}
      />
      <hr />
      <Map center={location?.latlng} />
    </div>
  );

  if (step === STEPS.DATE_2ND_STEP) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="When do you plan to go?"
          subtitle="Make sure everyone is free!"
        />
        <Calender
          dateRange={dateRange}
          onChange={(value) => setDateRange(value.selection)}
        />
      </div>
    );
  }

  if (step === STEPS.INFO_3RD_STEP) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="More infomation" subtitle="Find your perfect place!" />
        <Counter
          title="Guest"
          subtitle="How many guests are coming?"
          value={guestCount}
          onChange={(guestCount) => setGuestCount(guestCount)}
        />
        <Counter
          title="Rooms"
          subtitle="How many rooms do you need?"
          value={roomCount}
          onChange={(roomCount) => setRoomCount(roomCount)}
        />
        <Counter
          title="Bathrooms"
          subtitle="How many bathrooms do you need?"
          value={bathroomCount}
          onChange={(bathroomCount) => setBathroomCount(bathroomCount)}
        />
      </div>
    );
  }

  //END HTML

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      title="Filter"
      actionLabel={actionLabel}
      secondaryAction={step === STEPS.LOCATION_1ST_STEP ? undefined : onBack}
      secondaryActionLable={secondaryActionLabel}
      body={bodyContent}
    />
  );
};

export default SearchModal;
