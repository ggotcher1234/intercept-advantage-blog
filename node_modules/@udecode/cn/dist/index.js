"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  cn: () => cn,
  withCn: () => withCn,
  withProps: () => withProps,
  withVariants: () => withVariants
});
module.exports = __toCommonJS(index_exports);

// src/cn.ts
var import_class_variance_authority = require("class-variance-authority");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_class_variance_authority.cx)(inputs));
}

// src/withProps.tsx
var import_react = __toESM(require("react"));
function withProps(Component, defaultProps) {
  const ComponentWithClassName = Component;
  return import_react.default.forwardRef(function ExtendComponent(props, ref) {
    const newProps = { ...defaultProps, ...props };
    const className = cn(
      defaultProps.className,
      props.className
    );
    if (className) {
      newProps.className = className;
    }
    return /* @__PURE__ */ import_react.default.createElement(ComponentWithClassName, { ref, ...newProps });
  });
}

// src/withCn.tsx
function withCn(Component, ...inputs) {
  return withProps(Component, { className: cn(inputs) });
}

// src/withVariants.tsx
var import_react2 = __toESM(require("react"));
function withVariants(Component, variants, onlyVariantsProps) {
  return import_react2.default.forwardRef((props, ref) => {
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
    return /* @__PURE__ */ import_react2.default.createElement(
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
__reExport(index_exports, require("@udecode/react-utils"), module.exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cn,
  withCn,
  withProps,
  withVariants,
  ...require("@udecode/react-utils")
});
//# sourceMappingURL=index.js.map