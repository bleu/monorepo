"use client";

import { useRouter } from "next/navigation";
import { HTMLProps, useContext } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "#/components";
import { AdminToolsContext, toSlug } from "#/contexts/AdminToolsContext";
import { truncateAddress } from "#/utils/truncateAddress";

export function ActionAttributeContent() {
  const { register, handleSubmit } = useForm();
  // eslint-disable-next-line no-console
  const onSubmit = (data: unknown) => console.log(data);
  const { push } = useRouter();
  const { selectedAction } = useContext(AdminToolsContext);

  const Input = React.forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>(
    ({ label, ...rest }: React.HTMLProps<HTMLInputElement>, ref) => {
      return (
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-400">
            {label}
          </label>
          <input
            ref={ref}
            {...rest}
            className="selection:color-white box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded-[4px] bg-blackA5 px-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] shadow-blackA9 outline-none selection:bg-blackA9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] disabled:bg-blackA9"
          />
        </div>
      );
    }
  );

  //TODO fetch selectedAction data from action Id once the backend exists #BAL-157
  React.useEffect(() => {
    if (selectedAction?.name === "") {
      push("/daoadmin");
    }
  }, [selectedAction]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {selectedAction?.name && (
        <div className="w-full bg-gray-900">
          <div>
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="mx-1 text-2xl font-medium text-gray-400">
                  {selectedAction?.name}
                </h1>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-6 rounded-md border border-gray-700 bg-gray-800 p-6">
              <p className="text-gray-400">{selectedAction?.description}</p>
              <div className="mt-2 flex items-center gap-8">
                <div className="flex items-center gap-2">
                  Operation Responsible
                  <span className="rounded bg-blue-200 p-1 text-sm font-bold text-gray-800 group-hover:bg-yellow-100">
                    {selectedAction?.operationResponsible}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  Contract Address
                  <a
                    href={selectedAction?.contractUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:underline"
                  >
                    {truncateAddress(selectedAction?.contractAddress)}
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {selectedAction?.fields.map((field) => {
                  return (
                    <Input
                      key={field.name}
                      label={field.name}
                      placeholder={field.placeholder}
                      {...register(toSlug(`${field.name}`))}
                    />
                  );
                })}
              </div>
              <Button
                type="submit"
                disabled={false}
                className="bg-indigo-500 text-gray-50 hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-gray-600 disabled:text-gray-500"
              >
                Submit to Gnosis Safe Signers
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
