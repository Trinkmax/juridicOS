"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn, initials, hashHue } from "@/lib/utils";

const sizes = {
  xs: "size-6 text-[0.625rem]",
  sm: "size-8 text-xs",
  default: "size-10 text-sm",
  lg: "size-12 text-base",
};

function Avatar({
  name,
  src,
  size = "default",
  className,
}: {
  name?: string | null;
  src?: string | null;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const hue = hashHue(name ?? "?");
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        sizes[size],
        className,
      )}
    >
      {src && (
        <AvatarPrimitive.Image
          src={src}
          alt={name ?? ""}
          className="aspect-square size-full object-cover"
        />
      )}
      <AvatarPrimitive.Fallback
        className="flex size-full items-center justify-center font-semibold text-white"
        style={{
          backgroundImage: `linear-gradient(135deg, oklch(0.62 0.17 ${hue}), oklch(0.52 0.21 ${(hue + 45) % 360}))`,
        }}
      >
        {initials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

export { Avatar };
