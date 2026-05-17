import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { mergeClassNames } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = ({
	className,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof AccordionPrimitive.Item>) => (
	<AccordionPrimitive.Item
		ref={ref}
		className={mergeClassNames("border-b", className)}
		{...props}
	/>
);

const AccordionTrigger = ({
	className,
	children,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof AccordionPrimitive.Trigger>) => (
	<AccordionPrimitive.Header className="flex">
		<AccordionPrimitive.Trigger
			ref={ref}
			className={mergeClassNames(
				"flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
				className,
			)}
			{...props}
		>
			{children}
			<ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
);

const AccordionContent = ({
	className,
	children,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof AccordionPrimitive.Content>) => (
	<AccordionPrimitive.Content
		ref={ref}
		className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
		{...props}
	>
		<div className={mergeClassNames("pb-4 pt-0", className)}>
			{children}
		</div>
	</AccordionPrimitive.Content>
);

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
