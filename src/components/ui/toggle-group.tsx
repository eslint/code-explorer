import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { VariantProps } from "class-variance-authority";

import { mergeClassNames } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

const ToggleGroupContext = React.createContext<
	VariantProps<typeof toggleVariants>
>({
	size: "default",
	variant: "default",
});

const ToggleGroup = ({
	className,
	variant,
	size,
	children,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof ToggleGroupPrimitive.Root> &
	VariantProps<typeof toggleVariants>) => (
	<ToggleGroupPrimitive.Root
		ref={ref}
		className={mergeClassNames(
			"flex items-center justify-center gap-1",
			className,
		)}
		{...props}
	>
		<ToggleGroupContext value={{ variant, size }}>
			{children}
		</ToggleGroupContext>
	</ToggleGroupPrimitive.Root>
);

const ToggleGroupItem = ({
	className,
	children,
	variant,
	size,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof ToggleGroupPrimitive.Item> &
	VariantProps<typeof toggleVariants>) => {
	const context = React.useContext(ToggleGroupContext);

	return (
		<ToggleGroupPrimitive.Item
			ref={ref}
			className={mergeClassNames(
				toggleVariants({
					variant: context.variant || variant,
					size: context.size || size,
				}),
				className,
			)}
			{...props}
		>
			{children}
		</ToggleGroupPrimitive.Item>
	);
};

export { ToggleGroup, ToggleGroupItem };
