"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { mergeClassNames } from "@/lib/utils";

const labelVariants = cva(
	"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = ({
	className,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof LabelPrimitive.Root> &
	VariantProps<typeof labelVariants>) => (
	<LabelPrimitive.Root
		ref={ref}
		className={mergeClassNames(labelVariants(), className)}
		{...props}
	/>
);

export { Label };
