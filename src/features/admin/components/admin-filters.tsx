"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  label: string;
  value: string;
};

function updateUrl({
  key,
  pathname,
  router,
  searchParams,
  value,
}: {
  key: string;
  pathname: string;
  router: ReturnType<typeof useRouter>;
  searchParams: Record<string, string>;
  value: string;
}) {
  const params = new URLSearchParams(searchParams);

  params.delete("page");

  if (value && value !== "all") {
    params.set(key, value);
  } else {
    params.delete(key);
  }

  const query = params.toString();
  router.push(query ? `${pathname}?${query}` : pathname);
}

export function AdminSearchFilter({
  pathname,
  search,
  searchParams,
}: {
  pathname: string;
  search: string;
  searchParams: Record<string, string>;
}) {
  const router = useRouter();

  return (
    <form
      className="relative w-full sm:max-w-sm"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        updateUrl({
          key: "search",
          pathname,
          router,
          searchParams,
          value: String(formData.get("search") ?? "").trim(),
        });
      }}
    >
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-9"
        defaultValue={search}
        name="search"
        placeholder="Search"
        type="search"
      />
    </form>
  );
}

export function AdminSelectFilter({
  options,
  pathname,
  searchParams,
  value,
}: {
  options: Option[];
  pathname: string;
  searchParams: Record<string, string>;
  value: string;
}) {
  const router = useRouter();

  return (
    <Select
      onValueChange={(nextValue) =>
        updateUrl({
          key: "status",
          pathname,
          router,
          searchParams,
          value: nextValue,
        })
      }
      value={value}
    >
      <SelectTrigger className="w-full sm:w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
