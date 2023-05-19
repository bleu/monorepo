"use client";

import { useEffect, useState } from "react";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { AnalysisData, useStableSwap } from "#/contexts/StableSwapContext";

export default function PoolParametersForm() {
  const { initialData, setInitialData } = useStableSwap();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const inputParameters = (field: keyof AnalysisData) => {
    const label = field.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
    if (field == "tokens") return;
    return {
      label: label.charAt(0).toUpperCase() + label.slice(1),
      type: "number",
      placeholder: `Define the initial ${label}`,
      value: formData?.[field],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (value < 0) return;
        setFormData({
          ...formData,
          [field]: value,
        });
      },
    };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInitialData(formData);
  };

  useEffect(() => {
    setIsSubmitted(
      typeof formData?.ampFactor == "number" &&
        typeof formData?.swapFee == "number"
    );
  }, [formData]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} id="initial-data-form">
      <div className="flex flex-col gap-4">
        <Input {...inputParameters("swapFee")} />
        <Input {...inputParameters("ampFactor")} />
        <Button
          form="initial-data-form"
          type="submit"
          shade="light"
          disabled={!isSubmitted}
          className="w-32 h-min self-end"
        >
          Next step
        </Button>
      </div>
    </form>
  );
}
