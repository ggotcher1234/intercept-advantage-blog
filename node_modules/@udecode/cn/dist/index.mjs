// src/cn.ts
import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(cx(inputs));
}

// src/withProps.tsx
import React from "react";
function withProps(Component, defaultProps) {
  const ComponentWithClassName = Component;
  return React.forwardRef(function ExtendComponent(props, ref) {
    const newProps = { ...defaultProps, ...props };
    const className = cn(
      defaultProps.className,
      props.className
    );
    if (className) {
      newProps.className = className;
    }
    return /* @__PURE__ */ React.createElement(ComponentWithClassName, { ref, ...newProps });
  });
}

// src/withCn.tsx
function withCn(Component, ...inputs) {
  return withProps(Component, { className: cn(inputs) });
}

// src/withVariants.tsx
import React2 from "react";
function withVariants(Component, variants, onlyVariantsProps) {
  return React2.forwardRef((props, ref) => {
    const { className, ...rest } = props;
    const variantProps = { ...rest };
    const componentProps = { ...rest };
    if (onlyVariantsProps) {
      onlyVariantsProps.forEach((key) => {
        if (key in componentProps) {
          delete componentProps[key];
        }
      });
    }
    return /* @__PURE__ */ React2.createElement(
      Component,
      {
        ref,
        className: cn(variants(variantProps), className),
        ...componentProps
      }
    );
  });
}

// src/index.tsx
export * from "@udecode/react-utils";
export {
  cn,
  withCn,
  withProps,
  withVariants
};
//# sourceMappingURL=index.mjs.map