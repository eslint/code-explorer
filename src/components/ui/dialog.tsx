"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { mergeClassNames } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = ({
	className,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Overlay>) => (
	<DialogPrimitive.Overlay
		ref={ref}
		className={mergeClassNames(
			"fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
			className,
		)}
		{...props}
	/>
);

const DialogContent = ({
	className,
	children,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Content>) => (
	<DialogPortal>
		<DialogOverlay />
		<DialogPrimitive.Content
			ref={ref}
			className={mergeClassNames(
				"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
				className,
			)}
			{...props}
		>
			{children}
			<DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
				<X className="h-4 w-4" />
				<span className="sr-only">Close</span>
			</DialogPrimitive.Close>
		</DialogPrimitive.Content>
	</DialogPortal>
);

const DialogHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={mergeClassNames(
			"flex flex-col space-y-1.5 text-center sm:text-left",
			className,
		)}
		{...props}
	/>
);

const DialogFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={mergeClassNames(
			"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
			className,
		)}
		{...props}
	/>
);

const DialogTitle = ({
	className,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Title>) => (
	<DialogPrimitive.Title
		ref={ref}
		className={mergeClassNames(
			"text-lg font-semibold leading-none tracking-tight",
			className,
		)}
		{...props}
	/>
);

const DialogDescription = ({
	className,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Description>) => (
	<DialogPrimitive.Description
		ref={ref}
		className={mergeClassNames("text-sm text-muted-foreground", className)}
		{...props}
	/>
);

export {
	Dialog,
	DialogPortal,
	DialogOverlay,
	DialogClose,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
};
