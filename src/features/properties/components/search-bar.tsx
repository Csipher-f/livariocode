"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBar({ defaultCity = "" }: { defaultCity?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [city, setCity] = useState(defaultCity);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const trimmedCity = city.trim();

    params.delete("page");

    if (trimmedCity) {
      params.set("city", trimmedCity);
    } else {
      params.delete("city");
    }

    const queryString = params.toString();
    router.push(queryString ? `/listings?${queryString}` : "/listings");
  }

  return (
    <form
      className="grid gap-3 rounded-3xl border border-border bg-card p-3 shadow-sm sm:grid-cols-[1fr_auto]"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="listings-city-search">
        Search by city or location
      </label>
      <Input
        className="h-13 rounded-2xl border-transparent bg-secondary/70 px-5 shadow-none"
        id="listings-city-search"
        onChange={(event) => setCity(event.target.value)}
        placeholder="Search by city or location"
        type="search"
        value={city}
      />
      <Button className="h-13 rounded-2xl px-6" type="submit">
        <Search />
        Search
      </Button>
    </form>
  );
}
