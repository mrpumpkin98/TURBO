import { Meta } from "@storybook/react";
import { Button } from "../../../packages/ui/Button";

const meta = {
   title: "UI/Button",
   component: Button,
   parameters: {
      layout: "centered",
   },
   tags: ["autodocs"],
   argTypes: {
      variant: {
         control: "select",
         options: ["primary"],
      },
      size: {
         control: "select",
         options: ["sm", "md", "lg"],
      },
      isLoading: {
         control: "boolean",
      },
      disabled: {
         control: "boolean",
      },
   },
};

export default meta;

// Primary variant stories
export const Primary = {
   args: {
      variant: "primary",
      size: "md",
      children: "Primary Button",
   },
};

export const PrimarySmall = {
   args: {
      variant: "primary",
      size: "sm",
      children: "Primary Small",
   },
};

export const PrimaryLarge = {
   args: {
      variant: "primary",
      size: "lg",
      children: "Primary Large",
   },
};

// State stories
export const Loading = {
   args: {
      variant: "primary",
      size: "md",
      isLoading: true,
      children: "Loading Button",
   },
};

export const Disabled = {
   args: {
      variant: "primary",
      size: "md",
      disabled: true,
      children: "Disabled Button",
   },
};

// All sizes showcase
export const AllSizes = {
   render: () => (
      <div className="flex gap-4 items-center">
         <Button variant="primary" size="sm">
            Small
         </Button>
         <Button variant="primary" size="md">
            Medium
         </Button>
         <Button variant="primary" size="lg">
            Large
         </Button>
      </div>
   ),
};
