import { CxOptions, cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import * as class_variance_authority_types from 'class-variance-authority/types';
export * from '@udecode/react-utils';

/** Tailwind CSS classnames merge. */
declare function cn(...inputs: CxOptions): string;

/**
 * Set default `className` with `cn`.
 *
 * - IntelliSense: add `withCn` to `classAttributes`
 * - ESLint: add `withCn` to `settings.tailwindcss.callees`
 */
declare function withCn<T extends React.ComponentType<any>>(Component: T, ...inputs: CxOptions): React.ForwardRefExoticComponent<React.PropsWithoutRef<React.PropsWithoutRef<React.ComponentProps<T>>> & React.RefAttributes<React.ComponentRef<T>>>;

/**
 * Set default props with `React.forwardRef`.
 *
 * - Use `withCn` if only setting `className`
 */
declare function withProps<T extends React.ElementType>(Component: T, defaultProps: Partial<React.ComponentPropsWithoutRef<T>>): React.ForwardRefExoticComponent<React.PropsWithoutRef<React.PropsWithoutRef<React.ComponentProps<T>>> & React.RefAttributes<React.ComponentRef<T>>>;

/**
 * Set default `className` with `cn` and `variants`.
 *
 * @param Component - The component to which props will be added.
 * @param variants - Variants from `cva`. `Component` props will be extended
 *   with `variants` props.
 * @param onlyVariantsProps - Props to exclude from `Component`. Set the props
 *   that are only used for variants.
 */
declare function withVariants<T extends React.ElementType, V extends ReturnType<typeof cva>>(Component: T, variants: V, onlyVariantsProps?: (keyof VariantProps<V>)[]): React.ForwardRefExoticComponent<React.PropsWithoutRef<React.PropsWithoutRef<React.ComponentProps<T>> & Omit<React.ComponentProps<T>, Exclude<keyof class_variance_authority_types.OmitUndefined<Parameters<V>[0]>, "class" | "className">> & VariantProps<V>> & React.RefAttributes<React.ComponentRef<T>>>;

export { cn, withCn, withProps, withVariants };
