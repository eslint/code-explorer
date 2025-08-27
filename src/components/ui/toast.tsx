"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { mergeClassNames } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = ({
	className,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof ToastPrimitives.Viewport>) => (
	<ToastPrimitives.Viewport
		ref={ref}
		className={mergeClassNames(
			"fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
			className,
		)}
		{...props}
	/>
);

const toastVariants = cva(
	"group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
	{
		variants: {
			variant: {
				default: "border bg-background text-foreground",
				destructive:
					"destructive group border-destructive bg-destructive text-destructive-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const Toast = ({
	className,
	variant,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof ToastPrimitives.Root> &
	VariantProps<typeof toastVariants>) => {
	return (
		<ToastPrimitives.Root
			ref={ref}
			className={mergeClassNames(toastVariants({ variant }), className)}
			{...props}
		/>
	);
};

const ToastAction = ({
	className,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof ToastPrimitives.Action>) => (
	<ToastPrimitives.Action
		ref={ref}
		className={mergeClassNames(
			"inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
			className,
		)}
		{...props}
	/>
);

const ToastClose = ({
	className,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof ToastPrimitives.Close>) => (
	<ToastPrimitives.Close
		ref={ref}
		className={mergeClassNames(
			"absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
			className,
		)}
		toast-close=""
		{...props}
	>
		<X className="h-4 w-4" />
	</ToastPrimitives.Close>
);

const ToastTitle = ({
	className,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof ToastPrimitives.Title>) => (
	<ToastPrimitives.Title
		ref={ref}
		className={mergeClassNames("text-sm font-semibold", className)}
		{...props}
	/>
);

const ToastDescription = ({
	className,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof ToastPrimitives.Description>) => (
	<ToastPrimitives.Description
		ref={ref}
		className={mergeClassNames("text-sm opacity-90", className)}
		{...props}
	/>
);

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
	type ToastProps,
	type ToastActionElement,
	ToastProvider,
	ToastViewport,
	Toast,
	ToastTitle,
	ToastDescription,
	ToastClose,
	ToastAction,
};
