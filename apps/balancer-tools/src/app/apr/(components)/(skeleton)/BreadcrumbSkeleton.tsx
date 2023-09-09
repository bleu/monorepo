import React from "react";

export default function BreadcrumbSkeleton() {
  return (
    <nav
      className="border-blue6 bg-blue3 flex h-16 animate-pulse justify-between rounded-lg border px-4 py-3 text-white sm:px-5"
      aria-label="Breadcrumb"
    >
      <ol className="mb-0 inline-flex items-center space-x-1">
        <li className="hidden sm:block">
          <div className="flex items-center">
            <div className="h-2 w-32 rounded-full bg-blue6"></div>
          </div>
        </li>
        <li className="hidden sm:block">
          <div className="flex items-center">
            <div className="h-2 w-32 rounded-full bg-blue6"></div>
          </div>
        </li>
      </ol>
    </nav>
  );
}
