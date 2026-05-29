"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  PROPERTY_TYPES,
  type PropertyFilters,
} from "@/features/properties/types";

const anyValue = "any";

type FilterFormState = {
  city: string;
  type: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
};

function getInitialState(filters: PropertyFilters): FilterFormState {
  return {
    city: filters.city ?? "",
    type: filters.type ?? anyValue,
    bedrooms: filters.bedrooms ? String(filters.bedrooms) : anyValue,
    minPrice: filters.minPrice ? String(filters.minPrice) : "",
    maxPrice: filters.maxPrice ? String(filters.maxPrice) : "",
  };
}

function FilterFields({
  state,
  onStateChange,
}: {
  state: FilterFormState;
  onStateChange: (state: FilterFormState) => void;
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="filter-city">City</Label>
        <Input
          id="filter-city"
          onChange={(event) =>
            onStateChange({ ...state, city: event.target.value })
          }
          placeholder="Lagos, Abuja, Port Harcourt"
          value={state.city}
        />
      </div>

      <div className="grid gap-2">
        <Label>Property type</Label>
        <Select
          onValueChange={(value) => onStateChange({ ...state, type: value })}
          value={state.type}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any property type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={anyValue}>Any property type</SelectItem>
            {PROPERTY_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Bedrooms</Label>
        <Select
          onValueChange={(value) =>
            onStateChange({ ...state, bedrooms: value })
          }
          value={state.bedrooms}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={anyValue}>Any bedrooms</SelectItem>
            <SelectItem value="1">1 bedroom</SelectItem>
            <SelectItem value="2">2 bedrooms</SelectItem>
            <SelectItem value="3">3 bedrooms</SelectItem>
            <SelectItem value="4">4+ bedrooms</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div className="grid gap-2">
          <Label htmlFor="filter-min-price">Min price</Label>
          <Input
            id="filter-min-price"
            inputMode="numeric"
            min="0"
            onChange={(event) =>
              onStateChange({ ...state, minPrice: event.target.value })
            }
            placeholder="500000"
            type="number"
            value={state.minPrice}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="filter-max-price">Max price</Label>
          <Input
            id="filter-max-price"
            inputMode="numeric"
            min="0"
            onChange={(event) =>
              onStateChange({ ...state, maxPrice: event.target.value })
            }
            placeholder="3000000"
            type="number"
            value={state.maxPrice}
          />
        </div>
      </div>
    </div>
  );
}

function buildListingsUrl(state: FilterFormState) {
  const params = new URLSearchParams();
  const city = state.city.trim();
  const minPrice = state.minPrice.trim();
  const maxPrice = state.maxPrice.trim();

  if (city) {
    params.set("city", city);
  }

  if (state.type !== anyValue) {
    params.set("type", state.type);
  }

  if (state.bedrooms !== anyValue) {
    params.set("bedrooms", state.bedrooms);
  }

  if (minPrice) {
    params.set("min_price", minPrice);
  }

  if (maxPrice) {
    params.set("max_price", maxPrice);
  }

  const queryString = params.toString();

  return queryString ? `/listings?${queryString}` : "/listings";
}

function FiltersPanel({
  state,
  onStateChange,
  onSubmit,
}: {
  state: FilterFormState;
  onStateChange: (state: FilterFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="grid gap-6" onSubmit={onSubmit}>
      <FilterFields onStateChange={onStateChange} state={state} />
      <div className="grid gap-2">
        <Button type="submit">Apply filters</Button>
        <Button asChild type="button" variant="ghost">
          <Link href="/listings">Clear filters</Link>
        </Button>
      </div>
    </form>
  );
}

export function ListingsFilters({ filters }: { filters: PropertyFilters }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(() => getInitialState(filters));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(buildListingsUrl(state));
    setOpen(false);
  }

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold tracking-tight">Filters</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Refine homes by location, type, beds, and monthly price.
            </p>
          </div>
          <FiltersPanel
            onStateChange={setState}
            onSubmit={handleSubmit}
            state={state}
          />
        </div>
      </aside>

      <div className="lg:hidden">
        <Sheet onOpenChange={setOpen} open={open}>
          <SheetTrigger asChild>
            <Button className="w-full rounded-2xl" size="lg" variant="outline">
              <SlidersHorizontal />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            className="max-h-[88vh] overflow-y-auto rounded-t-3xl"
            side="bottom"
          >
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <FiltersPanel
              onStateChange={setState}
              onSubmit={handleSubmit}
              state={state}
            />
            <SheetFooter />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
