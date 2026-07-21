import * as React from 'react';
import { ButtonProps } from './button';
export interface DropdownButtonItem {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive';
    icon?: React.ReactNode;
    disabled?: boolean;
}
export interface DropdownButtonProps extends Omit<ButtonProps, 'onClick'> {
    /**
     * The main action to perform when the button is clicked
     */
    onMainAction?: () => void;
    /**
     * Array of dropdown menu items
     */
    items: DropdownButtonItem[];
    /**
     * Whether to show the dropdown arrow in a split button style
     * @default true
     */
    showSplitButton?: boolean;
    /**
     * Alignment of the dropdown menu
     * @default 'end'
     */
    align?: 'start' | 'center' | 'end';
}
/**
 * A button component that combines a primary action with a dropdown menu of additional options.
 *
 * This component follows the split-button pattern found in TinaCMS, where the main button
 * performs a primary action and a small arrow button opens a dropdown menu with additional options.
 *
 * @example
 * // Basic usage with split button
 * <DropdownButton
 *   variant="primary"
 *   onMainAction={() => console.log('Save to new branch')}
 *   items={[
 *     { label: 'Save to protected branch', onClick: () => console.log('Protected') },
 *     { label: 'Save and publish', onClick: () => console.log('Publish') },
 *   ]}
 * >
 *   Save to new branch
 * </DropdownButton>
 *
 * @example
 * // Dropdown-only button (no main action)
 * <DropdownButton
 *   variant="secondary"
 *   showSplitButton={false}
 *   items={[
 *     { label: 'Save to new branch', onClick: () => console.log('New branch') },
 *     { label: 'Save to protected branch', onClick: () => console.log('Protected') },
 *   ]}
 * >
 *   Save options
 * </DropdownButton>
 *
 * @example
 * // With icons and destructive action
 * <DropdownButton
 *   variant="primary"
 *   onMainAction={() => console.log('Save')}
 *   items={[
 *     { label: 'Duplicate', onClick: () => console.log('Duplicate'), icon: <CopyIcon /> },
 *     { label: 'Delete', onClick: () => console.log('Delete'), variant: 'destructive', icon: <TrashIcon /> },
 *   ]}
 * >
 *   Save
 * </DropdownButton>
 */
export declare const DropdownButton: React.ForwardRefExoticComponent<DropdownButtonProps & React.RefAttributes<HTMLButtonElement>>;
